// Material, environment and etch foundation for the planet.
//
// The planet reads as living machined metal only when every lit surface has
// something to reflect. So this module does two jobs:
//
// 1. It paints the sky as an equirectangular canvas (gradient + aurora bands +
//    sun glow + stars) and pre-filters it once per zone change into the
//    scene environment. Metals then pick up violet, cyan and magenta from the
//    sky instead of staying flat grey.
// 2. It collects the small material library the later zone work builds on, and
//    the circuit-etch patch that turns flat slabs into machined plates.
//
// Everything here is built once and reused. Nothing allocates per frame.

import * as THREE from 'three';
import { SKY_GRADIENT, ZONE_ATMOSPHERE, type Atmosphere, type SkyGradient, type ZoneAtmosphereId } from './night';

export type LookAtmosphereId = ZoneAtmosphereId | 'globe';

/** Size of the equirectangular sky the environment is baked from. */
const ENV_W = 1024;
const ENV_H = 512;
/** No sRGB conversion to fight: the canvas is already display colours. */
const DEEP = new THREE.Color(0x060a14);

/** Deterministic noise for the canvas; the texture must not shimmer between builds. */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const _c1 = new THREE.Color();
const _c2 = new THREE.Color();
const _c3 = new THREE.Color();

/** `a` mixed toward `b` by `t`, written to `out` without allocating. */
function mixColor(out: THREE.Color, a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return out.copy(a).lerp(b, t);
}

/**
 * Paint the sky as an equirectangular image: zenith to horizon gradient with a
 * warm band lying on the horizon, vertical aurora curtains, a wide pale sun
 * glow and a scatter of stars. Canvas 2D, once per zone change.
 */
export function paintSkyCanvas(id: LookAtmosphereId): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = ENV_W;
  canvas.height = ENV_H;
  const ctx = canvas.getContext('2d')!;
  const gradient: SkyGradient = id === 'globe'
    ? { zenith: new THREE.Color(0x030509), horizon: new THREE.Color(0x0a1220), haze: new THREE.Color(0x2a3b55), aurora: 0 }
    : SKY_GRADIENT[id];
  const atmo: Atmosphere = id === 'globe' ? ZONE_ATMOSPHERE.river : ZONE_ATMOSPHERE[id];

  // The zenith is pushed toward indigo even in a pale zone: the reference
  // world is dark metal first, colour second.
  const zenith = mixColor(_c1, gradient.zenith, DEEP, id === 'globe' ? 0 : 0.5);
  const mid = mixColor(_c2, zenith, gradient.horizon, 0.45).multiplyScalar(0.8);
  const horizon = gradient.horizon.clone();
  const haze = gradient.haze.clone();
  const below = mixColor(_c3, horizon, DEEP, 0.78);

  const g = ctx.createLinearGradient(0, 0, 0, ENV_H);
  g.addColorStop(0, `#${zenith.getHexString()}`);
  g.addColorStop(0.3, `#${mid.getHexString()}`);
  g.addColorStop(0.47, `#${horizon.getHexString()}`);
  g.addColorStop(0.5, `#${haze.getHexString()}`);
  g.addColorStop(0.55, `#${below.getHexString()}`);
  g.addColorStop(1, `#${DEEP.getHexString()}`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ENV_W, ENV_H);

  // ---- aurora curtains: soft vertical bands, one side of the sky mostly.
  const strength = gradient.aurora ?? 0;
  if (strength > 0.02) {
    ctx.globalCompositeOperation = 'lighter';
    const rng = lcg(9911);
    const bands = 7;
    for (let i = 0; i < bands; i++) {
      const cx = ENV_W * (0.06 + rng() * 0.88);
      const width = ENV_W * (0.035 + rng() * 0.06);
      const hue = 150 + rng() * 140;
      const top = ENV_H * (0.1 + rng() * 0.12);
      const bottom = ENV_H * (0.42 + rng() * 0.06);
      const grad = ctx.createLinearGradient(cx, top, cx, bottom);
      const a = (0.1 + rng() * 0.12) * strength;
      grad.addColorStop(0, `hsla(${hue}, 85%, 62%, 0)`);
      grad.addColorStop(0.5, `hsla(${hue}, 90%, 58%, ${a.toFixed(3)})`);
      grad.addColorStop(1, `hsla(${hue + 40}, 90%, 55%, 0)`);
      ctx.fillStyle = grad;
      // A band is several slanted streaks so the edge is not a hard rectangle.
      const streaks = 6;
      for (let s = 0; s < streaks; s++) {
        const x = cx + (rng() - 0.5) * width;
        const w = width * (0.12 + rng() * 0.3);
        const sway = (rng() - 0.5) * width * 0.6;
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x + w + sway, top);
        ctx.lineTo(x + w - sway, bottom);
        ctx.lineTo(x - sway, bottom);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ---- the sun: one oversized pale glow sitting just above the horizon.
  const sunX = ENV_W * 0.62;
  const sunY = ENV_H * 0.455;
  ctx.globalCompositeOperation = 'lighter';
  const halo = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, ENV_W * 0.16);
  halo.addColorStop(0, 'rgba(255, 250, 236, 0.95)');
  halo.addColorStop(0.12, 'rgba(255, 244, 222, 0.65)');
  halo.addColorStop(0.4, 'rgba(255, 226, 210, 0.22)');
  halo.addColorStop(1, 'rgba(255, 220, 210, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, ENV_W, ENV_H);
  // A warm seam along the horizon catches the sunlight across the whole sky.
  const seam = ctx.createLinearGradient(0, ENV_H * 0.47, 0, ENV_H * 0.52);
  seam.addColorStop(0, 'rgba(255, 214, 190, 0)');
  seam.addColorStop(0.5, `rgba(255, 214, 190, ${(0.1 + 0.12 * atmo.stars).toFixed(3)})`);
  seam.addColorStop(1, 'rgba(255, 214, 190, 0)');
  ctx.fillStyle = seam;
  ctx.fillRect(0, 0, ENV_W, ENV_H);
  ctx.globalCompositeOperation = 'source-over';

  // ---- stars, faint even in daylight: the reference sky always has them.
  const starRng = lcg(4423);
  const stars = Math.round(260 + 220 * (1 - atmo.stars));
  for (let i = 0; i < stars; i++) {
    const x = starRng() * ENV_W;
    const y = starRng() * ENV_H * 0.46;
    const r = 0.45 + starRng() * 0.9;
    const a = 0.12 + starRng() * 0.4 * (1 - y / (ENV_H * 0.46) * 0.5);
    ctx.fillStyle = `rgba(222, 232, 255, ${a.toFixed(3)})`;
    ctx.fillRect(x, y, r, r);
  }

  return canvas;
}

/**
 * Builds and owns the scene environment map. One canvas and one PMREM bake per
 * atmosphere change, never per frame; requests arriving inside the throttle
 * window are collapsed into a single later build.
 */
export class SkyEnvironment {
  /** The pre-filtered texture to hand to `scene.environment`. */
  texture: THREE.Texture | null = null;
  private pmrem: THREE.PMREMGenerator;
  private target: THREE.WebGLRenderTarget | null = null;
  private current: LookAtmosphereId | null = null;
  private pending: LookAtmosphereId | null = null;
  private nextBuild = 0;
  private canvas: HTMLCanvasElement | null = null;
  private source: THREE.Texture | null = null;
  private readonly throttle: number;

  constructor(renderer: THREE.WebGLRenderer, throttleMs = 900) {
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.pmrem.compileEquirectangularShader();
    this.throttle = throttleMs;
  }

  /**
   * Ask for the environment of `id`. Cheap when nothing changed; otherwise it
   * rebuilds now, or schedules the newest request once the throttle allows.
   */
  request(id: LookAtmosphereId, now: number, force = false): void {
    if (this.current === id && !force) return;
    if (!force && now < this.nextBuild) {
      this.pending = id;
      return;
    }
    this.pending = null;
    this.current = id;
    this.nextBuild = now + this.throttle;
    this.build(id);
  }

  /** Call every frame: runs a build that was held back by the throttle. */
  update(now: number): void {
    if (this.pending !== null && now >= this.nextBuild) {
      const id = this.pending;
      this.pending = null;
      this.current = id;
      this.nextBuild = now + this.throttle;
      this.build(id);
    }
  }

  private build(id: LookAtmosphereId): void {
    this.canvas = paintSkyCanvas(id);
    const source = new THREE.CanvasTexture(this.canvas);
    source.mapping = THREE.EquirectangularReflectionMapping;
    source.colorSpace = THREE.SRGBColorSpace;
    source.minFilter = THREE.LinearFilter;
    source.magFilter = THREE.LinearFilter;
    source.needsUpdate = true;
    const target = this.pmrem.fromEquirectangular(source);
    this.target?.dispose();
    this.source?.dispose();
    this.source = source;
    this.target = target;
    this.texture = target.texture;
  }

  dispose(): void {
    this.target?.dispose();
    this.source?.dispose();
    this.pmrem.dispose();
  }
}

// ---------------------------------------------------------------- etched metal

export type EtchOptions = {
  /** Emissive strength of the etched lines; the reference asks for 0.02-0.08 on ground. */
  strength?: number;
  /** Glow colour of the lines. */
  color?: number;
  /** Lines per object-space unit. Finer lines need a bigger number. */
  scale?: number;
};

const ETCH_FRAG = /* glsl */ `
  {
    // Object-space, no UVs: slabs are procedural boxes and spheres, so the
    // pattern has to be derived from position alone or it smears on every face.
    vec3 ep = vEtchPos;
    float sc = uEtchScale;
    vec3 cell = floor(ep * sc);
    vec3 f = abs(fract(ep * sc) - 0.5);
    // Two of the three axes carry a line, so the pattern reads as a circuit
    // grid with breaks rather than one uniform mesh.
    float axisPick = fract(sin(dot(cell, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    float line = axisPick < 0.5 ? max(step(f.x, 0.022), step(f.z, 0.022))
                                : max(step(f.y, 0.022), step(f.x, 0.022));
    // Break the grid into segments: only some cells light their edges.
    float lit = step(0.42, fract(sin(dot(cell, vec3(39.346, 11.135, 83.155))) * 43758.5453));
    // Upward faces only; the plate sides stay solid metal.
    float up = smoothstep(0.35, 0.72, dot(normalize(vEtchPos), normalize(vEtchNrm)));
    totalEmissiveRadiance += uEtchColor * (line * lit * up * uEtchStrength);
  }
`;

const ETCH_DECL = /* glsl */ `
#define ETCH_ON
uniform vec3 uEtchColor;
uniform float uEtchStrength;
uniform float uEtchScale;
varying vec3 vEtchPos;
varying vec3 vEtchNrm;
`;

/**
 * Add a faint circuit etch to a lit material.
 *
 * It composes with whatever `onBeforeCompile` the material already has — the
 * weather/sky-rim patch in `surfaceFx.ts` replaces that hook after materials
 * are built, so a plain assignment here would be silently overwritten.
 */
export function withCircuitEtch<T extends THREE.MeshStandardMaterial>(material: T, options: EtchOptions = {}): T {
  const strength = options.strength ?? 0.05;
  const color = new THREE.Color(options.color ?? 0x6fe8ff);
  const scale = options.scale ?? 0.85;
  let base: ((shader: THREE.WebGLProgramParametersWithUniforms) => void) | null = null;

  const etch = (shader: THREE.WebGLProgramParametersWithUniforms): void => {
    shader.uniforms.uEtchColor = { value: color };
    shader.uniforms.uEtchStrength = { value: strength };
    shader.uniforms.uEtchScale = { value: scale };
    shader.vertexShader = ETCH_DECL + shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
  vEtchPos = position;
  vEtchNrm = normal;`
    );
    shader.fragmentShader = ETCH_DECL + shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
${ETCH_FRAG}`
    );
  };

  Object.defineProperty(material, 'onBeforeCompile', {
    configurable: true,
    get() {
      return (shader: THREE.WebGLProgramParametersWithUniforms) => {
        base?.(shader);
        etch(shader);
      };
    },
    set(fn: (shader: THREE.WebGLProgramParametersWithUniforms) => void) {
      base = fn;
    }
  });
  let baseKey: (() => string) | null = null;
  Object.defineProperty(material, 'customProgramCacheKey', {
    configurable: true,
    get() {
      return () => `etch:${strength}:${scale}|${baseKey ? baseKey() : ''}`;
    },
    set(fn: () => string) {
      baseKey = fn;
    }
  });
  material.needsUpdate = true;
  return material;
}

// ---------------------------------------------------------------- materials
//
// The small palette the four zone sessions build on. Each factory returns a new
// material; call `dispose()` if a caller really throws one away (none do).

/** Brushed gold: tower crowns, beacons, rail highlights. Warm and reflective. */
export function brushedGold(color = 0xc9a227): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.95,
    roughness: 0.3,
    envMapIntensity: 1.25
  });
}

/**
 * Rusted layered metal: mines, wrecks, the shadow fortress. Layered reads as
 * roughness rather than bump; keep it dull so the light does not skip off it.
 */
export function rustedMetal(color = 0x8a4b2a): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.7,
    roughness: 0.6,
    envMapIntensity: 0.8
  });
}

/** Energon glass: pipes, cores, beacons. Translucent, glowing from inside. */
export function energonGlass(color = 0x9a4bff): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.9,
    metalness: 0.25,
    roughness: 0.12,
    transparent: true,
    opacity: 0.55,
    envMapIntensity: 1.4,
    depthWrite: false
  });
}

/** Energon flow: the river, fountains. Emissive cyan, no shading needed. */
export function energonFlow(color = 0x2fe6ff): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 2.2,
    metalness: 0,
    roughness: 0.35
  });
}

/**
 * Circuit metal: a dark machined plate with a faint etch. Used for ground
 * slabs and monuments; the etch strength is deliberately under 0.08 so it
 * glints without becoming a light source.
 */
export function circuitMetal(color = 0x12203a, etch: EtchOptions = {}): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.9,
    roughness: 0.35,
    envMapIntensity: 1.1
  });
  return withCircuitEtch(material, { strength: 0.06, scale: 0.9, ...etch });
}

/** Mossy growth: around the fortress crater. Mist green, matte, no metal. */
export function mossyGrowth(color = 0x3fa98a): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.05,
    roughness: 0.95
  });
}
