// The machines that fill the planet without being part of the game: two that
// patrol a loop in every zone, and a pair that trades harmless light bolts back
// and forth. Nothing here can be clicked, damaged or destroyed; it is scenery
// that happens to move.
//
// Every machine carries both forms. A patrol drives while it is far from its
// next waypoint and walks the last stretch; a duelling pair stands in robot
// form while it fires and drives to a new spot between rounds. The real GLB
// models are loaded once per zone and cloned for each machine, so a zone never
// fetches the same file twice.

import * as THREE from 'three';
import { buildRobot, type FormAnim, type FormState } from './robot';
import { buildVehicle } from './vehicle';
import { SCHEMES } from './scheme';
import { cloneForm, loadForms, SHADOW_RANGE } from '../models';
import { biomeById, isOcean } from '../biomes';
import { offsetDir, surfaceNormal, walkRadius } from '../planet';
import { bridgeAway, nearBridge, type ColliderGrid } from '../collision';
import { TransformBurst } from './burst';

type ZoneId = 'river' | 'citadel' | 'ark' | 'fortress';
type Form = 'robot' | 'vehicle';
const ZONES: ZoneId[] = ['river', 'citadel', 'ark', 'fortress'];

/** Surface units per second while walking, and while driving. */
const PATROL_SPEED = 1.3;
const DRIVE_SPEED = 2.6;
/** A patrol leaves the road and walks in over the last stretch. The two
 * thresholds differ so a machine already walking does not transform back the
 * instant it passes the line. */
const WALK_IN = 6;
const DRIVE_OFF = WALK_IN + 2.5;
/** Gap between the two duelling machines, in surface units. */
const DUEL_GAP = 3;
/** Seconds a bolt takes from muzzle to target. */
const BOLT_TIME = 0.4;
/** Pause between shots, in seconds. */
const SHOT_EVERY = 1.25;
/** Length of a form change, in seconds; the models swap halfway. */
const TRANSFORM_BEAT = 0.5;
/** Seconds of stationary duelling before the pair drives somewhere else. */
const DUEL_ROUND = 15;

/** Patrol waypoints as [east, north] from the zone centre, used only if the
 * collider search finds nothing. */
const PATROL: [number, number][] = [
  [-11, 2],
  [-4, -12],
  [7, 9],
  [10, -3]
];
/** The river zone is an island ringed by sea, so its walkers stay in tight. */
const PATROL_RIVER: [number, number][] = [
  [-6, 3],
  [-3, -7],
  [5, 5],
  [6, -2]
];
/** Distances from the zone centre searched for patrol stands. The river is an
 * island, so its walkers stay well inside the shore. */
const PATROL_RINGS = [8, 11.5, 15];
const PATROL_RINGS_RIVER = [4, 6.5, 9];
/** Bearings tried on each patrol ring. */
const PATROL_BEARINGS = 12;
/** Candidate distances from the zone centre where a duelling pair may stand,
 * in surface units. Each ring is tried all the way round, so a zone whose
 * scenery grew into one spot still has others to use. */
const DUEL_RINGS = [7.5, 10.5, 13.5];
/** How many bearings are tried on each ring. */
const DUEL_BEARINGS = 14;
/** How close the driven machine can come before a patrol stops walking. */
const YIELD = 2.6;
/** How often the crowd shadow budget is re-checked, in milliseconds. */
const SHADOW_INTERVAL = 180;

type Actor = {
  zone: ZoneId;
  kind: 'patrol' | 'duel';
  holder: THREE.Group;
  /** Leans back for recoil and when hit. */
  tilt: THREE.Group;
  /** Squashes vertically through a form change. */
  formHolder: THREE.Group;
  robot: THREE.Object3D;
  vehicle: THREE.Object3D;
  /** Local footprint of the active form, so a lean never sinks a toe under
   * the ground. `front`/`back` are +Z/-Z reach, `halfW` the side reach. */
  front: number;
  back: number;
  halfW: number;
  /** How far the machine was lifted above the surface to clear its lean. */
  lift: number;
  form: Form;
  /** Seconds left of a form change; zero when settled. */
  swap: number;
  swapped: boolean;
  pending: Form | null;
  /** Signed steering, fed to the vehicle animation. */
  steer: number;
  dir: THREE.Vector3;
  heading: THREE.Vector3;
  target: THREE.Vector3;
  next: number;
  partner: Actor | null;
  /** The lead of a duelling pair decides where the pair moves next. */
  lead: boolean;
  /** True while a duel pair is driving to its next spot. */
  travelling: boolean;
  /** Seconds spent driving to the current duel spot; a wedge gives up. */
  travel: number;
  /** Signed heading offset while steering around a prop, and how long left. */
  detour: number;
  detourT: number;
  /** Preferred side for a detour, and seconds spent trying to get past a prop. */
  side: number;
  stuck: number;
  /** Seconds of stationary duelling left. */
  round: number;
  shot: number;
  stagger: number;
  recoil: number;
};

type Bolt = { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; t: number; alive: boolean; victim: Actor | null };
type Flash = { mesh: THREE.Mesh; life: number };

/** Bursts are pooled: a form change borrows one for its beat. */
const BURSTS = 4;
/** A form change swaps objects at this fraction of the beat. */
const SWAP_AT = 0.5;

const _up = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _step = new THREE.Vector3();
const _aim = new THREE.Vector3();
const _chest = new THREE.Vector3();
const _chest2 = new THREE.Vector3();
const _prev = new THREE.Vector3();
const _prevHeading = new THREE.Vector3();
const _cross = new THREE.Vector3();
const _probe = new THREE.Vector3();

function blendedUp(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  return surfaceNormal(dir, out).multiplyScalar(0.6).addScaledVector(dir, 0.4).normalize();
}

/** Stand a crowd machine on the surface, facing `heading`. A long vehicle
 * samples the ground under its nose and tail so neither end sinks into a
 * rise; the convention matches the take-over machines. */
function place(holder: THREE.Group, dir: THREE.Vector3, heading: THREE.Vector3, bodyLength = 0): void {
  blendedUp(dir, _up);
  _fwd.copy(heading).addScaledVector(_up, -heading.dot(_up));
  if (_fwd.lengthSq() < 1e-8) _fwd.copy(heading);
  _fwd.normalize();
  _right.crossVectors(_up, _fwd).normalize();
  _m.makeBasis(_right, _up, _fwd);
  holder.quaternion.setFromRotationMatrix(_m);

  let radius = walkRadius(dir);
  if (bodyLength > 0) {
    const ang = bodyLength * 0.5 / 42;
    radius = Math.max(radius, walkRadius(_probe.copy(dir).multiplyScalar(Math.cos(ang)).addScaledVector(_fwd, Math.sin(ang))));
    radius = Math.max(radius, walkRadius(_probe.copy(dir).multiplyScalar(Math.cos(ang)).addScaledVector(_fwd, -Math.sin(ang))));
  }
  holder.position.copy(dir).multiplyScalar(radius);
}

/** Tangent heading that points from `dir` toward `to`. */
function headingToward(dir: THREE.Vector3, to: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  out.copy(to).addScaledVector(dir, -to.dot(dir));
  if (out.lengthSq() < 1e-10) out.set(0, 0, 1);
  return out.normalize();
}

/** A point `dist` surface units from `dir` along the tangent `heading`. */
function stepToward(dir: THREE.Vector3, heading: THREE.Vector3, dist: number, out: THREE.Vector3): THREE.Vector3 {
  const ang = dist / 42;
  return out.copy(dir).multiplyScalar(Math.cos(ang)).addScaledVector(heading, Math.sin(ang)).normalize();
}

/** Nearest dry point to the given offset: steps back toward the centre until
 * it leaves the water. */
function landNear(centre: THREE.Vector3, east: number, north: number): THREE.Vector3 {
  const point = offsetDir(centre.clone(), east, north);
  for (let i = 0; i < 24 && (isOcean(point) || nearBridge(point)); i++) {
    if (isOcean(point)) {
      offsetDir(point, -east * 0.12, -north * 0.12);
    } else {
      // Step sideways off the crossing rather than inward: the decks meet at
      // the middle of the island, so inward is still bridge.
      bridgeAway(point, _step);
      const ang = 2.5 / 42;
      point.multiplyScalar(Math.cos(ang)).addScaledVector(_step, Math.sin(ang)).normalize();
    }
  }
  return point;
}

/**
 * Every legal pair of duel feet around a zone centre, found by sweeping rings
 * of bearings. A spot is legal when it is dry, off a crossing, clear of props
 * and of the take-over machine, and has a partner spot one duel gap away.
 */
function duelSpots(
  centre: THREE.Vector3,
  colliders: ColliderGrid,
  out: { a: THREE.Vector3; b: THREE.Vector3 }[]
): void {
  const crew = offsetDir(centre.clone(), 4, -4);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const gap = DUEL_GAP / 42;
  for (let ring = 0; ring < DUEL_RINGS.length; ring++) {
    for (let k = 0; k < DUEL_BEARINGS; k++) {
      const ang = (k / DUEL_BEARINGS) * Math.PI * 2 + ring * 0.31;
      const r = DUEL_RINGS[ring];
      a.copy(landNear(centre, Math.cos(ang) * r, Math.sin(ang) * r));
      if (isOcean(a) || nearBridge(a) || colliders.blocked(a, 0.8)) continue;
      if (a.angleTo(crew) * 42 < 3) continue;
      if (a.angleTo(centre) * 42 < 3.6) continue;
      colliders.resolve(a, 0.8);

      bridgeAway(a, _step);
      let ok = false;
      for (const side of [1, -1]) {
        _probe.copy(a).multiplyScalar(Math.cos(gap)).addScaledVector(_step, side * Math.sin(gap)).normalize();
        if (!isOcean(_probe) && !nearBridge(_probe) && !colliders.blocked(_probe, 0.6)) {
          b.copy(_probe);
          ok = true;
          break;
        }
      }
      if (!ok) continue;
      out.push({ a: a.clone(), b: b.clone() });
    }
  }
}

/** Dispose the geometries a replaced built-in form owns. Materials are cached
 * and shared across every machine, so they are left alone. */
function dropForm(obj: THREE.Object3D): void {
  obj.traverse((o) => {
    if (o instanceof THREE.Mesh) o.geometry.dispose();
  });
}

/**
 * Legal patrol waypoints around a zone centre, swept the same way as the duel
 * stands. The fixed rings that used to serve here predate the current scenery
 * and can all end up inside props.
 */
function patrolSpots(
  zone: ZoneId,
  centre: THREE.Vector3,
  colliders: ColliderGrid,
  out: THREE.Vector3[]
): void {
  const crew = offsetDir(centre.clone(), 4, -4);
  const rings = zone === 'river' ? PATROL_RINGS_RIVER : PATROL_RINGS;
  const p = new THREE.Vector3();
  for (let ring = 0; ring < rings.length; ring++) {
    for (let k = 0; k < PATROL_BEARINGS; k++) {
      const ang = (k / PATROL_BEARINGS) * Math.PI * 2 + ring * 0.37;
      const r = rings[ring];
      p.copy(landNear(centre, Math.cos(ang) * r, Math.sin(ang) * r));
      if (isOcean(p) || nearBridge(p) || colliders.blocked(p, 0.7)) continue;
      if (p.angleTo(crew) * 42 < 2.5) continue;
      if (p.angleTo(centre) * 42 < 3.6) continue;
      colliders.resolve(p, 0.6);
      // Keep the list spread out: skip a point that duplicates one already in.
      if (out.some((q) => q.angleTo(p) * 42 < 2.5)) continue;
      out.push(p.clone());
    }
  }
}

/** True when a straight stroll from `from` to `to` misses every prop. Sampled
 * every half unit, finer than any footprint plus the walk clearance, so a
 * small prop cannot slip between samples. */
function clearPath(from: THREE.Vector3, to: THREE.Vector3, colliders: ColliderGrid): boolean {
  const total = from.angleTo(to) * 42;
  const steps = Math.max(2, Math.ceil(total / 0.5));
  _fwd.copy(to).addScaledVector(from, -to.dot(from));
  if (_fwd.lengthSq() < 1e-10) return true;
  _fwd.normalize();
  for (let i = 1; i <= steps; i++) {
    const ang = (total * i) / steps / 42;
    _probe.copy(from).multiplyScalar(Math.cos(ang)).addScaledVector(_fwd, Math.sin(ang)).normalize();
    if (colliders.blocked(_probe, 0.55)) return false;
  }
  return true;
}

function setCast(root: THREE.Object3D, cast: boolean): void {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (mesh.castShadow !== cast) mesh.castShadow = cast;
  });
}

export class Crowd {
  readonly group = new THREE.Group();
  private actors: Actor[] = [];
  private bolts: Bolt[] = [];
  private flashes: Flash[] = [];
  private bursts: TransformBurst[] = [];
  private burstNext = 0;
  private boltMat = new Map<ZoneId, THREE.MeshBasicMaterial>();
  private flashMat = new Map<ZoneId, THREE.MeshBasicMaterial>();
  /** Legal duel stands per zone, worked out once from the colliders. */
  private duelStands = new Map<ZoneId, { a: THREE.Vector3; b: THREE.Vector3 }[]>();
  /** Legal patrol waypoints per zone, likewise. */
  private patrolStands = new Map<ZoneId, THREE.Vector3[]>();
  private idle: FormState = { speed: 0, speed01: 0, airborne: false, steer: 0, time: 0 };
  private walk: FormState = { speed: 0, speed01: 0.16, airborne: false, steer: 0, time: 0 };
  private drive: FormState = { speed: 0, speed01: 0.4, airborne: false, steer: 0, time: 0 };
  private shadowLast = -Infinity;

  constructor(private colliders: ColliderGrid) {
    for (const zone of ZONES) {
      this.boltMat.set(zone, new THREE.MeshBasicMaterial({ color: SCHEMES[zone].accent, toneMapped: false }));
      this.flashMat.set(
        zone,
        new THREE.MeshBasicMaterial({
          color: SCHEMES[zone].accent,
          transparent: true,
          opacity: 0.9,
          toneMapped: false,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
    }

    for (const zone of ZONES) {
      const centre = biomeById(zone).center;
      const stands: THREE.Vector3[] = [];
      patrolSpots(zone, centre, this.colliders, stands);
      this.patrolStands.set(zone, stands);

      const fallback = zone === 'river' ? PATROL_RIVER : PATROL;
      const startA = stands[0] ? stands[0].clone() : landNear(centre, fallback[0][0], fallback[0][1]);
      let startB = stands.length > 1 ? stands[Math.floor(stands.length / 2)].clone() : null;
      if (!startB || startB.angleTo(startA) * 42 < 3) {
        startB = landNear(centre, fallback[2][0], fallback[2][1]);
      }

      // Two walkers on the loop.
      this.addActor(zone, startA, 1, null);
      this.addActor(zone, startB, 3, null);

      // One duelling pair, three units apart, facing each other.
      const spots: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
      duelSpots(centre, this.colliders, spots);
      this.duelStands.set(zone, spots);
      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      if (spots.length > 0) {
        a.copy(spots[0].a);
        b.copy(spots[0].b);
      } else {
        // Nothing was clear: stand them on the driest nearby point and let the
        // collider settle the rest.
        a.copy(landNear(centre, -6, 5.5));
        this.colliders.resolve(a, 0.8);
        b.copy(a);
        bridgeAway(a, _step);
        const gap = DUEL_GAP / 42;
        b.copy(a).multiplyScalar(Math.cos(gap)).addScaledVector(_step, Math.sin(gap)).normalize();
        this.colliders.resolve(b, 0.6);
      }
      const actorA = this.addActor(zone, a, 0, null);
      const actorB = this.addActor(zone, b, 0, null);
      actorA.kind = 'duel';
      actorB.kind = 'duel';
      actorA.partner = actorB;
      actorB.partner = actorA;
      actorA.lead = true;
      actorA.round = DUEL_ROUND;
      actorB.round = DUEL_ROUND;
      actorA.shot = 0.4;
      actorB.shot = SHOT_EVERY * 0.5 + 0.6;
    }

    for (let i = 0; i < 16; i++) this.bolts.push(this.makeBolt());
    for (let i = 0; i < 12; i++) this.flashes.push(this.makeFlash());
    for (let i = 0; i < BURSTS; i++) {
      const burst = new TransformBurst();
      this.bursts.push(burst);
      this.group.add(burst.group);
    }

    // One fetch per zone and form; every machine of the zone clones the result.
    for (const zone of ZONES) void this.loadZone(zone);
  }

  /**
   * Swap the built-in forms of one zone for the real models once they arrive.
   * `loadForms` shares a pending promise per file, so the whole planet pulls
   * four robot files and four vehicle files however many machines stand here.
   */
  private async loadZone(zone: ZoneId): Promise<void> {
    const { robot, vehicle } = await loadForms(zone);
    for (const actor of this.actors) {
      if (actor.zone !== zone) continue;
      if (robot) this.replaceForm(actor, 'robot', cloneForm(robot));
      if (vehicle) this.replaceForm(actor, 'vehicle', cloneForm(vehicle));
    }
  }

  private replaceForm(actor: Actor, form: Form, obj: THREE.Object3D): void {
    const old = form === 'robot' ? actor.robot : actor.vehicle;
    obj.visible = actor.form === form;
    // Far machines keep out of the shadow map; the budget pass turns them back
    // on when the player comes close.
    setCast(obj, false);
    actor.formHolder.remove(old);
    dropForm(old);
    actor.formHolder.add(obj);
    if (form === 'robot') actor.robot = obj;
    else actor.vehicle = obj;
    if (actor.form === form) this.measure(actor);
  }

  /** Dev aid: how many walkers are on a crossing or its bridgehead. */
  onBridge(): number {
    return this.actors.filter((a) => nearBridge(a.dir)).length;
  }

  /** Every crowd machine's position, for the driven machine to collide with. */
  positions(): THREE.Vector3[] {
    return this.actors.map((a) => a.dir);
  }

  /** Dev aid: form summary, for checking the crowd from the console. */
  forms(): { zone: ZoneId; kind: Actor['kind']; form: Form; transforming: boolean }[] {
    return this.actors.map((a) => ({ zone: a.zone, kind: a.kind, form: a.form, transforming: a.swap > 0 }));
  }

  /**
   * Dev aid: the lowest point of every machine above its own ground contact
   * plane, in surface units — the same measure used for the hero (active form,
   * root-local Y, 0 = contact plane). Negative means a model is under it.
   */
  lowest(): { zone: ZoneId; kind: Actor['kind']; form: Form; above: number }[] {
    const out: { zone: ZoneId; kind: Actor['kind']; form: Form; above: number }[] = [];
    for (const actor of this.actors) {
      const obj = actor.form === 'robot' ? actor.robot : actor.vehicle;
      actor.holder.updateWorldMatrix(true, true);
      let minY = Infinity;
      obj.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const geo = mesh.geometry;
        if (!geo.boundingBox) geo.computeBoundingBox();
        const bb = geo.boundingBox;
        if (!bb || !isFinite(bb.min.x)) return;
        for (let i = 0; i < 8; i++) {
          _probe.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z);
          _probe.applyMatrix4(mesh.matrixWorld);
          actor.holder.worldToLocal(_probe);
          if (_probe.y < minY) minY = _probe.y;
        }
      });
      out.push({ zone: actor.zone, kind: actor.kind, form: actor.form, above: +(minY + actor.lift).toFixed(3) });
    }
    return out;
  }

  update(dt: number, t: number, avoid: THREE.Vector3 | null = null, viewer: THREE.Vector3 | null = null): void {
    this.idle.time = t;
    this.walk.time = t;
    this.drive.time = t;
    for (const actor of this.actors) {
      if (actor.kind === 'patrol') this.patrol(actor, dt, avoid);
      else this.duel(actor, dt);
      this.advanceTransform(actor, dt);
    }
    this.updateBolts(dt);
    this.updateFlashes(dt);
    for (const burst of this.bursts) burst.update(dt);
    this.updateShadows(viewer);
  }

  // ---------------------------------------------------------------- actors

  private addActor(zone: ZoneId, dir: THREE.Vector3, next: number, partner: Actor | null): Actor {
    const scheme = SCHEMES[zone];
    const robot = buildRobot(scheme);
    const vehicle = buildVehicle(scheme);
    for (const form of [robot.root, vehicle.root]) setCast(form, false);
    vehicle.root.visible = false;

    const formHolder = new THREE.Group();
    formHolder.add(robot.root, vehicle.root);
    const tilt = new THREE.Group();
    tilt.add(formHolder);
    const holder = new THREE.Group();
    holder.add(tilt);

    const heading = new THREE.Vector3(0, 0, 1);
    const actor: Actor = {
      zone,
      kind: 'patrol',
      holder,
      tilt,
      formHolder,
      robot: robot.root,
      vehicle: vehicle.root,
      front: 0.5,
      back: 0.5,
      halfW: 0.2,
      lift: 0,
      form: 'robot',
      swap: 0,
      swapped: true,
      pending: null,
      steer: 0,
      dir: dir.clone(),
      heading,
      target: dir.clone(),
      next,
      partner,
      lead: false,
      travelling: false,
      travel: 0,
      detour: 0,
      detourT: 0,
      side: Math.random() < 0.5 ? -1 : 1,
      stuck: 0,
      round: DUEL_ROUND,
      shot: Math.random() * SHOT_EVERY,
      stagger: 0,
      recoil: 0
    };
    this.pickWaypoint(actor);
    place(holder, actor.dir, actor.heading);
    this.group.add(holder);
    this.actors.push(actor);
    this.measure(actor);
    return actor;
  }

  /** Start a form change, with the burst effect. */
  private beginTransform(actor: Actor, form: Form): void {
    if (actor.swap > 0 || actor.form === form) return;
    actor.swap = TRANSFORM_BEAT;
    actor.swapped = false;
    actor.pending = form;
    const burst = this.bursts[this.burstNext];
    this.burstNext = (this.burstNext + 1) % this.bursts.length;
    burst.play(actor.holder.position, actor.holder.quaternion);
    this.chest(actor, _chest);
    this.spray(actor.zone, _chest);
  }

  /** Run a form change forward; swaps the model at the midpoint. */
  private advanceTransform(actor: Actor, dt: number): void {
    if (actor.swap <= 0) return;
    actor.swap = Math.max(0, actor.swap - dt);
    const progress = 1 - actor.swap / TRANSFORM_BEAT;
    if (!actor.swapped && progress >= SWAP_AT) {
      actor.swapped = true;
      actor.form = actor.pending ?? actor.form;
      actor.robot.visible = actor.form === 'robot';
      actor.vehicle.visible = actor.form === 'vehicle';
      actor.steer = 0;
      this.measure(actor);
      // Re-pose at once: the lift was worked out for the other form's footprint.
      this.seat(actor);
    }
    // A short squash as the machine folds into the other form, always easing
    // back to full height so nothing is ever left half-sized.
    const squash = 1 - Math.sin(progress * Math.PI) * 0.22;
    actor.formHolder.scale.set(1, squash, 1);
    if (actor.swap === 0) {
      actor.formHolder.scale.set(1, 1, 1);
      actor.pending = null;
    }
  }

  /** Animate whichever form is showing. */
  private animate(actor: Actor, dt: number, state: FormState): void {
    const obj = actor.form === 'robot' ? actor.robot : actor.vehicle;
    const anim = obj.userData.anim as FormAnim | undefined;
    if (anim) anim(dt, state);
  }

  /** Measure the active form's footprint, so `settle` knows how far a lean
   * pushes a corner under the surface. Run on every form change. */
  private measure(actor: Actor): void {
    const obj = actor.form === 'robot' ? actor.robot : actor.vehicle;
    actor.holder.updateWorldMatrix(true, true);
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    obj.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const geo = mesh.geometry;
      if (!geo.boundingBox) geo.computeBoundingBox();
      const bb = geo.boundingBox;
      if (!bb || !isFinite(bb.min.x)) return;
      for (let i = 0; i < 8; i++) {
        _probe.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z);
        _probe.applyMatrix4(o.matrixWorld);
        actor.formHolder.worldToLocal(_probe);
        minX = Math.min(minX, _probe.x);
        maxX = Math.max(maxX, _probe.x);
        minZ = Math.min(minZ, _probe.z);
        maxZ = Math.max(maxZ, _probe.z);
      }
    });
    if (!isFinite(minX)) return;
    actor.back = Math.max(0.2, -minZ);
    actor.front = Math.max(0.2, maxZ);
    actor.halfW = Math.max(0.2, maxX, -minX);
  }

  /** Lift a machine by however far its lowest corner would drop, so a lean —
   * duel recoil or the built form's own walk/drive sway — never buries a foot
   * in the ground. The drop is linear across the footprint, so the four
   * corners bound it exactly. Returns the lift. */
  private settle(actor: Actor): number {
    const rot = actor.tilt.rotation;
    const obj = actor.form === 'robot' ? actor.robot : actor.vehicle;
    const inner = obj.children[0];
    const innerRot = inner && inner.rotation ? inner.rotation : null;
    if (rot.x === 0 && rot.z === 0 && (!innerRot || (innerRot.x === 0 && innerRot.z === 0))) return 0;
    let dip = 0;
    for (const [x, z] of [
      [actor.halfW, actor.front],
      [-actor.halfW, actor.front],
      [actor.halfW, -actor.back],
      [-actor.halfW, -actor.back]
    ]) {
      _probe.set(x, 0, z);
      if (innerRot) _probe.applyEuler(innerRot);
      _probe.applyEuler(rot);
      if (_probe.y < dip) dip = _probe.y;
    }
    if (dip >= 0) return 0;
    actor.holder.position.addScaledVector(_up, -dip);
    return -dip;
  }

  /** Stand a machine on the surface and keep its lean above ground. The built
   * forms also pitch and sway a little in their own animation, so each gets a
   * hair of lift (more for the longer vehicle) to stay clear of the surface. */
  private seat(actor: Actor): void {
    place(actor.holder, actor.dir, actor.heading, actor.form === 'vehicle' ? 2.4 : 0);
    const margin = actor.form === 'vehicle' ? 0.03 : 0.02;
    actor.holder.position.addScaledVector(_up, margin);
    actor.lift = margin + this.settle(actor);
  }

  /** Pose a machine that is standing still. */
  private stand(actor: Actor, dt: number): void {
    this.seat(actor);
    this.animate(actor, dt, this.idle);
  }

  private patrol(actor: Actor, dt: number, avoid: THREE.Vector3 | null): void {
    // A walker gives way to the machine being driven rather than shoving it.
    if (avoid && actor.dir.angleTo(avoid) * 42 < YIELD) {
      this.stand(actor, dt);
      return;
    }
    // A walker that has drifted onto a crossing walks off it.
    if (nearBridge(actor.dir)) {
      bridgeAway(actor.dir, _step);
      const ang = 4 / 42;
      actor.target.copy(actor.dir).multiplyScalar(Math.cos(ang)).addScaledVector(_step, Math.sin(ang)).normalize();
    }

    const left = actor.dir.angleTo(actor.target) * 42;
    if (left < 0.35 && actor.swap <= 0) {
      this.pickWaypoint(actor);
      actor.detourT = 0;
      this.stand(actor, dt);
      return;
    }

    // Transform before covering ground: drive while the waypoint is far, walk
    // the last stretch in. Thresholds differ by current form (see WALK_IN).
    const wantVehicle = actor.form === 'vehicle' ? left > WALK_IN : left > DRIVE_OFF;
    if (actor.swap > 0) {
      this.stand(actor, dt);
      return;
    }
    if (wantVehicle !== (actor.form === 'vehicle')) {
      this.beginTransform(actor, wantVehicle ? 'vehicle' : 'robot');
      this.stand(actor, dt);
      return;
    }

    const speed = actor.form === 'vehicle' ? DRIVE_SPEED : PATROL_SPEED;
    _prevHeading.copy(actor.heading);
    _prev.copy(actor.dir);
    headingToward(actor.dir, actor.target, actor.heading);
    this.applyDetour(actor, dt);
    this.steerToward(actor, _prevHeading, dt);

    const wasClear = !nearBridge(actor.dir);
    const wanted = speed * dt;
    stepToward(actor.dir, actor.heading, wanted, _step);
    if (isOcean(_step) || (wasClear && nearBridge(_step))) {
      this.pickWaypoint(actor);
      actor.detourT = 0;
      this.stand(actor, dt);
      return;
    }
    this.colliders.resolve(_step, 0.4);
    actor.dir.copy(_step);
    headingToward(actor.dir, actor.target, actor.heading);
    this.checkStuck(actor, _prev.angleTo(actor.dir) * 42, wanted, dt);
    actor.tilt.rotation.set(0, 0, 0);
    this.seat(actor);
    if (actor.form === 'vehicle') {
      this.drive.speed = speed;
      this.drive.steer = actor.steer;
      this.animate(actor, dt, this.drive);
    } else {
      this.walk.speed = speed;
      this.animate(actor, dt, this.walk);
    }
  }

  /** Signed turn rate, eased, for the vehicle to roll into. */
  private steerToward(actor: Actor, prev: THREE.Vector3, dt: number): void {
    blendedUp(actor.dir, _up);
    _cross.crossVectors(prev, actor.heading);
    const sign = Math.sign(_cross.dot(_up));
    const rate = prev.angleTo(actor.heading) / Math.max(dt, 1e-4);
    const target = THREE.MathUtils.clamp((sign * rate) / 1.6, -1, 1);
    actor.steer += (target - actor.steer) * Math.min(1, dt * 8);
  }

  /** While a detour is running, swing the chosen heading around the obstacle. */
  private applyDetour(actor: Actor, dt: number): void {
    if (actor.detourT <= 0) return;
    actor.detourT = Math.max(0, actor.detourT - dt);
    blendedUp(actor.dir, _up);
    actor.heading.applyAxisAngle(_up, actor.detour);
  }

  /** A step that barely moved means a prop is in the way: veer around it, and
   * if that keeps failing, send a patrol to a different waypoint. */
  private checkStuck(actor: Actor, moved: number, wanted: number, dt: number): void {
    const blocked = wanted > 0 && moved <= wanted * 0.4;
    actor.stuck = blocked ? actor.stuck + dt : Math.max(0, actor.stuck - dt * 2);
    if (!blocked) return;
    if (actor.detourT <= 0) {
      actor.detour = actor.side * 1.0;
      actor.detourT = 1.2;
    }
    if (actor.kind === 'patrol' && actor.stuck > 4) {
      this.pickWaypoint(actor);
      actor.stuck = 0;
      actor.detourT = 0;
      actor.side *= -1;
    }
  }

  /** Choose the next patrol point from the far stands, so every leg is worth
   * driving and the target is never the spot the machine already stands on. */
  private pickWaypoint(actor: Actor): void {
    actor.stuck = 0;
    actor.detourT = 0;
    const stands = this.patrolStands.get(actor.zone) ?? [];
    if (stands.length > 0) {
      const ranked = stands
        .map((p) => ({ p, d: p.angleTo(actor.dir) * 42 }))
        .sort((a, b) => b.d - a.d)
        .filter((r) => clearPath(actor.dir, r.p, this.colliders));
      const far = ranked.filter((r) => r.d > 3).slice(0, 3);
      if (far.length > 0) {
        actor.target.copy(far[Math.floor(Math.random() * far.length)].p);
        return;
      }
      if (ranked.length > 0 && ranked[0].d > 1.5) {
        actor.target.copy(ranked[0].p);
        return;
      }
      // Nothing can be reached in a straight line: hold this spot.
    }
    // No clear stands at all: fall back to the old fixed ring.
    const centre = biomeById(actor.zone).center;
    const ring = actor.zone === 'river' ? PATROL_RIVER : PATROL;
    for (let i = 0; i < ring.length; i++) {
      actor.next = (actor.next + 1) % ring.length;
      const point = offsetDir(centre.clone(), ring[actor.next][0], ring[actor.next][1]);
      if (isOcean(point) || nearBridge(point)) continue;
      this.colliders.resolve(point, 0.6);
      actor.target.copy(point);
      return;
    }
  }

  private duel(actor: Actor, dt: number): void {
    const partner = actor.partner;
    if (!partner) return;

    if (actor.travelling) {
      // Let the last shot's lean settle out while the pair drives off.
      actor.recoil = Math.max(0, actor.recoil - dt * 3.2);
      actor.stagger = Math.max(0, actor.stagger - dt * 2.2);
      actor.tilt.rotation.x = actor.recoil * 0.5;
      actor.tilt.rotation.z = actor.stagger * 0.45;
      if (actor.swap > 0) {
        this.stand(actor, dt);
        return;
      }
      if (actor.form !== 'vehicle') {
        this.beginTransform(actor, 'vehicle');
        this.stand(actor, dt);
        return;
      }
      actor.travel += dt;
      const left = actor.dir.angleTo(actor.target) * 42;
      if (left < 0.5 || actor.travel > 12) {
        // Arrived, or the route is not working out: fight from here.
        actor.travelling = false;
        actor.travel = 0;
        actor.detourT = 0;
        if (left < 0.5) this.beginTransform(actor, 'robot');
        else actor.target.copy(actor.dir);
        this.stand(actor, dt);
        return;
      }
      _prevHeading.copy(actor.heading);
      _prev.copy(actor.dir);
      headingToward(actor.dir, actor.target, actor.heading);
      this.applyDetour(actor, dt);
      this.steerToward(actor, _prevHeading, dt);
      const wanted = DRIVE_SPEED * dt;
      stepToward(actor.dir, actor.heading, wanted, _step);
      if (isOcean(_step) || nearBridge(_step)) {
        // The chosen spot is no longer reachable; give up and fight here.
        actor.travelling = false;
        actor.travel = 0;
        actor.detourT = 0;
        actor.target.copy(actor.dir);
        this.stand(actor, dt);
        return;
      }
      this.colliders.resolve(_step, 0.4);
      actor.dir.copy(_step);
      headingToward(actor.dir, actor.target, actor.heading);
      this.checkStuck(actor, _prev.angleTo(actor.dir) * 42, wanted, dt);
      this.seat(actor);
      this.drive.speed = DRIVE_SPEED;
      this.drive.steer = actor.steer;
      this.animate(actor, dt, this.drive);
      return;
    }

    // Standing duel: robot form only.
    headingToward(actor.dir, partner.dir, actor.heading);
    if (actor.swap > 0) {
      this.stand(actor, dt);
      return;
    }
    if (actor.form === 'vehicle') {
      this.beginTransform(actor, 'robot');
      this.stand(actor, dt);
      return;
    }
    // Lean back from the shot, and sideways from a hit, both easing home.
    actor.recoil = Math.max(0, actor.recoil - dt * 3.2);
    actor.stagger = Math.max(0, actor.stagger - dt * 2.2);
    actor.tilt.rotation.x = actor.recoil * 0.5;
    actor.tilt.rotation.z = actor.stagger * 0.45;
    this.seat(actor);
    this.animate(actor, dt, this.idle);

    // While the other half of the pair is still on the road there is nobody to
    // trade bolts with, and the round clock should not run.
    if (partner.travelling) {
      actor.shot = Math.max(actor.shot, SHOT_EVERY);
      return;
    }

    // A pair that ended its drive apart walks back together before duelling.
    if (actor.dir.angleTo(partner.dir) * 42 > DUEL_GAP + 2) {
      this.closeOn(actor, partner, dt);
      return;
    }

    actor.round -= dt;
    if (actor.round <= 0 && actor.lead) {
      this.relocatePair(actor);
      return;
    }

    actor.shot -= dt;
    if (actor.shot > 0) return;
    actor.shot = SHOT_EVERY + Math.random() * 0.5;
    actor.recoil = 1;
    this.fire(actor, partner);
  }

  /** Walk a stranded duellist back toward its partner. */
  private closeOn(actor: Actor, partner: Actor, dt: number): void {
    _prevHeading.copy(actor.heading);
    _prev.copy(actor.dir);
    headingToward(actor.dir, partner.dir, actor.heading);
    this.applyDetour(actor, dt);
    this.steerToward(actor, _prevHeading, dt);
    const wanted = PATROL_SPEED * dt;
    stepToward(actor.dir, actor.heading, wanted, _step);
    if (!isOcean(_step) && !nearBridge(_step)) {
      this.colliders.resolve(_step, 0.4);
      actor.dir.copy(_step);
    }
    headingToward(actor.dir, partner.dir, actor.heading);
    this.checkStuck(actor, _prev.angleTo(actor.dir) * 42, wanted, dt);
    actor.tilt.rotation.set(0, 0, 0);
    this.seat(actor);
    this.walk.speed = PATROL_SPEED;
    this.animate(actor, dt, this.walk);
    actor.shot = Math.max(actor.shot, SHOT_EVERY);
  }

  /** Send a duelling pair to another clear spot; they drive, then re-deploy. */
  private relocatePair(lead: Actor): void {
    const partner = lead.partner;
    if (!partner) return;
    const spots = this.duelStands.get(lead.zone) ?? [];
    lead.round = DUEL_ROUND + Math.random() * 6;
    partner.round = lead.round;
    lead.shot = SHOT_EVERY;
    partner.shot = SHOT_EVERY * 1.4;

    // Prefer the clear spot furthest from where the pair already stands, so the
    // move is worth watching; never one closer than a few steps.
    let best: { a: THREE.Vector3; b: THREE.Vector3 } | null = null;
    let bestScore = 5 / 42;
    for (const spot of spots) {
      if (!clearPath(lead.dir, spot.a, this.colliders)) continue;
      if (!clearPath(partner.dir, spot.b, this.colliders)) continue;
      const score = spot.a.angleTo(lead.dir) + spot.b.angleTo(partner.dir);
      if (score > bestScore) {
        bestScore = score;
        best = spot;
      }
    }
    // Nowhere else to stand: the pair simply keeps duelling where it is.
    if (!best) return;

    lead.target.copy(best.a);
    partner.target.copy(best.b);
    lead.travelling = true;
    partner.travelling = true;
    lead.travel = 0;
    partner.travel = 0;
    lead.detourT = 0;
    partner.detourT = 0;
    this.beginTransform(lead, 'vehicle');
    this.beginTransform(partner, 'vehicle');
  }

  // ---------------------------------------------------------------- bolts

  private chest(actor: Actor, out: THREE.Vector3): THREE.Vector3 {
    blendedUp(actor.dir, _up);
    return out.copy(actor.holder.position).addScaledVector(_up, 1.25);
  }

  private fire(shooter: Actor, target: Actor): void {
    const bolt = this.bolts.find((b) => !b.alive);
    if (!bolt) return;
    this.chest(shooter, _chest);
    this.chest(target, _chest2);
    bolt.alive = true;
    bolt.victim = target;
    bolt.t = 0;
    bolt.from.copy(_chest);
    bolt.to.copy(_chest2);
    bolt.mesh.material = this.boltMat.get(shooter.zone)!;
    bolt.mesh.position.copy(_chest);
    _aim.copy(_chest2).sub(_chest).normalize();
    bolt.mesh.lookAt(_chest2);
    bolt.mesh.visible = true;
  }

  private updateBolts(dt: number): void {
    for (const bolt of this.bolts) {
      if (!bolt.alive) continue;
      bolt.t += dt / BOLT_TIME;
      if (bolt.t >= 1) {
        bolt.alive = false;
        bolt.mesh.visible = false;
        if (bolt.victim) {
          bolt.victim.stagger = 1;
          this.spray(bolt.victim.zone, bolt.to);
        }
        continue;
      }
      bolt.mesh.position.lerpVectors(bolt.from, bolt.to, bolt.t);
    }
  }

  private spray(zone: ZoneId, at: THREE.Vector3): void {
    const flash = this.flashes.find((f) => f.life <= 0) ?? this.flashes[0];
    flash.life = 1;
    flash.mesh.material = this.flashMat.get(zone)!;
    flash.mesh.position.copy(at);
    flash.mesh.scale.setScalar(0.35);
    flash.mesh.visible = true;
  }

  private updateFlashes(dt: number): void {
    for (const flash of this.flashes) {
      if (flash.life <= 0) continue;
      flash.life = Math.max(0, flash.life - dt * 5);
      flash.mesh.scale.setScalar(0.35 + (1 - flash.life) * 0.9);
      (flash.mesh.material as THREE.MeshBasicMaterial).opacity = flash.life * 0.9;
      if (flash.life <= 0) flash.mesh.visible = false;
    }
  }

  /** Only the machines nearest the player draw into the shadow map; the rest
   * keep their meshes out of it. Throttled, like the take-over machines'. */
  private updateShadows(viewer: THREE.Vector3 | null): void {
    if (!viewer) return;
    const now = performance.now();
    if (now - this.shadowLast < SHADOW_INTERVAL) return;
    this.shadowLast = now;
    for (const actor of this.actors) {
      const near = actor.dir.angleTo(viewer) * 42 <= SHADOW_RANGE;
      const active = actor.form === 'robot' ? actor.robot : actor.vehicle;
      const hidden = actor.form === 'robot' ? actor.vehicle : actor.robot;
      setCast(active, near);
      setCast(hidden, false);
    }
  }

  private makeBolt(): Bolt {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.75),
      new THREE.MeshBasicMaterial({ toneMapped: false })
    );
    mesh.visible = false;
    this.group.add(mesh);
    return { mesh, from: new THREE.Vector3(), to: new THREE.Vector3(), t: 0, alive: false, victim: null };
  }

  private makeFlash(): Flash {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 8, 6),
      new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    mesh.visible = false;
    this.group.add(mesh);
    return { mesh, life: 0 };
  }
}
