// Ark Dock zone (方舟号): a giant warship half buried in the ground.
// Owned by the "ark and fortress" session.

import * as THREE from 'three';
import { G, emit, footprint, part, pick, rnd, type Ctx } from '../kit';
import type { ZoneApi, ZoneModule } from './types';

const HULL = 0x6b5f54;
const RUST = 0x8a5a3a;
const GUN = 0x4a4644;
const DARK = 0x38332f;
const PLATE = 0x7d7064;
const LAMP = 0xffd27a;
const ENGINE = 0xff8a3a;

/** Hull centreline sits this far north of the zone centre, clear of the beacon. */
const NORTH = 10;
const YAW = Math.PI / 2;

type Section = { e: number; len: number; w: number; h: number; lift: number; roll: number; pitch: number };

/**
 * The hull is built as six slices, each on its own ground frame. A single
 * rigid 30-unit frame would leave the ends floating: the ground drops about
 * 2.7 units over that span. Each slice carries a little less roll than the one
 * behind it, so the ship reads as tilted and settling into the soil at the stern.
 */
const SECTIONS: Section[] = [
  { e: -13.2, len: 5.8, w: 6.4, h: 4.4, lift: -1.1, roll: 0.2, pitch: 0.03 },
  { e: -8.4, len: 5.8, w: 8.2, h: 5.4, lift: -0.5, roll: 0.16, pitch: 0.02 },
  { e: -3.6, len: 5.8, w: 9.0, h: 6.0, lift: -0.05, roll: 0.12, pitch: 0.01 },
  { e: 1.2, len: 5.8, w: 8.9, h: 6.0, lift: 0.05, roll: 0.1, pitch: -0.005 },
  { e: 6.0, len: 5.8, w: 8.0, h: 5.4, lift: 0.2, roll: 0.07, pitch: -0.01 },
  { e: 10.8, len: 5.8, w: 6.6, h: 4.6, lift: 0.4, roll: 0.04, pitch: -0.02 }
];

function sectionFrame(api: ZoneApi, s: Section): THREE.Matrix4 {
  const f = api.at(s.e, NORTH, YAW, s.lift);
  return f.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(s.pitch, 0, s.roll)));
}

function hullSection(c: Ctx, f: THREE.Matrix4, s: Section): void {
  const belt = s.h * 0.6;
  // Belt at the waterline, slightly wider than the upper hull above it.
  part(c.solid, G.box, HULL, f, { p: [0, -1.9, 0], s: [s.w, belt + 1.9, s.len + 0.2] });
  part(c.solid, G.box, GUN, f, { p: [0, belt, 0], s: [s.w * 0.93, s.h - belt, s.len] });
  part(c.solid, G.box, PLATE, f, { p: [0, s.h, 0], s: [s.w * 0.62, 0.3, s.len * 0.98] });
  // Chamfered shoulders, so the cross-section is not a plain box.
  for (const side of [-1, 1]) {
    part(c.solid, G.box, HULL, f, { p: [side * (s.w * 0.43), s.h - 0.7, 0], s: [1.0, 1.1, s.len], r: [0, 0, -side * 0.68] });
  }

  for (const side of [-1, 1]) {
    // Armour bands standing proud of the flank.
    part(c.solid, G.box, RUST, f, { p: [side * (s.w / 2 - 0.12), belt - 1.0, 0], s: [0.55, 0.6, s.len * 0.96] });
    part(c.solid, G.box, PLATE, f, { p: [side * (s.w * 0.465 - 0.08), belt + 0.5, 0], s: [0.5, 0.45, s.len * 0.92] });
    part(c.solid, G.box, DARK, f, { p: [side * (s.w * 0.465 - 0.08), belt + 1.5, 0], s: [0.4, 0.28, s.len * 0.86] });
    // Portholes along the upper hull.
    for (let k = -1; k <= 1; k++) {
      part(c.night, G.box, LAMP, f, { p: [side * (s.w * 0.465 + 0.06), belt + 0.95, k * 1.45], s: [0.12, 0.3, 0.46] });
    }
    // A round hatch low on the belt.
    part(c.solid, G.cyl8, DARK, f, { p: [side * (s.w / 2), belt - 2.0, 0], s: [1.6, 0.22, 1.6], r: [0, 0, (-side * Math.PI) / 2] });
    part(c.solid, G.cyl8, RUST, f, { p: [side * (s.w / 2 + 0.18), belt - 2.0, 0], s: [1.15, 0.18, 1.15], r: [0, 0, (-side * Math.PI) / 2] });
  }

  // Rails and spars run past the end of each slice, so the seams between
  // slices read as one continuous line instead of six separate blocks.
  for (const side of [-1, 1]) {
    part(c.solid, G.box, DARK, f, { p: [side * (s.w * 0.38), s.h + 0.55, 0], s: [0.14, 0.14, s.len + 1.2] });
    for (let k = -1; k <= 1; k++) {
      part(c.solid, G.box, DARK, f, { p: [side * (s.w * 0.38), s.h + 0.3, k * 1.7], s: [0.12, 0.55, 0.12] });
    }
    part(c.solid, G.box, RUST, f, { p: [side * (s.w * 0.465), belt + 2.5, 0], s: [0.28, 0.28, s.len + 1.2] });
  }
  part(c.solid, G.box, RUST, f, { p: [0, s.h + 0.32, 0], s: [0.9, 0.14, s.len + 1.1] });
}

/** Bow: a four-sided wedge tapering the hull to a point. */
function bow(c: Ctx, f: THREE.Matrix4, s: Section): void {
  const h = (s.h - s.h * 0.6) + 1.9;
  part(c.solid, G.cone4, HULL, f, { p: [0, s.h * 0.6 - 1.9, s.len / 2], s: [s.w, h, s.len * 0.9], r: [Math.PI / 2, Math.PI / 4, 0] });
  part(c.solid, G.cone4, GUN, f, { p: [0, s.h * 0.6 - 1.9, s.len / 2 + 0.05], s: [s.w * 0.93, h, s.len * 0.9], r: [Math.PI / 2, Math.PI / 4, 0] });
}

/** Stern: engine block, three nozzles and their glow. */
function stern(c: Ctx, api: ZoneApi, f: THREE.Matrix4, s: Section): void {
  const aft = -s.len / 2 - 0.4;
  part(c.solid, G.box, DARK, f, { p: [0, 0.4, aft - 0.5], s: [s.w * 0.72, 3.2, 1.2] });
  for (const x of [-2.0, 0, 2.0]) {
    part(c.solid, G.cyl8, DARK, f, { p: [x, 1.7, aft - 0.9], s: [1.6, 2.2, 1.6], r: [-Math.PI / 2, 0, 0] });
    part(c.solid, G.cyl8, RUST, f, { p: [x, 1.7, aft - 1.0], s: [1.85, 0.3, 1.85], r: [-Math.PI / 2, 0, 0] });
    part(c.glow, G.cyl8, ENGINE, f, { p: [x, 1.7, aft - 3.0], s: [1.15, 0.12, 1.15], r: [-Math.PI / 2, 0, 0] });
  }
  emit(c, f, ENGINE, 1.4, 11, [0, 1.7, aft - 3.2]);
}

/** The bridge tower: stepped blocks, lit window strips and a signal mast. */
function bridge(c: Ctx, api: ZoneApi, f: THREE.Matrix4, s: Section): void {
  const deck = s.h + 0.3;
  part(c.solid, G.box, GUN, f, { p: [0, deck, -1.0], s: [5.4, 1.4, 3.6] });
  part(c.solid, G.box, HULL, f, { p: [0, deck + 1.4, -1.2], s: [4.0, 1.0, 2.8] });
  part(c.solid, G.box, PLATE, f, { p: [0, deck + 2.4, -1.4], s: [2.9, 0.2, 2.3] });
  // Bridge windows facing the bow.
  for (let k = -1; k <= 1; k++) {
    part(c.night, G.box, 0x9fe6ff, f, { p: [k * 1.15, deck + 0.7, -1.0 + 1.82], s: [0.7, 0.42, 0.1] });
    part(c.night, G.box, LAMP, f, { p: [k * 1.2, deck + 1.95, -1.2 + 1.42], s: [0.6, 0.3, 0.1] });
  }
  part(c.solid, G.box, DARK, f, { p: [1.1, deck + 2.6, -1.0], s: [0.12, 0.5, 0.12] });
  part(c.glow, G.sphere, 0xff5533, f, { p: [1.1, deck + 3.1, -1.0], s: 0.3 });
  part(c.solid, G.box, RUST, f, { p: [0, deck + 1.35, 0.9], s: [4.6, 0.12, 0.12] });
  emit(c, f, 0x9fe6ff, 0.7, 8, [0, deck + 1.0, -0.4]);
}

/** A slanted plate from the deck edge down to the ground, facing the beacon. */
function ramp(c: Ctx, api: ZoneApi): void {
  const f = api.at(-2.0, NORTH - 4.0, 0, 2.4);
  const slope = -0.72;
  part(c.solid, G.box, PLATE, f, { p: [0, 0, 0], s: [3.2, 0.35, 7.4], r: [slope, 0, 0] });
  for (let k = 0; k < 6; k++) {
    const z = -3.1 + k * 1.24;
    const y = z * Math.tan(0.72);
    part(c.solid, G.box, RUST, f, { p: [0, y + 0.12, z], s: [3.3, 0.14, 0.26], r: [slope, 0, 0] });
  }
  for (const side of [-1, 1]) {
    part(c.solid, G.box, GUN, f, { p: [side * 1.62, 0.28, 0], s: [0.18, 0.55, 7.4], r: [slope, 0, 0] });
  }
}

/** A dock crane. Returns the jib tip so the caller can hang a hook from it. */
function crane(c: Ctx, api: ZoneApi, east: number, north: number, yaw: number): { f: THREE.Matrix4; tip: THREE.Vector3 } {
  const f = api.at(east, north, yaw);
  part(c.solid, G.box, DARK, f, { p: [0, -0.3, 0], s: [2.6, 0.9, 2.6] });
  part(c.solid, G.box, GUN, f, { p: [0, 0.6, 0], s: [1.7, 0.5, 1.7] });
  part(c.solid, G.box, RUST, f, { p: [0, 1.1, 0], s: [0.85, 7.4, 0.85] });
  part(c.solid, G.box, GUN, f, { p: [0.9, 1.1, 0], s: [0.32, 6.0, 0.32], r: [0, 0, -0.3] });
  part(c.solid, G.box, GUN, f, { p: [-0.9, 1.1, 0], s: [0.32, 6.0, 0.32], r: [0, 0, 0.3] });
  // Cabin and counterweight.
  part(c.solid, G.box, HULL, f, { p: [0, 6.4, -0.9], s: [1.3, 1.2, 1.4] });
  part(c.solid, G.box, DARK, f, { p: [0, 6.6, -1.7], s: [1.1, 0.9, 0.7] });
  part(c.night, G.box, 0x9fe6ff, f, { p: [0, 7.0, -0.22], s: [0.9, 0.35, 0.1] });
  // Jib reaching out over the hull.
  part(c.solid, G.box, RUST, f, { p: [0, 8.1, 2.4], s: [0.7, 0.7, 6.6] });
  part(c.solid, G.box, GUN, f, { p: [0, 8.9, 1.2], s: [0.16, 1.2, 0.16], r: [0.55, 0, 0] });
  part(c.solid, G.box, DARK, f, { p: [0, 7.3, 0], s: [0.9, 0.9, 0.9], r: [0.6, 0, 0] });
  footprint(c, f, 1.7);
  const tip = new THREE.Vector3(0, 7.7, 5.4).applyMatrix4(f);
  return { f, tip };
}

function hook(api: ZoneApi, c: Ctx, f: THREE.Matrix4, tip: THREE.Vector3): void {
  const group = new THREE.Group();
  group.position.copy(tip);
  const base = new THREE.Quaternion().setFromRotationMatrix(f);
  group.quaternion.copy(base);
  const metal = new THREE.MeshStandardMaterial({ color: GUN, flatShading: true, roughness: 0.7, metalness: 0.4 });
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.6, 5).translate(0, -1.8, 0), metal);
  group.add(cable);
  const block = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.0), metal);
  block.position.set(0, -3.75, 0.22);
  group.add(block);
  const hookMesh = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.1, 4, 8, Math.PI * 1.4), metal);
  hookMesh.position.set(0, -4.35, 0.22);
  group.add(hookMesh);
  const swing = new THREE.Quaternion();
  const axis = new THREE.Vector3(1, 0, 0);
  api.addDynamic(group, (_dt, t) => {
    swing.setFromAxisAngle(axis, Math.sin(t * 0.85 + 0.7) * 0.14);
    group.quaternion.copy(base).multiply(swing);
  });
  void c;
}

/** A small lamp on a pole that blinks red. */
function warningLamp(api: ZoneApi, f: THREE.Matrix4, at: THREE.Vector3): void {
  const mat = new THREE.MeshBasicMaterial({ color: 0xff4433, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 5), mat);
  mesh.position.copy(at);
  const q = new THREE.Quaternion().setFromRotationMatrix(f);
  mesh.quaternion.copy(q);
  api.addDynamic(mesh, (_dt, t) => {
    mesh.visible = Math.sin(t * 3.4 + 0.4) > -0.25;
  });
}

/** Big pipes running out of the ground and into the hull. */
function pipeCluster(c: Ctx, api: ZoneApi, east: number, north: number, yaw: number, count: number): void {
  const f = api.at(east, north, yaw);
  for (let i = 0; i < count; i++) {
    const x = (i - (count - 1) / 2) * 0.95;
    const r = rnd(c, 0.3, 0.55);
    part(c.solid, G.cyl8, RUST, f, { p: [x, r + 0.1, -1.2], s: [r, 5.6, r], r: [Math.PI / 2 - 0.16, 0, 0] });
    part(c.solid, G.cyl8, GUN, f, { p: [x, r + 0.1, 0.4], s: [r * 1.3, 0.35, r * 1.3], r: [Math.PI / 2 - 0.16, 0, 0] });
  }
  part(c.solid, G.box, DARK, f, { p: [0, 0.2, -2.6], s: [count * 1.05, 0.5, 1.1] });
  footprint(c, f, 0.35 * count + 0.4);
}

function container(c: Ctx, f: THREE.Matrix4, color: number, w = 2.6, h = 1.3): void {
  part(c.solid, G.box, color, f, { p: [0, 0, 0], s: [w, h, 1.3] });
  part(c.solid, G.box, DARK, f, { p: [0, h - 0.06, 0], s: [w * 0.98, 0.08, 1.32] });
  for (let k = -1; k <= 1; k++) {
    part(c.solid, G.box, GUN, f, { p: [k * w * 0.3, h * 0.5, 0.66], s: [w * 0.1, h * 0.9, 0.06] });
  }
}

function containerStack(c: Ctx, api: ZoneApi, east: number, north: number, yaw: number): void {
  const f = api.at(east, north, yaw, -0.1);
  const colors = [RUST, GUN, 0x5c6a58, HULL];
  const levels = 2 + Math.floor(c.rng() * 2);
  for (let i = 0; i < levels; i++) {
    const g = f.clone();
    const off = i === 2 ? 0.6 : 0;
    g.multiply(new THREE.Matrix4().makeTranslation(off * 0.4, i * 1.34, off));
    part(c.solid, G.box, colors[(i + Math.floor(c.rng() * 4)) % 4], g, { p: [0, 0, 0], s: [2.6, 1.3, 1.35] });
    part(c.solid, G.box, DARK, g, { p: [0, 1.24, 0], s: [2.55, 0.08, 1.35] });
  }
  footprint(c, f, 1.8);
}

// ---------------------------------------------------------------- scatter

function scrap(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.5, 1.1);
  footprint(c, f, 0.45 * s);
  part(c.solid, G.box, pick(c, [HULL, RUST, GUN]), f, { s: [s, s * 0.5, s * 1.4], r: [0.2, c.rng() * 3, 0.1] });
}

function scrapPlate(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.8, 1.8);
  part(c.solid, G.box, pick(c, [PLATE, GUN, HULL]), f, { p: [0, 0.02, 0], s: [s, 0.12, s * 0.7], r: [rnd(c, -0.08, 0.08), c.rng() * 3, rnd(c, -0.08, 0.08)] });
}

function pipeSegment(c: Ctx, f: THREE.Matrix4): void {
  const r = rnd(c, 0.22, 0.42);
  const l = rnd(c, 1.4, 3.4);
  footprint(c, f, r + 0.2);
  part(c.solid, G.cyl8, pick(c, [RUST, GUN]), f, { p: [0, r, 0], s: [r, l, r], r: [Math.PI / 2, 0, rnd(c, 0, 3)] });
}

function scatteredContainer(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.9, 1.4);
  footprint(c, f, s * 1.1);
  container(c, f, pick(c, [RUST, GUN, 0x5c6a58]), s * 2.6, s * 1.3);
}

// ---------------------------------------------------------------- zone

// ---------------------------------------------------------------- scrape props

function buildArk(c: Ctx, api: ZoneApi): void {
  const frames = SECTIONS.map((s) => ({ s, f: sectionFrame(api, s) }));

  for (const { s, f } of frames) hullSection(c, f, s);
  bow(c, frames[frames.length - 1].f, SECTIONS[SECTIONS.length - 1]);
  stern(c, api, frames[0].f, SECTIONS[0]);
  bridge(c, api, frames[2].f, SECTIONS[2]);
  ramp(c, api);

  // One ground-frame collider per slice: the hull is a wall, not a walkway.
  const hullGround = api.at(0, NORTH, YAW);
  for (const s of SECTIONS) footprint(c, hullGround, 5.2, [0, s.e]);

  const south = crane(c, api, -9.5, 3.4, -0.4);
  const north = crane(c, api, 11.5, 16.2, 2.6);
  hook(api, c, south.f, south.tip);
  const lampPos = new THREE.Vector3(0, 8.7, 0).applyMatrix4(north.f);
  warningLamp(api, north.f, lampPos);
  part(c.solid, G.box, DARK, north.f, { p: [0, 8.2, 0], s: [0.4, 0.5, 0.4] });
  emit(c, north.f, 0xff4433, 0.7, 7, [0, 8.9, 0]);

  pipeCluster(c, api, -14.5, 7.0, 1.2, 3);
  pipeCluster(c, api, 8.0, 3.0, -0.5, 2);
  pipeCluster(c, api, 14.0, 14.0, 2.2, 3);

  containerStack(c, api, -13.0, 14.5, 0.4);
  containerStack(c, api, 12.5, 5.0, -0.7);
  containerStack(c, api, 4.0, 17.0, 1.1);

  // A lone pylon beside the ramp so the dock reads from the beacon.
  const pylon = api.at(-6.5, 4.0, 0.3);
  part(c.solid, G.box, DARK, pylon, { p: [0, -0.2, 0], s: [1.1, 0.6, 1.1] });
  part(c.solid, G.box, RUST, pylon, { p: [0, 0.4, 0], s: [0.42, 4.4, 0.42] });
  part(c.solid, G.box, RUST, pylon, { p: [0, 4.5, 0.5], s: [0.3, 0.14, 1.4] });
  part(c.glow, G.box, LAMP, pylon, { p: [0, 4.05, 0.55], s: [0.3, 0.42, 0.3] });
  emit(c, pylon, LAMP, 0.9, 7, [0, 4.2, 0.55]);
  footprint(c, pylon, 0.9);

  // Keep the scatter off the dock floor.
  api.exclude(0, NORTH, 19);
  api.exclude(-9.5, 3.4, 4);
  api.exclude(11.5, 16.2, 4);
  api.exclude(-6.5, 4.0, 3);
  api.exclude(-2.0, NORTH - 6.6, 5);
}

export const arkZone: ZoneModule = {
  id: 'ark',
  build(api) {
    buildArk(api.ctx, api);
  },
  scatter: [
    { p: 0.05, build: scrap },
    { p: 0.04, build: scrapPlate },
    { p: 0.03, build: pipeSegment },
    { p: 0.015, build: scatteredContainer }
  ]
};
