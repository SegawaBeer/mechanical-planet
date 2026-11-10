// Lighting and sky for each part of the planet. There is no day-night cycle,
// but every zone has its own weather: a clear iron citadel, a bright cyan
// river, a peach ark, and a dim purple fortress. The Game eases between these
// whenever the driven machine crosses a zone border.
//
// The proportions follow `docs/ART_DIRECTION.md`: the base is deep indigo, and
// the saturated colour lives in the environment reflections and the edge glow
// rather than in large flat areas. So the key light stays near white and under
// 1, the hemisphere light stays under a third of the key, and the environment
// map painted from `SKY_GRADIENT` (`look.ts`) supplies most of the colour.
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
  // Clear day over a silver city. The sky is the one bright thing; the ground
  // keeps its dark indigo base so the towers and the gold crowns stand out.
  citadel: {
    sky: C(0x16263c),
    fog: C(0x1d3048),
    fogDensity: 0.0042,
    hemiSky: C(0x3d5b80),
    hemiGround: C(0x1c1810),
    hemiIntensity: 0.22,
    key: C(0xfff1e0),
    keyIntensity: 0.85,
    keyHeight: 0.82,
    exposure: 0.72,
    stars: 0.3
  },
  // Ice-teal energy river in a black obsidian canyon: the channel and the
  // plate edges are the only bright things, the rock holds the dark.
  river: {
    sky: C(0x0d2b36),
    fog: C(0x123a45),
    fogDensity: 0.005,
    hemiSky: C(0x2f8fa0),
    hemiGround: C(0x07151a),
    hemiIntensity: 0.3,
    key: C(0xd6f7ff),
    keyIntensity: 0.95,
    keyHeight: 0.62,
    exposure: 0.94,
    stars: 0.32
  },
  // Magenta dusk around the half-buried ark, with rust orange on the ground
  // bounce and a warm haze band on the horizon.
  ark: {
    sky: C(0x1a0b16),
    fog: C(0x2a1024),
    fogDensity: 0.0046,
    hemiSky: C(0x7a3a60),
    hemiGround: C(0x2a1008),
    hemiIntensity: 0.24,
    key: C(0xffe4d0),
    keyIntensity: 0.8,
    keyHeight: 0.72,
    exposure: 0.8,
    stars: 0.4
  },
  // Near night, with a dense purple haze. Dim, but never too dim to read the
  // ground or the machines on it: the environment map carries what the key
  // leaves out. Magenta key, so edges catch pink.
  fortress: {
    sky: C(0x0a0510),
    fog: C(0x1c0a26),
    fogDensity: 0.009,
    hemiSky: C(0x4a2a6a),
    hemiGround: C(0x120812),
    hemiIntensity: 0.28,
    key: C(0xff8fd2),
    keyIntensity: 0.75,
    keyHeight: 0.5,
    exposure: 1,
    stars: 1
  },
  // The energy channels: dimmer than the river they run between, so standing
  // on a bridge still reads as the river's own light.
  ocean: {
    sky: C(0x06161c),
    fog: C(0x0c2b34),
    fogDensity: 0.0068,
    hemiSky: C(0x2a6b78),
    hemiGround: C(0x0a1a1e),
    hemiIntensity: 0.3,
    key: C(0xcfe9ff),
    keyIntensity: 0.9,
    keyHeight: 0.55,
    exposure: 0.95,
    stars: 0.6
  }
};

/** Vertical sky gradient: darker at the zenith, pale and hazy at the horizon. */
export type SkyGradient = {
  zenith: THREE.Color;
  horizon: THREE.Color;
  /** The warm or cold band that sits on the horizon line. */
  haze: THREE.Color;
  /**
   * 0..1 strength of the vertical aurora curtains in this sky. The reference
   * sky always carries them somewhere; the citadel is the one clear daylight
   * sky and keeps only a trace.
   */
  aurora: number;
};

/**
 * The sky dome's colours, one set per zone, and the source for the environment
 * map. The zenith is several stops darker than the horizon, and most zones are
 * indigo overhead, so the metal on the ground reflects a dark sky with a band
 * of colour at the horizon rather than a flat pale wash.
 */
export const SKY_GRADIENT: Record<ZoneAtmosphereId, SkyGradient> = {
  citadel: { zenith: C(0x0b1225), horizon: C(0x2f4468), haze: C(0x6f8bab), aurora: 0.04 },
  river: { zenith: C(0x04121c), horizon: C(0x14505f), haze: C(0x3fb4c8), aurora: 0.85 },
  ark: { zenith: C(0x1a0716), horizon: C(0x4a1430), haze: C(0xa03a4a), aurora: 0.9 },
  fortress: { zenith: C(0x050308), horizon: C(0x2a0c30), haze: C(0x8a1f74), aurora: 1 },
  ocean: { zenith: C(0x03141c), horizon: C(0x0e414b), haze: C(0x2f8894), aurora: 0.55 }
};

/**
 * The whole planet seen from outside: one pale sun, a thin bounce, and a dark
 * space background. The ground palettes must survive this unchanged, so nothing
 * here adds enough light to push a plate to white.
 */
export const GLOBE_ATMOSPHERE: Atmosphere = {
  sky: C(0x0b1622),
  fog: C(0x0b1622),
  fogDensity: 0,
  hemiSky: C(0x9fc4e0),
  hemiGround: C(0x4d4034),
  hemiIntensity: 0.3,
  key: C(0xfff6e8),
  keyIntensity: 1,
  keyHeight: 0.9,
  exposure: 0.9,
  stars: 1
};

/**
 * Build-time constants still read before any zone is known: the surface rim
 * colour and the water tint. Kept in the old shape so `Game`'s construction and
 * the surface shader keep working unchanged.
 */
export const NIGHT = {
  water: new THREE.Color(0x1f6f7e),
  // The rim the surface shader adds to every silhouette. A cool sky bounce
  // separates shapes without recolouring the plates.
  rim: new THREE.Color(0x7f9cba),
  hemiSky: ZONE_ATMOSPHERE.river.hemiSky,
  hemiGround: ZONE_ATMOSPHERE.river.hemiGround,
  hemiIntensity: ZONE_ATMOSPHERE.river.hemiIntensity,
  moon: ZONE_ATMOSPHERE.river.key,
  moonIntensity: ZONE_ATMOSPHERE.river.keyIntensity,
  moonHeight: ZONE_ATMOSPHERE.river.keyHeight
};
