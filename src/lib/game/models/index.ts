// Runtime loading for the hitem3d character models. Every model is scaled,
// stood on y = 0, turned to face +Z and given a `userData.anim` hook, so the
// driving code can hand the result straight to `Protagonist.setForms`.
//
// Nothing here throws: a missing, broken or blocked file resolves to null and
// the caller keeps the code-built robot.

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { base } from '$app/paths';
import { buildRobot, type FormState } from '../robots/robot';
import { buildVehicle } from '../robots/vehicle';
import { SCHEMES, type SchemeId } from '../robots/scheme';
import type { Protagonist } from '../robots/protagonist';
import {
  FALLBACK,
  MODELS,
  ROBOT_HEIGHT,
  VEHICLE_LENGTH,
  type ModelEntry,
  type ModelForm
} from './manifest';

export type { ModelEntry, ModelForm, RoleModels } from './manifest';
export { MODELS, ROBOT_HEIGHT, VEHICLE_LENGTH } from './manifest';

type Anim = (dt: number, state: FormState) => boolean;
type Animated = THREE.Object3D & { userData: { anim?: Anim } };

let loader: GLTFLoader | null = null;
function getLoader(): GLTFLoader {
  if (loader) return loader;
  const l = new GLTFLoader();
  l.setMeshoptDecoder(MeshoptDecoder);
  loader = l;
  return l;
}

/** One entry per file, so two callers asking for the same model share a load. */
const pending = new Map<string, Promise<THREE.Object3D | null>>();

/** True once every role has at least one real model file. */
export function hasModel(id: SchemeId, form: ModelForm): boolean {
  return Boolean(MODELS[id]?.[form]);
}

/**
 * Load one form of one machine, already normalised: feet or wheels on y = 0,
 * facing +Z, scaled to `ROBOT_HEIGHT` (2.0) or `VEHICLE_LENGTH` (2.4), casting
 * and receiving shadow, and carrying `userData.anim`. Resolves to null when
 * the role has no model for that form or the file fails to load.
 */
export function loadForm(id: SchemeId, form: ModelForm): Promise<THREE.Object3D | null> {
  const entry = MODELS[id]?.[form];
  if (!entry) return Promise.resolve(null);
  const key = `${id}-${form}`;
  let job = pending.get(key);
  if (!job) {
    job = fetchForm(entry, form).then((obj) => {
      if (!obj) pending.delete(key);
      return obj;
    });
    pending.set(key, job);
  }
  return job;
}

/** Both forms of one machine at once; either may be null. */
export async function loadForms(
  id: SchemeId
): Promise<{ robot: THREE.Object3D | null; vehicle: THREE.Object3D | null }> {
  const [robot, vehicle] = await Promise.all([loadForm(id, 'robot'), loadForm(id, 'vehicle')]);
  return { robot, vehicle };
}

export type EquipResult = { robot: boolean; vehicle: boolean };

/**
 * Load a role's models and install them on a `Protagonist`, keeping the
 * code-built form wherever no model exists. Safe to call more than once and
 * safe to call with a role that has no models at all — the machine simply
 * stays procedural. The game keeps running while this is in flight.
 */
export async function equip(machine: Protagonist, id: SchemeId): Promise<EquipResult> {
  const { robot, vehicle } = await loadForms(id);
  const colours = SCHEMES[id];
  const fallbackRobot = buildRobot(colours);
  const fallbackVehicle = buildVehicle(colours);

  const robotObj = robot ?? (fallbackRobot.root as Animated);
  const vehicleObj = vehicle ?? (fallbackVehicle.root as Animated);
  if (!robot) robotObj.userData.anim = fallbackRobot.anim;
  if (!vehicle) vehicleObj.userData.anim = fallbackVehicle.anim;

  machine.setForms(robotObj, vehicleObj);
  return { robot: Boolean(robot), vehicle: Boolean(vehicle) };
}

async function fetchForm(entry: ModelEntry, form: ModelForm): Promise<THREE.Object3D | null> {
  try {
    const gltf = await getLoader().loadAsync(`${base}/models/${entry.file}`);
    return dress(gltf.scene, entry, form);
  } catch (err) {
    console.warn(`[models] could not load ${entry.file}, keeping the built-in form`, err);
    return null;
  }
}

/** Scale to target size, drop onto y = 0, centre on x/z, turn to face +Z. */
function dress(scene: THREE.Object3D, entry: ModelEntry, form: ModelForm): THREE.Object3D {
  const inner = new THREE.Group();
  inner.add(scene);
  inner.rotation.y = THREE.MathUtils.degToRad(entry.yaw);
  inner.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(inner);
  const size = box.getSize(new THREE.Vector3());
  let scale: number;
  if (form === 'robot') {
    scale = size.y > 1e-4 ? ROBOT_HEIGHT / size.y : 1;
  } else {
    // A plane's length can run along either horizontal axis, so take the longer.
    const length = Math.max(size.x, size.z, 1e-4);
    scale = VEHICLE_LENGTH / length;
  }
  inner.scale.setScalar(scale);
  inner.updateMatrixWorld(true);

  const box2 = new THREE.Box3().setFromObject(inner);
  const centre = box2.getCenter(new THREE.Vector3());
  // How far the model had to be lifted so its lowest point rests on y = 0.
  // The animations below own `inner.position.y` and must add this back, or a
  // model authored around its centre sinks by half its height.
  const seatY = -box2.min.y;
  inner.userData.seatY = seatY;
  inner.position.set(-centre.x, seatY, -centre.z);

  const root = new THREE.Group();
  root.add(inner);
  root.userData.anim =
    form === 'robot' ? robotAnim(inner, entry, seatY) : vehicleAnim(inner, entry, seatY);

  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      const m = material as THREE.MeshStandardMaterial;
      // The planet is a night scene with no environment map, so anything
      // metallic reflects nothing and reads as a black silhouette. hitem3d
      // bakes metalness 1, so flatten it and let the albedo carry the look.
      m.metalness = 0.06;
      m.roughness = 0.7;
      if (m.map) {
        m.map.anisotropy = 4;
        // A little self-glow from the albedo keeps the colours legible in
        // shadow, without washing the model out.
        m.emissiveMap = m.map;
        m.emissive = new THREE.Color(0xffffff);
        m.emissiveIntensity = 0.3;
      }
      m.needsUpdate = true;
    }
  });

  return root;
}

/**
 * Walking: a small rise and fall two steps per cycle, a little side roll, a
 * forward lean with speed, and a tuck in the air. Returns true on each foot
 * landing so the caller can play a step.
 */function robotAnim(inner: THREE.Object3D, entry: ModelEntry, seatY: number): Anim {
  const bob = entry.bob || FALLBACK.bob;
  const sway = entry.sway || FALLBACK.sway;
  let phase = 0;
  let lastStep = 0;
  let strike = false;

  return (dt: number, state: FormState) => {
    const speed01 = THREE.MathUtils.clamp(state.speed01, 0, 1);
    const moving = speed01 > 0.04 && Math.abs(state.speed) > 0.15 && !state.airborne;
    strike = false;

    if (moving) {
      phase += dt * (5.4 + speed01 * 5.6);
      const step = Math.floor(phase / Math.PI);
      if (step !== lastStep) {
        lastStep = step;
        strike = true;
      }
    } else {
      lastStep = Math.floor(phase / Math.PI);
    }

    if (state.airborne) {
      inner.position.y = seatY + bob * 0.55;
      inner.rotation.z = 0;
      inner.rotation.x = -0.08;
      return false;
    }

    const gait = moving ? 0.45 + speed01 * 0.55 : 0;
    const breathe = Math.sin(state.time * 1.5) * bob * 0.16;
    inner.position.y = seatY + Math.abs(Math.sin(phase)) * bob * gait + breathe;
    inner.rotation.z = moving
      ? Math.sin(phase) * sway * gait
      : Math.sin(state.time * 1.1) * sway * 0.18;
    inner.rotation.x = -0.05 * speed01;
    return strike;
  };
}

/**
 * Driving: roll into a turn the same direction as the built-in vehicle, a
 * small pitch with speed, and a slow float when parked. Never a footstep.
 */
function vehicleAnim(inner: THREE.Object3D, entry: ModelEntry, seatY: number): Anim {
  const roll = entry.roll || FALLBACK.roll;
  let shown = 0;

  return (dt: number, state: FormState) => {
    const steer = THREE.MathUtils.clamp(state.steer, -1, 1);
    const target = -steer * roll * Math.min(1, Math.abs(state.speed) / 6);
    shown += (target - shown) * Math.min(1, dt * 9);
    inner.rotation.z = shown;
    inner.rotation.x = -0.02 * THREE.MathUtils.clamp(state.speed01, 0, 1);
    inner.position.y = seatY + Math.sin(state.time * 1.3) * 0.012;
    return false;
  };
}

/** Beyond this distance from the player a machine stops casting shadow. */
export const SHADOW_RANGE = 25;
/** How often the shadow budget is re-checked, in milliseconds. */
const SHADOW_INTERVAL = 180;

const shadowOrigin = new THREE.Vector3();
const shadowProbe = new THREE.Vector3();
let shadowLast = -Infinity;

function setCast(root: THREE.Object3D, cast: boolean): void {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    // Pick spheres and other fully transparent helpers must never shadow,
    // otherwise a grey ball appears under the machine.
    if (materials.every((m) => m.transparent && m.opacity === 0)) {
      if (mesh.castShadow) mesh.castShadow = false;
      return;
    }
    if (mesh.castShadow !== cast) mesh.castShadow = cast;
  });
}

/**
 * Distance-based shadow budget. Machines further than `SHADOW_RANGE` from the
 * player stop casting, which halves the geometry drawn into the shadow map.
 * The player and the machine being driven always keep their shadow.
 *
 * Call once per frame with every machine and the one currently being driven;
 * the check itself is throttled, so the call is cheap.
 */
export function updateShadowBudget(machines: Protagonist[], player: Protagonist): void {
  const now = performance.now();
  if (now - shadowLast < SHADOW_INTERVAL) return;
  shadowLast = now;

  player.root.getWorldPosition(shadowOrigin);
  for (const machine of machines) {
    const near =
      machine === player ||
      machine.root.getWorldPosition(shadowProbe).distanceTo(shadowOrigin) <= SHADOW_RANGE;
    setCast(machine.root, near);
  }
}
