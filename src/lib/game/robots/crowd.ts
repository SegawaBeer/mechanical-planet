// The machines that fill the planet without being part of the game: two that
// walk a loop in every zone, and a pair that trades harmless light bolts back
// and forth. Nothing here can be clicked, damaged or destroyed; it is scenery
// that happens to move.

import * as THREE from 'three';
import { buildRobot, type FormAnim, type FormState } from './robot';
import { SCHEMES } from './scheme';
import { biomeById, isOcean } from '../biomes';
import { offsetDir, surfaceNormal, walkRadius } from '../planet';
import { bridgeAway, nearBridge, type ColliderGrid } from '../collision';

type ZoneId = 'river' | 'citadel' | 'ark' | 'fortress';
const ZONES: ZoneId[] = ['river', 'citadel', 'ark', 'fortress'];

/** Surface units per second for a patrol. */
const PATROL_SPEED = 1.3;
/** Gap between the two duelling machines, in surface units. */
const DUEL_GAP = 3;
/** Seconds a bolt takes from muzzle to target. */
const BOLT_TIME = 0.4;
/** Pause between shots, in seconds. */
const SHOT_EVERY = 1.25;

/** Patrol waypoints as [east, north] from the zone centre. Kept clear of the
 * beacon, the take-over machines, and each other. */
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
/** How close the driven machine can come before a patrol stops walking. */
const YIELD = 2.6;

type Actor = {
  zone: ZoneId;
  kind: 'patrol' | 'duel';
  holder: THREE.Group;
  /** Leans back for recoil and when hit. */
  tilt: THREE.Group;
  anim: FormAnim;
  dir: THREE.Vector3;
  heading: THREE.Vector3;
  target: THREE.Vector3;
  next: number;
  partner: Actor | null;
  shot: number;
  stagger: number;
  recoil: number;
};

type Bolt = { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; t: number; alive: boolean; victim: Actor | null };
type Flash = { mesh: THREE.Mesh; life: number };

const _up = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _step = new THREE.Vector3();
const _aim = new THREE.Vector3();
const _chest = new THREE.Vector3();
const _chest2 = new THREE.Vector3();

function blendedUp(dir: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  return surfaceNormal(dir, out).multiplyScalar(0.6).addScaledVector(dir, 0.4).normalize();
}

/** Stand a crowd machine on the surface, facing `heading`. */
function place(holder: THREE.Group, dir: THREE.Vector3, heading: THREE.Vector3): void {
  blendedUp(dir, _up);
  _fwd.copy(heading).addScaledVector(_up, -heading.dot(_up));
  if (_fwd.lengthSq() < 1e-8) _fwd.copy(heading);
  _fwd.normalize();
  _right.crossVectors(_up, _fwd).normalize();
  _m.makeBasis(_right, _up, _fwd);
  holder.quaternion.setFromRotationMatrix(_m);
  holder.position.copy(dir).multiplyScalar(walkRadius(dir));
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

export class Crowd {
  readonly group = new THREE.Group();
  private actors: Actor[] = [];
  private bolts: Bolt[] = [];
  private flashes: Flash[] = [];
  private boltMat = new Map<ZoneId, THREE.MeshBasicMaterial>();
  private flashMat = new Map<ZoneId, THREE.MeshBasicMaterial>();
  private idle: FormState = { speed: 0, speed01: 0, airborne: false, steer: 0, time: 0 };
  private walk: FormState = { speed: 0, speed01: 0.16, airborne: false, steer: 0, time: 0 };

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
      const ring = zone === 'river' ? PATROL_RIVER : PATROL;

      // Two walkers on a loop of four points.
      const startA = landNear(centre, ring[0][0], ring[0][1]);
      const startB = landNear(centre, ring[2][0], ring[2][1]);
      this.addActor(zone, startA, 1, null);
      this.addActor(zone, startB, 3, null);

      // One duelling pair, three units apart, facing each other.
      const a = landNear(centre, -6, 5.5);
      // The partner stands the duel gap to one side of the first, still clear
      // of the crossings.
      const b = a.clone();
      bridgeAway(a, _step);
      const gapAng = DUEL_GAP / 42;
      const probe = a.clone().multiplyScalar(Math.cos(gapAng)).addScaledVector(_step, Math.sin(gapAng)).normalize();
      if (!nearBridge(probe) && !isOcean(probe)) b.copy(probe);
      else {
        const back = a.clone().multiplyScalar(Math.cos(gapAng)).addScaledVector(_step, -Math.sin(gapAng)).normalize();
        if (!nearBridge(back) && !isOcean(back)) b.copy(back);
      }
      const actorA = this.addActor(zone, a, 0, null);
      const actorB = this.addActor(zone, b, 0, null);
      actorA.kind = 'duel';
      actorB.kind = 'duel';
      actorA.partner = actorB;
      actorB.partner = actorA;
      actorA.shot = 0.4;
      actorB.shot = SHOT_EVERY * 0.5 + 0.6;
    }

    for (let i = 0; i < 16; i++) this.bolts.push(this.makeBolt());
    for (let i = 0; i < 12; i++) this.flashes.push(this.makeFlash());
  }

  /** Dev aid: how many walkers are on a crossing or its bridgehead. */
  onBridge(): number {
    return this.actors.filter((a) => nearBridge(a.dir)).length;
  }

  /** Every crowd machine's position, for the driven machine to collide with. */
  positions(): THREE.Vector3[] {
    return this.actors.map((a) => a.dir);
  }

  update(dt: number, t: number, avoid: THREE.Vector3 | null = null): void {
    this.idle.time = t;
    this.walk.time = t;
    for (const actor of this.actors) {
      if (actor.kind === 'patrol') this.patrol(actor, dt, avoid);
      else this.duel(actor, dt);
    }
    this.updateBolts(dt);
    this.updateFlashes(dt);
  }

  // ---------------------------------------------------------------- actors

  private addActor(zone: ZoneId, dir: THREE.Vector3, next: number, partner: Actor | null): Actor {
    const robot = buildRobot(SCHEMES[zone]);
    robot.root.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        // Twenty of these walking at once must not pay for shadow maps.
        o.castShadow = false;
        o.receiveShadow = false;
      }
    });
    const tilt = new THREE.Group();
    tilt.add(robot.root);
    const holder = new THREE.Group();
    holder.add(tilt);

    const heading = new THREE.Vector3(0, 0, 1);
    const actor: Actor = {
      zone,
      kind: 'patrol',
      holder,
      tilt,
      anim: robot.anim,
      dir: dir.clone(),
      heading,
      target: dir.clone(),
      next,
      partner,
      shot: Math.random() * SHOT_EVERY,
      stagger: 0,
      recoil: 0
    };
    this.pickWaypoint(actor);
    place(holder, actor.dir, actor.heading);
    this.group.add(holder);
    this.actors.push(actor);
    return actor;
  }

  private patrol(actor: Actor, dt: number, avoid: THREE.Vector3 | null): void {
    // A walker gives way to the machine being driven rather than shoving it.
    if (avoid && actor.dir.angleTo(avoid) * 42 < YIELD) {
      place(actor.holder, actor.dir, actor.heading);
      actor.anim(dt, this.idle);
      return;
    }
    // A walker that has drifted onto a crossing walks off it.
    if (nearBridge(actor.dir)) {
      bridgeAway(actor.dir, _step);
      const ang = 4 / 42;
      actor.target.copy(actor.dir).multiplyScalar(Math.cos(ang)).addScaledVector(_step, Math.sin(ang)).normalize();
    }
    headingToward(actor.dir, actor.target, actor.heading);
    const left = actor.dir.angleTo(actor.target) * 42;
    if (left < 0.35) {
      this.pickWaypoint(actor);
      return;
    }
    const wasClear = !nearBridge(actor.dir);
    stepToward(actor.dir, actor.heading, PATROL_SPEED * dt, _step);
    if (isOcean(_step) || (wasClear && nearBridge(_step))) {
      this.pickWaypoint(actor);
      return;
    }
    this.colliders.resolve(_step, 0.4);
    actor.dir.copy(_step);
    headingToward(actor.dir, actor.target, actor.heading);
    place(actor.holder, actor.dir, actor.heading);
    actor.tilt.rotation.set(0, 0, 0);
    actor.anim(dt, this.walk);
  }

  /** Choose the next loop point, skipping any that water or a prop blocks. */
  private pickWaypoint(actor: Actor): void {
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
    headingToward(actor.dir, partner.dir, actor.heading);
    place(actor.holder, actor.dir, actor.heading);
    actor.anim(dt, this.idle);

    // Lean back from the shot, and sideways from a hit, both easing home.
    actor.recoil = Math.max(0, actor.recoil - dt * 3.2);
    actor.stagger = Math.max(0, actor.stagger - dt * 2.2);
    actor.tilt.rotation.x = actor.recoil * 0.5;
    actor.tilt.rotation.z = actor.stagger * 0.45;

    actor.shot -= dt;
    if (actor.shot > 0) return;
    actor.shot = SHOT_EVERY + Math.random() * 0.5;
    actor.recoil = 1;
    this.fire(actor, partner);
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
