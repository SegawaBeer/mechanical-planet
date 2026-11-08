// Shadow Fortress zone (暗影要塞): a purple-black fortress, the dangerous zone.
// Owned by the "ark and fortress" session.

import { G, footprint, part, rnd, type Ctx } from '../kit';
import type * as THREE from 'three';
import type { ZoneModule } from './types';

function spike(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.8, 1.8);
  footprint(c, f, 0.35);
  part(c.solid, G.cone4, 0x3a3046, f, { s: [0.6, h, 0.6], r: [0, c.rng() * 3, 0] });
}

export const fortressZone: ZoneModule = {
  id: 'fortress',
  build() {},
  scatter: [{ p: 0.04, build: spike }]
};
