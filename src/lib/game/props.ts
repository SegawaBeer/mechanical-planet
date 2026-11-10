// Scenery assembly. The four zone modules in `zones/` own what stands in each
// zone; this file runs them, scatters their random props over open ground,
// and bakes everything into the three merged meshes described in `kit.ts`.

import * as THREE from 'three';
import { biomeById, landBiomeAt, landBiomeBlend, oceanField, type Biome } from './biomes';
import { deriveSeed, fbm3, seededRng } from './noise';
import { PLANET_RADIUS, offsetDir, plateEdgeMargin, surfaceFrame } from './planet';
import { onRoad, roadBlocks, roadDistance, roadPieces } from './roads';
import type { Collider } from './collision';
import type { Emitter } from './lights';
import { PropBatch, G, part, footprint, rnd, type Ctx } from './kit';
import { autoCollide, type KeepFree } from './autoCollide';
import { WONDERS, wonderDir } from './wonders';
import type { ZoneApi, ZoneId, ZoneModule } from './zones/types';
import { riverZone } from './zones/river';
import { citadelZone } from './zones/citadel';
import { arkZone } from './zones/ark';
import { fortressZone } from './zones/fortress';

const ZONES: Record<ZoneId, ZoneModule> = {
  river: riverZone,
  citadel: citadelZone,
  ark: arkZone,
  fortress: fortressZone
};

/**
 * Directions sampled over the sphere before filtering. Channels, density, and
 * each zone's own probabilities cut this down a lot; raise it to make the
 * whole planet busier.
 */
const SCATTER_SAMPLES = 6000;

/**
 * Extra directions sampled for the fault-seam pass that places the big
 * silhouettes. Only a small band around each plate boundary survives.
 */
const FAULT_SAMPLES = 7000;

/** Clumping noise, so what survives gathers into small groups, not even rows. */
function clumpAt(d: THREE.Vector3): number {
  const n = fbm3(d.x * 5.5 + 31, d.y * 5.5 - 13, d.z * 5.5 + 7, 2);
  return Math.max(0.55, Math.min(1.25, 0.9 + n * 0.6));
}

/** Width, in surface units, of the band of scatter that hugs a plate seam. */
const FAULT_WIDTH = 2.6;

/** 1 on a plate seam, falling to 0 about `FAULT_WIDTH` units away from it. */
function faultWeight(d: THREE.Vector3): number {
  const margin = plateEdgeMargin(d) * PLANET_RADIUS;
  return 1 - THREE.MathUtils.smoothstep(margin, 0.12, FAULT_WIDTH);
}

/**
 * Chance that a scattered prop stands at `d`. Detail belongs to the landmark
 * ring around a zone heart, to the shoulder of the carriageway and to the
 * seams between plates; the open faces between faults stay clear, so the
 * plate, not a carpet of small blocks, is what the eye reads.
 */
function scatterWeight(d: THREE.Vector3): number {
  const blend = landBiomeBlend(d);
  const fromHeart = d.angleTo(blend.primary.center) * PLANET_RADIUS;
  const nearLandmark = 1 - THREE.MathUtils.smoothstep(fromHeart, 9, 23);
  const nearRoad = 1 - THREE.MathUtils.smoothstep(roadDistance(d), 2.4, 7);
  const nearFault = faultWeight(d);
  return Math.max(0.06, Math.max(nearLandmark * 0.5, nearRoad * 0.36, nearFault * 0.6));
}

// ------------------------------------------------------------- slab scenery
//
// The surface prop language is broken machined plate: leaning slabs etched
// with circuitry, thin blade fins rising out of the faults, and flat debris
// piled at the slab feet. No rounded boulders and no dune forms.

const _hsl = { h: 0, s: 0, l: 0 };
const _depth = new THREE.Color();

/** A palette colour pulled down to dark machined metal, hue kept. */
function deepHex(hex: number, value = 0.07): number {
  _depth.setHex(hex);
  _depth.getHSL(_hsl);
  _depth.setHSL(_hsl.h, Math.min(0.62, _hsl.s * 0.85 + 0.1), value + _hsl.l * 0.04);
  return _depth.getHex();
}

/** A big fractured slab, leaning, with broken plates piled at its foot. */
function slabPlate(c: Ctx, f: THREE.Matrix4, biome: Biome): void {
  const w = rnd(c, 0.9, 2.3);
  const h = rnd(c, 1.1, 3.1);
  const t = rnd(c, 0.2, 0.48);
  const toneA = deepHex(biome.ground[0]);
  const toneB = deepHex(biome.ground[1] ?? biome.ground[0]);
  const lean = rnd(c, -0.4, 0.4);
  const tilt = rnd(c, -0.3, 0.3);
  part(c.solid, G.box, toneA, f, { s: [w, h, t], r: [tilt, c.rng() * 3, lean] });
  // A second plate broken away from the first and left leaning against it.
  if (c.rng() < 0.65) {
    part(c.solid, G.box, toneB, f, {
      p: [rnd(c, -0.7, 0.7), rnd(c, 0.15, 1.1), rnd(c, -0.5, 0.5)],
      s: [w * rnd(c, 0.35, 0.75), h * rnd(c, 0.25, 0.7), t * rnd(c, 0.6, 1)],
      r: [rnd(c, -0.7, 0.7), c.rng() * 3, rnd(c, -0.7, 0.7)]
    });
  }
  // A thin strip of the zone accent along the cut top edge: the saturated
  // colour of the zone lives on the edges, not on the faces.
  if (c.rng() < 0.32) {
    part(c.solid, G.box, biome.accent, f, {
      p: [0, h * 0.96, 0],
      s: [w * 0.86, 0.055, 0.055],
      r: [tilt, 0, lean]
    });
  }
  // Broken plate debris around the base.
  const n = 2 + Math.floor(c.rng() * 3);
  for (let i = 0; i < n; i++) {
    const a = c.rng() * Math.PI * 2;
    const r = rnd(c, 0.6, 1.4);
    part(c.solid, G.box, toneB, f, {
      p: [Math.sin(a) * r, 0, Math.cos(a) * r],
      s: [rnd(c, 0.2, 0.8), rnd(c, 0.06, 0.18), rnd(c, 0.15, 0.6)],
      r: [rnd(c, -0.2, 0.2), c.rng() * 3, rnd(c, -0.2, 0.2)]
    });
  }
  footprint(c, f, Math.max(0.85, w * 0.42));
}

/** A thin, sharp fin of plate rising out of a fault. */
function bladeFin(c: Ctx, f: THREE.Matrix4, biome: Biome): void {
  const h = rnd(c, 1.3, 3.4);
  const w = rnd(c, 0.45, 1.15);
  const t = rnd(c, 0.12, 0.26);
  part(c.solid, G.tetra, deepHex(biome.ground[2] ?? biome.ground[0]), f, {
    p: [rnd(c, -0.15, 0.15), 0, rnd(c, -0.15, 0.15)],
    s: [w, h, t],
    r: [rnd(c, -0.12, 0.12), c.rng() * Math.PI, rnd(c, -0.3, 0.3)]
  });
  if (c.rng() < 0.4) {
    part(c.solid, G.tetra, biome.accent, f, {
      p: [0, h * 0.92, 0],
      s: [w * 0.25, h * 0.18, t * 0.4],
      r: [0, c.rng() * 3, 0]
    });
  }
  footprint(c, f, Math.max(0.4, w * 0.45));
}

/** A flat scatter of broken plate on the ground. */
function plateDebris(c: Ctx, f: THREE.Matrix4, biome: Biome): void {
  const tone = deepHex(biome.ground[1] ?? biome.ground[0]);
  const n = 2 + Math.floor(c.rng() * 4);
  for (let i = 0; i < n; i++) {
    const a = c.rng() * Math.PI * 2;
    const r = rnd(c, 0.2, 1.3);
    part(c.solid, G.box, tone, f, {
      p: [Math.sin(a) * r, 0, Math.cos(a) * r],
      s: [rnd(c, 0.18, 0.75), rnd(c, 0.05, 0.16), rnd(c, 0.12, 0.55)],
      r: [rnd(c, -0.2, 0.2), c.rng() * 3, rnd(c, -0.2, 0.2)]
    });
  }
  footprint(c, f, 0.55);
}

/**
 * Circuit etch for scenery, drawn on every face. The foundation etch in
 * look.ts only lights upward faces, which leaves a standing slab blank; here
 * the grid runs up the sides too. The hook is a property getter/setter so the
 * weather/rim pass that replaces `onBeforeCompile` later still composes: its
 * patch lands in `base` and this etch always runs after it.
 */
function withPropEtch(material: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  const tint = new THREE.Color(0x5fd8ee);
  let base: ((shader: THREE.WebGLProgramParametersWithUniforms) => void) | null = null;
  const etch = (shader: THREE.WebGLProgramParametersWithUniforms): void => {
    shader.uniforms.uPropEtchColor = { value: tint };
    shader.uniforms.uPropEtchStrength = { value: 0.05 };
    shader.uniforms.uPropEtchScale = { value: 0.62 };
    shader.vertexShader =
      'varying vec3 vPropEtchPos;\n' +
      shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vPropEtchPos = position;');
    shader.fragmentShader =
      `uniform vec3 uPropEtchColor;
uniform float uPropEtchStrength;
uniform float uPropEtchScale;
varying vec3 vPropEtchPos;
` +
      shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
  {
    vec3 ep = vPropEtchPos;
    float sc = uPropEtchScale;
    vec3 cell = floor(ep * sc);
    vec3 f = abs(fract(ep * sc) - 0.5);
    float axisPick = fract(sin(dot(cell, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    float line = axisPick < 0.5 ? max(step(f.x, 0.02), step(f.z, 0.02))
                                : max(step(f.y, 0.02), step(f.x, 0.02));
    float lit = step(0.45, fract(sin(dot(cell, vec3(39.346, 11.135, 83.155))) * 43758.5453));
    totalEmissiveRadiance += uPropEtchColor * (line * lit * uPropEtchStrength);
  }`
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
  material.needsUpdate = true;
  return material;
}

export type Dynamic = { object: THREE.Object3D; update: (dt: number, t: number) => void };

export type WorldProps = {
  solid: THREE.Mesh | null;
  glow: THREE.Mesh | null;
  /** Lit windows and doorways. */
  night: THREE.Mesh | null;
  /** Every glowing prop's light source, for the pool in `lights.ts`. */
  lights: Emitter[];
  /** Ground frame of each wonder, keyed by id, for floating markers. */
  wonderFrames: Map<string, THREE.Matrix4>;
  /** Footprints of every solid prop, for the collision grid. */
  colliders: Collider[];
  /** Moving scenery added by the zones; the Game adds and updates these. */
  dynamics: Dynamic[];
};

type Exclusion = { dir: THREE.Vector3; radius: number };

export function buildWorldProps(seed: number): WorldProps {
  const ctx: Ctx = {
    solid: new PropBatch(),
    glow: new PropBatch(),
    night: new PropBatch(),
    rng: seededRng(deriveSeed(seed, 3)),
    colliders: [],
    lights: []
  };
  const exclusions: Exclusion[] = [];
  const dynamics: Dynamic[] = [];
  const wonderFrames = new Map<string, THREE.Matrix4>();
  for (const w of WONDERS) {
    const d = wonderDir(w);
    wonderFrames.set(w.id, surfaceFrame(d, w.yaw, new THREE.Matrix4()));
    exclusions.push({ dir: d, radius: 2.4 });
  }

  // Places the automatic collision pass must leave walkable: each beacon, each
  // robot's stand spot, and the player's spawn in the river zone.
  const keepFree: KeepFree[] = [];
  for (const zone of Object.values(ZONES)) {
    const center = biomeById(zone.id).center;
    keepFree.push({ dir: center.clone(), radius: 3 });
    keepFree.push({ dir: offsetDir(center.clone(), 4, -4), radius: 1.5 });
    const api: ZoneApi = {
      ctx,
      at: (east, north, yaw, lift = 0) => surfaceFrame(offsetDir(center.clone(), east, north), yaw, new THREE.Matrix4(), lift),
      exclude: (east, north, radius) => exclusions.push({ dir: offsetDir(center.clone(), east, north), radius }),
      wonderFrame: (id) => {
        const w = WONDERS.find((x) => x.id === id && x.biome === zone.id);
        return w ? wonderFrames.get(w.id) : undefined;
      },
      addDynamic: (object, update) => dynamics.push({ object, update })
    };
    zone.build(api);
  }

  const d = new THREE.Vector3();
  const f = new THREE.Matrix4();
  const excluded = (dir: THREE.Vector3): boolean =>
    exclusions.some((ex) => dir.angleTo(ex.dir) * PLANET_RADIUS < ex.radius);
  for (let i = 0; i < SCATTER_SAMPLES; i++) {
    d.set(ctx.rng() * 2 - 1, ctx.rng() * 2 - 1, ctx.rng() * 2 - 1);
    if (d.lengthSq() < 0.05) continue;
    d.normalize();
    // Land only, and a unit or so clear of the river banks so nothing leans
    // over the water or hangs off a canyon wall.
    if (oceanField(d) < 1.5) continue;
    // Keep the carriageway, its margins and the ground under a bridge clear.
    if (onRoad(d, 1.6)) continue;
    if (ctx.rng() > scatterWeight(d) * clumpAt(d)) continue;
    if (excluded(d)) continue;
    const table = ZONES[landBiomeAt(d).id as ZoneId].scatter;
    let r = ctx.rng();
    surfaceFrame(d, ctx.rng() * Math.PI * 2, f);
    for (const entry of table) {
      r -= entry.p;
      if (r < 0) {
        entry.build(ctx, f);
        break;
      }
    }
  }

  // Fault seams get their own pass. Slabs, blades and plate debris gather in
  // the crease between two plates, which is what gives the horizon its broken
  // silhouette; the open plate faces stay clear.
  for (let i = 0; i < FAULT_SAMPLES; i++) {
    d.set(ctx.rng() * 2 - 1, ctx.rng() * 2 - 1, ctx.rng() * 2 - 1);
    if (d.lengthSq() < 0.05) continue;
    d.normalize();
    if (oceanField(d) < 1.6) continue;
    // Wider than the paving alone: a three-metre slab at the road edge would
    // overhang the carriageway even if its centre were clear of it.
    if (onRoad(d, 3.2)) continue;
    const fault = faultWeight(d);
    // Slabs belong to a few stretches of seam, not every seam. A low-frequency
    // cluster field leaves most faults bare, so the planet reads as plate
    // country with a handful of monoliths instead of a carpet of shards.
    const cluster = fbm3(d.x * 3.1 + 41, d.y * 3.1 - 17, d.z * 3.1 + 9, 2);
    if (fault < 0.02 || cluster < 0.08) continue;
    if (ctx.rng() > fault * 0.14 * (0.35 + cluster)) continue;
    if (excluded(d)) continue;
    const biome = landBiomeAt(d);
    // Bed each piece a little into the plate so a slab seated across a crease
    // cuts the ground instead of hovering over the low side of it.
    surfaceFrame(d, ctx.rng() * Math.PI * 2, f, -0.12);
    const pickR = ctx.rng();
    if (pickR < 0.52) slabPlate(ctx, f, biome);
    else if (pickR < 0.8) bladeFin(ctx, f, biome);
    else plateDebris(ctx, f, biome);
  }

  // The carriageway, its edge lights and its bridge decks ride in the same
  // merged meshes as the scenery, so the whole network costs a few draw calls.
  const identity = new THREE.Matrix4();
  for (const piece of roadPieces()) {
    (piece.glow ? ctx.glow : ctx.solid).add(piece.geometry, piece.color, identity);
  }

  // All scenery shares one lit batch, so the slab etch comes for free.
  const solid = ctx.solid.build(
    withPropEtch(
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
        roughness: 0.42,
        metalness: 0.82,
        envMapIntensity: 1.0
      })
    )
  );
  const glow = ctx.glow.build(new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
  const night = ctx.night.build(new THREE.MeshBasicMaterial({ vertexColors: true }));

  if (solid) {
    // Hand-placed footprints miss some props; read the baked geometry back and
    // fill in whatever still stands in the player's way.
    keepFree.push({ dir: offsetDir(biomeById('river').center.clone(), 1.4, -3.6), radius: 1.5 });
    const started = performance.now();
    const added = autoCollide(solid.geometry, ctx.colliders, keepFree);
    // A landmark or a hand-placed footprint may reach into the road band; its
    // geometry stays where it is, but nothing may wall the carriageway off.
    for (let i = ctx.colliders.length - 1; i >= 0; i--) {
      if (roadBlocks(ctx.colliders[i].dir, ctx.colliders[i].radius)) ctx.colliders.splice(i, 1);
    }
    console.log(
      `[autoCollide] added ${added} colliders, ${ctx.colliders.length} total (${Math.round(performance.now() - started)} ms)`
    );
  }
  if (solid) {
    solid.castShadow = true;
    solid.receiveShadow = true;
    solid.name = 'props';
  }
  if (glow) glow.name = 'glow';
  if (night) night.name = 'night';
  return { solid, glow, night, lights: ctx.lights, wonderFrames, colliders: ctx.colliders, dynamics };
}
