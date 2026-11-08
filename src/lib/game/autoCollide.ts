// Automatic collision for baked scenery. Zone builders register footprints by
// hand, and some of them miss: this pass reads the merged solid mesh itself and
// drops a small collider wherever the geometry stands in the player's way.
//
// The mesh is baked in planet space, so a triangle sample's height above the
// ground is simply its distance from the planet centre minus `walkRadius` in
// that direction. Anything below the knee is ground decoration, anything above
// head height is something the player walks under; only the band between them
// becomes solid. Glowing parts never do: light bars are not walls.

import * as THREE from 'three';
import type { Collider } from './collision';
import { PLANET_RADIUS, offsetDir, walkRadius } from './planet';
import { BIOMES, BRIDGES, oceanField } from './biomes';

/** Sample spacing along triangle edges, surface units. */
const SPACING = 0.3;
/** Side of one dedupe cell on the surface, surface units. */
const CELL = 0.42;
/** Footprint radius of every collider this pass adds. */
const RADIUS = 0.45;
/** Below this height a prop is ground decoration: walk over it. */
const LOW = 0.3;
/** Above this height a prop is overhead: walk under it. */
const HIGH = 1.8;
/** Hard cap on subdivisions per triangle, so a long deck cannot explode. */
const MAX_DIV = 80;

/** A place no automatic collider may close off. `top` is a deck height, when the spot is a bridge. */
export type KeepFree = { dir: THREE.Vector3; radius: number; top?: number };

/**
 * The spots the world layout promises to keep walkable: every beacon, every
 * robot's stand spot, and the player's spawn. Built here as well as passed in,
 * so the guard cannot be lost by a caller.
 */
function protectedSpots(extra: KeepFree[]): KeepFree[] {
  const out: KeepFree[] = extra.slice();
  for (const b of BIOMES) {
    out.push({ dir: b.center.clone(), radius: 3 });
    out.push({ dir: offsetDir(b.center.clone(), 4, -4), radius: 1.5 });
  }
  out.push({ dir: offsetDir(BIOMES[0].center.clone(), 1.4, -3.6), radius: 1.5 });
  return out;
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _ab = new THREE.Vector3();
const _ac = new THREE.Vector3();
const _p = new THREE.Vector3();
const _d = new THREE.Vector3();
const _n = new THREE.Vector3();
const _mid = new THREE.Vector3();

const SCALE = PLANET_RADIUS / CELL;
/** Distance from a cell centre to its far corner, surface units. */
const HALF_DIAG = CELL * 0.87;
/** Neighbourhood radius, in buckets. One bucket is wider than any footprint here. */
const REACH_BUCKETS = 1;

type Cell = { ix: number; iy: number; iz: number; min: number; max: number; px: number; py: number; pz: number };

/** Bucket side for the existing-collider index, unit-sphere space (about 5 units). */
const BUCKET = 0.12;

function bucketKey(x: number, y: number, z: number): number {
  return ((x + 64) * 128 + (y + 64)) * 128 + (z + 64);
}

/**
 * Walkable circle every 0.8 units along every bridge deck, carried 2 units past
 * each end. The deck rides above `walkRadius`, so without this the pass reads
 * the deck as an obstacle standing in a walker's path and walls the bridge off.
 * Nothing may be placed inside these circles; the railings sit outside them and
 * still get their own colliders.
 */
function bridgeOpenings(): KeepFree[] {
  if (BRIDGES.length === 0) oceanField(new THREE.Vector3(0, 1, 0)); // bridges are laid out lazily
  const out: KeepFree[] = [];
  const STEP = 0.8;
  const OVERRUN = 3;
  for (const deck of BRIDGES) {
    // The published half-width is wider than the deck that is actually drawn
    // (3.5 across), so the corridor is capped: it must stay inside the railings,
    // or the railings would be suppressed and the player could walk off the side.
    const radius = Math.max(0.6, Math.min(deck.halfWidth - 0.8, 1));
    const pts = deck.points;
    if (pts.length < 2) continue;
    // Arc length between polyline vertices, so the step is in surface units.
    const push = (d: THREE.Vector3, top: number): void => {
      out.push({ dir: d.clone().normalize(), radius, top });
    };
    const tangentAt = (i: number, j: number): THREE.Vector3 => {
      const t = new THREE.Vector3().subVectors(pts[j], pts[i]);
      return t.addScaledVector(pts[i], -t.dot(pts[i])).normalize();
    };
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const segLen = a.angleTo(b) * PLANET_RADIUS;
      const n = Math.max(1, Math.ceil(segLen / STEP));
      for (let k = 0; k < n; k++) {
        const u = k / n;
        const p = a.clone().multiplyScalar(1 - u).addScaledVector(b, u).normalize();
        push(p, deck.heights[i] * (1 - u) + deck.heights[Math.min(i + 1, deck.heights.length - 1)] * u);
      }
    }
    push(pts[pts.length - 1], deck.heights[deck.heights.length - 1]);
    // Extend the corridor past each abutment.
    const head = tangentAt(0, 1).multiplyScalar(-1);
    const tail = tangentAt(pts.length - 2, pts.length - 1);
    for (let d = STEP; d <= OVERRUN + 1e-6; d += STEP) {
      const a = (d / PLANET_RADIUS);
      push(pts[0].clone().multiplyScalar(Math.cos(a)).addScaledVector(head, Math.sin(a)), deck.heights[0]);
      push(pts[pts.length - 1].clone().multiplyScalar(Math.cos(a)).addScaledVector(tail, Math.sin(a)), deck.heights[deck.heights.length - 1]);
    }
  }
  return out;
}

/** True when `d` falls inside one of the bridge corridors, grown by `pad`. */
function inOpening(d: THREE.Vector3, openings: KeepFree[], pad = 0): boolean {
  for (const o of openings) {
    if (d.dot(o.dir) > Math.cos((o.radius + pad) / PLANET_RADIUS)) return true;
  }
  return false;
}

/**
 * Walk every triangle of `geometry`, keep the samples that sit in the player's
 * way, and append a small collider for each occupied surface cell that no
 * existing footprint already covers. Returns how many were added.
 */
export function autoCollide(geometry: THREE.BufferGeometry, colliders: Collider[], keepFreeIn: KeepFree[] = []): number {
  const openings = bridgeOpenings();
  const keepFree = protectedSpots(keepFreeIn).concat(openings);
  const pos = geometry.getAttribute('position');
  if (!pos) return 0;

  // 0. Clear the bridge decks: hand-placed footprints left in a corridor would
  //    wall the deck off just as surely as automatic ones. Swept a little wider
  //    than the corridor, because a footprint whose centre just misses it can
  //    still reach across the deck. Railings are added later, so they survive.
  let cleared = 0;
  for (let i = colliders.length - 1; i >= 0; i--) {
    if (inOpening(colliders[i].dir, openings, 1.2)) {
      colliders.splice(i, 1);
      cleared++;
    }
  }
  if (openings.length > 0) {
    console.log(`[autoCollide] cleared ${cleared} footprints from ${BRIDGES.length} bridge corridors`);
  }

  // 1. Sample the mesh into surface cells, keeping the lowest and highest
  //    radius seen in each. The band test only needs those two.
  const cells = new Map<number, Cell>();
  const count = pos.count;
  for (let t = 0; t + 2 < count; t += 3) {
    _a.fromBufferAttribute(pos, t);
    _b.fromBufferAttribute(pos, t + 1);
    _c.fromBufferAttribute(pos, t + 2);
    _ab.subVectors(_b, _a);
    _ac.subVectors(_c, _a);
    // A face that lies flat on the ground is a platform or a paving top: the
    // player walks over it, never into it. Only faces that stand up block.
    _n.crossVectors(_ab, _ac);
    if (_n.lengthSq() < 1e-12) continue;
    _n.normalize();
    _mid.copy(_a).add(_b).add(_c).normalize();
    if (Math.abs(_n.dot(_mid)) > 0.7) continue;
    const longest = Math.max(_ab.length(), _ac.length(), _b.distanceTo(_c));
    const n = Math.min(MAX_DIV, Math.max(1, Math.ceil(longest / SPACING)));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      for (let j = 0; j + i <= n; j++) {
        const v = j / n;
        _p.copy(_a).addScaledVector(_ab, u).addScaledVector(_ac, v);
        const r = _p.length();
        if (r < 1) continue;
        _d.copy(_p).divideScalar(r);
        const ix = Math.round(_d.x * SCALE);
        const iy = Math.round(_d.y * SCALE);
        const iz = Math.round(_d.z * SCALE);
        const key = ((ix + 128) * 512 + (iy + 128)) * 512 + (iz + 128);
        const cell = cells.get(key);
        if (!cell) cells.set(key, { ix, iy, iz, min: r, max: r, px: _d.x, py: _d.y, pz: _d.z });
        else {
          if (r < cell.min) cell.min = r;
          if (r > cell.max) cell.max = r;
        }
      }
    }
  }

  // 2. Index the footprints the zones registered, so we skip what they cover.
  const buckets = new Map<number, Collider[]>();
  const index = (c: Collider): void => {
    const reach = (c.radius + RADIUS) / PLANET_RADIUS;
    const x0 = Math.floor((c.dir.x - reach) / BUCKET);
    const x1 = Math.floor((c.dir.x + reach) / BUCKET);
    const y0 = Math.floor((c.dir.y - reach) / BUCKET);
    const y1 = Math.floor((c.dir.y + reach) / BUCKET);
    const z0 = Math.floor((c.dir.z - reach) / BUCKET);
    const z1 = Math.floor((c.dir.z + reach) / BUCKET);
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        for (let z = z0; z <= z1; z++) {
          const k = bucketKey(x, y, z);
          const list = buckets.get(k);
          if (list) list.push(c);
          else buckets.set(k, [c]);
        }
      }
    }
  };
  for (const c of colliders) index(c);

  // 3. One collider per occupied cell that is neither already covered nor
  //    inside a place that must stay open.
  const dir = new THREE.Vector3();
  const spot = new THREE.Vector3();
  let added = 0;
  for (const cell of cells.values()) {
    spot.set(cell.ix / SCALE, cell.iy / SCALE, cell.iz / SCALE);
    if (spot.lengthSq() < 1e-6) continue;
    spot.normalize();
    let ground = walkRadius(spot);
    // On a deck the player stands on the bridge, not on the water far below it:
    // measure from the deck so the railings land in the band and the deck does not.
    // Only for what sits above the deck — the piers and the underside below it
    // are still measured against the ground, and still block.
    for (const o of openings) {
      if (o.top === undefined) continue;
      if (spot.dot(o.dir) > Math.cos((o.radius + 1.2) / PLANET_RADIUS) && cell.min > o.top - 0.4) {
        ground = o.top;
        break;
      }
    }
    if (cell.max < ground + LOW || cell.min > ground + HIGH) continue;

    // Skip the cell only when an existing footprint covers the whole of it —
    // its circle reaching past the cell's far corner. Anything smaller leaves
    // corners of the cell outside, and the player slips through them.
    let blockedByExisting = false;
    const kx = Math.floor(spot.x / BUCKET);
    const ky = Math.floor(spot.y / BUCKET);
    const kz = Math.floor(spot.z / BUCKET);
    for (let x = kx - REACH_BUCKETS; x <= kx + REACH_BUCKETS && !blockedByExisting; x++) {
      for (let y = ky - REACH_BUCKETS; y <= ky + REACH_BUCKETS && !blockedByExisting; y++) {
        for (let z = kz - REACH_BUCKETS; z <= kz + REACH_BUCKETS && !blockedByExisting; z++) {
          const list = buckets.get(bucketKey(x, y, z));
          if (!list) continue;
          for (const c of list) {
            const reach = c.radius - HALF_DIAG;
            if (reach <= 0) continue;
            if (spot.dot(c.dir) > Math.cos(reach / PLANET_RADIUS)) {
              blockedByExisting = true;
              break;
            }
          }
        }
      }
    }
    if (blockedByExisting) continue;

    let keepOpen = false;
    for (const k of keepFree) {
      if (spot.dot(k.dir) > Math.cos((k.radius + RADIUS) / PLANET_RADIUS)) {
        keepOpen = true;
        break;
      }
    }
    if (keepOpen) continue;

    dir.copy(spot);
    const c: Collider = { dir: dir.clone(), radius: RADIUS };
    colliders.push(c);
    index(c);
    added++;
  }

  return added;
}
