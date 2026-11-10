// Lighting and sky for each part of the planet. There is no day-night cycle,
// but every zone has its own weather: a clear iron citadel, a bright cyan
// river, a peach ark, and a dim purple fortress. The Game eases between these
// whenever the driven machine crosses a zone border.
//
// The numbers here are chosen so that no large surface clips to white. The
// hemisphere light stays well under the key so every surface keeps a lit and a
// dark side, and the exposure sits below 1: the palettes in `biomes.ts` carry
// the zone identity, the lights only shape them.
//
// Everything warmer than the base lighting comes from the light sources
// scattered over the surface; see `lights.ts`.

import * as THREE from 'three';

export type Atmosphere = {
  /** Scene background colour, and the horizon of the sky gradient. */
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
  // Clear day over a silver city: a deep blue zenith, a pale horizon, and a
  // key light strong enough to throw real shadows without burning the metal.
  citadel: {
    sky: C(0x8ec4ef),
    fog: C(0xa8cce6),
    fogDensity: 0.0036,
    hemiSky: C(0xa8cdf0),
    hemiGround: C(0x7d7460),
    hemiIntensity: 0.3,
    key: C(0xfff6ea),
    keyIntensity: 1.05,
    keyHeight: 0.86,
    exposure: 0.72,
    stars: 0.03
  },
  // Ice-teal canyon under a cool sky: the teal river and the plate light are
  // the bright things, the rock holds the dark.
  river: {
    sky: C(0x2fa9bf),
    fog: C(0x2f8fa0),
    fogDensity: 0.0046,
    hemiSky: C(0x5fc9d8),
    hemiGround: C(0x0e2f37),
    hemiIntensity: 0.4,
    key: C(0xd6f7ff),
    keyIntensity: 1.12,
    keyHeight: 0.66,
    exposure: 0.92,
    stars: 0.1
  },
  // Warm peach sky with a plum zenith, saturated bounce off the candy plates.
  ark: {
    sky: C(0xffb183),
    fog: C(0xf2a184),
    fogDensity: 0.0038,
    hemiSky: C(0xffb2c4),
    hemiGround: C(0xa2541f),
    hemiIntensity: 0.36,
    key: C(0xfff0dd),
    keyIntensity: 1.08,
    keyHeight: 0.8,
    exposure: 0.82,
    stars: 0.05
  },
  // Dark, with a dense purple-red haze. Dim, but never too dim to read the
  // ground or the machines standing on it: the exposure and the environment
  // map carry what the key light leaves out. Magenta key, so edges catch pink.
  fortress: {
    sky: C(0x37123c),
    fog: C(0x2e1040),
    fogDensity: 0.0095,
    hemiSky: C(0x4a2a6a),
    hemiGround: C(0x120812),
    hemiIntensity: 0.34,
    key: C(0xff6ec6),
    keyIntensity: 0.78,
    keyHeight: 0.55,
    exposure: 0.94,
    stars: 1
  },
  // The energy channels: dimmer than the river they run between, so standing
  // on a bridge still reads as the river's own light.
  ocean: {
    sky: C(0x1f6b7a),
    fog: C(0x14394a),
    fogDensity: 0.0065,
    hemiSky: C(0x3d8a96),
    hemiGround: C(0x12232a),
    hemiIntensity: 0.38,
    key: C(0xcfe9ff),
    keyIntensity: 1.02,
    keyHeight: 0.6,
    exposure: 0.94,
    stars: 0.5
  }
};

/** Vertical sky gradient: darker at the zenith, pale and hazy at the horizon. */
export type SkyGradient = {
  zenith: THREE.Color;
  horizon: THREE.Color;
  /** The warm or cold band that sits on the horizon line. */
  haze: THREE.Color;
};

/**
 * The sky dome's colours, one set per zone. `sky` above is the horizon; the
 * zenith is several stops darker so the sky never reads as one flat wash.
 */
export const SKY_GRADIENT: Record<ZoneAtmosphereId, SkyGradient> = {
  citadel: { zenith: C(0x2c69a8), horizon: C(0x8cc2ee), haze: C(0xc2dcf2) },
  river: { zenith: C(0x0a3d4e), horizon: C(0x35b3c6), haze: C(0x8ee0ea) },
  ark: { zenith: C(0x8c3a6b), horizon: C(0xf59a68), haze: C(0xffcf9f) },
  fortress: { zenith: C(0x090411), horizon: C(0x3a1540), haze: C(0x6a1f5a) },
  ocean: { zenith: C(0x041820), horizon: C(0x1f6b7a), haze: C(0x59b8c4) }
};

/**
 * The whole planet seen from outside: one sun, a thin bounce, and a dark space
 * background. The ground palettes must survive this unchanged, so nothing here
 * adds enough light to push a plate to white.
 */
export const GLOBE_ATMOSPHERE: Atmosphere = {
  sky: C(0x0b1622),
  fog: C(0x0b1622),
  fogDensity: 0,
  hemiSky: C(0x9fc4e0),
  hemiGround: C(0x4d4034),
  hemiIntensity: 0.4,
  key: C(0xfff6e8),
  keyIntensity: 1.18,
  keyHeight: 0.9,
  exposure: 0.86,
  stars: 1
};

/**
 * Build-time constants still read before any zone is known: the surface rim
 * colour and the water tint. Kept in the old shape so `Game`'s construction and
 * the surface shader keep working unchanged.
 */
export const NIGHT = {
  water: new THREE.Color(0x1f6f7e),
  // The rim the surface shader adds to every silhouette. It used to be a warm
  // amber, which stacked up along the limb and turned the whole planet sand
  // coloured from orbit; a cool sky bounce keeps shapes apart without recolouring
  // the plates.
  rim: new THREE.Color(0x7f9cba),
  hemiSky: ZONE_ATMOSPHERE.river.hemiSky,
  hemiGround: ZONE_ATMOSPHERE.river.hemiGround,
  hemiIntensity: ZONE_ATMOSPHERE.river.hemiIntensity,
  moon: ZONE_ATMOSPHERE.river.key,
  moonIntensity: ZONE_ATMOSPHERE.river.keyIntensity,
  moonHeight: ZONE_ATMOSPHERE.river.keyHeight
};
