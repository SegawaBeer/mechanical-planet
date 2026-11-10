// Scenery assembly. The four zone modules in `zones/` own what stands in each
// zone; this file runs them, scatters their random props over open ground,
// and bakes everything into the three merged meshes described in `kit.ts`.

import * as THREE from 'three';
import { biomeById, landBiomeAt, oceanField } from './biomes';
import { deriveSeed, fbm3, seededRng } from './noise';
import { PLANET_RADIUS, offsetDir, surfaceFrame } from './planet';
import type { Collider } from './collision';
import type { Emitter } from './lights';
import { PropBatch, type Ctx } from './kit';
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
const SCATTER_SAMPLES = 9000;

/** Local density multiplier, so props gather in clusters with open ground between. */
function clumpAt(d: THREE.Vector3): number {
  const n = fbm3(d.x * 5.5 + 31, d.y * 5.5 - 13, d.z * 5.5 + 7, 2);
  return Math.max(0.22, Math.min(1.2, 0.72 + n * 0.75));
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
  for (let i = 0; i < SCATTER_SAMPLES; i++) {
    d.set(ctx.rng() * 2 - 1, ctx.rng() * 2 - 1, ctx.rng() * 2 - 1);
    if (d.lengthSq() < 0.05) continue;
    d.normalize();
    // Land only, and a unit or so clear of the river banks so nothing leans
    // over the water or hangs off a canyon wall.
    if (oceanField(d) < 1.5) continue;
    if (ctx.rng() > clumpAt(d)) continue;
    if (exclusions.some((ex) => d.angleTo(ex.dir) * PLANET_RADIUS < ex.radius)) continue;
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

  const solid = ctx.solid.build(new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.55, metalness: 0.15 }));
  const glow = ctx.glow.build(new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
  const night = ctx.night.build(new THREE.MeshBasicMaterial({ vertexColors: true }));

  if (solid) {
    // Hand-placed footprints miss some props; read the baked geometry back and
    // fill in whatever still stands in the player's way.
    keepFree.push({ dir: offsetDir(biomeById('river').center.clone(), 1.4, -3.6), radius: 1.5 });
    const started = performance.now();
    const added = autoCollide(solid.geometry, ctx.colliders, keepFree);
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
