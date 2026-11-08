// Which optimised GLB belongs to which machine, and how each one has to be
// turned and tuned to stand alongside the code-built robots. Files live in
// `static/models/` and are loaded at run time; anything left out here simply
// falls back to the procedural robot and vehicle.

import type { SchemeId } from '../robots/scheme';

export type ModelForm = 'robot' | 'vehicle';

export type ModelEntry = {
  /** File name under `static/models/`, for example `hero-robot.glb`. */
  file: string;
  /** Y rotation in degrees applied before measuring, so the model faces +Z. */
  yaw: number;
  /** Peak rise while walking, world units. Robot only. */
  bob: number;
  /** Peak side roll while walking, radians. Robot only. */
  sway: number;
  /** Peak body roll into a turn, radians. Vehicle only. */
  roll: number;
};

export type RoleModels = Partial<Record<ModelForm, ModelEntry>>;

export const MODELS: Record<SchemeId, RoleModels> = {
  hero: {
    robot: { file: 'hero-robot.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 },
    vehicle: { file: 'hero-vehicle.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 }
  },
  river: {
    robot: { file: 'river-robot.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 },
    vehicle: { file: 'river-vehicle.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 }
  },
  citadel: {
    robot: { file: 'citadel-robot.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 },
    vehicle: { file: 'citadel-vehicle.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 }
  },
  ark: {
    robot: { file: 'ark-robot.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 },
    vehicle: { file: 'ark-vehicle.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 }
  },
  fortress: {
    robot: { file: 'fortress-robot.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 },
    vehicle: { file: 'fortress-vehicle.glb', yaw: 0, bob: 0.055, sway: 0.045, roll: 0.17 }
  }
};

/** Humanoid stands this tall, wheel or foot on y = 0. */
export const ROBOT_HEIGHT = 2.0;
/** Vehicle is this long along its own forward axis. */
export const VEHICLE_LENGTH = 2.4;

export const FALLBACK: Pick<ModelEntry, 'yaw' | 'bob' | 'sway' | 'roll'> = {
  yaw: 0,
  bob: 0.055,
  sway: 0.045,
  roll: 0.17
};
