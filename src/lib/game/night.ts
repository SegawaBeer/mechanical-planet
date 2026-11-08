// Lighting and sky for each part of the planet. There is no day-night cycle,
// but every zone has its own weather: a clear iron citadel, a bright cyan
// river, a peach ark, and a dim purple fortress. The Game eases between these
// whenever the driven machine crosses a zone border.
//
// Everything warmer than the base lighting comes from the light sources
// scattered over the surface; see `lights.ts`.

import * as THREE from 'three';

export type Atmosphere = {
  /** Scene background colour. */
  sky: THREE.Color;
  /** Fog colour and density. Density 0 turns the fog off entirely. */
  fog: THREE.Color;
  fogDensity: number;
  /** Hemisphere light: sky colour above, ground bounce below. */
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  /** The key light standing in for a sun or a moon. */
  key: THREE.Color;
  keyIntensity: number;
  /** Elevation of the key light, 0 at the horizon and 1 overhead. */
  keyHeight: number;
  exposure: number;
  /** 0..1 visibility of stars, constellations and meteors. */
  stars: number;
};

export type ZoneAtmosphereId = 'river' | 'citadel' | 'ark' | 'fortress' | 'ocean';

const C = (hex: number) => new THREE.Color(hex);

export const ZONE_ATMOSPHERE: Record<ZoneAtmosphereId, Atmosphere> = {
  // Clear day: a high warm sun, a pale blue sky, thin haze at the horizon.
  citadel: {
    sky: C(0x8fd0ff),
    fog: C(0xdcefff),
    fogDensity: 0.0042,
    hemiSky: C(0xbfe6ff),
    hemiGround: C(0xc9b48a),
    hemiIntensity: 0.95,
    key: C(0xfff3d6),
    keyIntensity: 1.6,
    keyHeight: 0.88,
    exposure: 1.02,
    stars: 0.04
  },
  // Bright cyan water light, sun a little lower, cool clean air.
  river: {
    sky: C(0x5fc6d8),
    fog: C(0xa9eef7),
    fogDensity: 0.0048,
    hemiSky: C(0x9ff0ff),
    hemiGround: C(0x2f5f66),
    hemiIntensity: 0.98,
    key: C(0xe8fbff),
    keyIntensity: 1.5,
    keyHeight: 0.7,
    exposure: 1.04,
    stars: 0.12
  },
  // Dopamine peach: warm bounce from the ship's hull, pink light overhead.
  ark: {
    sky: C(0xffb38a),
    fog: C(0xffd2b0),
    fogDensity: 0.004,
    hemiSky: C(0xffc2e0),
    hemiGround: C(0xffb347),
    hemiIntensity: 0.95,
    key: C(0xffe0c2),
    keyIntensity: 1.55,
    keyHeight: 0.82,
    exposure: 1.02,
    stars: 0.06
  },
  // Dark, with a dense purple-red haze. Dim, but never too dim to read the
  // ground or the machines standing on it: the exposure and the environment
  // map carry what the key light leaves out.
  fortress: {
    sky: C(0x1c1026),
    fog: C(0x4a1d52),
    fogDensity: 0.013,
    hemiSky: C(0x4a2a6a),
    hemiGround: C(0x1a0d14),
    hemiIntensity: 0.75,
    key: C(0xb49cff),
    keyIntensity: 0.85,
    keyHeight: 0.5,
    exposure: 1.05,
    stars: 1
  },
  // The energy channels: dimmer than the river they run between, so standing
  // on a bridge still reads as the river's own light.
  ocean: {
    sky: C(0x17343d),
    fog: C(0x12333c),
    fogDensity: 0.007,
    hemiSky: C(0x3d7f8c),
    hemiGround: C(0x22333a),
    hemiIntensity: 0.95,
    key: C(0xcfe9ff),
    keyIntensity: 1.1,
    keyHeight: 0.62,
    exposure: 1.08,
    stars: 0.55
  }
};

/**
 * The whole planet seen from outside: no fog, neutral daylight so every zone's
 * ground colour reads, and a dark space background with the stars on.
 */
export const GLOBE_ATMOSPHERE: Atmosphere = {
  sky: C(0x0d1c28),
  fog: C(0x0d1c28),
  fogDensity: 0,
  hemiSky: C(0xa8cbe4),
  hemiGround: C(0x6b5b4a),
  hemiIntensity: 1.45,
  key: C(0xffffff),
  keyIntensity: 1.6,
  keyHeight: 0.9,
  exposure: 1.1,
  stars: 1
};

/**
 * Build-time constants still read before any zone is known: the surface rim
 * colour and the water tint. Kept in the old shape so `Game`'s construction and
 * the surface shader keep working unchanged.
 */
export const NIGHT = {
  water: new THREE.Color(0x1f6f7e),
  rim: new THREE.Color(0xe8a463),
  hemiSky: ZONE_ATMOSPHERE.river.hemiSky,
  hemiGround: ZONE_ATMOSPHERE.river.hemiGround,
  hemiIntensity: ZONE_ATMOSPHERE.river.hemiIntensity,
  moon: ZONE_ATMOSPHERE.river.key,
  moonIntensity: ZONE_ATMOSPHERE.river.keyIntensity,
  moonHeight: ZONE_ATMOSPHERE.river.keyHeight
};
