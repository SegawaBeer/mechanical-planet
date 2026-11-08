// Energy River zone (能量河流): canyon country cut by glowing channels.
// Owned by the "terrain and energy river" session.

import { G, footprint, part, rnd, type Ctx } from '../kit';
import type * as THREE from 'three';
import type { ZoneModule } from './types';

function plateRock(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.6, 1.3);
  footprint(c, f, 0.5 * s);
  part(c.solid, G.dodeca, 0x3f4f5c, f, { s: [s * 1.2, s * 0.7, s], r: [0, c.rng() * 3, 0] });
}

export const riverZone: ZoneModule = {
  id: 'river',
  build() {},
  scatter: [{ p: 0.05, build: plateRock }]
};
