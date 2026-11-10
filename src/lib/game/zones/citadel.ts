// Iron Citadel zone (铁堡): a gilded Art Deco city on the four terraces.
//
// The zone is the orderly end of the planet: everything here is axis-aligned,
// mirrored across the avenue toward the river, and vertical. Three structures
// carry the identity:
//
// 1. The Gilded Crown: a stepped gold spire over the beacon plaza. Eight slim
//    piers ring the beacon (keeping its three-unit circle clear), a fanned
//    canopy spans them at head height, and a tiered needle rises to ~27 units.
// 2. The inverted district: a dark ceiling ring hangs above the city with a
//    district of towers growing DOWN from it, warm light strips underneath and
//    an open oculus so the spire still reads from the ring road and from orbit.
// 3. The city fabric: eleven dark towers on a grid, gold crowns and pilasters,
//    energon-glass window matrices, gold skybridges, and small ground works.
//
// Owned by the "citadel" session. Only this file is edited.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { emit, footprint, G, part, PropBatch, type Ctx, type PartOpts } from '../kit';
import { biomeById } from '../biomes';
import { tangentBasis } from '../planet';
import { brushedGold, circuitMetal, energonGlass } from '../look';
import type { ZoneApi, ZoneModule } from './types';

// ------------------------------------------------------------------ palette
//
// All large surfaces are dark metal; the gold is trim, crowns and the spire.
// Energon glass carries the window matrices in cyan and violet at low intensity.

const DARK = 0x121c30;
const DARK_PLATE = 0x0a1120;
const GOLD = 0xc9a227;
const GOLD_DEEP = 0x7a5c1a;
const WARM = 0xffd49a;
const GOLD_LIGHT = 0xffc75a;
const CYAN = 0x38d6ff;
const VIOLET = 0xa875ff;

// Small scattered props share the lit vertex-colour batch, so their colours
// are picked to sit next to the material palette rather than match it exactly.
const S_DARK = 0x18243a;
const S_GOLD = 0xc9a227;
const S_CYAN = 0x2fbfd6;

// ------------------------------------------------------------------- frames

/** Bearing from the zone centre toward the energy river zone, radians from north. */
function riverBearing(): number {
  const here = biomeById('citadel').center;
  const river = biomeById('river').center;
  const east = new THREE.Vector3();
  const north = new THREE.Vector3();
  tangentBasis(here, 0, east, north);
  const flat = river.clone().addScaledVector(here, -river.dot(here)).normalize();
  return Math.atan2(flat.dot(east), flat.dot(north));
}

/**
 * Frame on the city grid: `x` is lateral (positive to the right when facing the
 * river), `z` runs along the avenue (positive toward the gate). Every frame is
 * yawed to the avenue, so a box placed here is axis-aligned with the city.
 */
function gridFrame(api: ZoneApi, gate: number, x: number, z: number, lift = 0): THREE.Matrix4 {
  const east = Math.sin(gate) * z + Math.cos(gate) * x;
  const north = Math.cos(gate) * z - Math.sin(gate) * x;
  return api.at(east, north, gate, lift);
}

const _m1 = new THREE.Matrix4();
const _m2 = new THREE.Matrix4();

/**
 * Frame on one vertical face of a structure, `radius` from its axis and
 * `angle` radians round it. Local +Z points outward; local +X is the tangent.
 */
function faceFrame(f: THREE.Matrix4, angle: number, radius: number, y: number): THREE.Matrix4 {
  _m1.makeTranslation(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
  _m2.makeRotationY(angle);
  return f.clone().multiply(_m1).multiply(_m2);
}

/** Frame whose local +X spans the chord between two points in `f`'s plane. */
function chordFrame(
  f: THREE.Matrix4,
  x0: number,
  z0: number,
  y0: number,
  x1: number,
  z1: number,
  y1: number
): THREE.Matrix4 {
  const dx = x1 - x0;
  const dz = z1 - z0;
  _m1.makeTranslation((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  _m2.makeRotationY(Math.atan2(-dz, dx));
  return f.clone().multiply(_m1).multiply(_m2);
}

// ------------------------------------------------------------------ batches

/** One merged batch per material, built once at the end of `build`. */
type Batches = {
  gold: PropBatch;
  bronze: PropBatch;
  dark: PropBatch;
  plate: PropBatch;
  cyan: PropBatch;
  violet: PropBatch;
};

type Site = {
  api: ZoneApi;
  c: Ctx;
  b: Batches;
  gate: number;
  /** Triangles built into the citadel's own material batches, for the log. */
  tris: number;
};

function triCount(geo: THREE.BufferGeometry): number {
  return (geo.index ? geo.index.count : geo.attributes.position.count) / 3;
}

/** Add a part to one of the brushed-metal or glass batches. */
function bp(site: Site, key: keyof Batches, geo: THREE.BufferGeometry, frame: THREE.Matrix4, o: PartOpts = {}): void {
  part(site.b[key], geo, 0xffffff, frame, o);
  site.tris += triCount(geo);
}

/** Add a glowing or dark unlit part to the shared zone batches. */
function vp(
  site: Site,
  key: 'glow' | 'night' | 'solid',
  geo: THREE.BufferGeometry,
  color: number,
  frame: THREE.Matrix4,
  o: PartOpts = {}
): void {
  part(site.c[key], geo, color, frame, o);
  site.tris += triCount(geo);
}

/** A ring of tangent boxes: `count` segments around `f` at `radius`. */
function ringOf(
  site: Site,
  key: keyof Batches,
  f: THREE.Matrix4,
  count: number,
  radius: number,
  y: number,
  depth: number,
  height: number,
  phase = 0,
  fill = 1
): void {
  const len = 2 * radius * Math.tan(Math.PI / count) * fill;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + phase;
    bp(site, key, G.box, faceFrame(f, a, radius, y), { s: [len, height, depth] });
  }
}

/** A thin ring of emissive dashes, used for the gold trim lines. */
function glowRing(
  site: Site,
  f: THREE.Matrix4,
  count: number,
  radius: number,
  y: number,
  depth: number,
  height: number,
  color: number,
  phase = 0,
  fill = 0.86
): void {
  const len = 2 * radius * Math.tan(Math.PI / count) * fill;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + phase;
    vp(site, 'glow', G.box, color, faceFrame(f, a, radius, y), { s: [len, height, depth] });
  }
}

/**
 * A fan of thin gold blades radiating from a point on a face, the signature
 * Art Deco motif of the reference spires.
 */
function fanMotif(
  site: Site,
  f: THREE.Matrix4,
  angle: number,
  radius: number,
  y: number,
  blades: number,
  span: number,
  len: number
): void {
  const base = faceFrame(f, angle, radius, y);
  for (let i = 0; i < blades; i++) {
    const t = blades === 1 ? 0 : (i / (blades - 1)) * 2 - 1;
    const tilt = t * span;
    bp(site, 'gold', G.box, base, {
      p: [Math.sin(tilt) * len * 0.5, Math.cos(tilt) * len * 0.5, 0.02],
      r: [0, 0, -tilt],
      s: [0.06 + (1 - Math.abs(t)) * 0.03, len, 0.055]
    });
  }
}

// ------------------------------------------------------------ the gold crown

/** Dark plinth ring and inlays around the beacon, all low enough to walk over. */
function plaza(site: Site, f: THREE.Matrix4): void {
  bp(site, 'plate', G.cyl8, f, { p: [0, -0.62, 0], s: [9.6, 0.78, 9.6] });
  ringOf(site, 'bronze', f, 16, 4.35, 0.1, 0.36, 0.14);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
    vp(site, 'glow', G.box, GOLD_LIGHT, faceFrame(f, a, 3.36, 0.04), { s: [0.68, 0.05, 0.13] });
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    bp(site, 'gold', G.box, faceFrame(f, a, 3.9, 0.06), { s: [0.12, 0.05, 1.5] });
  }
}

/**
 * Eight slender piers round the beacon at radius 4.2. The beacon's keep-free
 * circle is 3, the pier geometry starts outside 3.68, and the colliders sit at
 * radius 0.4, so the avenue gap and the beacon circle both stay walkable.
 */
const PIER_R = 4.2;

function crownPiers(site: Site, f: THREE.Matrix4): void {
  const R = PIER_R;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const pf = faceFrame(f, a, R, 0);
    bp(site, 'dark', G.box, pf, { p: [0, 0, 0], s: [0.9, 0.9, 0.9] });
    bp(site, 'gold', G.box, pf, { p: [0, 0.9, 0], s: [0.7, 5.4, 0.7] });
    bp(site, 'gold', G.box, pf, { p: [0, 6.3, 0], s: [0.86, 0.66, 0.86] });
    bp(site, 'bronze', G.box, pf, { p: [0, 6.96, 0], s: [1.0, 0.28, 1.0] });
    bp(site, 'gold', G.cone4, pf, { p: [0, 7.24, 0], s: [0.8, 0.45, 0.8], r: [0, Math.PI / 4, 0] });
    // Dark inset panels on all four faces with a cyan slot in the inner one.
    for (const face of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      const ff = faceFrame(pf, face, 0.36, 0);
      for (const side of [-1, 1]) {
        bp(site, 'dark', G.box, ff, { p: [side * 0.22, 1.5, 0], s: [0.16, 2.7, 0.05] });
      }
      bp(site, 'gold', G.box, ff, { p: [0, 1.4, 0.01], s: [0.08, 3.0, 0.05] });
      if (face === Math.PI) vp(site, 'glow', G.box, CYAN, ff, { p: [0, 1.6, 0.04], s: [0.06, 2.5, 0.05] });
    }
    footprint(site.c, pf, 0.4);
    emit(site.c, pf, 0xffd9a6, 18, 11, [0, 2.2, 0.55], { flicker: 0.06 });
  }
}

/** The fanned canopy that ties the piers together at 7.6 units. */
function crownCanopy(site: Site, f: THREE.Matrix4): void {
  bp(site, 'plate', G.cyl8, f, { p: [0, 7.6, 0], s: [10.6, 0.6, 10.6] });
  bp(site, 'dark', G.cyl8, f, { p: [0, 8.2, 0], s: [9.9, 0.28, 9.9] });
  ringOf(site, 'bronze', f, 8, 5.24, 7.55, 0.34, 0.24, Math.PI / 8, 0.98);
  ringOf(site, 'gold', f, 8, 4.92, 8.34, 0.3, 0.26, Math.PI / 8, 0.98);
  glowRing(site, f, 8, 4.94, 8.5, 0.1, 0.05, GOLD_LIGHT, Math.PI / 8, 0.94);
  for (let i = 0; i < 8; i++) {
    fanMotif(site, f, (i / 8) * Math.PI * 2 + Math.PI / 8, 4.95, 8.42, 5, 0.6, 1.45);
  }
  // Warm ceiling under the canopy: the plaza reads lit from every approach.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    vp(site, 'glow', G.box, WARM, faceFrame(f, a, 4.1, 7.53), { s: [0.95, 0.05, 0.28] });
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    vp(site, 'glow', G.box, 0xffb870, faceFrame(f, a, 4.25, 7.55), { s: [1.5, 0.05, 1.1] });
  }
  ringOf(site, 'bronze', f, 8, 5.28, 7.9, 0.16, 0.5, Math.PI / 8, 0.98);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    emit(site.c, f, 0xffc98a, 44, 19, [Math.sin(a) * 3.4, 7.3, Math.cos(a) * 3.4]);
  }
}

/**
 * Five stepped octagonal drums narrowing to a needle, with dark vertical
 * channels, glowing setbacks and fan motifs on the lower tiers.
 */
function crownSpire(site: Site, f: THREE.Matrix4): void {
  const drums = [
    { r: 4.15, y: 8.2, h: 3.8 },
    { r: 3.35, y: 12.0, h: 3.5 },
    { r: 2.6, y: 15.5, h: 3.3 },
    { r: 1.85, y: 18.8, h: 3.0 },
    { r: 1.2, y: 21.8, h: 2.7 }
  ];
  for (let d = 0; d < drums.length; d++) {
    const { r, y, h } = drums[d];
    bp(site, 'bronze', G.cyl8, f, { p: [0, y - 0.1, 0], s: [r * 2 + 0.62, 0.34, r * 2 + 0.62] });
    bp(site, 'gold', G.cyl8, f, { p: [0, y + 0.16, 0], s: [r * 2, h - 0.2, r * 2] });
    bp(site, 'bronze', G.cyl8, f, { p: [0, y + h - 0.1, 0], s: [r * 2 + 0.4, 0.22, r * 2 + 0.4] });
    const faceR = r * 0.924;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
      const ff = faceFrame(f, a, faceR + 0.02, 0);
      bp(site, 'dark', G.box, ff, { p: [0, y + 0.35, 0], s: [r * 0.17, h * 0.72, 0.06] });
      vp(site, d < 3 ? 'glow' : 'night', G.box, d < 3 ? CYAN : VIOLET, ff, {
        p: [0, y + 0.5, 0.035],
        s: [0.06, h * 0.5, 0.05]
      });
    }
    glowRing(site, f, 8, r + 0.12, y + h + 0.02, 0.1, 0.055, GOLD_LIGHT, Math.PI / 8, 0.92);
    if (d < 2) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
        fanMotif(site, f, a, faceR + 0.05, y + 0.3, 4, 0.5, h * 0.5);
      }
    }
  }
  // Needle: a gold cone with four fins, glow sphere at the tip.
  bp(site, 'bronze', G.cyl8, f, { p: [0, 24.4, 0], s: [2.0, 0.36, 2.0] });
  bp(site, 'gold', G.cone8, f, { p: [0, 24.8, 0], s: [1.15, 4.6, 1.15] });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    bp(site, 'gold', G.box, faceFrame(f, a, 0.46, 24.8), { p: [0, 0, 0], s: [0.08, 1.7, 0.55] });
  }
  vp(site, 'glow', G.sphere, GOLD_LIGHT, f, { p: [0, 29.45, 0], s: 0.36 });
  vp(site, 'glow', G.cyl8, GOLD_LIGHT, f, { p: [0, 21.85, 0], s: [1.5, 0.06, 1.5] });
}

/** A slowly turning ring of gold fins around the spire, for a moving highlight. */
function spireOrbit(api: ZoneApi, f: THREE.Matrix4): void {
  const group = new THREE.Group();
  group.position.setFromMatrixPosition(f);
  group.quaternion.setFromRotationMatrix(f);
  const spin = new THREE.Group();
  spin.position.set(0, 13.4, 0);
  group.add(spin);

  const finPart = new THREE.BoxGeometry(0.1, 1.7, 0.34);
  const tipPart = new THREE.SphereGeometry(0.11, 6, 5);
  const fins: THREE.BufferGeometry[] = [];
  const tips: THREE.BufferGeometry[] = [];
  const m = new THREE.Matrix4();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.sin(a) * 2.55;
    const z = Math.cos(a) * 2.55;
    const fin = finPart.clone().applyMatrix4(m.makeTranslation(x, 0, z));
    fins.push(fin);
    const tip = tipPart.clone().applyMatrix4(m.makeTranslation(x, 0.9, z));
    tips.push(tip);
  }
  finPart.dispose();
  tipPart.dispose();
  const finMesh = new THREE.Mesh(mergeGeometries(fins)! , brushedGold(GOLD));
  const tipMesh = new THREE.Mesh(
    mergeGeometries(tips)!,
    new THREE.MeshBasicMaterial({ color: GOLD_LIGHT, toneMapped: false })
  );
  for (const g of [...fins, ...tips]) g.dispose();
  spin.add(finMesh, tipMesh);
  api.addDynamic(group, (dt) => {
    spin.rotation.y += dt * 0.16;
  });
}

// ----------------------------------------------------------------- the city

type TowerSpec = { x: number; z: number; w: number; h: number; glass: 'cyan' | 'violet' };

/**
 * One dark stepped tower: gold foundation and pilasters, energon-glass window
 * matrix on all four faces, a fanned gold crown and an antenna.
 */
function cityTower(site: Site, t: TowerSpec): void {
  const f = gridFrame(site.api, site.gate, t.x, t.z);
  const w = t.w;
  const h = t.h;
  const gm = t.glass === 'cyan' ? 'cyan' : 'violet';
  // Foundation and plinth.
  bp(site, 'plate', G.cyl8, f, { p: [0, -0.55, 0], s: [w * 1.65, 1.1, w * 1.65] });
  bp(site, 'bronze', G.box, f, { p: [0, 0, 0], s: [w * 1.18, 0.55, w * 1.18] });
  bp(site, 'gold', G.box, f, { p: [0, 0.55, 0], s: [w * 1.06, 0.16, w * 1.06] });
  // Stepped body.
  const a0 = 0.7;
  const a1 = h * 0.58;
  const a2 = h * 0.82;
  bp(site, 'dark', G.box, f, { p: [0, a0, 0], s: [w, a1 - a0, w] });
  bp(site, 'dark', G.box, f, { p: [0, a1, 0], s: [w * 0.84, a2 - a1, w * 0.84] });
  bp(site, 'dark', G.box, f, { p: [0, a2, 0], s: [w * 0.68, h * 0.94 - a2, w * 0.68] });
  bp(site, 'bronze', G.box, f, { p: [0, a1 - 0.14, 0], s: [w * 0.9, 0.2, w * 0.9] });
  bp(site, 'bronze', G.box, f, { p: [0, a2 - 0.12, 0], s: [w * 0.74, 0.18, w * 0.74] });
  // Four gold pilasters up the corners.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      bp(site, 'gold', G.box, f, {
        p: [sx * (w * 0.5 + 0.04), 0.55, sz * (w * 0.5 + 0.04)],
        s: [0.2, h * 0.9, 0.2]
      });
      bp(site, 'gold', G.box, f, {
        p: [sx * (w * 0.34 + 0.04), a2, sz * (w * 0.34 + 0.04)],
        s: [0.16, h * 0.1, 0.16]
      });
    }
  }
  // Window matrices: rows x three columns on every face, a golden floor line
  // every third row. Lit cells use the energon-glass batch.
  const rows = Math.max(4, Math.min(9, Math.floor((h - 2.2) / 1.25)));
  const cols = 5;
  const rowH = (h * 0.9 - 1.6) / rows;
  for (const face of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    for (let r = 0; r < rows; r++) {
      const y = 1.55 + r * rowH;
      const bw = y < a1 ? w : y < a2 ? w * 0.84 : w * 0.68;
      const half = bw / 2;
      if (r % 3 === 2) {
        bp(site, 'bronze', G.box, faceFrame(f, face, half + 0.035, y + rowH * 0.5), {
          s: [bw * 0.94, 0.09, 0.06]
        });
      }
      for (let c = 0; c < cols; c++) {
        if (site.c.rng() > 0.8) continue;
        const u = (c / (cols - 1) - 0.5) * bw * 0.62;
        bp(site, gm, G.box, faceFrame(f, face, half + 0.04, y), {
          s: [0.15, rowH * 0.42, 0.05],
          p: [u, 0, 0]
        });
      }
    }
  }
  // Doorway toward the avenue side of the tower.
  const doorAngle = t.z > 0 ? Math.PI : 0;
  const df = faceFrame(f, doorAngle, w * 0.5 + 0.04, 0);
  vp(site, 'glow', G.box, WARM, df, { p: [0, 0.5, 0], s: [1.0, 2.0, 0.06] });
  bp(site, 'gold', G.box, df, { p: [0, 0.42, 0.03], s: [1.32, 0.12, 0.08] });
  bp(site, 'gold', G.box, df, { p: [0, 2.55, 0.03], s: [1.32, 0.12, 0.08] });
  // Crown.
  const cy = h * 0.94;
  bp(site, 'gold', G.box, f, { p: [0, cy, 0], s: [w * 0.72, 0.4, w * 0.72] });
  bp(site, 'gold', G.box, f, { p: [0, cy + 0.4, 0], s: [w * 0.56, 0.42, w * 0.56] });
  bp(site, 'bronze', G.box, f, { p: [0, cy + 0.82, 0], s: [w * 0.42, 0.24, w * 0.42] });
  bp(site, 'gold', G.cone4, f, { p: [0, cy + 1.06, 0], s: [w * 0.38, 0.9, w * 0.38], r: [0, Math.PI / 4, 0] });
  for (let i = 0; i < 4; i++) {
    fanMotif(site, f, (i / 4) * Math.PI * 2 + Math.PI / 4, w * 0.36, cy + 0.4, 4, 0.62, 1.0);
  }
  glowRing(site, f, 4, w * 0.4, cy + 1.98, 0.1, 0.05, GOLD_LIGHT, Math.PI / 4, 0.7);
  const mastY = cy + 1.75;
  bp(site, 'gold', G.cyl6, f, { p: [0, mastY, 0], s: [0.14, 1.4, 0.14] });
  vp(site, 'glow', G.sphere, GOLD_LIGHT, f, { p: [0, mastY + 1.4, 0], s: 0.2 });
  footprint(site.c, f, w * 0.7);
  emit(site.c, f, 0xffd8a4, 22, 12, [0, 1.2, w * 0.6]);
}

const CITY: TowerSpec[] = [
  { x: 9, z: 10.5, w: 2.9, h: 9.5, glass: 'cyan' },
  { x: -9, z: 10.5, w: 2.9, h: 8.5, glass: 'violet' },
  { x: 9, z: 6, w: 3.0, h: 13.5, glass: 'violet' },
  { x: -9, z: 6, w: 2.8, h: 11.5, glass: 'cyan' },
  { x: 9, z: 0, w: 3.1, h: 9.0, glass: 'cyan' },
  { x: -9, z: 0, w: 3.0, h: 10.0, glass: 'violet' },
  { x: 9, z: -8, w: 2.9, h: 12.0, glass: 'cyan' },
  { x: -9, z: -8, w: 3.2, h: 14.0, glass: 'violet' },
  { x: 0, z: -10.5, w: 3.4, h: 13.8, glass: 'cyan' },
  { x: 4.8, z: -13, w: 2.5, h: 11.0, glass: 'violet' },
  { x: -4.8, z: -13, w: 2.5, h: 8.0, glass: 'cyan' }
];

/** A gold-railed skybridge between two towers. Visual only; nothing walks on it. */
function skybridge(site: Site, a: TowerSpec, b: TowerSpec, y: number): void {
  const f = chordFrame(
    gridFrame(site.api, site.gate, 0, 0),
    a.x,
    a.z,
    y,
    b.x,
    b.z,
    y
  );
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  bp(site, 'dark', G.box, f, { p: [0, -0.18, 0], s: [len * 0.92, 0.34, 1.6] });
  bp(site, 'bronze', G.box, f, { p: [0, 0.16, 0], s: [len * 0.94, 0.1, 1.7] });
  for (const side of [-1, 1]) {
    bp(site, 'gold', G.box, f, { p: [0, 0.36, side * 0.76], s: [len * 0.94, 0.5, 0.1] });
    vp(site, 'glow', G.box, WARM, f, { p: [0, 0.63, side * 0.76], s: [len * 0.9, 0.05, 0.06] });
  }
  for (const k of [-0.35, 0, 0.35]) {
    bp(site, 'gold', G.box, f, { p: [len * k, -0.35, 0], s: [0.12, 0.4, 0.12] });
  }
  vp(site, 'glow', G.box, CYAN, f, { p: [0, -0.05, 0], s: [len * 0.8, 0.04, 0.08] });
}

// ------------------------------------------------------- the inverted district

/**
 * The signature: a dark ceiling ring over the inner city, a district of towers
 * hanging off it, walkways and light strips. The oculus is wide enough that
 * the gold spire is still visible from the ring road, and the ring stops short
 * of the carriageway.
 */
function invertedDistrict(site: Site): void {
  const CEIL = 16.9;
  const R_IN = 9.4;
  const R_OUT = 14.6;
  const N = 8;
  const f = gridFrame(site.api, site.gate, 0, 0, CEIL);
  const rmid = (R_IN + R_OUT) / 2;
  const chord = 2 * R_OUT * Math.tan(Math.PI / N);

  // Plate segments. The alternate 3 cm lift keeps coplanar overlaps from
  // z-fighting where neighbouring segments cross at the inner corners.
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const sf = faceFrame(f, a, rmid, (i % 2) * 0.03);
    bp(site, 'plate', G.box, sf, { s: [chord, 0.8, R_OUT - R_IN] });
  }
  // Rims, beams and etched trim on the upper face.
  ringOf(site, 'bronze', f, N, R_OUT - 0.22, 0.42, 0.48, 0.46);
  ringOf(site, 'gold', f, N, R_IN + 0.18, 0.42, 0.4, 0.4);
  glowRing(site, f, N, R_OUT - 0.05, 0.62, 0.1, 0.05, GOLD_LIGHT, 0, 0.97);
  glowRing(site, f, N, R_IN + 0.06, 0.62, 0.1, 0.05, GOLD_LIGHT, 0, 0.97);
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    bp(site, 'gold', G.box, faceFrame(f, a, rmid, 0.86), { s: [0.32, 0.24, R_OUT - R_IN - 0.5] });
    bp(site, 'dark', G.box, faceFrame(f, a + Math.PI / N, rmid - 1.6, 0.9), {
      s: [1.4, 0.28, 1.1]
    });
  }
  // Underside: radial ribs, gold rims, warm strips.
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    bp(site, 'bronze', G.box, faceFrame(f, a, rmid, -0.55), { s: [0.3, 0.24, R_OUT - R_IN - 0.4] });
  }
  ringOf(site, 'bronze', f, N, R_OUT - 0.15, -0.52, 0.4, 0.42);
  ringOf(site, 'gold', f, N, R_IN + 0.12, -0.52, 0.34, 0.36);
  for (const rad of [8.2, 10.6, 13.2]) {
    glowRing(site, f, N, rad, -0.52, 0.2, 0.07, WARM, 0, 0.94);
  }
  // Long lit strips between the ribs: the underside reads as a warm ceiling,
  // not a black slab, which is what gives the gap its depth.
  for (const rad of [8.6, 11.9]) {
    const len = 2 * rad * Math.tan(Math.PI / N) * 0.72;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + Math.PI / N;
      vp(site, 'glow', G.box, 0xffb866, faceFrame(f, a, rad, -0.56), { s: [len, 0.06, 0.34] });
    }
  }
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + Math.PI / N;
    vp(site, 'glow', G.box, WARM, faceFrame(f, a, R_IN + 0.9, -2.6), { s: [0.16, 4.4, 0.12] });
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    emit(site.c, f, 0xffc17a, 48, 22, [Math.sin(a) * 11, -1.6, Math.cos(a) * 11]);
  }

  // Hanging towers, 3 depth rings round the oculus.
  const hang: { a: number; r: number; len: number; w: number; glass: 'cyan' | 'violet' }[] = [];
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2 + Math.PI / 8;
    const r = 10.0 + (Math.floor(k / 2) % 3) * 1.5;
    hang.push({ a, r, len: 4.8 + (k % 4) * 1.15, w: 1.5 + (k % 2) * 0.55, glass: k % 2 ? 'violet' : 'cyan' });
  }
  for (const ht of hang) {
    const hf = faceFrame(f, ht.a, ht.r, 0);
    const { w, len } = ht;
    bp(site, 'dark', G.box, hf, { p: [0, -0.35, 0], s: [w * 1.2, 0.4, w * 1.2] });
    bp(site, 'dark', G.box, hf, { p: [0, -0.35 - len * 0.48, 0], s: [w, len * 0.48, w] });
    bp(site, 'dark', G.box, hf, { p: [0, -0.35 - len * 0.82, 0], s: [w * 0.82, len * 0.34, w * 0.82] });
    bp(site, 'bronze', G.box, hf, { p: [0, -0.35 - len * 0.86, 0], s: [w * 0.9, 0.22, w * 0.9] });
    bp(site, 'gold', G.cone8, hf, {
      p: [0, -0.35 - len * 0.9, 0],
      s: [w * 0.7, len * 0.22, w * 0.7],
      r: [Math.PI, 0, 0]
    });
    vp(site, 'glow', G.sphere, GOLD_LIGHT, hf, { p: [0, -0.34 - len * 1.08, 0], s: 0.26 });
    // Window rows on four faces.
    for (const face of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      const rows = Math.max(2, Math.floor(len / 1.7));
      const ff = faceFrame(hf, face, w * 0.5 + 0.03, 0);
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < 2; cc++) {
          bp(site, ht.glass, G.box, ff, {
            p: [(cc - 0.5) * w * 0.36, -0.55 - rr * (len / rows), 0],
            s: [0.2, 0.44, 0.05]
          });
        }
      }
    }
    // A long warm light strip down one face.
    const sf = faceFrame(hf, 0, w * 0.5 + 0.06, 0);
    vp(site, 'glow', G.box, WARM, sf, { p: [0, -0.5 - len * 0.5, 0], s: [0.08, len * 0.85, 0.06] });
  }
  // Two hanging walkways between neighbours on the same depth ring.
  for (let k = 0; k < N; k += 2) {
    const a = hang[k];
    const b = hang[k + 1];
    if (!b) continue;
    const y0 = -0.35 - a.len * 0.55;
    const y1 = -0.35 - b.len * 0.55;
    const wf = chordFrame(
      f,
      Math.sin(a.a) * a.r,
      Math.cos(a.a) * a.r,
      y0,
      Math.sin(b.a) * b.r,
      Math.cos(b.a) * b.r,
      y1
    );
    const span = Math.hypot(
      Math.sin(b.a) * b.r - Math.sin(a.a) * a.r,
      Math.cos(b.a) * b.r - Math.cos(a.a) * a.r
    );
    bp(site, 'dark', G.box, wf, { p: [0, -0.14, 0], s: [span * 0.9, 0.24, 0.9] });
    bp(site, 'gold', G.box, wf, { p: [0, 0.1, 0.4], s: [span * 0.9, 0.4, 0.08] });
    bp(site, 'gold', G.box, wf, { p: [0, 0.1, -0.4], s: [span * 0.9, 0.4, 0.08] });
    vp(site, 'glow', G.box, WARM, wf, { p: [0, 0.34, 0], s: [span * 0.8, 0.05, 0.08] });
  }
  // Masts rising from the plate rim, so the district reads from orbit.
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + Math.PI / N;
    const mf = faceFrame(f, a, 13.9, 0);
    bp(site, 'gold', G.cyl6, mf, { p: [0, 0.7, 0], s: [0.24, 8.6, 0.24] });
    bp(site, 'gold', G.box, mf, { p: [0, 7.7, 0], s: [1.7, 0.18, 0.18] });
    bp(site, 'gold', G.box, mf, { p: [0, 8.5, 0], s: [1.0, 0.14, 0.14] });
    vp(site, 'glow', G.sphere, GOLD_LIGHT, mf, { p: [0, 9.45, 0], s: 0.24 });
  }
}

// -------------------------------------------------------------------- ground

/** A gold post with a warm lantern; the avenue's repeating rhythm. */
function lamp(site: Site, f: THREE.Matrix4): void {
  footprint(site.c, f, 0.28);
  bp(site, 'bronze', G.cyl8, f, { p: [0, 0, 0], s: [0.46, 0.16, 0.46] });
  bp(site, 'gold', G.cyl6, f, { p: [0, 0.16, 0], s: [0.16, 3.1, 0.16] });
  bp(site, 'gold', G.box, f, { p: [0, 3.2, 0], s: [0.5, 0.12, 0.5] });
  vp(site, 'glow', G.box, 0xffd9a8, f, { p: [0, 3.32, 0], s: [0.32, 0.24, 0.32] });
  vp(site, 'glow', G.sphere, 0xffe3b8, f, { p: [0, 3.62, 0], s: 0.14 });
  emit(site.c, f, 0xffcf96, 26, 12, [0, 3.5, 0], { flicker: 0.05 });
}

/** A dark planter with a gold rim and a violet energon slit. */
function planter(site: Site, f: THREE.Matrix4): void {
  footprint(site.c, f, 0.86);
  bp(site, 'dark', G.box, f, { p: [0, -0.1, 0], s: [1.7, 0.9, 1.7] });
  bp(site, 'gold', G.box, f, { p: [0, 0.8, 0], s: [1.82, 0.16, 1.82] });
  bp(site, 'bronze', G.box, f, { p: [0, 0.96, 0], s: [1.5, 0.1, 1.5] });
  vp(site, 'glow', G.box, VIOLET, f, { p: [0, 0.5, 0.86], s: [0.7, 0.06, 0.05] });
  for (let i = 0; i < 4; i++) {
    fanMotif(site, f, (i / 4) * Math.PI * 2 + Math.PI / 4, 0.78, 0.96, 3, 0.4, 0.5);
  }
}

/** Paved avenue slabs, sunk so the terrace steps pass underneath. */
function avenue(site: Site): void {
  for (let z = 4.2; z <= 12.4; z += 2.1) {
    const f = gridFrame(site.api, site.gate, 0, z);
    bp(site, 'plate', G.box, f, { p: [0, -0.5, 0], s: [3.1, 0.72, 2.0] });
    bp(site, 'bronze', G.box, f, { p: [0, 0.2, 0], s: [2.9, 0.06, 1.84] });
    vp(site, 'glow', G.box, GOLD_LIGHT, f, { p: [0, 0.24, 0], s: [0.14, 0.04, 1.7] });
  }
  for (const side of [-1, 1]) {
    for (const z of [4.6, 7.0, 9.4, 11.8]) {
      lamp(site, gridFrame(site.api, site.gate, side * 2.65, z));
    }
  }
  for (const side of [-1, 1]) {
    planter(site, gridFrame(site.api, site.gate, side * 4.5, 4.7));
    planter(site, gridFrame(site.api, site.gate, side * 4.5, 7.6));
  }
}

/** A tiny 1.9-unit sentry, the human-scale anchor beside the gate. */
function sentry(site: Site, f: THREE.Matrix4, facing: number): void {
  const g = f.clone().multiply(new THREE.Matrix4().makeRotationY(facing));
  footprint(site.c, g, 0.34);
  bp(site, 'dark', G.box, g, { p: [-0.18, 0, 0], s: [0.2, 0.82, 0.22] });
  bp(site, 'dark', G.box, g, { p: [0.18, 0, 0], s: [0.2, 0.82, 0.22] });
  bp(site, 'bronze', G.box, g, { p: [0, 0.82, 0], s: [0.62, 0.28, 0.36] });
  bp(site, 'dark', G.box, g, { p: [0, 1.1, 0], s: [0.82, 0.62, 0.44] });
  bp(site, 'gold', G.box, g, { p: [0, 1.6, 0], s: [0.94, 0.14, 0.4] });
  bp(site, 'dark', G.box, g, { p: [0, 1.86, 0], s: [0.34, 0.3, 0.32] });
  vp(site, 'glow', G.box, CYAN, g, { p: [0, 1.9, 0.18], s: [0.26, 0.05, 0.05] });
}

/** The river gate: two gold pylons, a stepped arch and the scale anchors. */
function riverGate(site: Site): void {
  const f = gridFrame(site.api, site.gate, 0, 13);
  for (const sx of [-1, 1]) {
    bp(site, 'plate', G.box, f, { p: [sx * 3.5, -0.4, 0], s: [2.1, 1.0, 2.1] });
    bp(site, 'gold', G.box, f, { p: [sx * 3.5, 0.6, 0], s: [1.5, 5.2, 1.7] });
    bp(site, 'bronze', G.box, f, { p: [sx * 3.5, 5.8, 0], s: [1.72, 0.36, 1.92] });
    bp(site, 'gold', G.box, f, { p: [sx * 3.5, 6.16, 0], s: [1.36, 0.9, 1.56] });
    bp(site, 'gold', G.cone4, f, { p: [sx * 3.5, 7.06, 0], s: [1.1, 0.75, 1.3], r: [0, Math.PI / 4, 0] });
    vp(site, 'glow', G.sphere, GOLD_LIGHT, f, { p: [sx * 3.5, 7.9, 0], s: 0.2 });
    for (const sz of [-1, 1]) {
      const ff = faceFrame(f, sz > 0 ? 0 : Math.PI, 3.5, 0);
      // The two inner faces carry a cyan slot.
      vp(site, 'glow', G.box, CYAN, ff, { p: [sx * 0.76, 0.7, 0.04], s: [0.06, 3.6, 0.05] });
    }
    const inner = faceFrame(f, sx > 0 ? -Math.PI / 2 : Math.PI / 2, 3.5, 0);
    vp(site, 'glow', G.box, CYAN, inner, { p: [0, 0.8, 0.04], s: [0.5, 3.4, 0.05] });
    footprint(site.c, f, 1.1, [sx * 3.5, 0]);
    emit(site.c, f, 0xffd09a, 38, 16, [sx * 3.5, 2.2, 0.8]);
  }
  // Stepped arch across the opening.
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * 1.08;
    const y = 6.35 + Math.cos(((i - 3) / 3) * 0.72) * 0.18;
    bp(site, 'gold', G.box, f, { p: [x, y, 0], s: [1.12, 0.56, 1.2] });
    bp(site, 'bronze', G.box, f, { p: [x, y + 0.56, 0], s: [1.0, 0.2, 1.0] });
    vp(site, 'glow', G.box, GOLD_LIGHT, f, { p: [x, y - 0.02, 0.62], s: [0.9, 0.06, 0.05] });
    vp(site, 'glow', G.box, GOLD_LIGHT, f, { p: [x, y - 0.02, -0.62], s: [0.9, 0.06, 0.05] });
  }
  bp(site, 'gold', G.box, f, { p: [0, 6.98, 0], s: [1.4, 0.5, 1.36] });
  fanMotif(site, f, 0, 0.72, 7.48, 7, 0.95, 1.9);
  // Low balustrades running out from the gate to the city blocks.
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const x = sx * (5.2 + i * 1.7);
      bp(site, 'dark', G.box, f, { p: [x, -0.1, 0], s: [1.6, 1.2, 0.7] });
      bp(site, 'gold', G.box, f, { p: [x, 1.1, 0], s: [1.7, 0.15, 0.8] });
      vp(site, 'glow', G.box, WARM, f, { p: [x, 0.62, 0.37], s: [0.8, 0.05, 0.05] });
      footprint(site.c, f, 0.6, [x, 0]);
    }
  }
  sentry(site, gridFrame(site.api, site.gate, 2.2, 11.7), Math.PI);
  sentry(site, gridFrame(site.api, site.gate, -2.2, 11.7), Math.PI);
}

/** A small vehicle bay and a parked machine, another scale anchor. */
function vehicleBay(site: Site): void {
  const f = gridFrame(site.api, site.gate, 5.7, 9.2);
  bp(site, 'plate', G.box, f, { p: [0, -0.4, 0], s: [4.6, 1.0, 3.6] });
  bp(site, 'dark', G.box, f, { p: [0, 0.6, 0], s: [4.2, 2.8, 3.2] });
  bp(site, 'gold', G.box, f, { p: [0, 3.4, 0], s: [4.4, 0.32, 3.4] });
  bp(site, 'bronze', G.box, f, { p: [0, 3.72, 0], s: [3.4, 0.36, 2.6] });
  bp(site, 'gold', G.box, f, { p: [0, 4.08, 0], s: [2.4, 0.4, 1.8] });
  // Front opening on the avenue side, warm interior.
  vp(site, 'glow', G.box, 0xffc98a, f, { p: [0, 0.55, 1.62], s: [2.2, 2.1, 0.08] });
  bp(site, 'gold', G.box, f, { p: [0, 0.45, 1.66], s: [2.5, 0.16, 0.12] });
  bp(site, 'gold', G.box, f, { p: [0, 2.72, 1.66], s: [2.5, 0.16, 0.12] });
  for (const sx of [-1, 1]) {
    bp(site, 'gold', G.box, f, { p: [sx * 1.28, 0.5, 1.66], s: [0.14, 2.4, 0.12] });
  }
  footprint(site.c, f, 2.5);
  emit(site.c, f, 0xffbe7a, 32, 14, [0, 1.4, 1.5]);
  // A tiny parked vehicle and its mechanic, both at true scale.
  const vf = gridFrame(site.api, site.gate, 3.9, 7.4);
  bp(site, 'dark', G.box, vf, { p: [0, 0.2, 0], s: [2.3, 0.72, 1.1] });
  bp(site, 'gold', G.box, vf, { p: [0, 0.92, 0], s: [1.5, 0.5, 0.98] });
  bp(site, 'bronze', G.box, vf, { p: [0, 0.1, 0], s: [2.4, 0.2, 1.2] });
  vp(site, 'glow', G.box, CYAN, vf, { p: [1.05, 0.5, 0.4], s: [0.1, 0.14, 0.3] });
  footprint(site.c, vf, 1.2);
  sentry(site, gridFrame(site.api, site.gate, 4.6, 5.8), Math.PI / 2);
}

// ------------------------------------------------------------------- scatter

function scatterPlanter(c: Ctx, f: THREE.Matrix4): void {
  footprint(c, f, 0.8);
  part(c.solid, G.box, S_DARK, f, { p: [0, 0.1, 0], s: [1.5, 0.85, 1.5] });
  part(c.solid, G.box, S_GOLD, f, { p: [0, 0.95, 0], s: [1.62, 0.14, 1.62] });
  if (c.rng() < 0.5) part(c.glow, G.box, GOLD_LIGHT, f, { p: [0, 0.62, 0.76], s: [0.5, 0.05, 0.05] });
}

function scatterKiosk(c: Ctx, f: THREE.Matrix4): void {
  footprint(c, f, 0.7);
  part(c.solid, G.box, S_DARK, f, { p: [0, 0.1, 0], s: [1.3, 1.3, 1.3] });
  part(c.solid, G.box, S_GOLD, f, { p: [0, 1.4, 0], s: [1.42, 0.15, 1.42] });
  part(c.solid, G.cone4, S_GOLD, f, { p: [0, 1.55, 0], s: [1.2, 0.4, 1.2], r: [0, Math.PI / 4, 0] });
  part(c.night, G.box, S_CYAN, f, { p: [0, 0.85, 0.66], s: [0.7, 0.1, 0.05] });
}

function scatterPost(c: Ctx, f: THREE.Matrix4): void {
  footprint(c, f, 0.26);
  part(c.solid, G.cyl6, S_GOLD, f, { s: [0.15, 1.6, 0.15] });
  part(c.glow, G.box, GOLD_LIGHT, f, { p: [0, 1.62, 0], s: [0.24, 0.12, 0.24] });
  part(c.glow, G.sphere, 0xffd9a8, f, { p: [0, 1.8, 0], s: 0.1 });
}

function scatterLamp(c: Ctx, f: THREE.Matrix4): void {
  footprint(c, f, 0.28);
  part(c.solid, G.cyl6, S_GOLD, f, { s: [0.15, 2.8, 0.15] });
  part(c.solid, G.box, S_GOLD, f, { p: [0, 2.8, 0], s: [0.44, 0.12, 0.44] });
  part(c.glow, G.box, 0xffd9a8, f, { p: [0, 2.92, 0], s: [0.28, 0.2, 0.28] });
  emit(c, f, 0xffcf96, 16, 9, [0, 3.1, 0]);
}

// -------------------------------------------------------------------- build

function makeBatches(): Batches {
  return {
    gold: new PropBatch(),
    bronze: new PropBatch(),
    dark: new PropBatch(),
    plate: new PropBatch(),
    cyan: new PropBatch(),
    violet: new PropBatch()
  };
}

/** Material per batch. Glass is capped short of full transparency so the
 *  window matrix stays legible against the dark bodies. */
function attachBatches(site: Site): void {
  const cyan = energonGlass(CYAN);
  cyan.opacity = 0.8;
  cyan.emissiveIntensity = 1.25;
  const violet = energonGlass(VIOLET);
  violet.opacity = 0.8;
  violet.emissiveIntensity = 1.15;
  // The citadel sky is deliberately dark, so pure metalness would leave the
  // gold black. A little emissive warmth keeps the gilding readable in shade,
  // and the environment intensity is raised for the horizon band.
  const gold = brushedGold(GOLD);
  gold.metalness = 0.82;
  gold.roughness = 0.32;
  gold.envMapIntensity = 1.7;
  gold.emissive = new THREE.Color(0x6b4d10);
  gold.emissiveIntensity = 0.9;
  const bronze = brushedGold(GOLD_DEEP);
  bronze.metalness = 0.8;
  bronze.roughness = 0.36;
  bronze.envMapIntensity = 1.5;
  bronze.emissive = new THREE.Color(0x3a2608);
  bronze.emissiveIntensity = 0.95;
  const dark = circuitMetal(DARK, { strength: 0.06, scale: 0.5, color: 0xa8e0ff });
  dark.metalness = 0.78;
  dark.roughness = 0.46;
  dark.envMapIntensity = 1.8;
  dark.emissive = new THREE.Color(0x071020);
  dark.emissiveIntensity = 1.0;
  const plate = circuitMetal(DARK_PLATE, { strength: 0.04, scale: 0.45, color: 0x9fd0ff });
  plate.metalness = 0.75;
  plate.roughness = 0.5;
  plate.envMapIntensity = 1.6;
  plate.emissive = new THREE.Color(0x050b16);
  plate.emissiveIntensity = 0.9;
  const mats: Record<keyof Batches, THREE.Material> = {
    gold,
    bronze,
    dark,
    plate,
    cyan,
    violet
  };
  for (const key of Object.keys(site.b) as (keyof Batches)[]) {
    const mesh = site.b[key].build(mats[key]);
    if (!mesh) continue;
    mesh.name = `citadel-${key}`;
    const glass = key === 'cyan' || key === 'violet';
    // The ceiling plate must not shadow the whole city: the reference lets key
    // light pour down through the district. Hanging parts still cast.
    mesh.castShadow = !glass && key !== 'plate';
    mesh.receiveShadow = !glass && key !== 'gold' && key !== 'bronze';
    site.api.addDynamic(mesh, () => {});
  }
}

export const citadelZone: ZoneModule = {
  id: 'citadel',
  build(api) {
    const c = api.ctx;
    const gate = riverBearing();
    const site: Site = { api, c, b: makeBatches(), gate, tris: 0 };

    // Keep the beacon itself and the robot's stand spot free of random props.
    api.exclude(0, 0, 3.3);
    api.exclude(4, -4, 2.2);
    // The whole inner city is hand-built; scatter belongs outside the ring.
    api.exclude(0, 0, 15.9);

    // 1. The gold centrepiece.
    const centre = gridFrame(api, gate, 0, 0);
    plaza(site, centre);
    crownPiers(site, centre);
    crownCanopy(site, centre);
    crownSpire(site, centre);
    spireOrbit(api, centre);

    // 2. The city fabric and its skybridges.
    for (const t of CITY) cityTower(site, t);
    skybridge(site, CITY[0], CITY[2], 6.4);
    skybridge(site, CITY[1], CITY[3], 6.4);
    skybridge(site, CITY[2], CITY[4], 6.0);
    skybridge(site, CITY[3], CITY[5], 5.8);
    skybridge(site, CITY[4], CITY[6], 5.4);
    skybridge(site, CITY[5], CITY[7], 5.6);
    skybridge(site, CITY[0], CITY[1], 5.2);

    // 3. The signature inverted district.
    invertedDistrict(site);

    // 4. Street level: avenue, gate, bay, anchors.
    avenue(site);
    riverGate(site);
    vehicleBay(site);

    attachBatches(site);
    console.log(`[citadel] ${Math.round(site.tris)} triangles in the citadel batches, piers at ${PIER_R}`);
  },
  scatter: [
    { p: 0.026, build: scatterPlanter },
    { p: 0.018, build: scatterKiosk },
    { p: 0.03, build: scatterPost },
    { p: 0.014, build: scatterLamp }
  ]
};
