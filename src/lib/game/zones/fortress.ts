// Shadow Fortress zone (暗影要塞): the chaos end of the planet.
// Owned by the "ark and fortress" session.
//
// Restyled to the production-design reference: the purple-black wall ring and
// its scanning turrets stay as the outer ring, and the interior is rebuilt as an
// impact crater. A bowl of broken plates with a spine of jagged wreckage rising
// out of it, a wreckage throne, makeshift scaffolding and needle towers around
// the rim, and purple energon glowing in the crater floor. Organic growth climbs
// the rim and the wrecks: moss, hanging vines and mushroom clusters, densest
// where the metal is broken. Nothing floats; every prop uses the zone's ground
// frames.

import * as THREE from 'three';
import { G, PropBatch, emit, footprint, part, pick, rnd, type Ctx } from '../kit';
import { brushedGold, circuitMetal, energonFlow, energonGlass, mossyGrowth, rustedMetal } from '../look';
import type { ZoneApi, ZoneModule } from './types';

// ---------------------------------------------------------------- palette
/** Wall stone, three steps. Deep purple is the base; rust is the wear. */
const WALL = 0x3b2b4c;
const WALL_B = 0x503c66;
const WALL_D = 0x271c35;
const RUST = 0x7a3f22;
const RUST_D = 0x512815;
const RUST_L = 0x9c5527;
const SOOT = 0x1d1722;
/** Energon and edge light. */
const MAGENTA = 0xff3dd0;
const VIOLET = 0xb04cff;
const RED = 0xff3355;
/** Mist green growth, three steps, and the mushroom caps. */
const MOSS = 0x46b894;
const MOSS_D = 0x2f8064;
const MOSS_L = 0x74d8ab;
const CAP = 0xa5552a;
const STEM = 0x7d7260;
/** Passed to the gold batch; the material's own colour is what is drawn. */
const GOLD = 0xc9a227;

const RING = 12;
/** Half-width of a gate, as an angle on the ring. */
const GATE_HALF = 2.7 / RING;

const GATE_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, Math.PI * 2];

/** Crater centre in zone coordinates, and its radius. Clears the beacon, the
 *  robot stand and both road approaches. */
const CRATER_E = -4.2;
const CRATER_N = 6.8;
const CRATER_R = 3.6;

// ---------------------------------------------------------------- batches

type Sets = {
  /** Dark purple-black plate with the faint circuit etch. */
  plate: PropBatch;
  /** Rusted layered metal: walls, wrecks, scaffolding. */
  wear: PropBatch;
  /** Brushed gold: throne trim only. */
  gold: PropBatch;
  /** Energon glass: the pool plates in the crater floor. */
  glass: PropBatch;
  /** Energon flow: the veins running out of the crater. */
  flow: PropBatch;
  /** Mossy growth: moss, vines, stems. */
  moss: PropBatch;
};

function newSets(): Sets {
  return {
    plate: new PropBatch(),
    wear: new PropBatch(),
    gold: new PropBatch(),
    glass: new PropBatch(),
    flow: new PropBatch(),
    moss: new PropBatch()
  };
}

function rustMaterial(): THREE.MeshStandardMaterial {
  const m = rustedMetal(0xffffff);
  m.vertexColors = true;
  m.flatShading = true;
  return m;
}

function mossMaterial(): THREE.MeshStandardMaterial {
  const m = mossyGrowth(0xffffff);
  m.vertexColors = true;
  m.flatShading = true;
  // A breath of self-light is what makes the growth read in the fortress's
  // near-black interior; without it the green drops to grey at any distance.
  m.emissive = new THREE.Color(0x1d5a44);
  m.emissiveIntensity = 0.35;
  return m;
}

function attach(api: ZoneApi, batch: PropBatch, material: THREE.Material, name: string, shadows = true): void {
  const mesh = batch.build(material);
  if (!mesh) return;
  mesh.name = name;
  mesh.castShadow = shadows;
  mesh.receiveShadow = true;
  api.addDynamic(mesh, () => {});
}

// ---------------------------------------------------------------- walls

function wallPanel(c: Ctx, s: Sets, api: ZoneApi, theta: number, halfArc: number, h: number): void {
  const f = api.at(RING * Math.sin(theta), RING * Math.cos(theta), theta, -0.45);
  const len = 2 * RING * Math.sin(halfArc) + 0.5;
  part(s.plate, G.box, WALL, f, { p: [0, 0, 0], s: [len, h, 1.6] });
  part(s.plate, G.box, WALL_D, f, { p: [0, h, 0], s: [len, 0.3, 2.0] });
  // Rusted strakes across the wall, and a rust cap on the parapet.
  part(s.wear, G.box, RUST_D, f, { p: [0, h * 0.66, 0.8], s: [len, 0.34, 0.26] });
  part(s.wear, G.box, RUST, f, { p: [0, h * 0.28, 0.78], s: [len, 0.3, 0.3] });
  part(s.wear, G.box, RUST_D, f, { p: [0, h + 0.32, 0], s: [len, 0.22, 2.02] });
  // Battlement blocks, and glow slots on both faces.
  for (let k = -1; k <= 1; k++) {
    part(s.plate, G.box, WALL_D, f, { p: [k * len * 0.3, h + 0.3, 0.6], s: [0.9, 0.9, 0.65] });
    part(c.glow, G.box, MAGENTA, f, { p: [k * len * 0.28, h * 0.6, -0.83], s: [0.18, h * 0.42, 0.06] });
  }
  // Moss taking the foot of the wall, outside.
  for (let k = -1; k <= 1; k++) {
    part(s.moss, G.box, k === 0 ? MOSS : MOSS_D, f, {
      p: [k * len * 0.3, 0.02, 0.95],
      s: [len * 0.22, rnd(c, 0.25, 0.55), rnd(c, 0.3, 0.6)],
      r: [0, 0, rnd(c, -0.1, 0.1)]
    });
  }
  // Magenta line along the parapet, and a low band that lights the walk inside.
  part(c.glow, G.box, MAGENTA, f, { p: [0, h + 0.02, 0.86], s: [len * 0.98, 0.1, 0.08] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, h * 0.16, -0.84], s: [len * 0.94, 0.12, 0.07] });
  // A chain of small discs along the panel, so the wall is blocked right up to
  // its two corners instead of being one fat blob at the middle.
  const discs = Math.max(3, Math.round(len / 1.1));
  const step = (len - 1.0) / (discs - 1);
  for (let i = 0; i < discs; i++) footprint(c, f, 1.0, [-len / 2 + 0.5 + i * step, 0]);
}

function gate(api: ZoneApi, c: Ctx, s: Sets, theta: number): void {
  const f = api.at(RING * Math.sin(theta), RING * Math.cos(theta), theta, -0.45);
  // Two posts framing the opening, joined by a lintel.
  for (const side of [-1, 1]) {
    part(s.plate, G.box, WALL_D, f, { p: [side * 2.6, 0, 0], s: [1.1, 4.6, 1.9] });
    part(s.wear, G.box, RUST, f, { p: [side * 2.6, 3.5, 0], s: [1.3, 0.5, 2.1] });
    part(s.wear, G.cone4, RUST_D, f, { p: [side * 2.6, 4.6, 0], s: [1.2, 1.1, 1.2], r: [0, Math.PI / 4, 0] });
    part(c.glow, G.box, RED, f, { p: [side * 2.05, 2.6, -0.85], s: [0.16, 0.7, 0.06] });
    // Magenta frame down the inner edge of each post.
    part(c.glow, G.box, MAGENTA, f, { p: [side * 2.05, 0.15, -0.85], s: [0.13, 4.1, 0.06] });
    part(c.glow, G.box, MAGENTA, f, { p: [side * 2.05, 0.15, 0.98], s: [0.13, 4.1, 0.06] });
    footprint(c, f, 0.7, [side * 2.6, 0]);
  }
  part(s.plate, G.box, WALL_D, f, { p: [0, 4.0, 0], s: [4.2, 0.7, 1.9] });
  part(s.glass, G.box, VIOLET, f, { p: [0, 4.35, 0.9], s: [3.2, 0.28, 0.1] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 3.95, -0.85], s: [3.6, 0.16, 0.06] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 4.72, 0.98], s: [3.6, 0.16, 0.06] });
  emit(c, f, MAGENTA, 1.0, 11, [0, 3.4, -0.6]);
}

// ---------------------------------------------------------------- towers

function tower(c: Ctx, s: Sets, api: ZoneApi, theta: number): THREE.Matrix4 {
  const f = api.at(RING * Math.sin(theta), RING * Math.cos(theta), theta, -0.6);
  part(s.plate, G.cone4, WALL_D, f, { p: [0, -0.3, 0], s: [4.6, 2.6, 4.6], r: [0, Math.PI / 4, 0] });
  part(s.plate, G.box, WALL, f, { p: [0, 2.1, 0], s: [3.2, 2.9, 3.2], r: [0, Math.PI / 4, 0] });
  part(s.wear, G.box, RUST_D, f, { p: [0, 4.9, 0], s: [3.6, 0.5, 3.6], r: [0, Math.PI / 4, 0] });
  part(s.plate, G.box, WALL_D, f, { p: [0, 5.4, 0], s: [2.6, 1.0, 2.6] });
  // Buttresses at the four faces, rusted at the foot.
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 4;
    const r = 1.65;
    part(s.plate, G.box, WALL, f, { p: [Math.sin(a) * r, 0, Math.cos(a) * r], s: [0.7, 3.4, 0.7], r: [0, -a, 0] });
    part(s.wear, G.cone4, RUST_D, f, { p: [Math.sin(a) * r, 3.4, Math.cos(a) * r], s: [0.9, 0.9, 0.9], r: [0, Math.PI / 4, 0] });
    part(s.moss, G.box, MOSS_D, f, { p: [Math.sin(a) * r, 0.02, Math.cos(a) * r], s: [0.9, 0.3, 0.9], r: [0, -a, 0] });
  }
  // Corner spikes.
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2;
    part(s.wear, G.cone4, RUST_D, f, { p: [Math.sin(a) * 1.5, 5.9, Math.cos(a) * 1.5], s: [0.5, 1.6, 0.5], r: [0, Math.PI / 4, 0] });
  }
  part(c.glow, G.box, MAGENTA, f, { p: [0, 3.2, 0], s: [2.4, 0.14, 2.4], r: [0, Math.PI / 4, 0] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 4.92, 0], s: [3.3, 0.12, 3.3], r: [0, Math.PI / 4, 0] });
  part(c.glow, G.box, VIOLET, f, { p: [0, 5.42, 0], s: [2.5, 0.1, 2.5] });
  emit(c, f, MAGENTA, 1.1, 10, [0, 5.4, 0]);
  footprint(c, f, 2.5);
  return f;
}

/** A turret head that sweeps side to side on top of a tower. */
function turret(api: ZoneApi, f: THREE.Matrix4, phase: number): void {
  const group = new THREE.Group();
  group.position.set(0, 6.4, 0).applyMatrix4(f);
  const base = new THREE.Quaternion().setFromRotationMatrix(f);
  group.quaternion.copy(base);

  const hullMat = new THREE.MeshStandardMaterial({ color: 0x4a3457, flatShading: true, roughness: 0.55, metalness: 0.7, envMapIntensity: 1 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x5c2f1b, flatShading: true, roughness: 0.7, metalness: 0.6 });
  const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.5, 6), hullMat);
  dome.position.y = 0.25;
  group.add(dome);
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.95, 1.6), hullMat);
  head.position.y = 0.95;
  group.add(head);
  for (const x of [-0.45, 0.45]) {
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 1.7), darkMat);
    barrel.position.set(x, 1.05, 1.5);
    group.add(barrel);
  }
  const eye = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.1), new THREE.MeshBasicMaterial({ color: MAGENTA, toneMapped: false }));
  eye.position.set(0, 1.15, 0.83);
  group.add(eye);

  api.addDynamic(group, (_dt, t) => {
    group.quaternion.copy(base).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(t * 0.42 + phase) * 0.75));
  });
}

// ---------------------------------------------------------------- crater

/** Ground frame at a ring position around the crater, facing outwards. */
function craterFrame(api: ZoneApi, angle: number, radius: number, lift: number): THREE.Matrix4 {
  return api.at(CRATER_E + Math.sin(angle) * radius, CRATER_N + Math.cos(angle) * radius, angle, lift);
}

/**
 * The crater: a rising rim of broken plates, two rings of floor plates stepping
 * down to the middle, and purple energon pooling and veining through the floor.
 * The plates are low and carry no footprints, so the player can walk in.
 */
function crater(c: Ctx, s: Sets, api: ZoneApi): void {
  // Rim: sixteen plates tilted so their outer edge lifts, half torn out.
  const rim = 16;
  for (let i = 0; i < rim; i++) {
    const a = (i / rim) * Math.PI * 2 + 0.12;
    const f = craterFrame(api, a, CRATER_R - 0.25, 0.3);
    const torn = i % 4 === 0;
    part(s.wear, G.box, torn ? RUST : pick(c, [WALL, WALL_D, RUST_D]), f, {
      p: [0, 0, 0],
      s: [rnd(c, 1.7, 2.2), rnd(c, 0.24, 0.34), rnd(c, 1.0, 1.4)],
      r: [-rnd(c, 0.14, 0.2), rnd(c, -0.08, 0.08), rnd(c, -0.05, 0.05)]
    });
  }
  // Bowl: two rings stepping down to the middle.
  for (const [radius, lift, count, hgt] of [
    [2.2, 0.18, 12, 0.24],
    [0.9, 0.07, 7, 0.2]
  ] as [number, number, number, number][]) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + 0.4;
      const f = craterFrame(api, a, radius, lift);
      part(s.plate, G.box, pick(c, [WALL_D, SOOT, 0x2d2138]), f, {
        p: [0, 0, 0],
        s: [rnd(c, 1.6, 2.4), hgt, rnd(c, 1.0, 1.4)],
        r: [-rnd(c, 0.06, 0.13), rnd(c, -0.1, 0.1), rnd(c, -0.04, 0.04)]
      });
    }
  }
  // Energon pooling in the floor, and veins running out from under the spine.
  const pool = api.at(CRATER_E + 0.3, CRATER_N - 0.4, 0.3, 0.05);
  part(s.glass, G.box, VIOLET, pool, { p: [0, 0, 0], s: [1.8, 0.09, 1.2], r: [0, 0.2, 0] });
  part(s.glass, G.box, VIOLET, api.at(CRATER_E - 0.9, CRATER_N + 0.9, 1.2, 0.04), { p: [0, 0, 0], s: [1.2, 0.08, 0.8], r: [0, -0.4, 0] });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.25;
    const r = rnd(c, 0.5, 2.9);
    const f = craterFrame(api, a, r, 0.05);
    part(s.flow, G.box, i % 3 === 0 ? MAGENTA : VIOLET, f, { p: [0, 0, 0], s: [rnd(c, 0.12, 0.24), 0.05, rnd(c, 0.7, 1.9)] });
  }
  // Glowing vents in the floor itself, so the bowl reads purple from above.
  for (const [e, n, s0] of [
    [-0.4, -0.6, 0.9],
    [0.7, 0.5, 0.6],
    [-1.2, 0.9, 0.5]
  ] as [number, number, number][]) {
    part(c.glow, G.box, VIOLET, craterFrame(api, Math.atan2(e, n), Math.hypot(e, n), 0.07), { p: [0, 0, 0], s: [s0, 0.05, s0 * 0.6], r: [0, rnd(c, 0, 3), 0] });
  }
  emit(c, pool, VIOLET, 2.2, 15, [0, 0.4, 0]);
  emit(c, pool, MAGENTA, 0.9, 9, [0, 0.2, 0]);

  // Larger broken plates half sunk outside the rim, south and west of it.
  for (let i = 0; i < 12; i++) {
    const a = rnd(c, Math.PI * 0.6, Math.PI * 1.9);
    const f = craterFrame(api, a, rnd(c, CRATER_R + 0.3, CRATER_R + 1.6), rnd(c, -0.35, -0.1));
    part(s.wear, G.box, pick(c, [RUST_D, RUST, WALL_D]), f, {
      p: [0, 0.12, 0],
      s: [rnd(c, 0.9, 1.8), rnd(c, 0.18, 0.32), rnd(c, 0.8, 1.6)],
      r: [rnd(c, -0.18, 0.18), rnd(c, 0, 3), rnd(c, -0.18, 0.18)]
    });
  }
}

// ---------------------------------------------------------------- wreck spine

/** The spine: jagged wreckage rising out of the crater, leaning over the bowl. */
function spine(c: Ctx, s: Sets, api: ZoneApi): void {
  const centre = api.at(CRATER_E, CRATER_N, 0.35, 0.1);
  // The main fin: one tall, thin, twisted wedge. It has to clear the 4.4-unit
  // wall by a wide margin, or the silhouette disappears from the ring road.
  part(s.wear, G.box, RUST_D, centre, { p: [0, 0.1, 0], s: [0.7, 15.0, 4.0], r: [0.07, 0.35, 0.12] });
  part(s.wear, G.box, RUST, centre, { p: [0.6, 0.3, -0.3], s: [0.32, 11.0, 2.8], r: [0.1, 0.55, 0.24] });
  part(s.wear, G.box, WALL_D, centre, { p: [-0.65, 0.2, 0.55], s: [0.36, 8.4, 2.4], r: [0.05, 0.9, -0.2] });
  // Three tips on the fin, cut at different heights.
  part(s.wear, G.cone4, RUST_L, centre, { p: [0.45, 14.8, -0.7], s: [0.9, 4.0, 0.9], r: [0.1, 0.5, 0.18] });
  part(s.wear, G.cone4, RUST_D, centre, { p: [-0.6, 12.6, 0.55], s: [0.66, 3.4, 0.66], r: [0.08, 0.9, -0.22] });
  part(s.wear, G.cone4, WALL_D, centre, { p: [0.1, 15.8, 0.3], s: [0.5, 3.0, 0.5], r: [0.16, 0.2, 0.05] });
  // Rib shards leaning out of the floor around the fin.
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + 0.7;
    const r = rnd(c, 0.9, 2.4);
    const f = craterFrame(api, a, r, rnd(c, 0, 0.1));
    const h = rnd(c, 3.4, 8.4);
    part(s.wear, G.cone4, pick(c, [RUST, RUST_D, WALL_D, SOOT]), f, {
      p: [0, 0, 0],
      s: [rnd(c, 0.55, 1.0), h, rnd(c, 0.55, 1.0)],
      r: [Math.sin(a) * rnd(c, 0.3, 0.55), rnd(c, 0, 3), -Math.cos(a) * rnd(c, 0.3, 0.55)]
    });
  }
  // Two cross beams through the fin, and the glow caught behind them.
  for (const [y, len, tilt] of [
    [4.4, 5.6, 0.05],
    [8.8, 4.0, -0.08]
  ] as [number, number, number][]) {
    part(s.wear, G.box, RUST_L, centre, { p: [0, y, 0], s: [len, 0.3, 0.46], r: [0, 0.55, tilt] });
  }
  part(c.glow, G.box, VIOLET, centre, { p: [0, 3.4, 0.02], s: [0.12, 3.4, 0.6] });
  part(c.glow, G.box, MAGENTA, centre, { p: [0.19, 6.8, -0.1], s: [0.11, 3.0, 0.5] });
  part(c.glow, G.box, VIOLET, centre, { p: [-0.28, 1.8, 0.1], s: [0.1, 1.6, 0.44] });
  part(c.glow, G.box, MAGENTA, centre, { p: [0.06, 11.4, 0.2], s: [0.09, 3.6, 0.38] });
  part(c.glow, G.box, VIOLET, centre, { p: [-0.22, 8.0, -0.2], s: [0.08, 2.4, 0.34] });
  // Two thin energon seams along the fin's outer edges: at night the wreck
  // shows as a cut silhouette rather than a black wedge.
  part(c.glow, G.box, MAGENTA, centre, { p: [0.34, 9.0, 1.6], s: [0.06, 9.0, 0.06], r: [0.05, 0.35, 0.2] });
  part(c.glow, G.box, VIOLET, centre, { p: [-0.42, 7.0, -1.6], s: [0.06, 7.0, 0.06], r: [0.03, 0.35, -0.14] });
  emit(c, centre, VIOLET, 1.6, 14, [0, 4.0, 0.6]);
  footprint(c, centre, 1.5);

  // A broken mast leaning out of the wreck over the crater rim, so the
  // silhouette is not just one triangular fin.
  const mast = craterFrame(api, 0.6, 2.4, 0.1);
  part(s.wear, G.box, RUST_D, mast, { p: [0, 0, 0], s: [0.46, 12.0, 0.46], r: [0.2, 0.4, -0.16] });
  part(s.wear, G.box, RUST, mast, { p: [0.35, 7.2, 0.35], s: [0.5, 0.22, 0.22], r: [0, 0, 0.4] });
  part(s.wear, G.cone4, RUST_L, mast, { p: [-0.1, 11.2, -0.1], s: [0.55, 2.0, 0.55], r: [0.2, 0.4, -0.2] });
  part(c.glow, G.box, MAGENTA, mast, { p: [0, 6.4, 0.24], s: [0.1, 1.6, 0.1] });
  footprint(c, mast, 0.7);
  emit(c, mast, MAGENTA, 0.7, 9, [0, 9.0, 0]);
}

/** A wreckage throne on the rim, facing into the crater. */
function throne(c: Ctx, s: Sets, api: ZoneApi): void {
  const east = -1.9;
  const north = 9.6;
  const yaw = Math.atan2(CRATER_E - east, CRATER_N - north);
  const f = api.at(east, north, yaw, 0.02);
  // Three steps up to the seat, cut from plates.
  for (let i = 0; i < 3; i++) {
    part(s.plate, G.box, i % 2 ? WALL : WALL_D, f, { p: [0, 0.02, 0.35 + i * 0.55], s: [2.4 - i * 0.2, 0.16 + i * 0.14, 0.62], r: [0, rnd(c, -0.03, 0.03), 0] });
  }
  part(s.plate, G.box, WALL_D, f, { p: [0, 0.46, -0.35], s: [2.2, 0.3, 1.3] });
  // Seat, and the jagged back.
  part(s.wear, G.box, RUST_D, f, { p: [0, 0.74, -0.5], s: [1.6, 0.42, 1.05] });
  part(s.wear, G.box, RUST, f, { p: [0, 1.1, -0.95], s: [1.5, 1.9, 0.28], r: [-0.12, 0, 0] });
  for (const x of [-0.62, 0, 0.62]) {
    part(s.wear, G.cone4, x === 0 ? RUST_L : RUST_D, f, { p: [x, 2.4, -1.05], s: [0.44, rnd(c, 1.0, 1.9), 0.32], r: [rnd(c, -0.12, 0.02), 0, rnd(c, -0.08, 0.08)] });
  }
  // Armrests, spiked, with a gold line.
  for (const side of [-1, 1]) {
    part(s.wear, G.box, RUST_D, f, { p: [side * 0.86, 0.86, -0.4], s: [0.26, 0.5, 1.2] });
    part(s.wear, G.cone4, RUST, f, { p: [side * 0.86, 1.3, -0.9], s: [0.28, 0.7, 0.28], r: [0.1, 0, 0] });
    part(s.gold, G.box, GOLD, f, { p: [side * 0.86, 1.32, -0.4], s: [0.3, 0.06, 1.25] });
  }
  part(s.gold, G.box, GOLD, f, { p: [0, 2.28, -1.02], s: [1.3, 0.07, 0.3], r: [-0.12, 0, 0] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 0.98, -1.16], s: [1.0, 0.09, 0.1] });
  emit(c, f, MAGENTA, 1.2, 10, [0, 1.6, -0.4]);
  footprint(c, f, 1.3);
}

// ---------------------------------------------------------------- scaffolding and needles

/** Makeshift scaffolding: four rusted poles, braces and planks. */
function scaffold(c: Ctx, s: Sets, api: ZoneApi, east: number, north: number, yaw: number, h: number): void {
  const f = api.at(east, north, yaw);
  const w = 1.9;
  const d = 1.3;
  for (const [px, pz] of [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [-w / 2, d / 2],
    [w / 2, d / 2]
  ] as [number, number][]) {
    part(s.wear, G.box, RUST_D, f, { p: [px, -0.05, pz], s: [0.14, h, 0.14], r: [rnd(c, -0.03, 0.03), 0, rnd(c, -0.03, 0.03)] });
    footprint(c, f, 0.3, [px, pz]);
  }
  for (const y of [h * 0.36, h * 0.72, h - 0.1]) {
    part(s.wear, G.box, RUST, f, { p: [0, y, -d / 2], s: [w, 0.11, 0.11] });
    part(s.wear, G.box, RUST, f, { p: [0, y, d / 2], s: [w, 0.11, 0.11] });
    part(s.wear, G.box, RUST_D, f, { p: [w / 2, y, 0], s: [0.11, 0.11, d] });
    part(s.wear, G.box, RUST_D, f, { p: [-w / 2, y, 0], s: [0.11, 0.11, d] });
  }
  // One diagonal brace and two planks, one of them torn loose and hanging.
  part(s.wear, G.box, RUST_L, f, { p: [0, h * 0.4, -d / 2], s: [0.1, h * 0.8, 0.1], r: [0, 0, 0.72] });
  part(s.wear, G.box, RUST, f, { p: [-0.2, h * 0.72, 0], s: [w * 0.9, 0.08, 0.55] });
  part(s.wear, G.box, RUST_D, f, { p: [0.35, h * 0.52, d / 2 + 0.2], s: [w * 0.6, 0.07, 0.45], r: [0.5, 0.2, 0.3] });
  // Vines dropping from the top rails.
  for (let i = 0; i < 3; i++) {
    const vx = rnd(c, -w / 2, w / 2);
    const len = rnd(c, 0.7, h * 0.5);
    part(s.moss, G.box, i % 2 ? MOSS_D : MOSS, f, { p: [vx, h - 0.15 - len, rnd(c, -d / 2, d / 2)], s: [0.07, len, 0.07], r: [0, 0, rnd(c, -0.12, 0.12)] });
  }
  emit(c, f, VIOLET, 0.5, 6, [0, h * 0.5, 0]);
}

/** A needle tower: a thin cluster of shards with a violet seam. */
function needle(c: Ctx, s: Sets, api: ZoneApi, east: number, north: number, h: number): void {
  const f = api.at(east, north, rnd(c, 0, Math.PI * 2));
  part(s.wear, G.cone4, WALL_D, f, { p: [0, -0.1, 0], s: [1.4, 1.0, 1.4], r: [0, Math.PI / 4, 0] });
  part(s.wear, G.cone4, RUST_D, f, { p: [0, 0.5, 0], s: [0.42, h, 0.42], r: [rnd(c, -0.03, 0.03), 0, rnd(c, -0.03, 0.03)] });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.8;
    part(s.wear, G.cone4, i % 2 ? RUST : WALL_D, f, {
      p: [Math.sin(a) * 0.34, 0.35, Math.cos(a) * 0.34],
      s: [0.26, h * rnd(c, 0.45, 0.75), 0.26],
      r: [Math.sin(a) * 0.16, 0, -Math.cos(a) * 0.16]
    });
  }
  part(c.glow, G.box, VIOLET, f, { p: [0, 0.6, 0], s: [0.08, h * 0.7, 0.12] });
  part(c.glow, G.sphere, MAGENTA, f, { p: [0, h + 0.2, 0], s: 0.18 });
  emit(c, f, MAGENTA, 0.5, 7, [0, h, 0]);
  footprint(c, f, 0.75);
}

// ---------------------------------------------------------------- growth

/** A moss patch: two or three overlapping angular plates, never one flat tile. */
function mossPatch(c: Ctx, s: Sets, f: THREE.Matrix4, scale: number): void {
  const plates = 2 + Math.floor(c.rng() * 2);
  for (let i = 0; i < plates; i++) {
    part(s.moss, G.box, pick(c, [MOSS, MOSS_D, MOSS_L, MOSS_D]), f, {
      p: [rnd(c, -0.3, 0.3) * scale, 0.02 + i * 0.02, rnd(c, -0.3, 0.3) * scale],
      s: [scale * rnd(c, 0.45, 0.8), 0.06, scale * rnd(c, 0.35, 0.7)],
      r: [rnd(c, -0.14, 0.14), rnd(c, 0, 3), rnd(c, -0.14, 0.14)]
    });
  }
}

/** A mushroom cluster: three to five stems under rust-red caps. */
function mushroomCluster(c: Ctx, s: Sets, f: THREE.Matrix4, scale: number): void {
  const n = 3 + Math.floor(c.rng() * 3);
  for (let i = 0; i < n; i++) {
    const h = scale * rnd(c, 0.35, 0.9);
    const x = rnd(c, -0.45, 0.45) * scale;
    const z = rnd(c, -0.45, 0.45) * scale;
    part(s.wear, G.cyl6, STEM, f, { p: [x, 0, z], s: [0.07 * scale, h, 0.07 * scale], r: [rnd(c, -0.14, 0.14), 0, rnd(c, -0.14, 0.14)] });
    part(s.wear, G.cone6, pick(c, [CAP, RUST_L, RUST]), f, {
      p: [x, h * 0.85, z],
      s: [0.4 * scale, 0.24 * scale, 0.4 * scale],
      r: [rnd(c, -0.14, 0.14), 0, rnd(c, -0.14, 0.14)]
    });
  }
  footprint(c, f, 0.35 * scale);
}

/**
 * Growth around the crater rim and on the wrecks: moss on the plates, vines
 * hanging off the spine and the scaffolds, mushrooms where the metal is
 * broken. Densest inside the rim and at the foot of the spine.
 */
function growth(c: Ctx, s: Sets, api: ZoneApi): void {
  // Moss and mushrooms around the rim, on the flat ground just outside it so
  // every patch sits on the terrain. The angles randomise, so growth also
  // reaches the two approaches without blocking them (patches carry no
  // collider).
  for (let i = 0; i < 20; i++) {
    const a = rnd(c, 0, Math.PI * 2);
    const r = rnd(c, CRATER_R + 0.1, CRATER_R + 1.6);
    const f = craterFrame(api, a, r, 0.08);
    mossPatch(c, s, f, rnd(c, 1.2, 2.6));
    if (i % 2 === 0) mushroomCluster(c, s, f, rnd(c, 1.2, 2.0));
  }
  // Growth climbing the spine: moss plates pressed to the fin and vines.
  const centre = api.at(CRATER_E, CRATER_N, 0.35, 0.1);
  for (let i = 0; i < 14; i++) {
    const y = rnd(c, 0.3, 5.0);
    const side = i % 2 === 0 ? 1 : -1;
    part(s.moss, G.box, pick(c, [MOSS, MOSS_D, MOSS_L]), centre, {
      p: [side * rnd(c, 0.35, 0.65), y, rnd(c, -1.4, 1.4)],
      s: [0.12, rnd(c, 0.7, 1.9), rnd(c, 0.45, 1.2)],
      r: [rnd(c, -0.2, 0.2), rnd(c, 0, 3), rnd(c, -0.2, 0.2)]
    });
  }
  for (let i = 0; i < 10; i++) {
    const len = rnd(c, 1.2, 3.6);
    part(s.moss, G.box, i % 2 ? MOSS_D : MOSS, centre, {
      p: [rnd(c, -0.8, 0.8), rnd(c, 3.4, 7.0) - len, rnd(c, -1.5, 1.5)],
      s: [0.08, len, 0.08],
      r: [rnd(c, -0.1, 0.1), 0, rnd(c, -0.1, 0.1)]
    });
  }
  // Mushroom rings at the foot of the shards, the strongest growth.
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.5;
    mushroomCluster(c, s, craterFrame(api, a, rnd(c, 1.2, 2.4), 0.08), rnd(c, 1.4, 2.2));
  }
  // Moss creeping over the wrecked plates outside the rim.
  for (let i = 0; i < 12; i++) {
    const a = rnd(c, 0, Math.PI * 2);
    mossPatch(c, s, craterFrame(api, a, rnd(c, CRATER_R + 0.6, CRATER_R + 2.4), 0.08), rnd(c, 1.0, 2.0));
  }
}

// ---------------------------------------------------------------- fences and mines

/** Laser bars across a gate approach. They flicker and do not block. */
function laserFence(api: ZoneApi, theta: number, radius: number): void {
  const f = api.at(radius * Math.sin(theta), radius * Math.cos(theta), theta, 0);
  const group = new THREE.Group();
  f.decompose(group.position, group.quaternion, group.scale);
  const mat = new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.8, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false });
  const postMat = new THREE.MeshStandardMaterial({ color: WALL_D, flatShading: true, roughness: 0.6, metalness: 0.5 });
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.6, 0.3), postMat);
    post.position.set(side * 1.9, 1.3, 0);
    group.add(post);
  }
  for (let i = 0; i < 4; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.09, 0.09), mat);
    bar.position.set(0, 0.5 + i * 0.62, 0);
    group.add(bar);
  }
  const phase = theta * 3.1;
  api.addDynamic(group, (_dt, t) => {
    mat.opacity = 0.3 + 0.55 * (0.5 + 0.5 * Math.sin(t * 9 + phase)) * (0.65 + 0.35 * Math.sin(t * 23 + phase * 2));
  });
}

/** Mines: squat discs with a red light that pulses. */
function mines(api: ZoneApi, spots: [number, number][]): void {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);
  const glowMat = new THREE.MeshBasicMaterial({ color: RED, toneMapped: false });
  const frames = spots.map(([e, n]) => api.at(e, n, 0));
  frames.forEach((f, i) => {
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5), glowMat);
    lamp.position.set(0, 0.85, 0).applyMatrix4(f);
    lamp.userData.phase = i * 1.7;
    group.add(lamp);
  });
  api.addDynamic(group, (_dt, t) => {
    for (const child of group.children) {
      const phase = (child.userData.phase as number) ?? 0;
      child.scale.setScalar(Math.sin(t * 2.6 + phase) > 0 ? 1 : 0.15);
    }
  });
}

function mineBody(c: Ctx, s: Sets, f: THREE.Matrix4): void {
  part(s.wear, G.cyl8, RUST_D, f, { p: [0, -0.1, 0], s: [1.5, 0.5, 1.5] });
  part(s.wear, G.box, RUST, f, { p: [0, 0.4, 0], s: [0.5, 0.3, 0.5] });
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + 0.4;
    part(s.wear, G.box, RUST_D, f, { p: [Math.sin(a) * 0.55, 0.05, Math.cos(a) * 0.55], s: [0.5, 0.14, 0.18], r: [0, -a, 0] });
  }
  footprint(c, f, 0.85);
}

// ---------------------------------------------------------------- scatter

function spike(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.8, 1.8);
  footprint(c, f, 0.35);
  part(c.solid, G.cone4, pick(c, [RUST_D, WALL_B, RUST]), f, { s: [0.6, h, 0.6], r: [0, c.rng() * 3, 0] });
}

function rubble(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.9, 1.9);
  footprint(c, f, s * 0.55);
  part(c.solid, G.box, pick(c, [WALL, WALL_D, RUST_D]), f, { p: [0, 0.1, 0], s: [s, rnd(c, 0.5, 1.1), s * 0.8], r: [rnd(c, -0.25, 0.25), c.rng() * 3, rnd(c, -0.25, 0.25)] });
  if (c.rng() < 0.5) {
    part(c.solid, G.box, RUST, f, { p: [s * 0.5, 0.6, 0], s: [0.6, 0.5, 0.7], r: [0, c.rng() * 3, 0.3] });
  }
}

function crystal(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.9, 2.2);
  footprint(c, f, 0.4);
  const tint = pick(c, [0x4a3d63, 0x5b3d7a, 0x3d3350]);
  part(c.solid, G.cone4, tint, f, { p: [0, 0, 0], s: [0.5, h, 0.5], r: [rnd(c, -0.3, 0.3), c.rng() * 3, rnd(c, -0.3, 0.3)] });
  part(c.glow, G.box, VIOLET, f, { p: [0, 0.15, 0], s: [0.3, h * 0.35, 0.3], r: [0, c.rng() * 3, 0] });
}

// ---------------------------------------------------------------- zone

function buildFortress(c: Ctx, api: ZoneApi): void {
  const sets = newSets();

  // Wall ring: three panels between each pair of gates.
  for (let q = 0; q < 4; q++) {
    const a = GATE_ANGLES[q] + GATE_HALF;
    const b = GATE_ANGLES[q + 1] - GATE_HALF;
    const span = b - a;
    for (let j = 0; j < 3; j++) {
      wallPanel(c, sets, api, a + (span * (j + 0.5)) / 3, span / 6, 3.4 + (j === 1 ? 0.5 : 0));
    }
    gate(api, c, sets, GATE_ANGLES[q]);
  }

  // Corner towers, each with a scanning head.
  for (let k = 0; k < 4; k++) {
    const theta = (GATE_ANGLES[k] + GATE_ANGLES[k + 1]) / 2;
    const f = tower(c, sets, api, theta);
    turret(api, f, k * 1.9);
  }

  // Interior: the crash site.
  crater(c, sets, api);
  spine(c, sets, api);
  throne(c, sets, api);
  scaffold(c, sets, api, -8.7, 4.5, 0.5, 3.8);
  scaffold(c, sets, api, -5.9, 9.4, 2.2, 3.2);
  needle(c, sets, api, -8.6, 6.4, 5.4);
  needle(c, sets, api, 1.8, 8.4, 4.4);
  needle(c, sets, api, 5.4, 6.6, 5.0);
  needle(c, sets, api, -1.2, 11.0, 3.6);
  growth(c, sets, api);

  // Laser fences inside three of the gates.
  laserFence(api, 0, 8.6);
  laserFence(api, Math.PI / 2, 8.6);
  laserFence(api, Math.PI, 8.0);

  // Mines in the courtyard, outside the crater.
  const spots: [number, number][] = [
    [6.5, 5.5], [-6.0, -1.0], [7.0, -3.0], [2.2, -7.0], [-2.0, -7.5], [3.0, 3.0]
  ];
  for (const [e, n] of spots) mineBody(c, sets, api.at(e, n, 0, -0.1));
  mines(api, spots);
  emit(c, api.at(6.5, 5.5, 0), RED, 0.5, 6, [0, 0.9, 0]);

  // Two torches on the inner face of the wall keep the courtyard readable.
  for (const [e, n, yaw] of [
    [9.1, 5.3, -0.6],
    [-9.1, -5.3, 2.5]
  ] as [number, number, number][]) {
    const f = api.at(e, n, yaw, -0.3);
    part(sets.wear, G.box, RUST_D, f, { p: [0, 0, 0], s: [0.7, 0.4, 0.7] });
    part(sets.wear, G.box, RUST, f, { p: [0, 0.4, 0], s: [0.3, 2.6, 0.3] });
    part(c.glow, G.sphere, MAGENTA, f, { p: [0, 3.1, 0], s: 0.45 });
    emit(c, f, MAGENTA, 1.3, 11, [0, 3.2, 0]);
    footprint(c, f, 0.7);
  }

  // Six merged meshes for the whole fortress, one per material. The plate and
  // the rust carry a small emissive floor so the wall ring keeps its shape in
  // the zone's near-black interior.
  const plateMat = circuitMetal(0xffffff, { strength: 0.05, color: 0xb04cff, scale: 0.6 });
  plateMat.emissive = new THREE.Color(0x0d0718);
  plateMat.emissiveIntensity = 0.8;
  plateMat.roughness = 0.7;
  plateMat.envMapIntensity = 0.25;
  plateMat.metalness = 0.32;
  const wearMat = rustMaterial();
  wearMat.emissive = new THREE.Color(0x240e05);
  wearMat.emissiveIntensity = 0.8;
  const goldMat = brushedGold();
  goldMat.emissive = new THREE.Color(0x2b1e06);
  goldMat.emissiveIntensity = 0.6;
  attach(api, sets.plate, plateMat, 'fortress-plate');
  attach(api, sets.wear, wearMat, 'fortress-wear');
  attach(api, sets.gold, goldMat, 'fortress-gold');
  attach(api, sets.glass, energonGlass(VIOLET), 'fortress-glass', false);
  attach(api, sets.flow, energonFlow(VIOLET), 'fortress-flow', false);
  attach(api, sets.moss, mossMaterial(), 'fortress-moss');

  api.exclude(0, 0, 14.5);
  api.exclude(0, 12, 4);
  api.exclude(0, -12, 4);
  api.exclude(12, 0, 4);
  api.exclude(-12, 0, 4);
}

export const fortressZone: ZoneModule = {
  id: 'fortress',
  build(api) {
    buildFortress(api.ctx, api);
  },
  scatter: [
    { p: 0.05, build: spike },
    { p: 0.03, build: rubble },
    { p: 0.025, build: crystal }
  ]
};
