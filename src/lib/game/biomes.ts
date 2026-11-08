import * as THREE from 'three';
import { deriveSeed, fbm3, seededRng } from './noise';
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
  /** Metal at the lip of an energy channel. */
  beach: number;
  /** Colour of the seam between two plates. */
  seam: number;
};

function dir(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z).normalize();
}

export const BIOMES: Biome[] = [
  {
    id: 'river',
    name: '能量河流',
    kind: 'ENERGY RIVER',
    index: '01',
    tagline: '星球的能量脉络在峡谷间奔流。',
    center: dir(0.55, 0.3, 0.78),
    // Cold steel teal: the metal that the energy rivers cut through.
    ground: [0x7fb3b8, 0xa9d6d6, 0x628f96],
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
    center: dir(-0.72, 0.28, 0.6),
    // Sunny silver-white with warm gold plates.
    ground: [0xd8d2c4, 0xe3b552, 0xbdb6a6],
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
    center: dir(0.82, -0.2, -0.5),
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
    center: dir(-0.35, -0.55, -0.72),
    // Purple black with magenta-lit seams.
    ground: [0x2b2135, 0x3d2c4f, 0x241b2e],
    accent: 0xff2f8a,
    beach: 0x4a2f56,
    seam: 0xff2f8a
  }
];

/** The energy channels that wind between and through the four zones. */
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

/** Radius, in radians, around each zone centre that no channel may cross. */
const CORE: Record<Exclude<BiomeId, 'ocean'>, number> = {
  river: 0.17,
  citadel: 0.34,
  ark: 0.36,
  fortress: 0.34
};

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

/**
 * Move the zone centres to seed-derived directions, in place, so every module
 * that reads `BIOMES[i].center` follows. Best-candidate sampling plus a few
 * repulsion passes spreads four centres close to the corners of a tetrahedron.
 * Call before generating anything.
 */
export function layoutBiomes(seed: number): void {
  const rng = seededRng(deriveSeed(seed, 2));
  const centers = LAND_BIOMES.map((b) => b.center);
  const cand = new THREE.Vector3();
  for (let i = 0; i < centers.length; i++) {
    let bestScore = -1;
    const tries = i === 0 ? 1 : 64;
    for (let k = 0; k < tries; k++) {
      randomDir(rng, cand);
      let score = 0;
      if (i > 0) {
        score = Infinity;
        for (let j = 0; j < i; j++) score = Math.min(score, centers[j].angleTo(cand));
      }
      if (score > bestScore) {
        bestScore = score;
        centers[i].copy(cand);
      }
    }
  }
  const force = new THREE.Vector3();
  for (let pass = 0; pass < 12; pass++) {
    for (const c of centers) {
      force.set(0, 0, 0);
      for (const o of centers) {
        if (o === c) continue;
        const ang = c.angleTo(o);
        force.addScaledVector(cand.copy(c).sub(o), 1 / (ang * ang));
      }
      c.addScaledVector(force, 0.02).normalize();
    }
  }
  // The sea, the rivers and the zone sizes all move with the centres.
  riversReady = false;
  RIVERS.length = 0;
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
 * cancels out when the scores are compared, which leaves the borders as the plain
 * great circles between centres. Two octaves give the border a broad sway of a
 * few units plus a fine sawtooth.
 */
function warpDir(d: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  // Held still near a zone heart, so no landmark is ever warped into a neighbour.
  let nearest = Math.PI;
  for (const b of LAND_BIOMES) nearest = Math.min(nearest, angleTo(b, d));
  const fade = THREE.MathUtils.smoothstep(nearest * PLANET_RADIUS_LOCAL, 16, 26);
  if (fade <= 0) return out.copy(d);
  const amp = fade / PLANET_RADIUS_LOCAL;
  const coarse = 5.5 * amp;
  const fine = 1.6 * amp;
  out.copy(d);
  out.x += fbm3(d.x * 2.2 + 11, d.y * 2.2 + 5, d.z * 2.2 - 7, 2) * coarse;
  out.y += fbm3(d.x * 2.2 - 9, d.y * 2.2 + 13, d.z * 2.2 + 3, 2) * coarse;
  out.z += fbm3(d.x * 2.2 + 7, d.y * 2.2 - 11, d.z * 2.2 + 9, 2) * coarse;
  out.x += fbm3(d.x * 7.5 - 3, d.y * 7.5 + 9, d.z * 7.5 - 5, 2) * fine;
  out.y += fbm3(d.x * 7.5 + 6, d.y * 7.5 - 4, d.z * 7.5 + 12, 2) * fine;
  out.z += fbm3(d.x * 7.5 - 14, d.y * 7.5 + 2, d.z * 7.5 + 6, 2) * fine;
  out.addScaledVector(d, -out.dot(d));
  if (out.lengthSq() < 1e-8) return out.copy(d);
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

/** Angular Voronoi over the zones with noise-warped borders. */
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
/** Index of the zone that is all sea. */
const SEA_ZONE = 0;
/** Radius of the island in the middle of the sea, in surface units. */
const ISLAND_BASE = 11.5;
const ISLAND_WOBBLE = 1.5;

/** One river: a centre line with a half width at every sample. */
export type RiverLine = {
  points: THREE.Vector3[];
  half: number[];
  center: THREE.Vector3;
  cos: number;
  /** The two land zones whose border this river follows. */
  pair: [number, number];
};

export const RIVERS: RiverLine[] = [];

const _v = new THREE.Vector3();
const _w = new THREE.Vector3();

/** Direction at fraction `t` along the great circle from `a` to `b`. */
export function arcDir(a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3): THREE.Vector3 {
  const len = a.angleTo(b);
  if (len < 1e-5) return out.copy(a);
  const s1 = Math.sin((1 - t) * len) / Math.sin(len);
  const s2 = Math.sin(t * len) / Math.sin(len);
  return out.copy(a).multiplyScalar(s1).addScaledVector(b, s2).normalize();
}

/** Radius of the island, in surface units, wobbling between 10 and 13. */
function islandRadius(d: THREE.Vector3): number {
  return ISLAND_BASE + fbm3(d.x * 3.1 + 4, d.y * 3.1 - 7, d.z * 3.1 + 2, 2) * ISLAND_WOBBLE;
}

/** The two zones nearest `d`, by plain angular Voronoi. */
function nearestPair(d: THREE.Vector3): [number, number] {
  let i0 = 0, i1 = 1, a0 = Infinity, a1 = Infinity;
  for (let i = 0; i < LAND_BIOMES.length; i++) {
    const a = angleTo(LAND_BIOMES[i], d);
    if (a < a0) { a1 = a0; i1 = i0; a0 = a; i0 = i; }
    else if (a < a1) { a1 = a; i1 = i; }
  }
  return [i0, i1];
}

/** Walk `p` sideways until it sits on the warped border between two centres. */
function slideToBorder(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): void {
  const w = new THREE.Vector3();
  const along = new THREE.Vector3();
  for (let it = 0; it < 4; it++) {
    warpDir(p, w);
    const d = a.angleTo(w) - b.angleTo(w);
    along.copy(b).sub(a).addScaledVector(p, -b.dot(p) + a.dot(p));
    if (along.lengthSq() < 1e-8) return;
    along.normalize();
    // Small steps only: a big jump here folds the centre line back on itself and
    // every later sample (tangent, water field, bridge placement) inherits the mess.
    const ang = THREE.MathUtils.clamp(d * 0.5, -0.02, 0.02);
    p.multiplyScalar(Math.cos(ang)).addScaledVector(along, Math.sin(ang)).normalize();
  }
}

/**
 * A river along the border between two land zones: the great circle that is
 * equidistant from both centres, cut to the stretch that belongs to the pair and
 * then to the first 60% of that stretch, measured from the sea end.
 */
function buildRiver(ia: number, ib: number, sea: THREE.Vector3): RiverLine | null {
  const a = LAND_BIOMES[ia].center;
  const b = LAND_BIOMES[ib].center;
  const m = _v.copy(a).sub(b);
  if (m.lengthSq() < 1e-8) return null;
  m.normalize();
  const e1 = new THREE.Vector3().crossVectors(m, sea);
  if (e1.lengthSq() < 1e-6) e1.crossVectors(m, new THREE.Vector3(0, 1, 0));
  e1.normalize();
  const e2 = new THREE.Vector3().crossVectors(m, e1).normalize();

  const N = 360;
  const pts: THREE.Vector3[] = [];
  const mine: boolean[] = [];
  for (let k = 0; k < N; k++) {
    const phi = (k / N) * Math.PI * 2;
    const p = new THREE.Vector3().copy(e1).multiplyScalar(Math.cos(phi)).addScaledVector(e2, Math.sin(phi)).normalize();
    pts.push(p);
    const [i0, i1] = nearestPair(p);
    mine.push((i0 === ia && i1 === ib) || (i0 === ib && i1 === ia));
  }
  // Longest circular run that belongs to this pair.
  let bestStart = -1, bestLen = 0;
  for (let k = 0; k < N; k++) {
    if (!mine[k] || mine[(k + N - 1) % N]) continue;
    let len = 0;
    while (len < N && mine[(k + len) % N]) len++;
    if (len > bestLen) { bestLen = len; bestStart = k; }
  }
  if (bestStart < 0 || bestLen < 4) return null;
  const run: THREE.Vector3[] = [];
  for (let k = 0; k < bestLen; k++) run.push(pts[(bestStart + k) % N]);

  // Orient the run so it starts at the end nearest the sea.
  const seaAng = (p: THREE.Vector3) => p.angleTo(sea);
  const flip = seaAng(run[0]) > seaAng(run[run.length - 1]);
  if (flip) run.reverse();
  const arcLen = run[0].angleTo(run[run.length - 1]) * PLANET_RADIUS_LOCAL;
  const target = arcLen * 0.6;

  const points: THREE.Vector3[] = [];
  const half: number[] = [];
  let travelled = 0;
  const centre = run[0].clone();
  for (let k = 0; k < run.length; k++) {
    if (k > 0) travelled += run[k - 1].angleTo(run[k]) * PLANET_RADIUS_LOCAL;
    if (travelled > target) break;
    // Keep the river clear of the zone hearts.
    let clear = true;
    for (const z of LAND_BIOMES) if (run[k].angleTo(z.center) * PLANET_RADIUS_LOCAL < 20) clear = false;
    if (!clear && k > 2) break;
    // Gentle meander, strongest near the middle of the run.
    const u = travelled / Math.max(1, target);
    const side = new THREE.Vector3().crossVectors(run[k], m).normalize();
    const sway = Math.sin(u * 7.5 + ia) * 1.6 + fbm3(run[k].x * 9, run[k].y * 9, run[k].z * 9, 2) * 1.4;
    const p = run[k].clone().addScaledVector(side, sway / PLANET_RADIUS_LOCAL).normalize();
    // Slide the point onto the real (warped) border, so the river hugs the seam.
    slideToBorder(p, a, b);
    // The warp can push the border close to a zone heart: keep the river well
    // clear of the landmarks that stand there.
    let clearance = Infinity;
    for (const z of LAND_BIOMES) clearance = Math.min(clearance, p.angleTo(z.center) * PLANET_RADIUS_LOCAL);
    if (clearance < 18 && k > 2) break;
    // Drop backtracks: consecutive samples have to keep moving down the river.
    const prev = points[points.length - 1];
    if (prev && prev.angleTo(p) * PLANET_RADIUS_LOCAL < 0.25) continue;
    points.push(p);
    const taper = Math.sqrt(Math.max(0, 1 - u));
    half.push(2.7 * Math.min(1, 0.35 + taper * 1.1));
  }
  if (points.length < 4) return null;
  return { points, half, center: centre, cos: Math.cos((target + 20) / PLANET_RADIUS_LOCAL), pair: [ia, ib] };
}

let riversReady = false;
function ensureWater(): void {
  if (riversReady) return;
  riversReady = true;
  RIVERS.length = 0;
  const sea = LAND_BIOMES[SEA_ZONE].center;
  for (let i = 1; i < LAND_BIOMES.length; i++) {
    for (let j = i + 1; j < LAND_BIOMES.length; j++) {
      const r = buildRiver(i, j, sea);
      if (r) RIVERS.push(r);
    }
  }
  BRIDGES.length = 0;
  for (const z of LAND_BIOMES) {
    if (z.id === 'river') continue;
    const deck = seaDeck(z.center, sea);
    if (deck) BRIDGES.push(deck);
  }
  for (const r of RIVERS) {
    const deck = riverDeck(r);
    if (deck) BRIDGES.push(deck);
  }
}

/** Distance, in surface units, from `d` to the nearest river edge. */
function riverField(d: THREE.Vector3): number {
  let best = 1e9;
  for (const r of RIVERS) {
    if (d.dot(r.center) < r.cos) continue;
    let bi = 0, bd = Infinity;
    for (let i = 0; i < r.points.length; i++) {
      const ang = r.points[i].angleTo(d);
      if (ang < bd) { bd = ang; bi = i; }
    }
    if (bd === Infinity) continue;
    const edge = bd * PLANET_RADIUS_LOCAL - r.half[bi];
    if (edge < best) best = edge;
  }
  return best;
}

/** True within about `pad` units of one of the sea bridge routes. */
export function nearSeaRoute(d: THREE.Vector3, pad = 11): boolean {
  const sea = LAND_BIOMES[SEA_ZONE].center;
  const n = new THREE.Vector3();
  for (const z of LAND_BIOMES) {
    if (z.id === 'river') continue;
    const len = sea.angleTo(z.center) * PLANET_RADIUS_LOCAL;
    if (d.angleTo(sea) * PLANET_RADIUS_LOCAL > len + pad) continue;
    n.crossVectors(sea, z.center);
    if (n.lengthSq() < 1e-8) continue;
    n.normalize();
    if (Math.asin(Math.min(1, Math.abs(d.dot(n)))) * PLANET_RADIUS_LOCAL < pad) return true;
  }
  return false;
}

/** One bridge deck: a polyline with a height at every sample. */
export type BridgeLine = { points: THREE.Vector3[]; heights: number[]; halfWidth: number };

/** Every deck, published for the scenery to draw. */
export const BRIDGES: BridgeLine[] = [];

/** Deck height: above the water, arching a little over the middle. */
function deckHeights(n: number, base: number, arch: number): number[] {
  const out: number[] = [];
  for (let k = 0; k <= n; k++) out.push(base + arch * Math.sin((Math.PI * k) / n));
  return out;
}

/** Push `p` along `step` until it stands on dry ground, two units past the bank. */
function pushToDry(p: THREE.Vector3, step: THREE.Vector3, max = 16): THREE.Vector3 {
  if (oceanField(p) > 0.25) return p.clone();
  const t = new THREE.Vector3();
  for (let s = 0.5; s <= max; s += 0.5) {
    const ang = s / PLANET_RADIUS_LOCAL;
    t.copy(p).multiplyScalar(Math.cos(ang)).addScaledVector(step, Math.sin(ang)).normalize();
    if (oceanField(t) > 0.25) {
      const extra = (s + 2) / PLANET_RADIUS_LOCAL;
      return p.clone().multiplyScalar(Math.cos(extra)).addScaledVector(step, Math.sin(extra)).normalize();
    }
  }
  return p.clone();
}

/**
 * Sample a deck from `a` to `b` between two fractions, with one extra sample at
 * each end. The extra sample is the registered overhang: the model stops one
 * unit short, so no deck geometry ever stands outside the walkable span.
 */
function sampleArc(a: THREE.Vector3, b: THREE.Vector3, from: number, to: number, halfWidth: number, base: number, arch: number): BridgeLine {
  const len = a.angleTo(b) * PLANET_RADIUS_LOCAL;
  const span = (to - from) * len;
  const n = Math.max(6, Math.round(span / 1.0));
  const points: THREE.Vector3[] = [];
  const d = new THREE.Vector3();
  for (let k = 0; k <= n; k++) {
    arcDir(a, b, THREE.MathUtils.clamp(from + ((to - from) * k) / n, 0, 1), d);
    points.push(d.clone());
  }
  const heights = deckHeights(n, base, arch);
  // The last sample at each end sits at ground level, so the deck meets the shore
  // instead of ending in a lip that the collision pass would read as a wall.
  heights[0] = PLANET_RADIUS_LOCAL + 0.45;
  heights[n] = PLANET_RADIUS_LOCAL + 0.45;
  return { points, heights, halfWidth };
}

/**
 * Walk outwards from `start` in direction `step` (a unit tangent) until three
 * samples in a row are dry, then two units further. That is where the deck ends,
 * so both ends are always on land rather than over open water.
 */
function dryEnd(start: THREE.Vector3, step: THREE.Vector3, limit: number): number {
  let run = 0;
  let lastDry = 0;
  const p = new THREE.Vector3();
  for (let s = 0.25; s <= limit; s += 0.25) {
    const ang = s / PLANET_RADIUS_LOCAL;
    p.copy(start).multiplyScalar(Math.cos(ang)).addScaledVector(step, Math.sin(ang)).normalize();
    if (oceanField(p) > 0.25) {
      run++;
      lastDry = s;
      if (run >= 3) return lastDry + 2;
    } else run = 0;
  }
  return limit;
}

/** One deck from the island out to a land zone's coast. */
function seaDeck(land: THREE.Vector3, sea: THREE.Vector3): BridgeLine | null {
  const len = sea.angleTo(land);
  const d = new THREE.Vector3();
  // Cross the water first: find the first and last wet sample on the arc.
  let waterIn = -1;
  let waterOut = -1;
  const steps = Math.max(40, Math.round((len * PLANET_RADIUS_LOCAL) / 0.4));
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    arcDir(sea, land, t, d);
    if (oceanField(d) < -0.15) {
      if (waterIn < 0) waterIn = t;
      waterOut = t;
    }
  }
  if (waterIn < 0) return null;
  // Then push the ends out onto dry ground in both directions.
  arcDir(sea, land, waterIn, d);
  const back = new THREE.Vector3().subVectors(sea, d).addScaledVector(d, -new THREE.Vector3().subVectors(sea, d).dot(d)).normalize();
  const inLen = Math.min(20, dryEnd(d, back, 22));
  arcDir(sea, land, waterOut, d);
  const fwd = new THREE.Vector3().subVectors(land, d).addScaledVector(d, -new THREE.Vector3().subVectors(land, d).dot(d)).normalize();
  const outLen = Math.min(20, dryEnd(d, fwd, 22));
  const total = len * PLANET_RADIUS_LOCAL;
  const from = Math.max(0, waterIn * total - inLen - 1) / total;
  const to = Math.min(1, waterOut * total + outLen + 1) / total;
  const a = new THREE.Vector3();
  const b2 = new THREE.Vector3();
  arcDir(sea, land, from, a);
  arcDir(sea, land, to, b2);
  const t0 = new THREE.Vector3().subVectors(sea, a).addScaledVector(a, -new THREE.Vector3().subVectors(sea, a).dot(a)).normalize();
  const t1 = new THREE.Vector3().subVectors(land, b2).addScaledVector(b2, -new THREE.Vector3().subVectors(land, b2).dot(b2)).normalize();
  const p0 = pushToDry(a, t0);
  const p1 = pushToDry(b2, t1);
  return sampleArc(p0, p1, 0, 1, 3.2, PLANET_RADIUS_LOCAL + 1.35, 0.95);
}

/**
 * One deck across a river. The crossing is the river point nearest the great
 * circle joining the two land centres, but never within 20 units of a zone heart
 * (that is where the landmarks stand); if the natural crossing is too close, the
 * bridge slides along the river until it is clear.
 */
function riverDeck(river: RiverLine): BridgeLine | null {
  // The river's own pair of zones, not just the first two land zones.
  const m = new THREE.Vector3().crossVectors(LAND_BIOMES[river.pair[0]].center, LAND_BIOMES[river.pair[1]].center).normalize();
  const cand: { i: number; side: number; clear: number; across: THREE.Vector3; tangent: THREE.Vector3; half: number }[] = [];
  for (let i = 2; i < river.points.length - 2; i++) {
    const p = river.points[i];
    let clear = Infinity;
    for (const z of LAND_BIOMES) clear = Math.min(clear, p.angleTo(z.center) * PLANET_RADIUS_LOCAL);
    if (clear < 20) continue;
    const tangent = new THREE.Vector3().subVectors(river.points[i + 2], river.points[i - 2]);
    tangent.addScaledVector(p, -tangent.dot(p));
    if (tangent.lengthSq() < 1e-10) continue;
    tangent.normalize();
    // Square to the river: this is the direction the deck runs, always.
    const across = new THREE.Vector3().crossVectors(p, tangent).normalize();
    cand.push({ i, side: Math.abs(p.dot(m)), clear, across, tangent, half: river.half[i] });
  }
  if (cand.length === 0) {
    console.warn('[riverDeck] no river point clear of every zone centre');
    return null;
  }
  // A crossing has to be on water, with dry ground a short way out on both banks.
  const limit = (c: { half: number }) => c.half + 4;
  const good = cand.filter((c) => {
    if (oceanField(river.points[c.i]) >= 0) return false;
    const outA = dryEnd(river.points[c.i], c.across.clone().negate(), 14);
    const outB = dryEnd(river.points[c.i], c.across, 14);
    return outA <= limit(c) && outB <= limit(c);
  });
  good.sort((x, y) => x.side - y.side || x.clear - y.clear);
  const pick = good.length > 0
    ? good[0]
    : cand.slice().sort((x, y) => x.side - y.side)[0];
  if (good.length === 0) console.warn('[riverDeck] no wet crossing found, falling back to the point nearest the centre line');
  const cross = river.points[pick.i];
  const back = pick.across.clone().negate();
  const angA = (dryEnd(cross, back, 14) + 1) / PLANET_RADIUS_LOCAL;
  const angB = (dryEnd(cross, pick.across, 14) + 1) / PLANET_RADIUS_LOCAL;
  const p0 = pushToDry(cross.clone().multiplyScalar(Math.cos(angA)).addScaledVector(back, Math.sin(angA)).normalize(), back);
  const p1 = pushToDry(cross.clone().multiplyScalar(Math.cos(angB)).addScaledVector(pick.across, Math.sin(angB)).normalize(), pick.across);
  return sampleArc(p0, p1, 0, 1, 2.6, PLANET_RADIUS_LOCAL + 1.5, 0.3);
}

/**
 * The sea decks, answered straight from the arcs rather than from the sampled
 * polylines: a walker follows the great circle from the island to a land centre,
 * and that is exactly where the deck has to be walkable.
 */
function seaDeckAt(d: THREE.Vector3): number | null {
  const sea = LAND_BIOMES[SEA_ZONE].center;
  const n = new THREE.Vector3();
  for (const z of LAND_BIOMES) {
    if (z.id === 'river') continue;
    const len = sea.angleTo(z.center) * PLANET_RADIUS_LOCAL;
    const along = sea.angleTo(d) * PLANET_RADIUS_LOCAL;
    if (along > len * 0.9) continue;
    n.crossVectors(sea, z.center);
    if (n.lengthSq() < 1e-8) continue;
    n.normalize();
    const side = Math.asin(Math.min(1, Math.abs(d.dot(n)))) * PLANET_RADIUS_LOCAL;
    if (side > 3.2) continue;
    const start = islandRadius(d) - 2.5;
    if (along < start) continue;
    const u = THREE.MathUtils.clamp((along - start) / Math.max(1, len * 0.9 - start), 0, 1);
    return PLANET_RADIUS_LOCAL + 1.35 + 0.95 * Math.sin(Math.PI * u);
  }
  return null;
}

/** Height of a bridge deck at `d`, or null when `d` is not on a deck. */
export function bridgeHeight(d: THREE.Vector3): number | null {
  const seaDeck = seaDeckAt(d);
  if (seaDeck !== null) return seaDeck;
  for (const b of BRIDGES) {
    let bi = 0;
    let bd = Infinity;
    for (let i = 0; i < b.points.length; i++) {
      const ang = b.points[i].angleTo(d);
      if (ang < bd) { bd = ang; bi = i; }
    }
    if (bd * PLANET_RADIUS_LOCAL <= b.halfWidth) return b.heights[bi];
  }
  return null;
}

/**
 * Signed water field, in surface units: negative in water, positive on land,
 * and the magnitude is the distance to the nearest shoreline.
 *
 * There are only two kinds of water now. The sea fills the river zone apart
 * from a wobbling island in its middle, and three rivers run out of the sea
 * along the borders between the land zones. Everything else is dry.
 */
export function oceanField(d: THREE.Vector3): number {
  ensureWater();
  const blend = landBiomeBlend(d);
  const border = blend.margin * PLANET_RADIUS_LOCAL;
  let land: number;
  if (blend.primary.id === 'river') {
    const fromIsland = angleTo(LAND_BIOMES[SEA_ZONE], d) * PLANET_RADIUS_LOCAL - islandRadius(d);
    land = fromIsland < 0 ? -fromIsland : -Math.min(fromIsland, border);
  } else {
    const fromSea = blend.secondary.id === 'river' ? border : 40;
    const fromRiver = riverField(d);
    land = Math.min(fromSea, fromRiver);
  }
  return land;
}

export function isOcean(d: THREE.Vector3): boolean {
  if (bridgeHeight(d) !== null) return false;
  return oceanField(d) < 0;
}

export function biomeAt(d: THREE.Vector3): Biome {
  return isOcean(d) ? OCEAN : landBiomeAt(d);
}

export function biomeById(id: BiomeId): Biome {
  return id === 'ocean' ? OCEAN : BIOMES.find((b) => b.id === id)!;
}
