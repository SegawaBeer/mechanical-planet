import * as THREE from 'three';
import { deriveSeed, fbm3, seededRng } from './noise';
import { resetRoads, roadDeckHeight } from './roads';
import type { PlanetProfile } from './space';

export type BiomeId = 'river' | 'citadel' | 'ark' | 'fortress' | 'ocean';

export type Biome = {
  id: BiomeId;
  /** Display name shown in the bottom-left caption. */
  name: string;
  /** Category label, for example ENERGY RIVER. */
  kind: string;
  /** Two-digit ordinal shown next to the category. */
  index: string;
  tagline: string;
  /** Unit vector pointing at the zone's heart on the sphere. */
  center: THREE.Vector3;
  /** Plate palette, one to five metals. Any length: the ark uses a full
   * dopamine patchwork, the others two or three tones of one metal. */
  ground: readonly number[];
  /** Rare plates in the zone's signature colour. */
  accent: number;
  /** Metal at the lip of a river channel. */
  beach: number;
  /** Colour of the seam between two plates. */
  seam: number;
};

function dir(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z).normalize();
}

/**
 * The four corners of a regular tetrahedron. Four points cannot be spread any
 * more evenly than this: every pair is 109.47 degrees apart (80.25 surface
 * units on this planet), and the Voronoi cell of each corner is exactly a
 * quarter of the sphere. The zone centres start here and `layoutBiomes` only
 * rotates the tetrahedron, so the four continents stay equal in size.
 */
const TETRA: readonly THREE.Vector3[] = [
  dir(1, 1, 1),
  dir(1, -1, -1),
  dir(-1, 1, -1),
  dir(-1, -1, 1)
];

export const BIOMES: Biome[] = [
  {
    id: 'river',
    name: '能量河流',
    kind: 'ENERGY RIVER',
    index: '01',
    tagline: '星球的能量脉络在峡谷间奔流。',
    center: TETRA[0].clone(),
    // Cold steel teal: the metal that the river canyons cut through.
    ground: [0x6ea4ac, 0x93c4c6, 0x537c85],
    accent: 0x2fe6ff,
    beach: 0x5aa0a8,
    seam: 0x3f7980
  },
  {
    id: 'citadel',
    name: '铁堡',
    kind: 'IRON CITADEL',
    index: '02',
    tagline: '层层塔楼守着最后的灯火。',
    center: TETRA[1].clone(),
    // Sunny silver-white, with a gold plate now and then for warmth.
    ground: [0xeae8e2, 0xd4d8d7, 0xb7bcba, 0xe3b552],
    accent: 0xffd98a,
    beach: 0xb3a488,
    seam: 0x8d8574
  },
  {
    id: 'ark',
    name: '方舟号',
    kind: 'ARK DOCK',
    index: '03',
    tagline: '沉睡的巨舰半埋在大地里。',
    center: TETRA[2].clone(),
    // Dopamine patchwork: five saturated plates, picked at random.
    ground: [0xff5d8f, 0xff9f43, 0xffd93d, 0x3ddbb5, 0x4d7cff],
    accent: 0xfff0f4,
    beach: 0xd9c2a8,
    seam: 0x8a4a72
  },
  {
    id: 'fortress',
    name: '暗影要塞',
    kind: 'SHADOW FORTRESS',
    index: '04',
    tagline: '越靠近，越危险。',
    center: TETRA[3].clone(),
    // Purple black with magenta-lit seams.
    ground: [0x2b2135, 0x3d2c4f, 0x241b2e],
    accent: 0xff2f8a,
    beach: 0x4a2f56,
    seam: 0xff2f8a
  }
];

/** The energy water: the river that cuts the river zone, and its pools. */
export const OCEAN: Biome = {
  id: 'ocean',
  name: '能量河',
  kind: 'ENERGY FLOW',
  index: '00',
  tagline: '流动的星球血脉。',
  center: dir(0, -1, 0),
  ground: [0x16222b, 0x1b2a34, 0x121d25],
  accent: 0x121d25,
  beach: 0x121d25,
  seam: 0x0d151c
};

const LAND_BIOMES = BIOMES;

/** Kept for the profile hook in `planet.ts`; there is only one planet now. */
export function configureBiomeOcean(profile: PlanetProfile): void {
  void profile;
}

/** Uniformly random unit direction. */
function randomDir(rng: () => number, out: THREE.Vector3): THREE.Vector3 {
  const z = rng() * 2 - 1;
  const phi = rng() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return out.set(r * Math.cos(phi), r * Math.sin(phi), z);
}

/** Seed of the river network, set by `layoutBiomes`. */
let riverSeed = 1;

/**
 * Turn the tetrahedron to a seed-derived orientation and give the corners to
 * the zones in a seed-derived order. The shape does not change, so the four
 * zones stay equal quarters of the sphere and equally far apart; only which
 * direction each zone faces changes from one planet to the next.
 * Call before generating anything.
 */
export function layoutBiomes(seed: number): void {
  const rng = seededRng(deriveSeed(seed, 2));
  const axis = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1);
  if (axis.lengthSq() < 1e-4) axis.set(0.3, 1, 0.2);
  axis.normalize();
  const turn = new THREE.Quaternion().setFromAxisAngle(axis, rng() * Math.PI * 2);
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  LAND_BIOMES.forEach((b, i) => b.center.copy(TETRA[order[i]]).applyQuaternion(turn).normalize());
  riverSeed = deriveSeed(seed, 9);
  resetWater();
  // The road is fitted to the zone centres, so it moves with them.
  resetRoads(seed);
}

function angleTo(b: Biome, d: THREE.Vector3): number {
  return Math.acos(THREE.MathUtils.clamp(b.center.dot(d), -1, 1));
}

const _blend: { primary: Biome; secondary: Biome; mix: number; margin: number } = {
  primary: LAND_BIOMES[0],
  secondary: LAND_BIOMES[1],
  mix: 0,
  margin: 1
};

const _warp = new THREE.Vector3();

/**
 * Nudge the direction sideways before it is compared against the zone centres.
 *
 * The warp has to move `d`, not the scores: one noise value added to every score
 * cancels out when the scores are compared, which would leave the borders as the
 * plain great circles between centres. A single octave of noise at a long
 * wavelength gives the seam a broad, gentle sway of a few units: it bends the
 * border but never shreds it into a jagged outline.
 */
function warpDir(d: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  // Held still near a zone heart, so no landmark is ever warped into a neighbour.
  let nearest = Math.PI;
  for (const b of LAND_BIOMES) nearest = Math.min(nearest, angleTo(b, d));
  const fade = THREE.MathUtils.smoothstep(nearest * PLANET_RADIUS_LOCAL, 15, 26);
  if (fade <= 0) return out.copy(d);
  const amp = (4.4 * fade) / PLANET_RADIUS_LOCAL;
  out.copy(d);
  out.x += fbm3(d.x * 1.25 + 11, d.y * 1.25 + 5, d.z * 1.25 - 7, 1) * amp;
  out.y += fbm3(d.x * 1.25 - 9, d.y * 1.25 + 13, d.z * 1.25 + 3, 1) * amp;
  out.z += fbm3(d.x * 1.25 + 7, d.y * 1.25 - 11, d.z * 1.25 + 9, 1) * amp;
  // The displacement is a few units against a radius of 42, so adding it to `d`
  // and re-normalising is exact enough: only the sideways part of it survives.
  return out.normalize();
}

/**
 * The two zones nearest `d`, how much the ground should favour the second, and
 * how far `d` is from the border. Distances are measured against the warped
 * direction, so the border, the heights, the colours and the water all agree.
 */
export function landBiomeBlend(d: THREE.Vector3): { primary: Biome; secondary: Biome; mix: number; margin: number } {
  const w = warpDir(d, _warp);
  let primary = LAND_BIOMES[0];
  let bestScore = Infinity;
  let secondary = LAND_BIOMES[1];
  let secondScore = Infinity;
  for (const b of LAND_BIOMES) {
    const score = angleTo(b, w);
    if (score < bestScore) {
      secondScore = bestScore;
      secondary = primary;
      bestScore = score;
      primary = b;
    } else if (score < secondScore) {
      secondScore = score;
      secondary = b;
    }
  }
  _blend.primary = primary;
  _blend.secondary = secondary;
  _blend.margin = secondScore - bestScore;
  _blend.mix = 0.5 * (1 - THREE.MathUtils.smoothstep(_blend.margin, 0, 1 / PLANET_RADIUS_LOCAL));
  return _blend;
}

/** Angular Voronoi over the zones with a gently warped border. */
export function landBiomeAt(d: THREE.Vector3): Biome {
  return landBiomeBlend(d).primary;
}

/** Angle (radians) from `d` to the nearest zone centre. */
export function nearestCenterAngle(d: THREE.Vector3): number {
  let best = Math.PI;
  for (const b of LAND_BIOMES) best = Math.min(best, angleTo(b, d));
  return best;
}

/** Radius of the planet, mirrored here to keep `biomes.ts` free of cycles. */
const PLANET_RADIUS_LOCAL = 42;
/** Index of the zone that holds the river. */
const RIVER_ZONE = 0;

/** One river: a centre line with a half width at every sample. */
export type RiverLine = {
  points: THREE.Vector3[];
  half: number[];
  center: THREE.Vector3;
  cos: number;
  /** The two land zones whose border this river follows; the river zone's own
   * index twice for the channels of the river canyon. */
  pair: [number, number];
};

/** Every water channel: the main river, its branches and the pools. */
export const RIVERS: RiverLine[] = [];

const _v = new THREE.Vector3();

/** Direction at fraction `t` along the great circle from `a` to `b`. */
export function arcDir(a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3): THREE.Vector3 {
  const len = a.angleTo(b);
  if (len < 1e-5) return out.copy(a);
  const s1 = Math.sin((1 - t) * len) / Math.sin(len);
  const s2 = Math.sin(t * len) / Math.sin(len);
  return out.copy(a).multiplyScalar(s1).addScaledVector(b, s2).normalize();
}

/**
 * East and north at `up`, matching `planet.tangentBasis`, so a channel laid out
 * here means the same offsets as `ZoneApi.at` and `offsetDir` elsewhere.
 */
function tangentFrame(up: THREE.Vector3, east: THREE.Vector3, north: THREE.Vector3): void {
  if (Math.abs(up.y) > 0.98) east.crossVectors(up, _v.set(1, 0, 0)).normalize();
  else east.crossVectors(up, _v.set(0, 1, 0)).normalize();
  north.crossVectors(east, up).normalize();
}

/** Unit direction `east`/`north` surface units from `up`, matching `offsetDir`. */
function localPoint(
  up: THREE.Vector3,
  east: THREE.Vector3,
  north: THREE.Vector3,
  e: number,
  n: number,
  out: THREE.Vector3
): THREE.Vector3 {
  const len = Math.hypot(e, n);
  if (len < 1e-9) return out.copy(up);
  const ang = len / PLANET_RADIUS_LOCAL;
  return out
    .copy(east)
    .multiplyScalar(e / len)
    .addScaledVector(north, n / len)
    .multiplyScalar(Math.sin(ang))
    .addScaledVector(up, Math.cos(ang))
    .normalize();
}

/** Smooth 0..1 ramp between `a` and `b`, clamped at both ends. */
function ramp(x: number, a: number, b: number): number {
  return THREE.MathUtils.smoothstep(x, a, b);
}

/** Build the distance record for one channel, as a capped sample scan. */
function makeLine(points: THREE.Vector3[], half: number[]): RiverLine {
  const center = new THREE.Vector3();
  for (const p of points) center.add(p);
  center.normalize();
  let radius = 0;
  for (let i = 0; i < points.length; i++) {
    radius = Math.max(radius, center.angleTo(points[i]) + half[i] / PLANET_RADIUS_LOCAL);
  }
  return {
    points,
    half,
    center,
    cos: Math.cos(Math.min(Math.PI, radius + 1 / PLANET_RADIUS_LOCAL)),
    pair: [RIVER_ZONE, RIVER_ZONE]
  };
}

/** Half width of the main river, in surface units: seven units across. */
const MAIN_HALF = 3.6;
/** Half width of a branch channel. */
const BRANCH_HALF = 2.3;
/** No channel runs closer than this to the zone heart (beacon, spawn, robots). */
const HEART_CLEAR = 9.5;
/** No channel runs further than this from the zone heart (stays off neighbours). */
const EDGE_LIMIT = 31;

/**
 * Lay the energy river out inside the river zone: one long channel winding
 * around the zone's heart, two branches running out from it, and two pools.
 * Everything is kept clear of the beacon and the player's spawn at the centre,
 * and well inside the zone so no water ever appears in another continent.
 */
function buildRiverZone(): RiverLine[] {
  const up = LAND_BIOMES[RIVER_ZONE].center;
  const east = new THREE.Vector3();
  const north = new THREE.Vector3();
  tangentFrame(up, east, north);
  const rng = seededRng(riverSeed);
  const phi0 = rng() * Math.PI * 2;
  const wob1 = rng() * Math.PI * 2;
  const wob2 = rng() * Math.PI * 2;
  const out: RiverLine[] = [];

  // Main channel: an arc that sweeps around the zone heart at 10..19 units.
  const N = 160;
  const SPAN = 0.92;
  const le: number[] = [];
  const ln: number[] = [];
  const main: THREE.Vector3[] = [];
  const mainHalf: number[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const rel = (u - 0.5) * 2 * SPAN;
    const phi = phi0 + rel;
    const rho = 14.5 + 2.6 * Math.sin(rel * 3.2 + wob1) + 1.4 * Math.sin(rel * 5.6 + wob2);
    const e = rho * Math.sin(phi);
    const n = rho * Math.cos(phi);
    le.push(e);
    ln.push(n);
    main.push(localPoint(up, east, north, e, n, new THREE.Vector3()));
    mainHalf.push(MAIN_HALF * ramp(u, 0, 0.05) * (1 - ramp(u, 0.95, 1)));
  }
  out.push(makeLine(main, mainHalf));

  // Branches: leave the main channel radially and curve away from it.
  const branch = (u0: number, side: number, length: number): void => {
    const i0 = Math.max(2, Math.min(N - 2, Math.round(u0 * N)));
    const e0 = le[i0];
    const n0 = ln[i0];
    const rad = Math.hypot(e0, n0) || 1;
    const base = Math.atan2(e0 / rad, n0 / rad) + side * 0.55;
    let dx = Math.sin(base);
    let dy = Math.cos(base);
    let e = e0;
    let n = n0;
    const points: THREE.Vector3[] = [];
    const halfs: number[] = [];
    const steps = Math.round(length / 0.4);
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      if (k > 0) {
        e += dx * 0.4;
        n += dy * 0.4;
        const turn = side * 0.02;
        const nx = dx * Math.cos(turn) - dy * Math.sin(turn);
        const ny = dx * Math.sin(turn) + dy * Math.cos(turn);
        dx = nx;
        dy = ny;
      }
      const fromHeart = Math.hypot(e, n);
      if (fromHeart < HEART_CLEAR || fromHeart > EDGE_LIMIT) break;
      points.push(localPoint(up, east, north, e, n, new THREE.Vector3()));
      halfs.push(BRANCH_HALF * (1 - ramp(t, 0.7, 1)));
    }
    if (points.length > 6) out.push(makeLine(points, halfs));
  };
  branch(0.3, 1, 13);
  branch(0.72, -1, 12);

  // Pools: small round ponds beside the channels.
  const pool = (ring: number, angle: number, radius: number): void => {
    const e = ring * Math.sin(phi0 + angle);
    const n = ring * Math.cos(phi0 + angle);
    if (Math.hypot(e, n) < HEART_CLEAR || Math.hypot(e, n) > EDGE_LIMIT) return;
    const p = localPoint(up, east, north, e, n, new THREE.Vector3());
    out.push(makeLine([p], [radius]));
  };
  pool(21, 0.62, 2.3);
  pool(25, -0.55, 1.9);

  return out;
}

let riversReady = false;

/** Rebuild the channels after the zone centres move. */
function resetWater(): void {
  riversReady = false;
  RIVERS.length = 0;
  BRIDGES.length = 0;
}

function ensureWater(): void {
  if (riversReady) return;
  riversReady = true;
  RIVERS.length = 0;
  for (const line of buildRiverZone()) RIVERS.push(line);
  BRIDGES.length = 0;
}

/**
 * Signed distance to the nearest water, in surface units: negative inside the
 * water, positive on land, and the magnitude is the distance to the shoreline.
 * Beyond a few dozen units the exact value stops mattering, so it is capped.
 */
export function oceanField(d: THREE.Vector3): number {
  ensureWater();
  let best = 1e9;
  for (const r of RIVERS) {
    if (d.dot(r.center) < r.cos) continue;
    let bestDot = -2;
    let bi = 0;
    for (let i = 0; i < r.points.length; i++) {
      const dot = r.points[i].dot(d);
      if (dot > bestDot) {
        bestDot = dot;
        bi = i;
      }
    }
    if (bestDot === -2) continue;
    const edge = Math.acos(THREE.MathUtils.clamp(bestDot, -1, 1)) * PLANET_RADIUS_LOCAL - r.half[bi];
    if (edge < best) best = edge;
  }
  return Math.min(best, 60);
}

/** True within about `pad` units of any water, on either bank. */
export function nearSeaRoute(d: THREE.Vector3, pad = 11): boolean {
  return Math.abs(oceanField(d)) < pad;
}

/** One bridge deck: a polyline with a height at every sample. */
export type BridgeLine = { points: THREE.Vector3[]; heights: number[]; halfWidth: number };

/**
 * Decks across the water. The road network fills this when it is laid out;
 * every deck here is drawn geometry, so nothing a walker can stand on is
 * invisible to the eye.
 */
export const BRIDGES: BridgeLine[] = [];

/** Height of the deck at `d`, or null where there is no bridge underfoot. */
export function bridgeHeight(d: THREE.Vector3): number | null {
  return roadDeckHeight(d);
}

/** True where `d` is water and not covered by a bridge deck. */
export function isOcean(d: THREE.Vector3): boolean {
  return oceanField(d) < 0 && roadDeckHeight(d) === null;
}

export function biomeAt(d: THREE.Vector3): Biome {
  return isOcean(d) ? OCEAN : landBiomeAt(d);
}

export function biomeById(id: BiomeId): Biome {
  return id === 'ocean' ? OCEAN : BIOMES.find((b) => b.id === id)!;
}
