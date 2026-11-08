// Circular footprints on the sphere. Prop builders register one footprint per
// solid object; the Game and the critters push their position out of any
// footprint they step into, which slides them along the obstacle.

import * as THREE from 'three';
import { PLANET_RADIUS } from './planet';
import { BRIDGES, bridgeHeight } from './biomes';

/** A solid disc on the surface: unit direction plus radius in surface units. */
export type Collider = { dir: THREE.Vector3; radius: number };

/** Side of one grid cube in unit-sphere space, about 4 surface units. */
const CELL = 0.1;
/** Largest agent radius that can query the grid, in surface units. */
const MAX_AGENT_RADIUS = 1.2;
const PASSES = 3;

const _t = new THREE.Vector3();
const _ref = new THREE.Vector3();

/**
 * Colliders bucketed by a cubic grid over the unit sphere. Each collider is
 * inserted into every cell its inflated footprint touches, so a query only
 * reads the single cell that contains the query direction.
 */
export class ColliderGrid {
  private cells = new Map<number, Collider[]>();
  readonly count: number;

  constructor(colliders: Collider[]) {
    for (const c of colliders) this.insert(c);
    this.count = colliders.length;
  }

  private static key(ix: number, iy: number, iz: number): number {
    return ((ix + 32) * 64 + (iy + 32)) * 64 + (iz + 32);
  }

  private insert(c: Collider): void {
    const reach = (c.radius + MAX_AGENT_RADIUS) / PLANET_RADIUS;
    const d = c.dir;
    const x0 = Math.floor((d.x - reach) / CELL);
    const x1 = Math.floor((d.x + reach) / CELL);
    const y0 = Math.floor((d.y - reach) / CELL);
    const y1 = Math.floor((d.y + reach) / CELL);
    const z0 = Math.floor((d.z - reach) / CELL);
    const z1 = Math.floor((d.z + reach) / CELL);
    for (let ix = x0; ix <= x1; ix++) {
      for (let iy = y0; iy <= y1; iy++) {
        for (let iz = z0; iz <= z1; iz++) {
          const k = ColliderGrid.key(ix, iy, iz);
          const list = this.cells.get(k);
          if (list) list.push(c);
          else this.cells.set(k, [c]);
        }
      }
    }
  }

  private cellAt(d: THREE.Vector3): Collider[] | undefined {
    return this.cells.get(ColliderGrid.key(Math.floor(d.x / CELL), Math.floor(d.y / CELL), Math.floor(d.z / CELL)));
  }

  /** True if a disc of `radius` at `dir` overlaps any collider. */
  blocked(dir: THREE.Vector3, radius: number): boolean {
    const list = this.cellAt(dir);
    if (!list) return false;
    for (const c of list) {
      if (dir.angleTo(c.dir) * PLANET_RADIUS < c.radius + radius) return true;
    }
    return false;
  }

  /**
   * Push `dir` (in place) out of any collider it overlaps, moving along the
   * tangent away from the collider centre. Returns true if `dir` changed.
   */
  resolve(dir: THREE.Vector3, radius: number): boolean {
    let changed = false;
    for (let pass = 0; pass < PASSES; pass++) {
      const list = this.cellAt(dir);
      if (!list) break;
      let moved = false;
      for (const c of list) {
        const cos = THREE.MathUtils.clamp(dir.dot(c.dir), -1, 1);
        _t.copy(dir).addScaledVector(c.dir, -cos);
        const sin = _t.length();
        const ang = Math.atan2(sin, cos);
        const minAng = (c.radius + radius) / PLANET_RADIUS;
        if (ang >= minAng) continue;
        if (sin < 1e-8) {
          // Standing exactly on the centre: pick any tangent.
          _ref.set(0, 1, 0);
          if (Math.abs(c.dir.y) > 0.98) _ref.set(1, 0, 0);
          _t.crossVectors(_ref, c.dir);
        }
        _t.normalize();
        const push = minAng - ang + 1e-5;
        dir.multiplyScalar(Math.cos(push)).addScaledVector(_t, Math.sin(push)).normalize();
        moved = true;
      }
      if (!moved) break;
      changed = true;
    }
    return changed;
  }
}

/** Every deck, plus this much dry ground beyond each of its ends, is off limits
 * to the animals and the crowd: they kept blocking the bridgeheads. */
const BRIDGE_MARGIN = 4;

/**
 * True on a bridge deck, or within `margin` surface units of either end of
 * one. Scenery that wanders uses this to stay off the crossings.
 */
export function nearBridge(d: THREE.Vector3, margin = BRIDGE_MARGIN): boolean {
  if (bridgeHeight(d) !== null) return true;
  for (const bridge of BRIDGES) {
    const points = bridge.points;
    if (points.length < 2) continue;
    const reach = margin + bridge.halfWidth;
    for (let i = 0; i < 2; i++) {
      const end = i === 0 ? points[0] : points[points.length - 1];
      if (d.angleTo(end) * PLANET_RADIUS <= reach) return true;
    }
  }
  return false;
}

const _seg = new THREE.Vector3();
const _to = new THREE.Vector3();

/**
 * Tangent direction that leads away from the nearest bridge corridor, written
 * into `out`. Used to walk a stray animal or crowd machine off a crossing.
 */
export function bridgeAway(d: THREE.Vector3, out: THREE.Vector3): void {
  out.set(0, 0, 0);
  for (const bridge of BRIDGES) {
    const points = bridge.points;
    if (points.length < 2) continue;
    // Closest sample on this deck.
    let best = 0;
    let bestAng = Infinity;
    for (let i = 0; i < points.length; i++) {
      const ang = d.angleTo(points[i]);
      if (ang < bestAng) {
        bestAng = ang;
        best = i;
      }
    }
    const joint = points[best];
    // Deck axis at that sample, as a tangent on the sphere.
    const a = points[Math.max(0, best - 1)];
    const b = points[Math.min(points.length - 1, best + 1)];
    _seg.copy(b).addScaledVector(a, -1).addScaledVector(d, -(b.dot(d) - a.dot(d)));
    if (_seg.lengthSq() < 1e-10) continue;
    _seg.normalize();
    // Where we stand relative to the deck line, in the tangent plane.
    _to.copy(d).addScaledVector(joint, -joint.dot(d));
    if (_to.lengthSq() < 1e-10) {
      // Exactly on the deck: step off to one side.
      _to.crossVectors(d, _seg);
      if (_to.lengthSq() < 1e-10) continue;
    }
    _to.normalize();
    const side = _to.dot(_seg);
    _to.addScaledVector(_seg, -side);
    if (_to.lengthSq() < 1e-10) {
      _to.crossVectors(d, _seg);
      if (_to.lengthSq() < 1e-10) continue;
    }
    _to.normalize();
    // Nearer decks count for more.
    const weight = 1 / (1 + bestAng * bestAng * 4000);
    out.addScaledVector(_to, weight);
  }
  if (out.lengthSq() < 1e-10) out.crossVectors(d, new THREE.Vector3(0, 1, 0));
  if (out.lengthSq() < 1e-10) out.set(1, 0, 0);
  out.addScaledVector(d, -out.dot(d)).normalize();
}
