// Ark Dock zone (方舟号): a giant warship half buried in the ground.
// Owned by the "ark and fortress" session.
//
// Restyled to the production-design reference: the hull is dark gunmetal with a
// layered rust wear coat, brushed gold on the raised trim, and energon teal in
// the hatches, the ports and the spine that runs the length of the deck. The
// ship's silhouette is unchanged: six hull slices on their own ground frames, a
// tilted deck, a bridge tower, a dock crane and pipe runs into the soil. Around
// the hull the ground is littered with torn plating and broken slabs where the
// ship settled in, and rigging lights stand along both flanks.

import * as THREE from 'three';
import { G, PropBatch, emit, footprint, part, pick, rnd, type Ctx } from '../kit';
import { brushedGold, circuitMetal, energonFlow, energonGlass, rustedMetal } from '../look';
import type { ZoneApi, ZoneModule } from './types';

// ---------------------------------------------------------------- palette
/** Hull gunmetal: three steps of the same cold plate, so faces separate. */
const HULL = 0x47515f;
const HULL_D = 0x2c343f;
const HULL_L = 0x626e80;
/** Wear coat: rust at three stages, and the soot in a torn-out plate. */
const RUST = 0x8c4a28;
const RUST_D = 0x5e3119;
const RUST_L = 0xb0662f;
const SOOT = 0x27231f;
/** Energon teal: the light in the ship, never a surface colour. */
const TEAL = 0x35e8ff;
const TEAL_D = 0x1a8fa2;
/** Rigging lamps are warm, so the teal reads as the ship's own light. */
const WARM = 0xffcf92;
/** Passed to the gold batch; the material's own colour is what is drawn. */
const GOLD = 0xc9a227;

/** Hull centreline sits this far north of the zone centre, clear of the beacon. */
const NORTH = 10;
const YAW = Math.PI / 2;

// ---------------------------------------------------------------- batches
// The zone's hand-placed parts go into their own merged meshes so they can use
// the real material library: one draw call per material, nothing per part.

type Sets = {
  /** Dark gunmetal plate, with the faint circuit etch. */
  hull: PropBatch;
  /** Rusted layered metal: the wear coat and the debris. */
  wear: PropBatch;
  /** Brushed gold: raised trim only. */
  gold: PropBatch;
  /** Energon glass: hatches, ports, spine panels. */
  glass: PropBatch;
  /** Energon flow: the spill pools under the open hatches. */
  flow: PropBatch;
};

function newSets(): Sets {
  return {
    hull: new PropBatch(),
    wear: new PropBatch(),
    gold: new PropBatch(),
    glass: new PropBatch(),
    flow: new PropBatch()
  };
}

/** The rusted-metal factory, opened up to per-part vertex colours. */
function wearMaterial(): THREE.MeshStandardMaterial {
  const m = rustedMetal(0xffffff);
  m.vertexColors = true;
  m.flatShading = true;
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

type Section = {
  e: number;
  len: number;
  w: number;
  h: number;
  lift: number;
  roll: number;
  pitch: number;
  /** How much of this slice has weathered through to rust, 0..1. */
  rust: number;
};

/**
 * The hull is built as six slices, each on its own ground frame. A single
 * rigid 30-unit frame would leave the ends floating: the ground drops about
 * 2.7 units over that span. Each slice carries a little less roll than the one
 * behind it, so the ship reads as tilted and settling into the soil at the
 * stern. The stern slices are the most rusted: they have been in the ground
 * longest.
 */
const SECTIONS: Section[] = [
  { e: -13.2, len: 5.8, w: 6.4, h: 4.4, lift: -1.1, roll: 0.2, pitch: 0.03, rust: 0.95 },
  { e: -8.4, len: 5.8, w: 8.2, h: 5.4, lift: -0.5, roll: 0.16, pitch: 0.02, rust: 0.8 },
  { e: -3.6, len: 5.8, w: 9.0, h: 6.0, lift: -0.05, roll: 0.12, pitch: 0.01, rust: 0.55 },
  { e: 1.2, len: 5.8, w: 8.9, h: 6.0, lift: 0.05, roll: 0.1, pitch: -0.005, rust: 0.4 },
  { e: 6.0, len: 5.8, w: 8.0, h: 5.4, lift: 0.2, roll: 0.07, pitch: -0.01, rust: 0.28 },
  { e: 10.8, len: 5.8, w: 6.6, h: 4.6, lift: 0.4, roll: 0.04, pitch: -0.02, rust: 0.18 }
];

function sectionFrame(api: ZoneApi, s: Section): THREE.Matrix4 {
  const f = api.at(s.e, NORTH, YAW, s.lift);
  return f.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(s.pitch, 0, s.roll)));
}

/** A rust streak running down a flank: thin, slightly proud, varied length. */
function rustStreak(c: Ctx, s: Sets, f: THREE.Matrix4, x: number, y: number, z: number, len: number): void {
  part(s.wear, G.box, pick(c, [RUST, RUST_D, RUST_L]), f, {
    p: [x, y, z],
    s: [0.1, len, rnd(c, 0.35, 0.9)],
    r: [0, 0, rnd(c, -0.04, 0.04)]
  });
}

function hullSection(c: Ctx, s: Sets, f: THREE.Matrix4, sec: Section): void {
  const belt = sec.h * 0.6;
  // Belt at the waterline, slightly wider than the upper hull above it.
  part(s.hull, G.box, HULL_D, f, { p: [0, -1.9, 0], s: [sec.w, belt + 1.9, sec.len + 0.2] });
  // Main hull: gunmetal plate, with the etch picking out the panel grid.
  part(s.hull, G.box, HULL, f, { p: [0, belt, 0], s: [sec.w * 0.93, sec.h - belt, sec.len] });
  // The wear line: a rusted band where the ground has chewed the flank.
  part(s.wear, G.box, sec.rust > 0.6 ? RUST_D : RUST, f, { p: [0, belt + 0.1, 0], s: [sec.w * 0.95, 0.55, sec.len * 0.985] });
  // Deck plate, and the spine conduit down its centre. The deck is the darkest
  // plate on the hull: it is the one face the key light hits square on.
  part(s.hull, G.box, 0x272c35, f, { p: [0, sec.h, 0], s: [sec.w * 0.62, 0.3, sec.len * 0.98] });
  // Bulwark along both deck edges: a tall armoured freeboard, so the hull
  // stands above the debris field, with a gold cap and an energon strip along
  // its outer face.
  for (const side of [-1, 1]) {
    part(s.hull, G.box, HULL, f, { p: [side * (sec.w * 0.44), sec.h + 0.3, 0], s: [0.3, 2.2, sec.len + 0.04] });
    part(s.gold, G.box, GOLD, f, { p: [side * (sec.w * 0.44), sec.h + 2.52, 0], s: [0.38, 0.1, sec.len + 0.04] });
    part(c.glow, G.box, TEAL_D, f, { p: [side * (sec.w * 0.44 + 0.17), sec.h + 1.5, 0], s: [0.06, 0.14, sec.len * 0.82] });
  }
  part(s.hull, G.box, HULL_D, f, { p: [0, sec.h + 0.3, 0], s: [0.9, 0.16, sec.len + 1.1] });
  // The energon spine: one unbroken teal line the length of the ship.
  part(c.glow, G.box, TEAL, f, { p: [0, sec.h + 0.44, 0], s: [0.2, 0.07, sec.len * 0.86] });
  // Gold trim, one raised line at the belt and one at each deck edge.
  part(s.gold, G.box, GOLD, f, { p: [0, belt + 0.42, 0], s: [sec.w * 0.955, 0.1, sec.len * 0.99] });

  // Chamfered shoulders, so the cross-section is not a plain box. Kept dark:
  // this face tilts toward the key light and goes pale on any lighter metal.
  for (const side of [-1, 1]) {
    part(s.hull, G.box, 0x2e3641, f, { p: [side * (sec.w * 0.43), sec.h - 0.7, 0], s: [1.0, 1.1, sec.len], r: [0, 0, -side * 0.68] });
  }

  for (const side of [-1, 1]) {
    // Layered wear, standing proud of the flank: rust at the belt, then a
    // gunmetal strake above it, then the gold rail at the deck edge.
    part(s.wear, G.box, RUST_D, f, { p: [side * (sec.w / 2 - 0.1), belt - 1.0, 0], s: [0.52, 0.72, sec.len * 0.96] });
    part(s.hull, G.box, HULL_L, f, { p: [side * (sec.w * 0.465 - 0.06), belt + 0.5, 0], s: [0.44, 0.42, sec.len * 0.92] });
    part(s.hull, G.box, HULL_D, f, { p: [side * (sec.w * 0.465 - 0.06), belt + 1.5, 0], s: [0.36, 0.26, sec.len * 0.86] });
    // Rust streaks running down from the wear line.
    const streaks = Math.round(1 + sec.rust * 3);
    for (let k = 0; k < streaks; k++) {
      rustStreak(c, s, f, side * (sec.w * 0.468), belt + 0.4, rnd(c, -sec.len * 0.45, sec.len * 0.45), rnd(c, 0.5, 1.5));
    }
    // Vertical ribs stand proud of the flank, so the hull has shadow lines
    // instead of one flat face at distance.
    for (let k = -1; k <= 1; k++) {
      part(s.hull, G.box, k === 0 ? HULL_L : HULL, f, { p: [side * (sec.w * 0.468), belt - 0.4, k * 1.55], s: [0.16, sec.h - belt - 0.2, 0.42] });
    }
    // A torn-out plate: soot behind, a bent plate standing off the hull.
    if (k0(sec)) {
      part(s.wear, G.box, SOOT, f, { p: [side * (sec.w * 0.47), belt + 1.2, sec.len * 0.22], s: [0.12, 0.9, 1.2] });
      part(s.wear, G.box, RUST, f, {
        p: [side * (sec.w * 0.5), belt + 1.7, sec.len * 0.22],
        s: [0.1, 1.5, 1.3],
        r: [0, 0, side * 0.5]
      });
    }
    // Ports: small energon-lit rectangles along the upper hull.
    for (let k = -1; k <= 1; k++) {
      part(c.glow, G.box, TEAL, f, { p: [side * (sec.w * 0.465 + 0.02), belt + 1.05, k * 1.45], s: [0.1, 0.26, 0.44] });
    }
    // A round hatch low on the belt, its opening filled with energon glass.
    part(s.wear, G.cyl8, RUST_D, f, { p: [side * (sec.w / 2), belt - 2.0, 0], s: [1.6, 0.22, 1.6], r: [0, 0, (-side * Math.PI) / 2] });
    part(s.glass, G.cyl8, TEAL, f, { p: [side * (sec.w / 2 + 0.16), belt - 2.0, 0], s: [1.15, 0.16, 1.15], r: [0, 0, (-side * Math.PI) / 2] });
    // Light spilling from the hatch onto the ground below it.
    part(c.glow, G.box, TEAL_D, f, { p: [side * (sec.w / 2 + 0.7), -1.15, 0], s: [1.5, 0.04, 1.0], r: [0, 0, side * 0.18] });
    emit(c, f, TEAL, 0.5, 7, [side * (sec.w / 2 + 0.4), belt - 1.9, 0]);
  }

  // Rails and spars run past the end of each slice, so the seams between
  // slices read as one continuous line instead of six separate blocks.
  for (const side of [-1, 1]) {
    part(s.hull, G.box, HULL_L, f, { p: [side * (sec.w * 0.38), sec.h + 0.55, 0], s: [0.14, 0.14, sec.len + 1.2] });
    part(s.gold, G.box, GOLD, f, { p: [side * (sec.w * 0.38), sec.h + 0.68, 0], s: [0.1, 0.07, sec.len + 1.2] });
    for (let k = -1; k <= 1; k++) {
      part(s.hull, G.box, HULL_D, f, { p: [side * (sec.w * 0.38), sec.h + 0.3, k * 1.7], s: [0.12, 0.55, 0.12] });
    }
    part(s.hull, G.box, HULL_D, f, { p: [side * (sec.w * 0.465), belt + 2.5, 0], s: [0.26, 0.26, sec.len + 1.2] });
  }
}

/** Deterministic per-slice switch; keeps the tear pattern out of the rng stream. */
function k0(sec: Section): boolean {
  return Math.abs(sec.e) % 3 < 1;
}

/** Bow: a four-sided wedge tapering the hull to a point, gold on the leading edge. */
function bow(c: Ctx, s: Sets, f: THREE.Matrix4, sec: Section): void {
  const h = (sec.h - sec.h * 0.6) + 1.9;
  part(s.hull, G.cone4, HULL, f, { p: [0, sec.h * 0.6 - 1.9, sec.len / 2], s: [sec.w, h, sec.len * 0.9], r: [Math.PI / 2, Math.PI / 4, 0] });
  part(s.wear, G.cone4, RUST, f, { p: [0, sec.h * 0.6 - 1.75, sec.len / 2 + 0.06], s: [sec.w * 0.86, h * 0.9, sec.len * 0.86], r: [Math.PI / 2, Math.PI / 4, 0] });
  part(s.gold, G.box, GOLD, f, { p: [0, sec.h * 0.5, sec.len * 0.94], s: [0.16, 0.5, 1.3], r: [0.2, 0, 0] });
  part(c.glow, G.box, TEAL, f, { p: [0, sec.h * 0.62, sec.len * 0.96], s: [0.1, 0.16, 0.5] });
}

/** Stern: engine block, three nozzles and the energon still burning in them. */
function stern(c: Ctx, s: Sets, f: THREE.Matrix4, sec: Section): void {
  const aft = -sec.len / 2 - 0.4;
  part(s.wear, G.box, RUST_D, f, { p: [0, 0.4, aft - 0.5], s: [sec.w * 0.72, 3.2, 1.2] });
  for (const x of [-2.0, 0, 2.0]) {
    part(s.wear, G.cyl8, RUST, f, { p: [x, 1.7, aft - 0.9], s: [1.6, 2.2, 1.6], r: [-Math.PI / 2, 0, 0] });
    part(s.hull, G.cyl8, HULL_D, f, { p: [x, 1.7, aft - 1.0], s: [1.85, 0.3, 1.85], r: [-Math.PI / 2, 0, 0] });
    part(s.glass, G.cyl8, TEAL, f, { p: [x, 1.7, aft - 2.6], s: [1.15, 0.16, 1.15], r: [-Math.PI / 2, 0, 0] });
    part(c.glow, G.cyl8, TEAL, f, { p: [x, 1.7, aft - 3.0], s: [1.0, 0.1, 1.0], r: [-Math.PI / 2, 0, 0] });
  }
  emit(c, f, TEAL, 1.6, 12, [0, 1.7, aft - 3.2]);
}

/** The bridge tower: stepped gunmetal blocks, a lit window band and a gold crown. */
function bridge(c: Ctx, s: Sets, f: THREE.Matrix4, sec: Section): void {
  const deck = sec.h + 0.3;
  part(s.hull, G.box, HULL, f, { p: [0, deck, -1.0], s: [5.4, 1.4, 3.6] });
  part(s.hull, G.box, HULL_L, f, { p: [0, deck + 1.4, -1.2], s: [4.0, 1.0, 2.8] });
  part(s.wear, G.box, RUST, f, { p: [0, deck + 2.4, -1.4], s: [2.9, 0.2, 2.3] });
  part(s.gold, G.box, GOLD, f, { p: [0, deck + 2.62, -1.4], s: [2.6, 0.1, 2.0] });
  // Bridge windows facing the bow: cold energon through glass.
  for (let k = -1; k <= 1; k++) {
    part(s.glass, G.box, TEAL, f, { p: [k * 0.86, deck + 0.62, -1.0 + 1.78], s: [0.66, 0.5, 0.1] });
    part(c.glow, G.box, TEAL, f, { p: [k * 0.86, deck + 1.95, -1.2 + 1.38], s: [0.5, 0.26, 0.1] });
  }
  // Signal mast above the bridge, and the funnel stack behind it, so the ship
  // has a silhouette above the deck instead of one long low ridge.
  part(s.hull, G.box, HULL_D, f, { p: [1.1, deck + 2.7, -1.0], s: [0.12, 1.9, 0.12] });
  part(s.gold, G.box, GOLD, f, { p: [1.1, deck + 4.6, -1.0], s: [0.3, 0.16, 0.3] });
  part(c.glow, G.sphere, TEAL, f, { p: [1.1, deck + 4.78, -1.0], s: 0.26 });
  part(s.wear, G.box, RUST_D, f, { p: [-1.35, deck + 0.4, -2.3], s: [1.1, 3.6, 1.3] });
  part(s.hull, G.box, HULL_D, f, { p: [-1.35, deck + 3.9, -2.3], s: [1.35, 0.5, 1.55] });
  part(s.gold, G.box, GOLD, f, { p: [-1.35, deck + 3.55, -2.3], s: [1.18, 0.12, 1.38] });
  part(s.hull, G.box, HULL_D, f, { p: [0, deck + 1.35, 0.9], s: [4.6, 0.12, 0.12] });
  emit(c, f, TEAL, 0.6, 8, [0, deck + 1.0, -0.4]);
}

/** A slanted plate from the deck edge down to the ground, facing the beacon. */
function ramp(c: Ctx, s: Sets, api: ZoneApi): void {
  const f = api.at(-2.0, NORTH - 4.0, 0, 2.4);
  const slope = -0.72;
  part(s.hull, G.box, HULL, f, { p: [0, 0, 0], s: [3.2, 0.35, 7.4], r: [slope, 0, 0] });
  for (let k = 0; k < 6; k++) {
    const z = -3.1 + k * 1.24;
    const y = z * Math.tan(0.72);
    part(s.wear, G.box, RUST_D, f, { p: [0, y + 0.12, z], s: [3.3, 0.14, 0.26], r: [slope, 0, 0] });
  }
  for (const side of [-1, 1]) {
    part(s.gold, G.box, GOLD, f, { p: [side * 1.62, 0.28, 0], s: [0.16, 0.5, 7.4], r: [slope, 0, 0] });
  }
  emit(c, f, TEAL, 0.4, 6, [0, 0.6, 1.0]);
}

/** A dock crane. Returns the jib tip so the caller can hang a hook from it. */
function crane(c: Ctx, s: Sets, api: ZoneApi, east: number, north: number, yaw: number): { f: THREE.Matrix4; tip: THREE.Vector3 } {
  const f = api.at(east, north, yaw);
  part(s.wear, G.box, RUST_D, f, { p: [0, -0.3, 0], s: [2.6, 0.9, 2.6] });
  part(s.hull, G.box, HULL, f, { p: [0, 0.6, 0], s: [1.7, 0.5, 1.7] });
  part(s.wear, G.box, RUST, f, { p: [0, 1.1, 0], s: [0.85, 7.4, 0.85] });
  part(s.hull, G.box, HULL_L, f, { p: [0.95, 1.1, 0], s: [0.28, 6.0, 0.28], r: [0, 0, -0.3] });
  part(s.wear, G.box, RUST_L, f, { p: [-0.95, 1.1, 0], s: [0.28, 6.0, 0.28], r: [0, 0, 0.3] });
  // Cabin and counterweight.
  part(s.hull, G.box, HULL, f, { p: [0, 6.4, -0.9], s: [1.3, 1.2, 1.4] });
  part(s.wear, G.box, RUST_D, f, { p: [0, 6.6, -1.7], s: [1.1, 0.9, 0.7] });
  part(s.glass, G.box, TEAL, f, { p: [0, 7.0, -0.22], s: [0.9, 0.35, 0.1] });
  // Jib reaching out over the hull, with a gold tip.
  part(s.hull, G.box, HULL_D, f, { p: [0, 8.1, 2.4], s: [0.7, 0.7, 6.6] });
  part(s.wear, G.box, RUST, f, { p: [0, 8.9, 1.2], s: [0.16, 1.2, 0.16], r: [0.55, 0, 0] });
  part(s.hull, G.box, HULL_L, f, { p: [0, 7.3, 0], s: [0.9, 0.9, 0.9], r: [0.6, 0, 0] });
  part(s.gold, G.box, GOLD, f, { p: [0, 8.3, 5.6], s: [0.4, 0.3, 0.8] });
  footprint(c, f, 1.9);
  const tip = new THREE.Vector3(0, 7.7, 5.4).applyMatrix4(f);
  return { f, tip };
}

function hook(api: ZoneApi, f: THREE.Matrix4, tip: THREE.Vector3): void {
  const group = new THREE.Group();
  group.position.copy(tip);
  const base = new THREE.Quaternion().setFromRotationMatrix(f);
  group.quaternion.copy(base);
  const metal = new THREE.MeshStandardMaterial({ color: 0x6b3a20, flatShading: true, roughness: 0.65, metalness: 0.75, envMapIntensity: 1 });
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
}

/** A small warm lamp on a mast that blinks. */
function warningLamp(api: ZoneApi, f: THREE.Matrix4, at: THREE.Vector3): void {
  const mat = new THREE.MeshBasicMaterial({ color: WARM, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 6, 5), mat);
  mesh.position.copy(at);
  const q = new THREE.Quaternion().setFromRotationMatrix(f);
  mesh.quaternion.copy(q);
  api.addDynamic(mesh, (_dt, t) => {
    mesh.visible = Math.sin(t * 3.4 + 0.4) > -0.25;
  });
}

/** Big rusted pipes running out of the ground and into the hull. */
function pipeCluster(c: Ctx, s: Sets, api: ZoneApi, east: number, north: number, yaw: number, count: number): void {
  const f = api.at(east, north, yaw);
  const tints = [RUST, RUST_D, RUST_L];
  for (let i = 0; i < count; i++) {
    const x = (i - (count - 1) / 2) * 0.95;
    const r = rnd(c, 0.3, 0.55);
    part(s.wear, G.cyl8, tints[i % 3], f, { p: [x, r + 0.1, -1.2], s: [r, 5.6, r], r: [Math.PI / 2 - 0.16, 0, 0] });
    part(s.hull, G.cyl8, HULL_D, f, { p: [x, r + 0.1, 0.4], s: [r * 1.3, 0.35, r * 1.3], r: [Math.PI / 2 - 0.16, 0, 0] });
    part(s.glass, G.cyl8, TEAL, f, { p: [x, r + 0.1, 0.62], s: [r * 1.2, 0.09, r * 1.2], r: [Math.PI / 2 - 0.16, 0, 0] });
  }
  part(s.wear, G.box, SOOT, f, { p: [0, 0.2, -2.6], s: [count * 1.05, 0.5, 1.1] });
  // The pipes lie along the ground for about seven units, so one disc at the
  // base would let the player walk through them.
  const half = 0.48 * (count - 1) + 0.7;
  for (let z = -2.8; z <= 3.7; z += 1.6) footprint(c, f, half, [0, z]);
  emit(c, f, TEAL, 0.4, 6, [0, 0.9, 0.6]);
}

function container(c: Ctx, s: Sets, f: THREE.Matrix4, color: number, w = 2.6, h = 1.3): void {
  part(s.wear, G.box, color, f, { p: [0, 0, 0], s: [w, h, 1.3] });
  part(s.hull, G.box, HULL_D, f, { p: [0, h - 0.06, 0], s: [w * 0.98, 0.08, 1.32] });
  for (let k = -1; k <= 1; k++) {
    part(s.hull, G.box, HULL_D, f, { p: [k * w * 0.3, h * 0.5, 0.66], s: [w * 0.1, h * 0.9, 0.06] });
  }
  part(s.gold, G.box, GOLD, f, { p: [w * 0.28, h * 0.5, 0.68], s: [0.12, 0.16, 0.05] });
}

const CRATES = [RUST, RUST_D, RUST_L, HULL_D];

function containerStack(c: Ctx, s: Sets, api: ZoneApi, east: number, north: number, yaw: number): void {
  const f = api.at(east, north, yaw, -0.1);
  const levels = 2 + Math.floor(c.rng() * 2);
  for (let i = 0; i < levels; i++) {
    const g = f.clone();
    const off = i === 2 ? 0.6 : 0;
    g.multiply(new THREE.Matrix4().makeTranslation(off * 0.4, i * 1.34, off));
    container(c, s, g, pick(c, CRATES));
    part(s.hull, G.box, HULL_D, g, { p: [0, 1.24, 0], s: [2.55, 0.08, 1.35] });
  }
  footprint(c, f, 1.8);
}

// ---------------------------------------------------------------- debris

/** Broken slabs and torn plating where the hull meets the ground. */
function hullDebris(c: Ctx, s: Sets, api: ZoneApi): void {
  // Two litter lines: along the south flank by the dock, and along the north
  // flank where the ship tore into the soil. Larger toward the stern.
  for (let i = 0; i < 30; i++) {
    const east = rnd(c, -18, 17);
    const south = i % 3 !== 0;
    const north = south ? rnd(c, 3.4, 6.4) : rnd(c, 14.2, 17.4);
    const big = south ? 1 : 1.45;
    const w = rnd(c, 0.9, 2.4) * big;
    const l = rnd(c, 1.2, 3.2) * big;
    const f = api.at(east, north, rnd(c, 0, Math.PI * 2), rnd(c, -0.35, -0.05));
    const tone = pick(c, [RUST, RUST_D, RUST_L, HULL, HULL_D]);
    part(s.wear, G.box, tone, f, {
      p: [0, 0.16, 0],
      s: [w, rnd(c, 0.16, 0.4), l],
      r: [rnd(c, -0.16, 0.16), 0, rnd(c, -0.16, 0.16)]
    });
    if (c.rng() < 0.45) {
      // A shard of plate left standing in the slab.
      part(s.wear, G.cone4, pick(c, [RUST_D, HULL_D]), f, {
        p: [rnd(c, -w * 0.3, w * 0.3), 0.2, rnd(c, -l * 0.3, l * 0.3)],
        s: [rnd(c, 0.4, 0.9), rnd(c, 0.8, 2.0), rnd(c, 0.4, 0.9)],
        r: [rnd(c, -0.4, 0.4), rnd(c, 0, 3), rnd(c, -0.4, 0.4)]
      });
    }
    if (w > 1.6) footprint(c, f, w * 0.34);
  }
  // Torn plates still leaning on the hull: one sheet per flank at three
  // stations, angled off the launch rail.
  for (const [east, north, side] of [
    [-11.5, 4.6, -1],
    [4.6, 4.7, -1],
    [-9.0, 15.8, 1]
  ] as [number, number, number][]) {
    const f = api.at(east, north, side < 0 ? 0 : Math.PI, 0.05);
    part(s.wear, G.box, pick(c, [RUST, RUST_D]), f, {
      p: [0, 0.1, 0],
      s: [rnd(c, 2.0, 3.2), 0.2, rnd(c, 1.4, 2.2)],
      r: [side * rnd(c, 0.95, 1.25), rnd(c, -0.2, 0.2), 0]
    });
    footprint(c, f, 1.4);
  }
  // A row of half-buried blocks along the south flank, where the keel cut in.
  for (let i = 0; i < 7; i++) {
    const f = api.at(-16 + i * 5.2, 4.7, YAW, -0.45);
    part(s.wear, G.box, i % 2 ? HULL_D : RUST_D, f, { p: [0, 0, 0], s: [rnd(c, 0.9, 1.6), rnd(c, 0.5, 0.9), rnd(c, 1.0, 1.8)], r: [0, rnd(c, -0.1, 0.1), 0] });
  }
}

/** Rigging masts along both flanks: a pole, a diagonal stay and a warm lamp. */
function riggingLights(c: Ctx, s: Sets, api: ZoneApi): void {
  const masts: [number, number, number][] = [
    [-15.6, 4.3, 3.6],
    [-8.2, 4.1, 4.4],
    [-0.6, 4.2, 4.8],
    [7.4, 4.3, 4.2],
    [15.2, 5.0, 3.4],
    [-12.6, 15.6, 4.0],
    [5.6, 16.2, 4.6]
  ];
  for (const [east, north, h] of masts) {
    const side = north < NORTH ? -1 : 1;
    const f = api.at(east, north, rnd(c, 0, Math.PI * 2));
    part(s.wear, G.box, RUST_D, f, { p: [0, -0.1, 0], s: [0.7, 0.35, 0.7] });
    part(s.hull, G.box, HULL_D, f, { p: [0, 0.2, 0], s: [0.17, h, 0.17] });
    part(s.gold, G.box, GOLD, f, { p: [0, h + 0.16, 0], s: [0.22, 0.1, 0.22] });
    part(c.glow, G.box, WARM, f, { p: [0, h - 0.1, 0.2], s: [0.35, 0.3, 0.35] });
    // A stay leaning back toward the hull.
    part(s.wear, G.box, RUST, f, { p: [0, h * 0.42, -side * 0.9], s: [0.08, h * 0.95, 0.08], r: [side * 0.55, 0, 0] });
    emit(c, f, WARM, 0.85, 8, [0, h, 0.2]);
    footprint(c, f, 0.45);
  }
}

// ---------------------------------------------------------------- scatter
// Scatter props land in the shared batches; they are small and read by colour,
// so the shared vertex-coloured metal is enough at this distance.

function scrap(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.5, 1.1);
  footprint(c, f, 0.45 * s);
  part(c.solid, G.box, pick(c, [RUST, RUST_D, HULL_D, HULL]), f, { s: [s, s * 0.5, s * 1.4], r: [0.2, c.rng() * 3, 0.12] });
  if (c.rng() < 0.25) part(c.glow, G.box, TEAL_D, f, { p: [0, s * 0.25, s * 0.3], s: [s * 0.7, 0.04, s * 0.4] });
}

function scrapPlate(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.9, 2.0);
  part(c.solid, G.box, pick(c, [RUST, RUST_D, RUST_L, HULL_D]), f, {
    p: [0, 0.02, 0],
    s: [s, 0.14, s * 0.7],
    r: [rnd(c, -0.1, 0.1), c.rng() * 3, rnd(c, -0.1, 0.1)]
  });
}

function pipeSegment(c: Ctx, f: THREE.Matrix4): void {
  const r = rnd(c, 0.22, 0.42);
  const l = rnd(c, 1.4, 3.4);
  footprint(c, f, r + 0.2);
  part(c.solid, G.cyl8, pick(c, [RUST, RUST_D, HULL_D]), f, { p: [0, r, 0], s: [r, l, r], r: [Math.PI / 2, 0, rnd(c, 0, 3)] });
}

function scatteredContainer(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.9, 1.4);
  footprint(c, f, s * 1.1);
  const w = s * 2.6;
  const h = s * 1.3;
  part(c.solid, G.box, pick(c, CRATES), f, { s: [w, h, 1.3] });
  part(c.solid, G.box, HULL_D, f, { p: [0, h - 0.06, 0], s: [w * 0.98, 0.08, 1.32] });
}

// ---------------------------------------------------------------- zone

function buildArk(c: Ctx, api: ZoneApi): void {
  const sets = newSets();
  const frames = SECTIONS.map((s) => ({ s, f: sectionFrame(api, s) }));

  for (const { s, f } of frames) hullSection(c, sets, f, s);
  bow(c, sets, frames[frames.length - 1].f, SECTIONS[SECTIONS.length - 1]);
  stern(c, sets, frames[0].f, SECTIONS[0]);
  bridge(c, sets, frames[2].f, SECTIONS[2]);
  ramp(c, sets, api);

  // One ground-frame collider per slice, sized to that slice's beam, plus caps
  // over the bow and the engine nozzles, which reach past the end slices.
  const hullGround = api.at(0, NORTH, YAW);
  for (const s of SECTIONS) footprint(c, hullGround, s.w / 2 + 0.4, [0, s.e]);
  const caps: [number, number][] = [[13.7, 3.3], [15.8, 2.5], [17.3, 1.7], [-16.2, 3.1], [-18.4, 2.4], [-20.0, 1.6]];
  for (const [e, r] of caps) footprint(c, hullGround, r, [0, e]);

  const south = crane(c, sets, api, -9.5, 3.4, -0.4);
  const north = crane(c, sets, api, 11.5, 16.2, 2.6);
  hook(api, south.f, south.tip);
  const lampPos = new THREE.Vector3(0, 8.7, 0).applyMatrix4(north.f);
  warningLamp(api, north.f, lampPos);
  part(sets.hull, G.box, HULL_D, north.f, { p: [0, 8.2, 0], s: [0.4, 0.5, 0.4] });
  emit(c, north.f, WARM, 0.7, 7, [0, 8.9, 0]);

  pipeCluster(c, sets, api, -14.5, 7.0, 1.2, 3);
  pipeCluster(c, sets, api, 8.0, 3.0, -0.5, 2);
  pipeCluster(c, sets, api, 14.0, 14.0, 2.2, 3);

  containerStack(c, sets, api, -13.0, 14.5, 0.4);
  containerStack(c, sets, api, 12.5, 5.0, -0.7);
  containerStack(c, sets, api, 4.0, 17.0, 1.1);

  hullDebris(c, sets, api);
  riggingLights(c, sets, api);

  // A lone pylon beside the ramp so the dock reads from the beacon.
  const pylon = api.at(-6.5, 4.0, 0.3);
  part(sets.wear, G.box, RUST_D, pylon, { p: [0, -0.2, 0], s: [1.1, 0.6, 1.1] });
  part(sets.hull, G.box, HULL_D, pylon, { p: [0, 0.4, 0], s: [0.42, 4.4, 0.42] });
  part(sets.gold, G.box, GOLD, pylon, { p: [0, 4.5, 0.5], s: [0.3, 0.14, 1.4] });
  part(c.glow, G.box, TEAL, pylon, { p: [0, 4.05, 0.55], s: [0.3, 0.42, 0.3] });
  emit(c, pylon, TEAL, 0.9, 7, [0, 4.2, 0.55]);
  footprint(c, pylon, 0.9);

  // Energon spilling out of two open hatches onto the dock floor.
  for (const [east, north, yaw] of [
    [-5.5, 4.9, 0.1],
    [9.5, 5.2, -0.1]
  ] as [number, number, number][]) {
    const f = api.at(east, north, yaw);
    part(sets.flow, G.box, TEAL, f, { p: [0, 0.04, 0], s: [1.7, 0.05, 0.9], r: [0, 0.1, 0] });
  }

  // At most five extra draw calls for the whole zone: one merged mesh per
  // material, no per-prop meshes. Glass does not cast (it writes no depth).
  // Each material carries a small emissive floor: the zone's key light is dim,
  // and without it the hull and the rust drop to the same black as the ground.
  const hullMat = circuitMetal(0xffffff, { strength: 0.05, color: 0x39c7e0, scale: 0.55 });
  hullMat.emissive = new THREE.Color(0x0a1520);
  hullMat.emissiveIntensity = 0.75;
  // Hull plate is rougher and reflects less than the ground does: polished
  // metal picks the pale sun out of the environment and the deck turns cream.
  hullMat.roughness = 0.7;
  hullMat.envMapIntensity = 0.25;
  hullMat.metalness = 0.3;
  const wearMat = wearMaterial();
  wearMat.emissive = new THREE.Color(0x190a04);
  wearMat.emissiveIntensity = 0.5;
  const goldMat = brushedGold();
  goldMat.emissive = new THREE.Color(0x2b1e06);
  goldMat.emissiveIntensity = 0.6;
  attach(api, sets.hull, hullMat, 'ark-hull');
  attach(api, sets.wear, wearMat, 'ark-wear');
  attach(api, sets.gold, goldMat, 'ark-gold');
  attach(api, sets.glass, energonGlass(TEAL), 'ark-glass', false);
  attach(api, sets.flow, energonFlow(TEAL), 'ark-flow', false);

  // Keep the scatter off the dock floor, the beacon and the robot's spot.
  api.exclude(0, NORTH, 19);
  api.exclude(0, 0, 4);
  api.exclude(4, -4, 2.2);
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
