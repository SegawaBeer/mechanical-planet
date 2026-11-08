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
  arcs = null;
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

/**
 * The two zones nearest `d`, how much the ground should favour the second, and
 * how far `d` is from the border. The blend band is one surface unit wide, so a
 * zone change reads as a boundary rather than as a smear.
 */
export function landBiomeBlend(d: THREE.Vector3): { primary: Biome; secondary: Biome; mix: number; margin: number } {
  const warp = fbm3(d.x * 2.3 + 5, d.y * 2.3, d.z * 2.3 - 3, 3) * 0.22;
  let primary = LAND_BIOMES[0];
  let bestScore = Infinity;
  let secondary = LAND_BIOMES[1];
  let secondScore = Infinity;
  for (const b of LAND_BIOMES) {
    const score = angleTo(b, d) + warp;
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
/** Angular half-width of the dry core of a crossing, in radians. */
const CROSS_CORE = 3.2;
/** Surface distance at which a crossing has faded back into the channel. */
const CROSS_FADE = 5.6;
/** Extra dry width near each end of a crossing, so leaving a zone cannot put a
 * walker straight into a channel. Measured in surface units. */
const CROSS_APRON = 7;
const APRON_REACH = 18;
/** Field value a crossing settles at: above zero so it is land, below the 0.06
 * that prop scattering needs, so nothing solid is strewn across the causeway. */
const CROSS_DRY = 0.05;

type Arc = { a: THREE.Vector3; b: THREE.Vector3; n: THREE.Vector3; cos: number; len: number };

let arcs: Arc[] | null = null;

/**
 * Great-circle arcs joining every pair of zone centres. These are the causeways
 * the player can drive: the channel field is forced dry across them so no zone
 * is walled off by the energy rivers. Rebuilt whenever the centres move.
 */
function crossingArcs(): Arc[] {
  if (arcs) return arcs;
  const list: Arc[] = [];
  for (let i = 0; i < LAND_BIOMES.length; i++) {
    for (let j = i + 1; j < LAND_BIOMES.length; j++) {
      const a = LAND_BIOMES[i].center;
      const b = LAND_BIOMES[j].center;
      const n = new THREE.Vector3().crossVectors(a, b);
      if (n.lengthSq() < 1e-8) continue;
      list.push({ a, b, n: n.normalize(), cos: a.dot(b), len: a.angleTo(b) });
    }
  }
  arcs = list;
  return arcs;
}

const _proj = new THREE.Vector3();
/** Distance from the last `arcDistance` point to the nearer end of its arc. */
let _endDist = 0;

/** Surface distance from `d` to the closest point of `arc`, given `side`. */
function arcDistance(arc: Arc, d: THREE.Vector3, side: number): number {
  _proj.copy(d).addScaledVector(arc.n, -d.dot(arc.n));
  if (_proj.lengthSq() < 1e-10) {
    _endDist = (arc.len * PLANET_RADIUS_LOCAL) / 2;
    return _endDist;
  }
  _proj.normalize();
  const da = arc.a.angleTo(d) * PLANET_RADIUS_LOCAL;
  const db = arc.b.angleTo(d) * PLANET_RADIUS_LOCAL;
  _endDist = Math.min(da, db);
  // Within the arc's own span both endpoints are inside one arc length of it.
  if (arc.a.dot(_proj) >= arc.cos && arc.b.dot(_proj) >= arc.cos) {
    return Math.asin(Math.min(1, side)) * PLANET_RADIUS_LOCAL;
  }
  return _endDist;
}

/**
 * How much `d` belongs to a crossing, 0 on open channel and 1 on the causeway
 * core. The dot with the arc's plane normal prunes almost every point with one
 * multiply, which matters because the ground mesh samples this a lot at load.
 */
function crossingAt(d: THREE.Vector3): number {
  let best = 0;
  const reach = Math.sin((CROSS_FADE + CROSS_APRON) / PLANET_RADIUS_LOCAL);
  for (const arc of crossingArcs()) {
    const side = Math.abs(d.dot(arc.n));
    if (side > reach) continue;
    const dist = arcDistance(arc, d, side);
    // The causeway opens out where it meets a zone, so leaving a zone in the
    // general direction of another never walks straight into a channel.
    const apron = CROSS_APRON * (1 - THREE.MathUtils.clamp(_endDist / APRON_REACH, 0, 1));
    const core = CROSS_CORE + apron;
    const fade = CROSS_FADE + apron;
    if (dist >= fade) continue;
    const t = 1 - THREE.MathUtils.smoothstep(dist, core, fade);
    if (t > best) best = t;
  }
  return best;
}

/**
 * Signed channel field before the crossings are cut: negative inside an energy
 * channel, positive on metal. Exported so zone scenery can find the channels it
 * bridges.
 *
 * Channels follow the zero set of a smooth noise, which draws long winding
 * lines instead of blobs. The river zone carries wider channels and a second,
 * finer network of veins; the fortress keeps its channels thin. Each zone core
 * is held dry so its landmarks and wonders always stand on solid ground.
 */
export function channelField(d: THREE.Vector3): number {
  const river = LAND_BIOMES[0];
  const near = THREE.MathUtils.smoothstep(-angleTo(river, d), -1.0, -0.25);
  const fortress = THREE.MathUtils.smoothstep(-angleTo(LAND_BIOMES[3], d), -0.9, -0.3);

  const bend = fbm3(d.x * 3.6 - 6, d.y * 3.6 + 13, d.z * 3.6 + 4, 2) * 0.035;
  const n = fbm3(d.x * 1.25 + 11, d.y * 1.25 - 2, d.z * 1.25 + 7, 3) + bend;
  const width = 0.056 + 0.04 * near - 0.016 * fortress;
  let channel = Math.abs(n) - width;
  if (near > 0.01) {
    const vein = fbm3(d.x * 2.6 - 17, d.y * 2.6 + 5, d.z * 2.6 + 21, 2);
    channel = Math.min(channel, Math.abs(vein) - 0.03 * near);
  }

  let keep = 1;
  for (const b of LAND_BIOMES) {
    const core = CORE[b.id as Exclude<BiomeId, 'ocean'>];
    keep = Math.min(keep, THREE.MathUtils.smoothstep(angleTo(b, d), core, core + 0.28));
  }
  return keep * channel + (1 - keep) * Math.max(channel, 0.3);
}

/**
 * Channel field with the crossings cut through it. Where a great-circle arc
 * between two zone centres passes over a channel, the field is lifted to dry
 * land, so every zone can be driven to from every other.
 *
 * The whole corridor is pulled to `CROSS_DRY`, land included, not just the wet
 * part: that keeps scattered props off the road and lays the road at a constant
 * rise, so it reads as a causeway instead of a path that wanders through rocks.
 */
export function oceanField(d: THREE.Vector3): number {
  const field = channelField(d);
  const dry = crossingAt(d);
  if (dry <= 0) return field;
  return THREE.MathUtils.lerp(field, CROSS_DRY, dry);
}


export function isOcean(d: THREE.Vector3): boolean {
  return oceanField(d) < 0;
}

export function biomeAt(d: THREE.Vector3): Biome {
  return isOcean(d) ? OCEAN : landBiomeAt(d);
}

export function biomeById(id: BiomeId): Biome {
  return id === 'ocean' ? OCEAN : BIOMES.find((b) => b.id === id)!;
}
