// The vehicle form: a low, sleek truck about 2.6 units long, forward +Z.
// Wheels are separate pivots so they can spin with the ground speed and the
// front pair can lean into a turn; the body rolls slightly over them.

import * as THREE from 'three';
import { glowing, metal, type Scheme } from './scheme';
import type { FormAnim } from './robot';

const WHEEL_R = 0.3;
const WHEEL_W = 0.22;
/** Half the wheelbase and half the track, in local units. */
const AXLE_Z = 0.86;
const AXLE_X = 0.6;

export type VehicleForm = { root: THREE.Group; anim: FormAnim };

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function buildVehicle(scheme: Scheme): VehicleForm {
  const shell = metal(scheme.primary, 0.38, 0.22);
  const dark = metal(scheme.secondary, 0.5, 0.16);
  const trim = metal(scheme.trim, 0.32, 0.5);
  const accent = metal(scheme.accent, 0.35, 0.4);
  const light = glowing(scheme.eye, 2.6);
  const rubber = metal(0x14161a, 0.95, 0.05);

  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // Hull: a broad lower body with a narrow nose and a cab set back.
  body.add(box(1.14, 0.3, 2.1, shell, 0, 0.46, 0));
  body.add(box(1.0, 0.22, 2.5, dark, 0, 0.32, 0));
  body.add(box(1.16, 0.1, 2.0, trim, 0, 0.6, -0.05));
  // Sloped nose over the front wheels.
  const nose = box(0.96, 0.22, 0.6, shell, 0, 0.5, 1.0);
  nose.rotation.x = -0.22;
  body.add(nose);
  body.add(box(1.08, 0.2, 0.16, trim, 0, 0.34, 1.28));
  body.add(box(1.06, 0.3, 0.14, dark, 0, 0.34, -1.26));

  // Cab with a dark windscreen and a glowing headlight strip.
  body.add(box(0.92, 0.34, 0.94, shell, 0, 0.78, -0.12));
  body.add(box(0.78, 0.22, 0.04, dark, 0, 0.8, 0.36));
  body.add(box(0.8, 0.06, 0.5, trim, 0, 0.95, -0.16));
  body.add(box(0.24, 0.07, 0.04, light, -0.3, 0.48, 1.28));
  body.add(box(0.24, 0.07, 0.04, light, 0.3, 0.48, 1.28));
  body.add(box(0.16, 0.05, 0.04, accent, 0, 0.62, 1.15));

  // A low spoiler and a pair of fins: heroic, not boxy.
  body.add(box(0.96, 0.06, 0.26, trim, 0, 1.0, -0.98));
  body.add(box(0.06, 0.22, 0.22, dark, -0.44, 0.9, -0.98));
  body.add(box(0.06, 0.22, 0.22, dark, 0.44, 0.9, -0.98));

  // Wheels: pivots on the root, so the body can roll over them.
  const wheelGeo = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, WHEEL_W, 14);
  const hubGeo = new THREE.CylinderGeometry(0.13, 0.13, WHEEL_W + 0.02, 8);
  const wheels: THREE.Group[] = [];
  const front: THREE.Group[] = [];
  for (const [x, z] of [
    [-AXLE_X, AXLE_Z],
    [AXLE_X, AXLE_Z],
    [-AXLE_X, -AXLE_Z],
    [AXLE_X, -AXLE_Z]
  ]) {
    const pivot = new THREE.Group();
    pivot.rotation.order = 'YXZ';
    pivot.position.set(x, WHEEL_R, z);
    root.add(pivot);
    const tyre = new THREE.Mesh(wheelGeo, rubber);
    tyre.rotation.z = Math.PI / 2;
    tyre.castShadow = true;
    const hub = new THREE.Mesh(hubGeo, trim);
    hub.rotation.z = Math.PI / 2;
    hub.position.x = x < 0 ? -0.02 : 0.02;
    pivot.add(tyre, hub);
    wheels.push(pivot);
    if (z > 0) front.push(pivot);
  }

  let spin = 0;

  const anim: FormAnim = (dt, s) => {
    spin = (spin + (s.speed * dt) / WHEEL_R) % (Math.PI * 2);
    for (const w of wheels) w.rotation.x = spin;
    const steer = THREE.MathUtils.clamp(s.steer, -1, 1) * 0.28;
    for (const w of front) w.rotation.y = steer;
    // Body rolls into the turn, and lifts a touch with speed.
    const lean = -steer * 0.16 * Math.min(1, Math.abs(s.speed) / 6);
    body.rotation.z += (lean - body.rotation.z) * Math.min(1, dt * 6);
    body.rotation.x += (Math.min(0.06, Math.abs(s.speed) * 0.004) - body.rotation.x) * Math.min(1, dt * 4);
    body.position.y = Math.sin(s.time * 9) * 0.006 * Math.min(1, Math.abs(s.speed) / 6);
    return false;
  };

  root.userData.anim = anim;
  return { root, anim };
}
