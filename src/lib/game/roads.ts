// Road network across the four continents.
//
// One closed ring loops through the four zone centres, with a short spur into
// each zone's centre area. The road is the single source of truth for three
// things: how high the ground sits along it (planet.ts levels the terrain to
// it), where a walker stands on a bridge (biomes.ts answers bridgeHeight and
// isOcean from it), and where scenery may not be planted (props.ts).
//
// Everything here is measured on the unit sphere and converted to surface
// units by RADIUS, the same convention as planet.ts. This module imports
// nothing from the rest of the game: planet.ts hands it the zone centres, the
// raw terrain sampler and the water field through `configureRoadSource`.

import * as THREE from 'three';

export const RADIUS = 42;
export const SEA = RADIUS + 0.4;

/** Half width of the ring, 5.6 units across. */
export const RING_HALF = 2.8;
/** Width over which the levelled road band eases back into the land. */
export const ROAD_EASE = 2.2;
/** Distance between road samples, in surface units. */
const STEP = 0.4;

/** One deck, in the shape collision.ts and autoCollide.ts read. */
export type RoadBridge = { points: THREE.Vector3[]; heights: number[]; halfWidth: number };

export type RoadSource = {
  /** Zone centres, in BIOMES order and by live reference. */
  centres: THREE.Vector3[];
  /** Accent colour of each zone, for the glowing edge line. */
  accents: number[];
  /** Ground height before any levelling. */
  baseRadius: (d: THREE.Vector3) => number;
  /** Signed distance to water: negative inside a channel. */
  water: (d: THREE.Vector3) => number;
  /** Filled with the deck polylines whenever the network is laid out. */
  bridges: RoadBridge[];
};

let src: RoadSource | null = null;
let seedValue = 1;
let ready = false;

export function configureRoadSource(source: RoadSource): void {
  src = source;
  ready = false;
}

/** Forget the network; the next query rebuilds it from the current centres. */
export function resetRoads(seed: number): void {
  seedValue = seed;
  ready = false;
}

// ------------------------------------------------------------ sphere helpers

const _r = new THREE.Vector3();
const _f = new THREE.Vector3();
const _ref = new THREE.Vector3();
const _flat = new THREE.Vector3();
const _step = new THREE.Vector3();

/** East and north at `up`, matching planet.tangentBasis. */
function basis(up: THREE.Vector3, right: THREE.Vector3, fwd: THREE.Vector3): void {
  if (Math.abs(up.y) > 0.98) _ref.set(1, 0, 0);
  else _ref.set(0, 1, 0);
  right.crossVectors(up, _ref).normalize();
  fwd.crossVectors(right, up).normalize();
}

/** `east`/`north` surface units from `d`, matching planet.offsetDir. */
function offset(d: THREE.Vector3, east: number, north: number, out = new THREE.Vector3()): THREE.Vector3 {
  basis(d, _r, _f);
  const len = Math.hypot(east, north);
  if (len < 1e-9) return out.copy(d);
  _step.copy(_r).multiplyScalar(east / len).addScaledVector(_f, north / len);
  const ang = len / RADIUS;
  return out.copy(d).multiplyScalar(Math.cos(ang)).addScaledVector(_step, Math.sin(ang)).normalize();
}

/** Bearing (radians from local north) of direction `target` as seen from `up`. */
function bearingOf(up: THREE.Vector3, target: THREE.Vector3): number {
  basis(up, _r, _f);
  _flat.copy(target).addScaledVector(up, -up.dot(target)).normalize();
  return Math.atan2(_flat.dot(_r), _flat.dot(_f));
}

/** Unit direction `dist` surface units from `up` along a local bearing. */
function atBearing(up: THREE.Vector3, bearing: number, dist: number, out = new THREE.Vector3()): THREE.Vector3 {
  return offset(up, Math.sin(bearing) * dist, Math.cos(bearing) * dist, out);
}

/** Great-circle interpolation between two unit directions. */
function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number, out = new THREE.Vector3()): THREE.Vector3 {
  const ang = a.angleTo(b);
  if (ang < 1e-6) return out.copy(a);
  const s = Math.sin(ang);
  return out
    .copy(a)
    .multiplyScalar(Math.sin((1 - t) * ang) / s)
    .addScaledVector(b, Math.sin(t * ang) / s)
    .normalize();
}

/**
 * Centripetal Catmull-Rom point, projected back onto the sphere.
 *
 * Uniform Catmull-Rom cusps when the control points are unevenly spaced — and
 * they are: the zone feet sit 1-2 units apart, the border midpoints 20 units
 * away. The centripetal parameterisation (alpha 0.5) keeps the curve smooth
 * and inside the control hull however the spacing varies.
 */
function crPoint(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  s: number,
  out: THREE.Vector3
): THREE.Vector3 {
  const knot = (a: THREE.Vector3, b: THREE.Vector3, t: number): number => t + Math.sqrt(a.distanceTo(b));
  const t0 = 0;
  const t1 = knot(p0, p1, t0);
  const t2 = knot(p1, p2, t1);
  const t3 = knot(p2, p3, t2);
  const t = t1 + (t2 - t1) * s;
  const d01 = t1 - t0 || 1e-6;
  const d12 = t2 - t1 || 1e-6;
  const d23 = t3 - t2 || 1e-6;
  const d02 = t2 - t0 || 1e-6;
  const d13 = t3 - t1 || 1e-6;
  const a1x = ((t1 - t) / d01) * p0.x + ((t - t0) / d01) * p1.x;
  const a1y = ((t1 - t) / d01) * p0.y + ((t - t0) / d01) * p1.y;
  const a1z = ((t1 - t) / d01) * p0.z + ((t - t0) / d01) * p1.z;
  const a2x = ((t2 - t) / d12) * p1.x + ((t - t1) / d12) * p2.x;
  const a2y = ((t2 - t) / d12) * p1.y + ((t - t1) / d12) * p2.y;
  const a2z = ((t2 - t) / d12) * p1.z + ((t - t1) / d12) * p2.z;
  const a3x = ((t3 - t) / d23) * p2.x + ((t - t2) / d23) * p3.x;
  const a3y = ((t3 - t) / d23) * p2.y + ((t - t2) / d23) * p3.y;
  const a3z = ((t3 - t) / d23) * p2.z + ((t - t2) / d23) * p3.z;
  const b1x = ((t2 - t) / d02) * a1x + ((t - t0) / d02) * a2x;
  const b1y = ((t2 - t) / d02) * a1y + ((t - t0) / d02) * a2y;
  const b1z = ((t2 - t) / d02) * a1z + ((t - t0) / d02) * a2z;
  const b2x = ((t3 - t) / d13) * a2x + ((t - t1) / d13) * a3x;
  const b2y = ((t3 - t) / d13) * a2y + ((t - t1) / d13) * a3y;
  const b2z = ((t3 - t) / d13) * a2z + ((t - t1) / d13) * a3z;
  out.set(
    ((t2 - t) / d12) * b1x + ((t - t1) / d12) * b2x,
    ((t2 - t) / d12) * b1y + ((t - t1) / d12) * b2y,
    ((t2 - t) / d12) * b1z + ((t - t1) / d12) * b2z
  );
  return out.normalize();
}

/** Sample a Catmull-Rom spline through `ctrl` into a dense direction list. */
function spline(ctrl: THREE.Vector3[], closed: boolean, per: number): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  const n = ctrl.length;
  const segs = closed ? n : n - 1;
  const p = new THREE.Vector3();
  for (let s = 0; s < segs; s++) {
    const p0 = ctrl[closed ? (s - 1 + n) % n : Math.max(0, s - 1)];
    const p1 = ctrl[s];
    const p2 = ctrl[(s + 1) % n];
    const p3 = ctrl[closed ? (s + 2) % n : Math.min(n - 1, s + 2)];
    for (let k = 0; k < per; k++) out.push(crPoint(p0, p1, p2, p3, k / per, p).clone());
  }
  if (!closed) out.push(ctrl[n - 1].clone());
  return out;
}

/** Binomial relaxation of a sampled curve: softens the kinks between control
 * points into the gentle bends a road reads as. */
function relax(pts: THREE.Vector3[], closed: boolean, passes: number, mix: number): void {
  const n = pts.length;
  if (n < 3) return;
  for (let p = 0; p < passes; p++) {
    const copy = pts.map((v) => v.clone());
    for (let i = 0; i < n; i++) {
      if (!closed && (i === 0 || i === n - 1)) continue;
      const a = copy[(i - 1 + n) % n];
      const c = copy[(i + 1) % n];
      pts[i].copy(copy[i]).multiplyScalar(1 - mix).addScaledVector(a, mix * 0.5).addScaledVector(c, mix * 0.5).normalize();
    }
  }
}

/** Resample a direction list to an even arc length. */
function resample(dense: THREE.Vector3[], spacing: number, closed: boolean): THREE.Vector3[] {
  const pts = closed ? [...dense, dense[0]] : dense.slice();
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].angleTo(pts[i - 1]) * RADIUS);
  const total = cum[cum.length - 1];
  const count = Math.max(closed ? 12 : 2, Math.round(total / spacing));
  const out: THREE.Vector3[] = [];
  let j = 0;
  for (let k = 0; k < (closed ? count : count + 1); k++) {
    const target = (k / count) * total;
    while (j < cum.length - 2 && cum[j + 1] < target) j++;
    const span = cum[j + 1] - cum[j] || 1e-9;
    const t = THREE.MathUtils.clamp((target - cum[j]) / span, 0, 1);
    out.push(slerp(pts[j], Math.min(j + 1, pts.length - 1) === j ? pts[j] : pts[j + 1], t));
  }
  return out;
}

// -------------------------------------------------------------- road layout

type Path = {
  pts: THREE.Vector3[];
  h: number[];
  half: number[];
  deck: boolean[];
  zone: number[];
  closed: boolean;
  /** Lateral bow of a spur, in surface units at mid length. */
  bow: number;
  /** First sample the paved strip starts at (spurs begin on the ring's edge). */
  startAt?: number;
};

let paths: Path[] = [];
let segA: THREE.Vector3[] = [];
let segB: THREE.Vector3[] = [];
let segHA: number[] = [];
let segHB: number[] = [];
let segWA: number[] = [];
let segWB: number[] = [];
let segDeck: boolean[] = [];

/** Foot point and inner end of each zone's spur, in zone order. */
type Access = {
  /** Bearing of the spur and of the dip's middle control point. */
  bearing: number;
  /** Control-point bearings at the foot radius (three for the river dip). */
  dips: number[];
  /** Radius of the foot points from the zone centre. */
  foot: number;
  /** Radius of the spur's inner end. */
  end: number;
  bow: number;
};
let access: Access[] = [];

// Zone indices follow the BIOMES order: 0 river, 1 citadel, 2 ark, 3 fortress.
// The ring cycle is river -> citadel -> ark -> fortress -> river.
let RING_ORDER = [0, 1, 2, 3];

/** Mean of the two ring-neighbour directions, as a bearing, for a zone. */
function neighbourBisector(zone: number, neighbours: [number, number]): number {
  const c = src!.centres[zone];
  const a = bearingOf(c, src!.centres[neighbours[0]]);
  const b = bearingOf(c, src!.centres[neighbours[1]]);
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * 0.5;
}

/** Angle between two bearings, 0..PI. */
function bearingGap(a: number, b: number): number {
  let diff = Math.abs(a - b) % (Math.PI * 2);
  if (diff > Math.PI) diff = Math.PI * 2 - diff;
  return diff;
}

/** The contiguous water band a ray from `c` crosses, as [first, last] radius. */
function waterBand(c: THREE.Vector3, bearing: number): [number, number] | null {
  let first = -1;
  let last = -1;
  for (let d = 3; d <= 27; d += 0.3) {
    if (src!.water(atBearing(c, bearing, d)) < 0) {
      if (first < 0) first = d;
      last = d;
    }
  }
  return first < 0 ? null : [first, last];
}

/** Shortest signed difference between two bearings, in (-PI, PI]. */
function bearingDelta(a: number, b: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d <= -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * How the ring should travel through a zone, as bearings.
 *
 * The ring passes each zone between the two directions of its neighbours on
 * the loop. For the river zone those bearings decide whether the road can
 * reach the canyon: a different loop order puts the canyon between a different
 * pair, so the order is picked to give the road the widest crossing.
 */
type Route = { cycle: number[]; dips: number[]; foot: number };

function routeFor(cycle: number[]): Route {
  const c = src!.centres[0];
  const k = cycle.indexOf(0);
  const prev = src!.centres[cycle[(k + 3) % 4]];
  const next = src!.centres[cycle[(k + 1) % 4]];
  const a1 = bearingOf(c, prev);
  const sweep = bearingDelta(a1, bearingOf(c, next));
  let best = a1 + sweep * 0.5;
  let bestWidth = 0;
  for (let i = 1; i < 32; i++) {
    const t = i / 32;
    const b = a1 + sweep * t;
    const band = waterBand(c, b);
    if (!band) continue;
    const width = band[1] - band[0];
    const mid = t;
    const score = width - Math.abs(mid - 0.5) * 0.8;
    if (score > bestWidth) {
      bestWidth = score;
      best = b;
    }
  }
  const band = waterBand(c, best);
  const inner = band ? band[0] : 12;
  const foot = THREE.MathUtils.clamp(inner - 2.2, 7.6, 12);
  const dips = [best - 0.22, best, best + 0.22];
  // The ring visits the dip in travel order; reversed travel must not double back.
  if (sweep < 0) dips.reverse();
  return { cycle, dips, foot };
}

function planAccess(): void {
  const centres = src!.centres;
  // Hamiltonian loops over the four zones, up to reversal.
  const cycles = [
    [0, 1, 2, 3],
    [0, 1, 3, 2],
    [0, 2, 1, 3]
  ];
  let route = routeFor(cycles[0]);
  let bestSpan = -Infinity;
  for (const cycle of cycles) {
    const r = routeFor(cycle);
    const band = waterBand(centres[0], r.dips[1]);
    const span = band ? band[1] - band[0] : 0;
    if (span > bestSpan) {
      bestSpan = span;
      route = r;
    }
  }
  RING_ORDER = route.cycle;

  const cycle = route.cycle;
  const k = cycle.indexOf(0);
  const neighbours = (z: number): [number, number] => [
    cycle[(cycle.indexOf(z) + 3) % 4],
    cycle[(cycle.indexOf(z) + 1) % 4]
  ];
  void k;
  const out: Access[] = [];
  out[0] = { bearing: route.dips[1], dips: route.dips, foot: route.foot, end: 6.4, bow: 0 };
  // Citadel: the gate faces the river zone, which is also a ring neighbour.
  {
    const b = bearingOf(centres[1], centres[0]);
    out[1] = { bearing: b, dips: [b], foot: 19.5, end: 15, bow: 0 };
  }
  // Ark: the hull lies north of the beacon and reaches about 25 units out, so
  // the ring sweeps round it at 30 units and the spur runs in from the far
  // side. Take the approach bearing closest to the ring bisector.
  {
    const nb = neighbours(2);
    const want = neighbourBisector(2, nb);
    const options = [Math.PI, Math.PI / 2, -Math.PI / 2];
    let pick = options[0];
    let bestGap = Infinity;
    for (const b of options) {
      const g = bearingGap(b, want);
      if (g < bestGap) {
        bestGap = g;
        pick = b;
      }
    }
    const c = centres[2];
    const sweep = bearingDelta(bearingOf(c, centres[nb[0]]), bearingOf(c, centres[nb[1]]));
    const dips = [pick - 0.5, pick, pick + 0.5];
    if (sweep < 0) dips.reverse();
    out[2] = { bearing: pick, dips, foot: 30, end: 6.0, bow: 0.4 };
  }
  // Fortress: the west wall gate (local 270 degrees) has no laser fence.
  {
    const b = -Math.PI / 2;
    out[3] = { bearing: b, dips: [b], foot: 17, end: 6.0, bow: 0 };
  }
  access = out;
}

/** Half width of the road at a spur fraction t (0 at the foot, 1 at the end). */
function spurHalf(t: number): number {
  return 1.75 + (RING_HALF - 1.75) * (1 - THREE.MathUtils.smoothstep(t, 0, 0.55));
}

function buildPaths(): void {
  const centres = src!.centres;
  const feet = access.map((a, i) => atBearing(centres[i], a.bearing, a.foot));
  const mids: THREE.Vector3[] = [];
  for (let k = 0; k < 4; k++) {
    const i = RING_ORDER[k];
    const j = RING_ORDER[(k + 1) % 4];
    mids.push(centres[i].clone().add(centres[j]).normalize());
  }
  const ctrl: THREE.Vector3[] = [];
  for (let k = 0; k < 4; k++) {
    const z = RING_ORDER[k];
    const a = access[z];
    for (const b of a.dips) ctrl.push(atBearing(centres[z], b, a.foot));
    ctrl.push(mids[k]);
  }
  const ringDense = spline(ctrl, true, 32);
  relax(ringDense, true, 3, 0.5);
  const ringPts = resample(ringDense, STEP, true);
  // A light pass on the evenly spaced samples kills the small radius wobble
  // where the river dip's control points meet the long border stretches.
  relax(ringPts, true, 3, 0.5);

  const ring: Path = {
    pts: ringPts,
    h: [],
    half: ringPts.map(() => RING_HALF),
    deck: ringPts.map(() => false),
    zone: [],
    closed: true,
    bow: 0
  };

  const spurs: Path[] = access.map((a, i) => {
    const c = centres[i];
    const foot = feet[i];
    const end = atBearing(c, a.bearing, a.end);
    const dense: THREE.Vector3[] = [];
    const lateral = new THREE.Vector3().crossVectors(foot, end).normalize();
    for (let k = 0; k <= 48; k++) {
      const t = k / 48;
      const p = slerp(foot, end, t);
      if (a.bow !== 0) p.addScaledVector(lateral, (Math.sin(Math.PI * t) * a.bow) / RADIUS).normalize();
      dense.push(p);
    }
    relax(dense, false, 4, 0.5);
    const pts = resample(dense, STEP, false);
    const n = pts.length;
    return {
      pts,
      h: [],
      half: pts.map((_, k) => spurHalf(k / Math.max(1, n - 1))),
      deck: pts.map(() => false),
      zone: pts.map(() => i),
      closed: false,
      bow: a.bow
    };
  });

  // A spur's paving begins where it clears the ring's own paving.
  const clearance = Math.cos((RING_HALF + 0.15) / RADIUS);
  for (const sp of spurs) {
    let k = 0;
    while (k < sp.pts.length - 4) {
      let onRing = false;
      for (const q of ringPts) {
        if (sp.pts[k].dot(q) > clearance) {
          onRing = true;
          break;
        }
      }
      if (!onRing) break;
      k++;
    }
    sp.startAt = Math.min(k, Math.max(0, sp.pts.length - 4));
  }
  paths = [ring, ...spurs];
  for (const p of paths) {
    if (p.closed) p.zone = p.pts.map((d) => nearestZone(d));
  }
}

function nearestZone(d: THREE.Vector3): number {
  let best = 0;
  let bestAng = Infinity;
  for (let i = 0; i < src!.centres.length; i++) {
    const a = d.angleTo(src!.centres[i]);
    if (a < bestAng) {
      bestAng = a;
      best = i;
    }
  }
  return best;
}

// --------------------------------------------------------------- the heights

/** Smooth the dry ground along a path and keep the grade walkable. */
function profile(p: Path): void {
  const n = p.pts.length;
  const w = new Float64Array(n);
  const base = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    w[i] = src!.water(p.pts[i]);
    base[i] = src!.baseRadius(p.pts[i]);
  }
  const W = 7;
  const sm = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let ws = 0;
    for (let k = -W; k <= W; k++) {
      let j = i + k;
      if (p.closed) j = ((j % n) + n) % n;
      else if (j < 0 || j >= n) continue;
      const wgt = (1 - Math.abs(k) / (W + 1)) * THREE.MathUtils.smoothstep(w[j], 0.0, 1.2);
      if (wgt <= 0) continue;
      sum += base[j] * wgt;
      ws += wgt;
    }
    sm[i] = ws > 0.05 ? sum / ws : base[i];
  }
  // Beside the water the road must stay above the sheet, so the abutments do.
  // The pull fades out over four units, so this never becomes a step.
  for (let i = 0; i < n; i++) {
    const near = THREE.MathUtils.smoothstep(4.0 - w[i], 0, 4.0);
    if (near > 0) sm[i] += Math.max(0, SEA + 0.7 - sm[i]) * near;
  }
  // Grade limit: a walker and a vehicle both hate a staircase.
  const MAX_GRADE = 0.3;
  const ds: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = p.closed ? (i + 1) % n : i + 1;
    ds.push(j < n ? p.pts[i].angleTo(p.pts[j]) * RADIUS : 0);
  }
  for (let pass = 0; pass < 8; pass++) {
    const fwd = pass % 2 === 0;
    for (let k = 0; k < n - (p.closed ? 0 : 1); k++) {
      const i = fwd ? k : n - 1 - k;
      const j = fwd ? (i + 1) % n : (i - 1 + n) % n;
      if (!p.closed && (j < 0 || j >= n)) continue;
      const lim = MAX_GRADE * ds[fwd ? i : j];
      if (sm[j] > sm[i] + lim) sm[j] = sm[i] + lim;
      if (sm[j] < sm[i] - lim) sm[j] = sm[i] - lim;
    }
  }
  p.h = Array.from(sm);
  p.deck = p.pts.map(() => false);
}

/**
 * Make every spur start at the ring's own height. The two profiles are smoothed
 * along different directions, so without this the junction is a step where the
 * nearest-segment lookup hands the walker from one path to the other.
 */
function joinSpurs(): void {
  const ring = paths[0];
  const rn = ring.pts.length;
  for (let i = 1; i < paths.length; i++) {
    const sp = paths[i];
    let along = 0;
    for (let k = 0; k < sp.pts.length; k++) {
      if (k > 0) along += sp.pts[k].angleTo(sp.pts[k - 1]) * RADIUS;
      const wgt = 1 - THREE.MathUtils.smoothstep(along, 4, 10);
      if (wgt <= 0) continue;
      // Height of the ring at the closest point of its own polyline, so the
      // junction matches the ring's smooth profile and not a single sample.
      let best = Infinity;
      let bestH = ring.h[0];
      for (let j = 0; j < rn; j++) {
        const a = ring.pts[j];
        const b = ring.pts[(j + 1) % rn];
        _ab.subVectors(b, a);
        _ap.subVectors(sp.pts[k], a);
        const denom = _ab.lengthSq();
        const t = denom > 1e-12 ? THREE.MathUtils.clamp(_ap.dot(_ab) / denom, 0, 1) : 0;
        _close.copy(a).addScaledVector(_ab, t).normalize();
        const dist = sp.pts[k].angleTo(_close) * RADIUS;
        if (dist < best) {
          best = dist;
          bestH = ring.h[j] + (ring.h[(j + 1) % rn] - ring.h[j]) * t;
        }
      }
      sp.h[k] = sp.h[k] * (1 - wgt) + bestH * wgt;
    }
  }
}

/** Cap the grade of an already-built profile. */
function clampGrade(p: Path): void {
  const n = p.pts.length;
  const MAX_GRADE = 0.3;
  const h = Float64Array.from(p.h);
  const ds: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = p.closed ? (i + 1) % n : i + 1;
    ds.push(j < n ? p.pts[i].angleTo(p.pts[j]) * RADIUS : 0);
  }
  for (let pass = 0; pass < 8; pass++) {
    const fwd = pass % 2 === 0;
    for (let k = 0; k < n - (p.closed ? 0 : 1); k++) {
      const i = fwd ? k : n - 1 - k;
      const j = fwd ? (i + 1) % n : (i - 1 + n) % n;
      if (!p.closed && (j < 0 || j >= n)) continue;
      const lim = MAX_GRADE * ds[fwd ? i : j];
      if (h[j] > h[i] + lim) h[j] = h[i] + lim;
      if (h[j] < h[i] - lim) h[j] = h[i] - lim;
    }
  }
  p.h = Array.from(h);
}

/**
 * Hold the profile level around each junction. The ring's grade at a foot can
 * change height by most of a metre across the junction's own width, which would
 * leave the ground levelled across the spur and the spur's paving buried in it.
 */
function flattenJunctions(): void {
  const ring = paths[0];
  const rn = ring.pts.length;
  for (let i = 1; i < paths.length; i++) {
    const sp = paths[i];
    let best = 0;
    let bestAng = Infinity;
    for (let j = 0; j < rn; j++) {
      const a = ring.pts[j].angleTo(sp.pts[0]);
      if (a < bestAng) {
        bestAng = a;
        best = j;
      }
    }
    const level = ring.h[best];
    for (let k = 0; k < rn; k++) {
      const a = ring.pts[k].angleTo(ring.pts[best]) * RADIUS;
      const wgt = 1 - THREE.MathUtils.smoothstep(a, 1.5, 4.5);
      if (wgt > 0) ring.h[k] += (level - ring.h[k]) * wgt;
    }
    let along = 0;
    for (let k = 0; k < sp.pts.length; k++) {
      if (k > 0) along += sp.pts[k].angleTo(sp.pts[k - 1]) * RADIUS;
      const wgt = 1 - THREE.MathUtils.smoothstep(along, 1.5, 4.5);
      if (wgt > 0) sp.h[k] += (level - sp.h[k]) * wgt;
    }
  }
}

/** Turn every water stretch into a deck that lands on firm ground. */function buildDecks(p: Path): void {
  const n = p.pts.length;
  const water = p.pts.map((d) => src!.water(d));
  const runs: [number, number][] = [];
  let i = 0;
  // Start the scan at dry ground so a closed loop wraps at most once.
  let start = 0;
  if (p.closed) {
    for (let k = 0; k < n; k++) {
      if (water[k] >= 0) {
        start = k;
        break;
      }
    }
  }
  i = start;
  const seen = p.closed ? n : n;
  while (i < start + seen) {
    const idx = i % n;
    if (water[idx] >= 0) {
      i++;
      continue;
    }
    let a = idx;
    let b = idx;
    let count = 0;
    while (count < n && water[(i + count) % n] < 0) {
      b = (i + count) % n;
      count++;
    }
    // Run the deck onto firm dry ground at both ends.
    let guard = 0;
    while (guard++ < 40 && water[(a - 1 + n) % n] < 0) a = (a - 1 + n) % n;
    guard = 0;
    while (guard++ < 40 && water[(b + 1) % n] < 0) b = (b + 1) % n;
    guard = 0;
    while (guard++ < 40 && water[(a - 1 + n) % n] < 1.4) a = (a - 1 + n) % n;
    guard = 0;
    while (guard++ < 40 && water[(b + 1) % n] < 1.4) b = (b + 1) % n;
    runs.push([a, b]);
    i += count;
  }

  for (const [a, b] of runs) {
    const span = b - a + n * (b < a ? 1 : 0);
    const steps = Math.max(1, span);
    const hA = p.h[a];
    const hB = p.h[b % n];
    for (let s = 0; s <= steps; s++) {
      const idx = (a + s) % n;
      const u = s / steps;
      const chord = hA + (hB - hA) * u;
      const arch = Math.sin(Math.PI * u) * 0.42;
      // The deck floor rises into the span from the abutments, never at them.
      const k = Math.min(
        THREE.MathUtils.smoothstep(u, 0.06, 0.4),
        THREE.MathUtils.smoothstep(1 - u, 0.06, 0.4)
      );
      const floor = SEA + 1.35;
      p.h[idx] = chord + arch + Math.max(0, floor - (chord + arch)) * k;
      p.deck[idx] = true;
    }
  }
}

// --------------------------------------------------------------- the lookup

/** Side of one lookup cell in unit-sphere space, about 5.2 surface units. */
const CELL = 0.124;
/** Reach beyond a segment that still counts as "near the road". */
const REACH = RING_HALF + ROAD_EASE + 0.6;
const grid = new Map<number, number[]>();

function cellKey(ix: number, iy: number, iz: number): number {
  return ((ix + 64) * 128 + (iy + 64)) * 128 + (iz + 64);
}

function buildLookup(): void {
  segA = [];
  segB = [];
  segHA = [];
  segHB = [];
  segWA = [];
  segWB = [];
  segDeck = [];
  grid.clear();
  for (const p of paths) {
    const n = p.pts.length;
    const last = p.closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const j = (i + 1) % n;
      const idx = segA.length;
      segA.push(p.pts[i]);
      segB.push(p.pts[j]);
      segHA.push(p.h[i]);
      segHB.push(p.h[j]);
      segWA.push(p.half[i]);
      segWB.push(p.half[j]);
      segDeck.push(p.deck[i] || p.deck[j]);
      const reach = (Math.max(p.half[i], p.half[j]) + ROAD_EASE + 0.6) / RADIUS;
      const a = p.pts[i];
      const b = p.pts[j];
      const x0 = Math.floor((Math.min(a.x, b.x) - reach) / CELL);
      const x1 = Math.floor((Math.max(a.x, b.x) + reach) / CELL);
      const y0 = Math.floor((Math.min(a.y, b.y) - reach) / CELL);
      const y1 = Math.floor((Math.max(a.y, b.y) + reach) / CELL);
      const z0 = Math.floor((Math.min(a.z, b.z) - reach) / CELL);
      const z1 = Math.floor((Math.max(a.z, b.z) + reach) / CELL);
      for (let x = x0; x <= x1; x++) {
        for (let y = y0; y <= y1; y++) {
          for (let z = z0; z <= z1; z++) {
            const key = cellKey(x, y, z);
            const list = grid.get(key);
            if (list) list.push(idx);
            else grid.set(key, [idx]);
          }
        }
      }
    }
  }
}

export type RoadHit = { dist: number; height: number; half: number; deck: boolean };

const hit: RoadHit = { dist: Infinity, height: 0, half: 0, deck: false };
const _ab = new THREE.Vector3();
const _ap = new THREE.Vector3();
const _close = new THREE.Vector3();

/** Nearest point of the network to `d`, or null when `d` is far from it. */
export function roadHit(d: THREE.Vector3): RoadHit | null {
  ensureRoads();
  const list = grid.get(cellKey(Math.floor(d.x / CELL), Math.floor(d.y / CELL), Math.floor(d.z / CELL)));
  if (!list) return null;
  let best = Infinity;
  let bestIdx = -1;
  let bestT = 0;
  for (const i of list) {
    const a = segA[i];
    _ab.subVectors(segB[i], a);
    _ap.subVectors(d, a);
    const denom = _ab.lengthSq();
    const t = denom > 1e-12 ? THREE.MathUtils.clamp(_ap.dot(_ab) / denom, 0, 1) : 0;
    _close.copy(a).addScaledVector(_ab, t).normalize();
    const dist = d.angleTo(_close) * RADIUS;
    if (dist < best) {
      best = dist;
      bestIdx = i;
      bestT = t;
    }
  }
  if (bestIdx < 0) return null;
  const half = segWA[bestIdx] + (segWB[bestIdx] - segWA[bestIdx]) * bestT;
  if (best > half + ROAD_EASE + 0.4) return null;
  hit.dist = best;
  hit.height = segHA[bestIdx] + (segHB[bestIdx] - segHA[bestIdx]) * bestT;
  hit.half = half;
  hit.deck = segDeck[bestIdx];
  return hit;
}

/** Radius a bridge deck gives a walker at `d`, or null off the decks. */
export function roadDeckHeight(d: THREE.Vector3): number | null {
  const h = roadHit(d);
  if (!h || !h.deck) return null;
  if (h.dist > h.half + 0.15) return null;
  return h.height + 0.06;
}

/**
 * True when a solid circle of `radius` at `d` stands in the carriageway. Bridge
 * decks are exempt: their railings are meant to be there.
 */
export function roadBlocks(d: THREE.Vector3, radius: number): boolean {
  const h = roadHit(d);
  if (!h || h.deck) return false;
  return h.dist - radius < h.half - 0.1;
}

/** True when `d` is inside the road band plus `margin` surface units. */
export function onRoad(d: THREE.Vector3, margin = 1.4): boolean {
  const h = roadHit(d);
  return h !== null && h.dist <= h.half + margin;
}

/** Distance from `d` to the road centreline, or Infinity. */
export function roadDistance(d: THREE.Vector3): number {
  const h = roadHit(d);
  return h ? h.dist : Infinity;
}

// --------------------------------------------------------------- assembly

function ensureRoads(): void {
  if (ready || !src) return;
  ready = true;
  grid.clear();
  planAccess();
  buildPaths();
  for (const p of paths) profile(p);
  joinSpurs();
  flattenJunctions();
  for (const p of paths) clampGrade(p);
  for (const p of paths) buildDecks(p);
  buildLookup();
  publishBridges();
}

function publishBridges(): void {
  if (!src) return;
  src.bridges.length = 0;
  for (const p of paths) {
    const n = p.pts.length;
    let i = 0;
    while (i < n) {
      if (!p.deck[i]) {
        i++;
        continue;
      }
      const a = i;
      while (i + 1 < n && p.deck[i + 1]) i++;
      const b = i;
      if (b - a < 4) {
        i++;
        continue;
      }
      const points = p.pts.slice(a, b + 1).map((d) => d.clone());
      const heights = p.h.slice(a, b + 1);
      let halfWidth = 0;
      for (let k = a; k <= b; k++) halfWidth = Math.max(halfWidth, p.half[k]);
      src.bridges.push({ points, heights, halfWidth });
      i++;
    }
  }
}

/** Everything the measuring script wants to see. */
export function roadSamples(): { pts: THREE.Vector3[]; h: number[]; half: number[]; deck: boolean[]; closed: boolean }[] {
  ensureRoads();
  return paths.map((p) => ({ pts: p.pts, h: p.h, half: p.half, deck: p.deck, closed: p.closed }));
}

/** Zone index whose accent colours the edge line at `d`. */
export function roadZoneAt(d: THREE.Vector3): number {
  ensureRoads();
  return nearestZone(d);
}

// --------------------------------------------------------------- geometry

export type RoadPiece = { glow: boolean; color: number; geometry: THREE.BufferGeometry };

const ROAD_METAL = 0x525c67;
const ROAD_EDGE = 0x303943;
const DECK_METAL = 0x1c232a;
const RAIL_GLOW = 0xcaf6ff;
const EDGE_LIFT = 0.08;
const DECK_DEPTH = 0.42;

const _tan = new THREE.Vector3();
const _side = new THREE.Vector3();
const _p0 = new THREE.Vector3();
const _p1 = new THREE.Vector3();

/** Tangent of a path at sample i, projected to the surface. */
function tangentAt(p: Path, i: number, out: THREE.Vector3): THREE.Vector3 {
  const n = p.pts.length;
  const a = p.pts[p.closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
  const b = p.pts[p.closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
  const d = p.pts[i];
  out.subVectors(b, a);
  out.addScaledVector(d, -out.dot(d));
  if (out.lengthSq() < 1e-10) out.crossVectors(d, new THREE.Vector3(0, 1, 0));
  return out.normalize();
}

/** Add one quad strip between two rails over samples i0..i1 (inclusive). */
function strip(
  out: number[],
  p: Path,
  i0: number,
  i1: number,
  offsetA: number,
  offsetB: number,
  liftA: number,
  liftB: number,
  up: boolean
): void {
  const n = p.pts.length;
  const count = i1 - i0;
  if (count < 1) return;
  const rail = (i: number, off: number, lift: number, outV: THREE.Vector3): THREE.Vector3 => {
    const d = p.pts[i];
    tangentAt(p, i, _tan);
    _side.crossVectors(d, _tan).normalize();
    // Offsets are written for the full ring width; a tapering spur narrows.
    const ang = (off * (p.half[i] / RING_HALF)) / RADIUS;
    outV.copy(d).multiplyScalar(Math.cos(ang)).addScaledVector(_side, Math.sin(ang)).normalize();
    // Same function the ground uses, so paving and terrain can never disagree.
    const hit = roadHit(outV);
    const top = hit ? hit.height : p.h[i];
    return outV.multiplyScalar(top + lift);
  };
  for (let k = 0; k < count; k++) {
    const i = i0 + k;
    const j = i + 1 > n - 1 && !p.closed ? n - 1 : (i + 1) % n;
    rail(i, offsetA, liftA, _p0);
    rail(i, offsetB, liftB, _p1);
    const a0x = _p0.x, a0y = _p0.y, a0z = _p0.z;
    const b0x = _p1.x, b0y = _p1.y, b0z = _p1.z;
    rail(j, offsetA, liftA, _p0);
    rail(j, offsetB, liftB, _p1);
    const a1x = _p0.x, a1y = _p0.y, a1z = _p0.z;
    const b1x = _p1.x, b1y = _p1.y, b1z = _p1.z;
    if (up) {
      out.push(a0x, a0y, a0z, a1x, a1y, a1z, b0x, b0y, b0z);
      out.push(b0x, b0y, b0z, a1x, a1y, a1z, b1x, b1y, b1z);
    } else {
      out.push(a0x, a0y, a0z, b0x, b0y, b0z, a1x, a1y, a1z);
      out.push(b0x, b0y, b0z, b1x, b1y, b1z, a1x, a1y, a1z);
    }
  }
}

function geo(positions: number[]): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return g;
}

/** Geometry with one flat vertex colour, for the standalone paving mesh. */
function tinted(positions: number[], hex: number): THREE.BufferGeometry {
  const g = geo(positions);
  g.computeVertexNormals();
  const colour = new THREE.Color(hex);
  const n = positions.length / 3;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = colour.r;
    arr[i * 3 + 1] = colour.g;
    arr[i * 3 + 2] = colour.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

const BOX = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
const _m = new THREE.Matrix4();
const _bq = new THREE.Quaternion();
const _bp = new THREE.Vector3();
const _bs = new THREE.Vector3();

/** Append a box standing on the road at sample i, at lateral `off`. */
function boxAt(out: number[], p: Path, i: number, off: number, width: number, height: number, lift: number): void {
  const d = p.pts[i];
  tangentAt(p, i, _tan);
  _side.crossVectors(d, _tan).normalize();
  const ang = (off * (p.half[i] / RING_HALF)) / RADIUS;
  const dir = d
    .clone()
    .multiplyScalar(Math.cos(ang))
    .addScaledVector(_side, Math.sin(ang))
    .normalize();
  const up = dir;
  const right = new THREE.Vector3().crossVectors(up, _tan).normalize();
  const fwd = new THREE.Vector3().crossVectors(right, up).normalize();
  _m.makeBasis(right, up, fwd);
  _bq.setFromRotationMatrix(_m);
  _bp.copy(dir).multiplyScalar(p.h[i] + lift + height * 0.5);
  _bs.set(width, height, width);
  _m.compose(_bp, _bq, _bs);
  const pos = BOX.attributes.position.array as Float32Array;
  const v = new THREE.Vector3();
  for (let k = 0; k < pos.length; k += 3) {
    v.set(pos[k], pos[k + 1], pos[k + 2]).applyMatrix4(_m);
    out.push(v.x, v.y, v.z);
  }
}

let pieces: RoadPiece[] | null = null;
let surfaceGeo: THREE.BufferGeometry | null = null;

/**
 * The paved surface on its own, as a standalone mesh for the ground.
 *
 * It rides in the ground mesh rather than the props batch on purpose: the
 * props mesh casts shadows, and a surface lifted a few centimetres above the
 * terrain casts a saw-toothed band of shadow along its own edges. The ground
 * does not cast, so the paving reads as one clean ribbon.
 */
export function roadSurfaceMesh(): THREE.Mesh | null {
  roadPieces();
  if (!surfaceGeo) return null;
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.86,
    metalness: 0.06,
    // Keep the paving dark from every angle: a glossy surface picks up the
    // bright sky at grazing angles and reads as pale concrete from orbit.
    envMapIntensity: 0.35,
    // The paving is barely above the levelled band; this keeps it in front.
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const mesh = new THREE.Mesh(surfaceGeo, material);
  mesh.receiveShadow = true;
  mesh.name = 'road';
  return mesh;
}

/** The road's edge lights, deck fascias and railings, as batch-ready geometry. */
export function roadPieces(): RoadPiece[] {
  ensureRoads();
  if (pieces) return pieces;
  const paved: number[] = [];
  const dark: number[] = [];
  const edgeByZone: number[][] = [[], [], [], []];
  const railByZone: number[][] = [[], [], [], []];
  const posts: number[] = [];

  for (const p of paths) {
    const n = p.pts.length;
    // Paved surface. A spur starts where the ring's own paving ends, so the
    // two strips meet edge to edge instead of lying on top of each other.
    const lift = EDGE_LIFT + (p.closed ? 0 : 0.02);
    const start = p.startAt ?? 0;
    strip(paved, p, start, p.closed ? n : n - 1, -RING_HALF, RING_HALF, lift, lift, true);
    // Thin glowing lines inboard of both edges, split into runs of one zone
    // colour so a batch part never has to blend two accents in one mesh.
    const last = p.closed ? n : n - 1;
    let runStart = start;
    for (let i = 1; i <= last; i++) {
      const ended = i === last || p.zone[i % n] !== p.zone[runStart];
      if (!ended) continue;
      const zone = p.zone[runStart];
      for (const side of [-1, 1]) {
        strip(edgeByZone[zone], p, runStart, i, side * (RING_HALF - 0.16) - 0.07, side * (RING_HALF - 0.16) + 0.07, EDGE_LIFT + 0.035, EDGE_LIFT + 0.035, true);
      }
      runStart = i;
    }
    // Decks: soffit, fascias, rails, posts.
    let i = 0;
    while (i < n) {
      if (!p.deck[i]) {
        i++;
        continue;
      }
      const a = i;
      while (i + 1 < n && p.deck[i + 1]) i++;
      const b = i;
      if (b - a < 4) {
        i++;
        continue;
      }
      // Underside and sides of the deck.
      strip(dark, p, a, b, -RING_HALF, RING_HALF, -DECK_DEPTH, -DECK_DEPTH, false);
      for (const side of [-1, 1]) {
        strip(dark, p, a, b, side * RING_HALF, side * RING_HALF, EDGE_LIFT, -DECK_DEPTH, side < 0 ? false : true);
      }
      // Rails: a glowing bar at hand height on both sides.
      for (const side of [-1, 1]) {
        const off = side * (RING_HALF - 0.16);
        for (let k = a; k < b; k++) {
          strip(railByZone[p.zone[k]], p, k, k + 1, off - 0.05, off + 0.05, 0.86, 0.86, true);
        }
      }
      for (let k = a + 1; k < b; k += 5) {
        for (const side of [-1, 1]) boxAt(posts, p, k, side * (RING_HALF - 0.16), 0.13, 0.9, 0.02);
      }
      i++;
    }
  }

  const out: RoadPiece[] = [];
  surfaceGeo = tinted(paved, ROAD_METAL);
  if (dark.length) out.push({ glow: false, color: DECK_METAL, geometry: geo(dark) });
  if (posts.length) out.push({ glow: false, color: ROAD_EDGE, geometry: geo(posts) });
  for (let z = 0; z < 4; z++) {
    if (edgeByZone[z].length) out.push({ glow: true, color: src!.accents[z], geometry: geo(edgeByZone[z]) });
  }
  if (railByZone.some((r) => r.length)) {
    const rail: number[] = [];
    for (const r of railByZone) rail.push(...r);
    out.push({ glow: true, color: RAIL_GLOW, geometry: geo(rail) });
  }
  pieces = out;
  return out;
}
