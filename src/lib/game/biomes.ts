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
  /** Plate palette: base colour plus a lighter and darker variant. */
  ground: [number, number, number];
  /** Rare plates in the zone's signature colour. */
  accent: number;
  /** Metal at the lip of an energy channel. */
  beach: number;
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
    ground: [0x3b4b57, 0x46596a, 0x313f4a],
    accent: 0x2f7d8c,
    beach: 0x28606c
  },
  {
    id: 'citadel',
    name: '铁堡',
    kind: 'IRON CITADEL',
    index: '02',
    tagline: '层层塔楼守着最后的灯火。',
    center: dir(-0.72, 0.28, 0.6),
    ground: [0x69727f, 0x7b8592, 0x5a626e],
    accent: 0x8a9fb8,
    beach: 0x4c5664
  },
  {
    id: 'ark',
    name: '方舟号',
    kind: 'ARK DOCK',
    index: '03',
    tagline: '沉睡的巨舰半埋在大地里。',
    center: dir(0.82, -0.2, -0.5),
    ground: [0x5b5149, 0x6b5f54, 0x4a423a],
    accent: 0x8a5a3a,
    beach: 0x4a4644
  },
  {
    id: 'fortress',
    name: '暗影要塞',
    kind: 'SHADOW FORTRESS',
    index: '04',
    tagline: '越靠近，越危险。',
    center: dir(-0.35, -0.55, -0.72),
    ground: [0x2f2738, 0x3a3046, 0x251f2d],
    accent: 0x5a2f6e,
    beach: 0x3a2442
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
  ground: [0x0d161c, 0x111d24, 0x0a1217],
  accent: 0x0a1217,
  beach: 0x0a1217
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

const _blend: { primary: Biome; secondary: Biome; mix: number } = {
  primary: LAND_BIOMES[0],
  secondary: LAND_BIOMES[1],
  mix: 0
};

/**
 * The two zones nearest `d` and how much the ground should favour the second.
 *
 * Zone shaping runs on whichever zone owns a point, so a hard height step would
 * sit along every border. Handing the caller the runner-up and a weight that
 * falls off within a few surface units lets the terrain cross-fade its shapes
 * instead of breaking into a cliff.
 */
export function landBiomeBlend(d: THREE.Vector3): { primary: Biome; secondary: Biome; mix: number } {
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
  _blend.mix = 0.5 * (1 - THREE.MathUtils.smoothstep(secondScore - bestScore, 0, 0.07));
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
const CROSS_CORE = 1.5 / PLANET_RADIUS_LOCAL;
/** Angular half-width at which a crossing has faded back into the channel. */
const CROSS_FADE = 2.7 / PLANET_RADIUS_LOCAL;
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

/** Angular distance from `d` to the closest point of `arc`, given `side`. */
function arcDistance(arc: Arc, d: THREE.Vector3, side: number): number {
  _proj.copy(d).addScaledVector(arc.n, -d.dot(arc.n));
  if (_proj.lengthSq() < 1e-10) return arc.len;
  _proj.normalize();
  // Within the arc's own span both endpoints are inside one arc length of it.
  if (arc.a.dot(_proj) >= arc.cos && arc.b.dot(_proj) >= arc.cos) {
    return Math.asin(Math.min(1, side));
  }
  return Math.min(arc.a.angleTo(d), arc.b.angleTo(d));
}

/**
 * How much `d` belongs to a crossing, 0 on open channel and 1 on the causeway
 * core. The dot with the arc's plane normal prunes almost every point with one
 * multiply, which matters because the ground mesh samples this a lot at load.
 */
function crossingAt(d: THREE.Vector3): number {
  let best = 0;
  for (const arc of crossingArcs()) {
    const side = Math.abs(d.dot(arc.n));
    if (side > Math.sin(CROSS_FADE)) continue;
    const dist = arcDistance(arc, d, side);
    if (dist >= CROSS_FADE) continue;
    const t = 1 - THREE.MathUtils.smoothstep(dist, CROSS_CORE, CROSS_FADE);
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

  const bend = fbm3(d.x * 4.5 - 6, d.y * 4.5 + 13, d.z * 4.5 + 4, 2) * 0.05;
  const n = fbm3(d.x * 1.6 + 11, d.y * 1.6 - 2, d.z * 1.6 + 7, 3) + bend;
  const width = 0.032 + 0.07 * near - 0.014 * fortress;
  let channel = Math.abs(n) - width;
  if (near > 0.01) {
    const vein = fbm3(d.x * 3.4 - 17, d.y * 3.4 + 5, d.z * 3.4 + 21, 3);
    channel = Math.min(channel, Math.abs(vein) - 0.035 * near);
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
 */
export function oceanField(d: THREE.Vector3): number {
  const field = channelField(d);
  const dry = crossingAt(d);
  if (dry <= 0) return field;
  return THREE.MathUtils.lerp(field, Math.max(field, CROSS_DRY), dry);
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
