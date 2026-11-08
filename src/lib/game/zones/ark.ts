// Ark Dock zone (方舟号): a giant warship half buried in the ground.
// Owned by the "ark and fortress" session.

import { G, footprint, part, rnd, type Ctx } from '../kit';
import type * as THREE from 'three';
import type { ZoneModule } from './types';

function scrap(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.5, 1.1);
  footprint(c, f, 0.45 * s);
  part(c.solid, G.box, 0x6b5f54, f, { s: [s, s * 0.5, s * 1.4], r: [0.2, c.rng() * 3, 0.1] });
}

export const arkZone: ZoneModule = {
  id: 'ark',
  build() {},
  scatter: [{ p: 0.04, build: scrap }]
};
