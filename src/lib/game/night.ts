// The planet's one and only lighting mood. There is no day-night cycle: the
// world sits under a permanent, moonlit night, bright enough overhead to read
// the stars, the constellations, the moon, and the planets against, and bright
// enough underfoot to walk by. Everything warmer than this comes from the light
// sources scattered over the surface; see `lights.ts`.

import * as THREE from 'three';

export type NightLighting = {
  /** Scene background: a deep navy the star field still reads against. */
  sky: THREE.Color;
  /** Hemisphere light: moonlit blue from above, cold ground bounce below. */
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  /** The key light. Pale and blue, standing in for moonlight. */
  moon: THREE.Color;
  moonIntensity: number;
  /** Elevation of the key light, 0 at the horizon and 1 overhead. Sets the shadow angle. */
  moonHeight: number;
  water: THREE.Color;
  /** Halo on the planet's limb, and the sky bounce that lights upward faces. */
  rim: THREE.Color;
};

/**
 * Tuned so the sky stays legible and the ground stays walkable. Raising
 * `hemiIntensity` flattens the world; raising `moonIntensity` deepens the
 * shadows. `sky` is the one to lift if the stars start to feel lost.
 */
export const NIGHT: NightLighting = {
  // A dusky, industrial dusk: teal-indigo overhead, warm haze near the ground.
  sky: new THREE.Color(0x14262f),
  hemiSky: new THREE.Color(0x3e6e78),
  hemiGround: new THREE.Color(0x3a2c22),
  hemiIntensity: 0.9,
  moon: new THREE.Color(0xffd6a8),
  moonIntensity: 1.0,
  moonHeight: 0.42,
  water: new THREE.Color(0x1f6f7e),
  rim: new THREE.Color(0xe8a463)
};
