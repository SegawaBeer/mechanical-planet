// Iron Citadel zone (铁堡): a stronghold city of tiered metal towers.
// Owned by the "citadel" session.

import * as THREE from 'three';
import { emit, footprint, G, part, rnd, type Ctx } from '../kit';
import { biomeById } from '../biomes';
import { tangentBasis } from '../planet';
import type { ZoneApi, ZoneModule } from './types';

// Silver-blue steel with darker trim; windows burn cyan or warm amber.
const STEEL_L = 0xd6e5f4;
const STEEL = 0xbcd1e4;
const STEEL_M = 0x9fb6cd;
const STEEL_D = 0x7e95ad;
const TRIM = 0x586c82;
const IRON = 0x3e4d5e;
const DECK = 0x94a9bf;
const CYAN = 0x63e8ff;
const AMBER = 0xffb464;

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

/** Ground frame at a bearing (radians from north) and distance from the centre. */
function atBearing(api: ZoneApi, bearing: number, dist: number, yaw = 0, lift = 0): THREE.Matrix4 {
  return api.at(Math.sin(bearing) * dist, Math.cos(bearing) * dist, yaw + bearing, lift);
}

// ------------------------------------------------------------------ towers

type TowerSpec = {
  bearing: number;
  dist: number;
  h: number;
  w: number;
  style: 'keep' | 'drum';
  window: number;
  /** Skip the static antenna, for the tower that carries the rotating radar. */
  mast?: boolean;
};

type Built = {
  east: number;
  north: number;
  frame: THREE.Matrix4;
  /** World point where a walkway meets this tower. */
  shoulder: THREE.Vector3;
  /** Height of the crown above the tower's own ground, for the radar. */
  top: number;
};

/** A thin lit band wrapped round all four faces of a square tier. */
function band(c: Ctx, f: THREE.Matrix4, y: number, w: number, sy: number, col: number): void {
  const e = w / 2 + 0.035;
  const len = w * 0.78;
  part(c.night, G.box, col, f, { p: [0, y, e], s: [len, sy, 0.07] });
  part(c.night, G.box, col, f, { p: [0, y, -e], s: [len, sy, 0.07] });
  part(c.night, G.box, col, f, { p: [e, y, 0], s: [0.07, sy, len] });
  part(c.night, G.box, col, f, { p: [-e, y, 0], s: [0.07, sy, len] });
}

/** A thin lit line round all four faces of a square tier, under a ledge. */
function edgeLight(c: Ctx, f: THREE.Matrix4, y: number, w: number, col: number): void {
  const e = w / 2 + 0.03;
  part(c.glow, G.box, col, f, { p: [0, y, e], s: [w * 0.97, 0.05, 0.06] });
  part(c.glow, G.box, col, f, { p: [0, y, -e], s: [w * 0.97, 0.05, 0.06] });
  part(c.glow, G.box, col, f, { p: [e, y, 0], s: [0.06, 0.05, w * 0.97] });
  part(c.glow, G.box, col, f, { p: [-e, y, 0], s: [0.06, 0.05, w * 0.97] });
}

/** Square stepped keep: four narrowing tiers, ledges, crown pyramid and mast. */
function keepTower(c: Ctx, f: THREE.Matrix4, s: TowerSpec): number {
  const { h, w } = s;
  const base = 0.55;
  const usable = h * 0.74;
  const tiers: [number, number, number][] = [
    [0.0, 0.46, 1.0],
    [0.46, 0.74, 0.79],
    [0.74, 0.9, 0.62],
    [0.9, 1.0, 0.48]
  ];
  for (let i = 0; i < tiers.length; i++) {
    const [a, b, k] = tiers[i];
    const y = base + a * usable;
    const th = (b - a) * usable;
    const sw = w * k;
    part(c.solid, G.box, i % 2 === 0 ? STEEL : STEEL_M, f, { p: [0, y, 0], s: [sw, th, sw] });
    // Dark seam at the foot of every tier, a wider lit ledge at its top.
    part(c.solid, G.box, TRIM, f, { p: [0, y, 0], s: [sw * 1.05, 0.16, sw * 1.05] });
    part(c.solid, G.box, i === 0 ? IRON : TRIM, f, { p: [0, y + th - 0.2, 0], s: [sw * 1.13, 0.22, sw * 1.13] });
    edgeLight(c, f, y + th + 0.02, sw * 1.13, s.window);
    if (i < 3) band(c, f, y + th * 0.55, sw, 0.17, s.window);
    // Vertical window slits down each face of the lower tiers.
    if (i < 2) {
      const e = sw / 2 + 0.03;
      for (const u of [-0.3, 0, 0.3]) {
        part(c.night, G.box, s.window, f, { p: [sw * u, y + th * 0.3, e], s: [sw * 0.07, th * 0.34, 0.05] });
        part(c.night, G.box, s.window, f, { p: [sw * u, y + th * 0.3, -e], s: [sw * 0.07, th * 0.34, 0.05] });
        part(c.night, G.box, s.window, f, { p: [e, y + th * 0.3, sw * u], s: [0.05, th * 0.34, sw * 0.07] });
        part(c.night, G.box, s.window, f, { p: [-e, y + th * 0.3, sw * u], s: [0.05, th * 0.34, sw * 0.07] });
      }
    }
    if (i === 1) {
      // A darker shutter column down each face.
      const e = sw / 2 + 0.04;
      part(c.solid, G.box, IRON, f, { p: [0, y + th * 0.5, e], s: [sw * 0.2, th * 0.7, 0.06] });
      part(c.solid, G.box, IRON, f, { p: [e, y + th * 0.5, 0], s: [0.06, th * 0.7, sw * 0.2] });
    }
  }
  // Buttresses splayed against each face of the base tier.
  for (const [px, pz, rx, rz] of [
    [0, w * 0.5, 0.32, 0],
    [0, -w * 0.5, -0.32, 0],
    [w * 0.5, 0, 0, -0.32],
    [-w * 0.5, 0, 0, 0.32]
  ]) {
    part(c.solid, G.box, STEEL_D, f, { p: [px, 0.4, pz], s: [w * 0.42, usable * 0.38, 0.42], r: [rx, 0, rz] });
  }
  // Corner spires on the top ledge.
  const cw = w * 0.48;
  const ledgeY = base + usable * 0.9;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      part(c.solid, G.box, STEEL_D, f, { p: [sx * cw * 0.4, ledgeY, sz * cw * 0.4], s: [cw * 0.24, 0.75, cw * 0.24] });
      part(c.glow, G.box, s.window, f, { p: [sx * cw * 0.4, ledgeY + 0.62, sz * cw * 0.4], s: [cw * 0.14, 0.08, cw * 0.14] });
    }
  }
  // Pyramid crown, then mast and glowing tip.
  const crownY = base + usable;
  const crownH = h * 0.07;
  part(c.solid, G.cone4, STEEL_L, f, { p: [0, crownY - 0.05, 0], s: [w * 0.62, crownH, w * 0.62], r: [0, Math.PI / 4, 0] });
  if (s.mast === false) return crownY + crownH;
  const mastY = crownY + crownH - 0.05;
  part(c.solid, G.cyl6, IRON, f, { p: [0, mastY, 0], s: [0.17, h * 0.12, 0.17] });
  part(c.solid, G.box, TRIM, f, { p: [0, mastY + h * 0.09, 0], s: [0.75, 0.09, 0.1] });
  part(c.glow, G.sphere, s.window, f, { p: [0, mastY + h * 0.12, 0], s: 0.26 });
  return mastY + h * 0.12 + 0.13;
}

/** Round drum tower: tapered shaft with lit rings, cooling fins and a cone crown. */
function drumTower(c: Ctx, f: THREE.Matrix4, s: TowerSpec): number {
  const { h, w } = s;
  part(c.solid, G.cyl8, STEEL_M, f, { p: [0, 0.5, 0], s: [w * 1.32, h * 0.2, w * 1.32] });
  part(c.solid, G.cyl8, TRIM, f, { p: [0, 0.5 + h * 0.2, 0], s: [w * 1.42, 0.24, w * 1.42] });
  const shaftY = 0.5 + h * 0.2 + 0.24;
  const shaftH = h * 0.56;
  part(c.solid, G.taper8, STEEL, f, { p: [0, shaftY, 0], s: [w * 1.08, shaftH, w * 1.08] });
  for (let i = 1; i <= 3; i++) {
    const k = i / 4;
    const ww = w * 1.08 * (1 - 0.28 * k) * 1.03;
    part(c.night, G.cyl8, s.window, f, { p: [0, shaftY + shaftH * k, 0], s: [ww, 0.15, ww] });
    part(c.solid, G.cyl8, TRIM, f, { p: [0, shaftY + shaftH * k + 0.16, 0], s: [ww * 1.04, 0.09, ww * 1.04] });
    part(c.glow, G.cyl8, s.window, f, { p: [0, shaftY + shaftH * k + 0.26, 0], s: [ww * 1.06, 0.04, ww * 1.06] });
  }
  // Vertical fins around the base.
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    part(c.solid, G.box, STEEL_D, f, {
      p: [Math.sin(a) * w * 0.58, 0.5, Math.cos(a) * w * 0.58],
      s: [0.26, h * 0.3, 0.55],
      r: [0, a, 0]
    });
  }
  const collarY = shaftY + shaftH;
  part(c.solid, G.cyl8, STEEL_D, f, { p: [0, collarY, 0], s: [w * 0.92, h * 0.05, w * 0.92] });
  part(c.solid, G.cone8, STEEL_L, f, { p: [0, collarY + h * 0.05, 0], s: [w * 0.86, h * 0.13, w * 0.86] });
  const mastY = collarY + h * 0.18;
  part(c.solid, G.cyl6, IRON, f, { p: [0, mastY, 0], s: [0.15, h * 0.07, 0.15] });
  part(c.glow, G.sphere, s.window, f, { p: [0, mastY + h * 0.07, 0], s: 0.24 });
  return mastY + h * 0.07 + 0.12;
}

function buildTower(c: Ctx, api: ZoneApi, s: TowerSpec): Built {
  const east = Math.sin(s.bearing) * s.dist;
  const north = Math.cos(s.bearing) * s.dist;
  const f = api.at(east, north, s.bearing + 0.12);
  // Foundation sunk into the stepped ground so no gap shows under the base.
  part(c.solid, G.cyl8, IRON, f, { p: [0, -0.5, 0], s: [s.w * 1.5, 1.0, s.w * 1.5] });
  part(c.solid, G.cyl8, TRIM, f, { p: [0, 0.15, 0], s: [s.w * 1.38, 0.4, s.w * 1.38] });
  footprint(c, f, s.w * 0.62);
  api.exclude(east, north, s.w * 1.05);
  const top = s.style === 'drum' ? drumTower(c, f, s) : keepTower(c, f, s);
  emit(c, f, s.window, 26, 11, [0, 1.4, s.w * 0.62], { flicker: 0.08 });
  const deckY = s.h * 0.62;
  return { east, north, frame: f, shoulder: new THREE.Vector3(0, deckY, 0).applyMatrix4(f), top };
}

// ----------------------------------------------------------------- bridges

/** A lit walkway between two tower shoulders. Visual only; nothing walks on it. */
function walkway(c: Ctx, api: ZoneApi, a: Built, b: Built): void {
  const f = api.at((a.east + b.east) / 2, (a.north + b.north) / 2, 0);
  // Tower shoulders in the midpoint's own frame, so the span follows the curve.
  const inv = f.clone().invert();
  const pa = a.shoulder.clone().applyMatrix4(inv);
  const pb = b.shoulder.clone().applyMatrix4(inv);
  const dx = pb.x - pa.x;
  const dz = pb.z - pa.z;
  const len = Math.hypot(dx, dz);
  const rot = -Math.atan2(dz, dx);
  const mx = (pa.x + pb.x) / 2;
  const mz = (pa.z + pb.z) / 2;
  const y = Math.min(pa.y, pb.y) + 0.3;
  const sx = Math.sin(rot);
  const sz = Math.cos(rot);
  part(c.solid, G.box, DECK, f, { p: [mx, y, mz], s: [len + 1.4, 0.3, 2.3], r: [0, rot, 0] });
  part(c.solid, G.box, TRIM, f, { p: [mx, y - 0.32, mz], s: [len, 0.24, 1.5], r: [0, rot, 0] });
  for (const side of [-1, 1]) {
    part(c.solid, G.box, TRIM, f, {
      p: [mx + sx * side * 1.1, y + 0.52, mz + sz * side * 1.1],
      s: [len + 1.4, 0.44, 0.12],
      r: [0, rot, 0]
    });
    part(c.glow, G.box, CYAN, f, {
      p: [mx + sx * side * 1.16, y + 0.78, mz + sz * side * 1.16],
      s: [len, 0.06, 0.06],
      r: [0, rot, 0]
    });
  }
  // Truss struts hanging under the deck.
  for (const k of [-0.32, 0, 0.32]) {
    part(c.solid, G.box, STEEL_D, f, { p: [mx + dx * k, y - 0.75, mz + dz * k], s: [0.22, 0.9, 0.22], r: [0, rot, 0] });
  }
  // Fill the height gap up to the taller shoulder.
  const diff = pb.y - pa.y;
  if (Math.abs(diff) > 0.35) {
    const hp = diff > 0 ? pb : pa;
    part(c.solid, G.box, STEEL_D, f, { p: [hp.x, y, hp.z], s: [2.1, Math.abs(diff) + 0.4, 2.1] });
  }
}

// -------------------------------------------------------------------- gate

/** Arched gate facing the river zone, with pylons and a lit arch ring. */
function gate(c: Ctx, api: ZoneApi, bearing: number, dist: number): void {
  const f = atBearing(api, bearing, dist, 0);
  const pil = 2.35;
  api.exclude(Math.sin(bearing) * dist, Math.cos(bearing) * dist, 4.4);
  for (const sx of [-1, 1]) {
    footprint(c, f, 0.95, [sx * pil, 0]);
    // Stepped footing, shaft, cap and spire.
    part(c.solid, G.box, IRON, f, { p: [sx * pil, -0.3, 0], s: [1.5, 0.9, 2.0] });
    part(c.solid, G.box, STEEL_M, f, { p: [sx * pil, 0.5, 0], s: [1.1, 4.1, 1.7] });
    part(c.solid, G.box, TRIM, f, { p: [sx * pil, 0.5, 0], s: [1.18, 0.3, 1.78] });
    // Lit slot up the inner face of each pylon.
    part(c.night, G.box, AMBER, f, { p: [sx * (pil - 0.57), 2.3, 0], s: [0.06, 1.5, 0.5] });
    part(c.night, G.box, AMBER, f, { p: [sx * pil, 2.5, 0.87], s: [0.6, 0.14, 0.06] });
    part(c.solid, G.box, STEEL_D, f, { p: [sx * pil, 4.6, 0], s: [1.35, 0.34, 1.95] });
    part(c.solid, G.cone4, STEEL_L, f, { p: [sx * pil, 4.94, 0], s: [1.15, 0.9, 1.5], r: [0, Math.PI / 4, 0] });
    part(c.glow, G.sphere, AMBER, f, { p: [sx * pil, 5.95, 0], s: 0.24 });
    emit(c, f, AMBER, 24, 11, [sx * pil, 2.4, 0.9]);
  }
  // Glowing sill on the ground line between the pylons.
  part(c.solid, G.box, IRON, f, { p: [0, -0.2, 0], s: [pil * 2 + 1.2, 0.55, 2.2] });
  part(c.glow, G.box, CYAN, f, { p: [0, 0.33, 0], s: [pil * 2 - 1.1, 0.05, 1.5] });
  // Arch: boxes laid along a half-ellipse across the opening.
  const steps = 7;
  for (let i = 0; i < steps; i++) {
    const a0 = -Math.PI / 2 + (i / steps) * Math.PI;
    const a1 = -Math.PI / 2 + ((i + 1) / steps) * Math.PI;
    const am = (a0 + a1) / 2;
    const x = Math.sin(am) * pil;
    const yy = 4.35 + Math.cos(am) * 1.15;
    const ang = Math.atan2(-1.15 * Math.sin(am), pil * Math.cos(am));
    part(c.solid, G.box, STEEL_M, f, { p: [x, yy, 0], s: [0.86, 0.42, 1.7], r: [0, 0, ang] });
    part(c.glow, G.box, CYAN, f, { p: [x, yy - 0.26, 1.16], s: [0.7, 0.08, 0.06], r: [0, 0, ang] });
    part(c.glow, G.box, CYAN, f, { p: [x, yy - 0.26, -1.16], s: [0.7, 0.08, 0.06], r: [0, 0, ang] });
  }
  part(c.solid, G.box, STEEL_D, f, { p: [0, 5.25, 0], s: [1.3, 0.5, 1.9] });
  // Short walls running out from each pylon.
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const px = sx * (pil + 1.2 + i * 1.9);
      footprint(c, f, 0.7, [px, 0]);
      part(c.solid, G.box, STEEL_D, f, { p: [px, -0.1, 0], s: [1.85, 1.35 + (i % 2) * 0.25, 0.85] });
      part(c.solid, G.box, TRIM, f, { p: [px, 1.25 + (i % 2) * 0.25, 0], s: [1.95, 0.18, 0.95] });
      if (i === 1) part(c.night, G.box, AMBER, f, { p: [px, 0.75, 0.44], s: [0.7, 0.12, 0.06] });
    }
  }
}

// -------------------------------------------------------------- ground kit

/** Low paving slab on the avenue. Sunk deep enough to swallow the terrace steps. */
function slab(c: Ctx, f: THREE.Matrix4, w = 2.6, d = 2.0): void {
  part(c.solid, G.box, STEEL_D, f, { p: [0, -0.5, 0], s: [w, 0.72, d] });
  part(c.solid, G.box, TRIM, f, { p: [0, 0.16, 0], s: [w * 0.96, 0.06, d * 0.96] });
}

/** Flush plaza plate with a segmental rim; low enough to walk over. */
function plaza(c: Ctx, f: THREE.Matrix4, rad: number): void {
  part(c.solid, G.cyl8, STEEL_D, f, { p: [0, -0.66, 0], s: [rad * 2, 0.72, rad * 2] });
  // Ring of light round the plaza edge, not a filled disc: the beacon owns the middle.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    part(c.glow, G.box, CYAN, f, {
      p: [Math.sin(a) * rad * 0.82, 0.04, Math.cos(a) * rad * 0.82],
      s: [rad * 0.34, 0.04, 0.1],
      r: [0, a, 0]
    });
  }
  // Rim blocks, kept out of the three avenue mouths at 0, 120 and 240 degrees.
  for (const arc of [60, 180, 300]) {
    for (const k of [-1, 0, 1]) {
      const a = ((arc + k * 17) * Math.PI) / 180;
      part(c.solid, G.box, TRIM, f, {
        p: [Math.sin(a) * rad * 0.93, 0, Math.cos(a) * rad * 0.93],
        s: [rad * 0.58, 0.46, 0.5],
        r: [0, a, 0]
      });
    }
  }
}

/** Light post for the avenues. */
function lightPost(c: Ctx, f: THREE.Matrix4, col: number): void {
  footprint(c, f, 0.3);
  part(c.solid, G.cyl6, IRON, f, { s: [0.19, 2.5, 0.19] });
  part(c.solid, G.cyl8, TRIM, f, { p: [0, 0, 0], s: [0.42, 0.24, 0.42] });
  part(c.solid, G.box, TRIM, f, { p: [0, 2.5, 0], s: [0.62, 0.13, 0.62] });
  part(c.glow, G.box, col, f, { p: [0, 2.63, 0], s: [0.34, 0.14, 0.34] });
  part(c.glow, G.sphere, col, f, { p: [0, 2.82, 0], s: 0.16 });
  emit(c, f, col, 18, 9, [0, 2.8, 0]);
}

/** Low wall of three segments, with a gap through the middle. */
function coverWall(c: Ctx, api: ZoneApi, bearing: number, dist: number): void {
  const f = api.at(Math.sin(bearing) * dist, Math.cos(bearing) * dist, bearing);
  api.exclude(Math.sin(bearing) * dist, Math.cos(bearing) * dist, 3);
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 2; i++) {
      const px = sx * (1.5 + i * 2.5);
      footprint(c, f, 0.85, [px, 0]);
      const hgt = 1.25 + (i % 2) * 0.2;
      part(c.solid, G.box, STEEL_M, f, { p: [px, -0.2, 0], s: [2.45, hgt + 0.2, 0.7] });
      part(c.solid, G.box, TRIM, f, { p: [px, hgt, 0], s: [2.55, 0.16, 0.8] });
      if (i === 0) part(c.night, G.box, sx > 0 ? CYAN : AMBER, f, { p: [px, 0.55, 0.37], s: [1.4, 0.1, 0.05] });
    }
  }
}

/** Barricade block: an angled bar on a plinth. */
function barricade(c: Ctx, api: ZoneApi, bearing: number, dist: number): void {
  const f = atBearing(api, bearing, dist, 0.4);
  footprint(c, f, 1.0);
  part(c.solid, G.box, IRON, f, { p: [0, -0.2, 0], s: [2.1, 0.6, 0.9] });
  part(c.solid, G.box, STEEL_M, f, { p: [0, 0.3, 0], s: [1.9, 0.55, 0.7], r: [0, 0, 0.16] });
  part(c.solid, G.box, TRIM, f, { p: [0.35, 0.82, 0], s: [1.2, 0.16, 0.55], r: [0, 0, 0.16] });
  if (api.ctx.rng() < 0.5) part(c.night, G.box, CYAN, f, { p: [-0.3, 0.42, 0.36], s: [0.8, 0.09, 0.05], r: [0, 0, 0.16] });
}

// ------------------------------------------------------------ moving piece

/** Slowly turning radar dish on the tallest tower. */
function radar(api: ZoneApi, t: Built): void {
  const f = t.frame;
  const pos = new THREE.Vector3(0, t.top, 0).applyMatrix4(f);
  const up = new THREE.Vector3().setFromMatrixColumn(f, 1).normalize();
  const body = new THREE.Group();
  body.position.copy(pos);
  body.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);

  const steel = new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.7, roughness: 0.35, flatShading: true, side: THREE.DoubleSide });
  const trim = new THREE.MeshStandardMaterial({ color: TRIM, metalness: 0.5, roughness: 0.6, flatShading: true });

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.6, 6), trim);
  mast.position.y = 0.8;
  body.add(mast);

  const spin = new THREE.Group();
  spin.position.y = 1.5;
  body.add(spin);

  const yoke = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.24), trim);
  spin.add(yoke);

  const dish = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.62, 12, 1, true), steel);
  dish.rotation.x = Math.PI; // open mouth upward
  dish.position.y = 0.38;
  const tilt = new THREE.Group();
  tilt.rotation.x = -0.55;
  tilt.position.y = 0.15;
  tilt.add(dish);
  spin.add(tilt);

  const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 4), trim);
  feed.position.y = 0.5;
  tilt.add(feed);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 6),
    new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false })
  );
  beacon.position.set(0, 1.34, 0);
  spin.add(beacon);

  api.addDynamic(body, (dt, time) => {
    spin.rotation.y += dt * 0.45;
    const pulse = 0.8 + Math.sin(time * 2.4) * 0.25;
    beacon.scale.setScalar(pulse);
  });
}

// ---------------------------------------------------------------- scatter

function scatterCrate(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.7, 1.05);
  footprint(c, f, s * 0.55);
  part(c.solid, G.box, STEEL_M, f, { s: [s, s * 0.85, s] });
  part(c.solid, G.box, TRIM, f, { p: [0, 0.04, 0], s: [s * 1.03, 0.1, s * 1.03] });
  part(c.solid, G.box, TRIM, f, { p: [0, s * 0.85 - 0.06, 0], s: [s * 1.03, 0.1, s * 1.03] });
  if (c.rng() < 0.4) part(c.night, G.box, AMBER, f, { p: [0, s * 0.42, s * 0.52], s: [s * 0.4, 0.07, 0.05] });
}

function scatterCover(c: Ctx, f: THREE.Matrix4): void {
  const l = rnd(c, 1.3, 2.1);
  footprint(c, f, 0.62, [-l * 0.28, 0]);
  footprint(c, f, 0.62, [l * 0.28, 0]);
  part(c.solid, G.box, STEEL_D, f, { p: [0, -0.15, 0], s: [l, 0.95, 0.6] });
  part(c.solid, G.box, TRIM, f, { p: [0, 0.8, 0], s: [l * 1.04, 0.16, 0.7] });
}

function scatterPipe(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.6, 1.3);
  footprint(c, f, 0.4);
  part(c.solid, G.cyl8, STEEL_D, f, { s: [0.48, h, 0.48] });
  part(c.solid, G.cyl8, TRIM, f, { p: [0, h - 0.08, 0], s: [0.6, 0.16, 0.6] });
  part(c.solid, G.box, STEEL_M, f, { p: [0, h, 0], s: [0.46, 0.26, 0.46] });
  if (c.rng() < 0.5) {
    part(c.solid, G.box, STEEL_D, f, { p: [0.36, h * 0.72, 0], s: [0.8, 0.26, 0.26] });
    part(c.glow, G.box, CYAN, f, { p: [0, h - 0.02, 0.25], s: [0.3, 0.04, 0.04] });
  }
}

function scatterLamp(c: Ctx, f: THREE.Matrix4): void {
  lightPost(c, f, c.rng() < 0.6 ? CYAN : AMBER);
}

export const citadelZone: ZoneModule = {
  id: 'citadel',
  build(api) {
    const c = api.ctx;
    const gateBearing = riverBearing();

    api.exclude(0, 0, 3.4);
    api.exclude(4, -4, 2.4);

    // Ring of six towers, tallest beside the main avenue.
    const specs: TowerSpec[] = [
      { bearing: gateBearing + (30 * Math.PI) / 180, dist: 10.5, h: 11.0, w: 3.8, style: 'keep', window: CYAN },
      { bearing: gateBearing + (90 * Math.PI) / 180, dist: 9.0, h: 15.5, w: 3.6, style: 'keep', window: CYAN, mast: false },
      { bearing: gateBearing + (150 * Math.PI) / 180, dist: 12.0, h: 9.5, w: 4.2, style: 'drum', window: AMBER },
      { bearing: gateBearing + (210 * Math.PI) / 180, dist: 11.0, h: 12.5, w: 4.0, style: 'keep', window: AMBER },
      { bearing: gateBearing + (270 * Math.PI) / 180, dist: 9.5, h: 8.0, w: 3.9, style: 'drum', window: CYAN },
      { bearing: gateBearing + (330 * Math.PI) / 180, dist: 12.5, h: 13.5, w: 4.1, style: 'keep', window: CYAN }
    ];
    const built = specs.map((s) => buildTower(c, api, s));

    // Walkways between neighbouring towers.
    walkway(c, api, built[0], built[5]);
    walkway(c, api, built[1], built[2]);
    walkway(c, api, built[3], built[4]);

    // Arched gate on the river side, at the head of the main avenue.
    gate(c, api, gateBearing, 13.0);

    // Main avenue: paving and light posts from the gate to the centre plaza.
    const avenue = gateBearing;
    for (let d = 4.2; d <= 12.2; d += 2.1) {
      slab(c, api.at(Math.sin(avenue) * d, Math.cos(avenue) * d, avenue), 3.0, 2.0);
    }
    for (const side of [-1, 1]) {
      for (const d of [4.6, 7.2, 9.8, 12.0]) {
        const lat = side * 2.3;
        lightPost(
          c,
          api.at(
            Math.sin(avenue) * d + Math.cos(avenue) * lat,
            Math.cos(avenue) * d - Math.sin(avenue) * lat,
            avenue
          ),
          AMBER
        );
      }
    }

    // Two lesser avenues with their own paving and lamps.
    for (const off of [120, 240]) {
      const b = gateBearing + (off * Math.PI) / 180;
      for (let d = 4.6; d <= 11.4; d += 2.2) {
        slab(c, api.at(Math.sin(b) * d, Math.cos(b) * d, b), 2.4, 1.9);
      }
      for (const d of [6.0, 9.0]) {
        lightPost(c, api.at(Math.sin(b) * d, Math.cos(b) * d, b), CYAN);
      }
    }

    // Centre plaza and the plinths at the foot of each tower-facing approach.
    plaza(c, api.at(0, 0, gateBearing), 4.6);
    for (const spec of specs) {
      const p = atBearing(api, spec.bearing, spec.dist - spec.w * 0.95, 0);
      part(c.solid, G.box, STEEL_D, p, { p: [0, -0.35, 0], s: [spec.w * 0.9, 0.8, spec.w * 0.5] });
      part(c.solid, G.box, TRIM, p, { p: [0, 0.3, 0], s: [spec.w * 0.95, 0.14, spec.w * 0.56] });
    }

    // Low cover walls between towers, clear of all three avenues.
    for (const off of [60, 180, 300]) coverWall(c, api, gateBearing + (off * Math.PI) / 180, 14.2);
    for (const [off, d] of [
      [48, 6.6],
      [66, 7.4],
      [104, 5.8],
      [136, 7.2],
      [176, 6.8],
      [196, 7.5],
      [224, 6.5],
      [256, 6.4],
      [288, 6.7],
      [312, 7.0]
    ]) {
      barricade(c, api, gateBearing + (off * Math.PI) / 180, d);
    }

    // Rotating radar on the tallest tower.
    radar(api, built[1]);
  },
  scatter: [
    { p: 0.028, build: scatterCrate },
    { p: 0.032, build: scatterCover },
    { p: 0.02, build: scatterPipe },
    { p: 0.008, build: scatterLamp }
  ]
};

