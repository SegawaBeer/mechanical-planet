// Contract between the scenery assembler in `props.ts` and the four zone
// modules. Each zone file owns everything that stands in its zone: landmarks
// placed by hand in `build`, and the random scatter in `scatter`.

import type * as THREE from 'three';
import type { Ctx } from '../kit';
import type { BiomeId } from '../biomes';

export type ZoneId = Exclude<BiomeId, 'ocean'>;

/** One entry in a zone's scatter table: how often, and what to build. */
export type Scatter = { p: number; build: (c: Ctx, f: THREE.Matrix4) => void };

export type ZoneApi = {
  ctx: Ctx;
  /**
   * Ground frame `east`/`north` surface units from the zone centre, facing
   * `yaw` radians from north. Local +Y is the ground normal; the origin sits on
   * the ground, raised by `lift`.
   */
  at(east: number, north: number, yaw: number, lift?: number): THREE.Matrix4;
  /** Keep random scatter out of a circle of `radius` surface units. */
  exclude(east: number, north: number, radius: number): void;
  /** Ground frame of a wonder marker standing in this zone, if any. */
  wonderFrame(id: string): THREE.Matrix4 | undefined;
  /**
   * Add a moving object, for example a fountain jet or a turret head, already
   * placed in world space. `update` runs every frame with the frame time and
   * the world clock in seconds.
   */
  addDynamic(object: THREE.Object3D, update: (dt: number, t: number) => void): void;
};

export type ZoneModule = {
  id: ZoneId;
  /** Place the zone's landmarks. Call `api.exclude` around each one. */
  build(api: ZoneApi): void;
  /**
   * Random props for the open ground of this zone. Probabilities are absolute
   * and should sum to well under one; a sample past the end builds nothing.
   */
  scatter: Scatter[];
};
