// Iron Citadel zone (铁堡): a stronghold city of tiered towers and platforms.
// Owned by the "citadel" session.

import { G, footprint, part, rnd, type Ctx } from '../kit';
import type * as THREE from 'three';
import type { ZoneModule } from './types';

function block(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.6, 1.6);
  footprint(c, f, 0.5);
  part(c.solid, G.box, 0x7b8592, f, { s: [0.9, h, 0.9], r: [0, c.rng() * 3, 0] });
}

export const citadelZone: ZoneModule = {
  id: 'citadel',
  build() {},
  scatter: [{ p: 0.04, build: block }]
};
