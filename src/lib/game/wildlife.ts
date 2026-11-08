// Robot wildlife that roams the planet. Built with the same `animal` helper as
// the original critters so `critters.ts` can walk and pat them unchanged.
// Owned by the "sky and cleanup" session.

import type * as THREE from 'three';
import { buildDeer } from './character';

export function buildRobotDeer(): THREE.Group {
  return buildDeer();
}
