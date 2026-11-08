// Shared kit for building static scenery. Everything static is baked into three
// merged meshes (lit, unlit "glow", and lit-window "night") so the whole
// planet's props cost a handful of draw calls. Glowing parts also register an
// `Emitter` so the light pool in `lights.ts` can cast real light near the player.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Collider } from './collision';
import { emitter, type Emitter, type EmitterOptions } from './lights';

// ---------------------------------------------------------------- batching

export class PropBatch {
  private parts: THREE.BufferGeometry[] = [];
  private color = new THREE.Color();

  add(geo: THREE.BufferGeometry, hex: number, matrix: THREE.Matrix4): void {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(matrix);
    // A mirrored placement — a negative scale, or a left-handed frame — reverses
    // triangle winding. Because the batch bakes the matrix into the vertices,
    // the renderer cannot flip the cull face for us the way it does for a mesh
    // with a mirrored world matrix, so the prop would render inside out: front
    // faces culled, normals pointing in, and shadows cast off its far side.
    if (matrix.determinant() < 0) reverseWinding(g);
    for (const name of Object.keys(g.attributes)) if (name !== 'position') g.deleteAttribute(name);
    const n = g.attributes.position.count;
    const arr = new Float32Array(n * 3);
    this.color.setHex(hex);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = this.color.r;
      arr[i * 3 + 1] = this.color.g;
      arr[i * 3 + 2] = this.color.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    this.parts.push(g);
  }

  build(material: THREE.Material): THREE.Mesh | null {
    if (this.parts.length === 0) return null;
    const merged = mergeGeometries(this.parts, false);
    if (!merged) return null;
    merged.computeVertexNormals();
    for (const p of this.parts) p.dispose();
    this.parts = [];
    return new THREE.Mesh(merged, material);
  }
}

/** Swap two corners of every triangle, flipping the geometry's facing. */
function reverseWinding(g: THREE.BufferGeometry): void {
  for (const attribute of Object.values(g.attributes)) {
    const array = attribute.array as Float32Array;
    const size = attribute.itemSize;
    for (let i = 0; i < attribute.count; i += 3) {
      for (let k = 0; k < size; k++) {
        const a = (i + 1) * size + k;
        const b = (i + 2) * size + k;
        const t = array[a];
        array[a] = array[b];
        array[b] = t;
      }
    }
    attribute.needsUpdate = true;
  }
}

// Shared unit geometries, all sitting on y = 0 so `s[1]` is the height and
// `p[1]` is the base.
export const G = {
  box: new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
  cone4: new THREE.ConeGeometry(0.5, 1, 4).translate(0, 0.5, 0),
  cone6: new THREE.ConeGeometry(0.5, 1, 6).translate(0, 0.5, 0),
  cone8: new THREE.ConeGeometry(0.5, 1, 8).translate(0, 0.5, 0),
  cyl6: new THREE.CylinderGeometry(0.5, 0.5, 1, 6).translate(0, 0.5, 0),
  cyl8: new THREE.CylinderGeometry(0.5, 0.5, 1, 8).translate(0, 0.5, 0),
  taper8: new THREE.CylinderGeometry(0.36, 0.5, 1, 8).translate(0, 0.5, 0),
  ico: new THREE.IcosahedronGeometry(0.5, 0).translate(0, 0.5, 0),
  dodeca: new THREE.DodecahedronGeometry(0.5, 0).translate(0, 0.5, 0),
  sphere: new THREE.SphereGeometry(0.5, 8, 6).translate(0, 0.5, 0),
  tetra: new THREE.TetrahedronGeometry(0.5).translate(0, 0.3, 0)
};

export type PartOpts = { p?: [number, number, number]; s?: [number, number, number] | number; r?: [number, number, number] };

const _m = new THREE.Matrix4();
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _e = new THREE.Euler();

export function part(b: PropBatch, geo: THREE.BufferGeometry, color: number, frame: THREE.Matrix4, o: PartOpts = {}): void {
  const p = o.p ?? [0, 0, 0];
  const r = o.r ?? [0, 0, 0];
  const s = o.s ?? 1;
  _p.set(p[0], p[1], p[2]);
  _e.set(r[0], r[1], r[2]);
  _q.setFromEuler(_e);
  if (typeof s === 'number') _s.set(s, s, s);
  else _s.set(s[0], s[1], s[2]);
  _m.compose(_p, _q, _s).premultiply(frame);
  b.add(geo, color, _m);
}


export type Ctx = { solid: PropBatch; glow: PropBatch; night: PropBatch; rng: () => number; colliders: Collider[]; lights: Emitter[] };

const _cp = new THREE.Vector3();

/**
 * Register a solid footprint of `radius` surface units at the frame's origin,
 * or at a local `[x, z]` offset from it. Props that are low or thin, such as
 * grass, flowers, crops, and path stones, register nothing.
 */
export function footprint(c: Ctx, frame: THREE.Matrix4, radius: number, offset?: [number, number]): void {
  if (offset) _cp.set(offset[0], 0, offset[1]).applyMatrix4(frame);
  else _cp.setFromMatrixPosition(frame);
  c.colliders.push({ dir: _cp.clone().normalize(), radius });
}

/**
 * Register a light source at a local `[x, y, z]` offset in the prop's frame.
 * `intensity` is the peak; the pool fades it with distance and, for a flame,
 * flickers it. `distance` is the light's reach in world units.
 */
export function emit(
  c: Ctx,
  frame: THREE.Matrix4,
  color: number,
  intensity: number,
  distance: number,
  offset: [number, number, number],
  o: EmitterOptions = {}
): void {
  _cp.set(offset[0], offset[1], offset[2]).applyMatrix4(frame);
  // The flicker phase comes from the position, not `c.rng()`: drawing here would
  // shift every later draw and reshuffle the scatter for a given seed.
  const phase = Math.abs(_cp.x * 12.9898 + _cp.y * 78.233 + _cp.z * 37.719) % 6.283;
  c.lights.push(emitter(_cp.clone(), color, intensity, distance, { phase, ...o }));
}

export const rnd = (c: Ctx, a: number, b: number) => a + c.rng() * (b - a);
export const pick = <T>(c: Ctx, arr: T[]): T => arr[Math.floor(c.rng() * arr.length)];
