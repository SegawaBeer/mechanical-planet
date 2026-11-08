// The walking robot form: chunky primitives, jointed hips and shoulders so the
// walk can swing the limbs. Local +Y is up and +Z is forward, feet on y = 0.
// Roughly 1.9 units tall, which is a little over the human explorer.

import * as THREE from 'three';
import { glowing, metal, type Scheme } from './scheme';

/** Ground covered by one full gait cycle, in surface units. */
const STRIDE = 1.62;
const HIP_Y = 0.98;
const THIGH = 0.44;
const SHIN = 0.5;

export type FormState = {
  /** Signed ground speed in surface units per second. */
  speed: number;
  /** Ground speed relative to a full sprint, clamped to [0, 1]. */
  speed01: number;
  airborne: boolean;
  /** Steering input in [-1, 1], used by the vehicle to roll into a turn. */
  steer: number;
  time: number;
};

/** Animation hook stored on a form's `userData.anim`; returns true on a foot landing. */
export type FormAnim = (dt: number, state: FormState) => boolean;

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export type RobotForm = { root: THREE.Group; anim: FormAnim };

/**
 * Build one robot in the given colours. Eyes glow, everything else is lit
 * metal. No emblem or insignia anywhere, by design.
 */
export function buildRobot(scheme: Scheme): RobotForm {
  const shell = metal(scheme.primary, 0.42, 0.2);
  const dark = metal(scheme.secondary, 0.5, 0.16);
  const trim = metal(scheme.trim, 0.34, 0.45);
  const accent = metal(scheme.accent, 0.35, 0.4);
  const eye = glowing(scheme.eye, 2.6);

  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // Pelvis and waist.
  body.add(box(0.52, 0.2, 0.34, dark, 0, HIP_Y + 0.04, 0));
  body.add(box(0.34, 0.1, 0.3, trim, 0, HIP_Y + 0.16, 0));

  // Torso: a broad chest over a narrower waist, with a bright seam.
  const torso = new THREE.Group();
  torso.position.y = HIP_Y + 0.2;
  body.add(torso);
  torso.add(box(0.44, 0.26, 0.3, dark, 0, 0.13, 0));
  torso.add(box(0.74, 0.34, 0.42, shell, 0, 0.38, 0));
  torso.add(box(0.58, 0.2, 0.06, trim, 0, 0.36, 0.22));
  torso.add(box(0.22, 0.14, 0.03, accent, 0, 0.36, 0.255));
  torso.add(box(0.5, 0.3, 0.14, dark, 0, 0.34, -0.24));
  torso.add(box(0.26, 0.12, 0.16, trim, 0, 0.56, -0.2));

  // Head with a visor and two glowing eyes, mounted on a short neck.
  const head = new THREE.Group();
  head.position.y = 0.62;
  torso.add(head);
  head.add(box(0.16, 0.1, 0.16, trim, 0, -0.04, 0));
  head.add(box(0.34, 0.26, 0.32, shell, 0, 0.13, 0));
  head.add(box(0.3, 0.1, 0.04, dark, 0, 0.14, 0.17));
  head.add(box(0.09, 0.055, 0.03, eye, -0.08, 0.15, 0.19));
  head.add(box(0.09, 0.055, 0.03, eye, 0.08, 0.15, 0.19));
  head.add(box(0.05, 0.16, 0.05, trim, 0.17, 0.26, -0.02));
  head.add(box(0.05, 0.16, 0.05, trim, -0.17, 0.26, -0.02));

  // Arms hang from shoulder pivots, so they can swing against the legs.
  const makeArm = (side: number) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.43, 0.46, 0);
    torso.add(shoulder);
    shoulder.add(box(0.22, 0.18, 0.26, shell, 0, 0, 0));
    shoulder.add(box(0.16, 0.26, 0.18, trim, 0, -0.22, 0));
    const upper = box(0.19, 0.3, 0.21, dark, 0, -0.46, 0);
    shoulder.add(upper);
    const elbow = new THREE.Group();
    elbow.position.y = -0.6;
    shoulder.add(elbow);
    elbow.add(box(0.17, 0.28, 0.19, shell, 0, -0.14, 0));
    elbow.add(box(0.2, 0.16, 0.22, trim, 0, -0.32, 0.01));
    return { shoulder, elbow };
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // Legs: thigh, knee pivot, shin, boot.
  const makeLeg = (side: number) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.15, HIP_Y, 0);
    body.add(hip);
    hip.add(box(0.2, 0.16, 0.22, trim, 0, 0.02, 0));
    hip.add(box(0.24, 0.36, 0.26, shell, 0, -0.24, 0));
    hip.add(box(0.12, 0.22, 0.24, accent, side * 0.12, -0.24, 0));
    const knee = new THREE.Group();
    knee.position.y = -THIGH;
    hip.add(knee);
    knee.add(box(0.22, 0.12, 0.24, trim, 0, 0, 0));
    knee.add(box(0.2, 0.34, 0.22, dark, 0, -0.24, 0));
    knee.add(box(0.28, 0.13, 0.4, shell, 0, -SHIN + 0.07, 0.05));
    return { hip, knee };
  };
  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  let phase = 0;
  let lastHalf = 0;

  const anim: FormAnim = (dt, s) => {
    let strike = false;
    const gait = THREE.MathUtils.clamp(s.speed01, 0, 1);
    if (s.airborne) {
      // Legs tucked, arms up for the hop.
      const k = Math.min(1, dt * 12);
      legL.hip.rotation.x += (-0.62 - legL.hip.rotation.x) * k;
      legR.hip.rotation.x += (0.34 - legR.hip.rotation.x) * k;
      legL.knee.rotation.x += (-1.1 - legL.knee.rotation.x) * k;
      legR.knee.rotation.x += (-0.45 - legR.knee.rotation.x) * k;
      armL.shoulder.rotation.x += (-1.9 - armL.shoulder.rotation.x) * k;
      armR.shoulder.rotation.x += (-2.1 - armR.shoulder.rotation.x) * k;
      body.position.y += (0 - body.position.y) * k;
      return false;
    }
    if (Math.abs(s.speed) < 0.12) {
      // Idle: settle to a planted stance and breathe.
      const k = Math.min(1, dt * 8);
      for (const o of [legL.hip, legR.hip, legL.knee, legR.knee]) o.rotation.x += (0 - o.rotation.x) * k;
      armL.shoulder.rotation.x += (0.05 - armL.shoulder.rotation.x) * k;
      armR.shoulder.rotation.x += (0.05 - armR.shoulder.rotation.x) * k;
      armL.elbow.rotation.x += (-0.18 - armL.elbow.rotation.x) * k;
      armR.elbow.rotation.x += (-0.18 - armR.elbow.rotation.x) * k;
      torso.rotation.set(0, 0, 0);
      body.position.y = Math.sin(s.time * 1.8) * 0.014;
      phase = 0;
      lastHalf = 0;
      return false;
    }

    const dir = Math.sign(s.speed);
    phase = (phase + (Math.abs(s.speed) * dt) / STRIDE) % 1;
    const half = phase < 0.5 ? 0 : 1;
    if (half !== lastHalf) strike = true;
    lastHalf = half;

    // One full cycle is two strides: the hips swing in counter-phase.
    const swing = Math.sin(phase * Math.PI * 2) * (0.42 + 0.34 * gait) * dir;
    legL.hip.rotation.x = swing;
    legR.hip.rotation.x = -swing;
    // The knee folds under the leg that is lifting; the planted leg stays near
    // straight so the foot does not skate.
    legL.knee.rotation.x = -Math.max(0, -swing) * 1.5 - 0.06;
    legR.knee.rotation.x = -Math.max(0, swing) * 1.5 - 0.06;

    // Arms counter-swing, and pump more the faster we go.
    armL.shoulder.rotation.x = -swing * (0.8 + 0.5 * gait) + 0.06;
    armR.shoulder.rotation.x = swing * (0.8 + 0.5 * gait) + 0.06;
    armL.elbow.rotation.x = -0.35 - 0.5 * gait;
    armR.elbow.rotation.x = -0.35 - 0.5 * gait;

    torso.rotation.x = 0.04 + 0.16 * gait;
    torso.rotation.y = -swing * 0.1;
    body.position.y = Math.abs(Math.cos(phase * Math.PI * 2)) * 0.05 * gait;
    return strike;
  };

  root.userData.anim = anim;
  return { root, anim };
}
