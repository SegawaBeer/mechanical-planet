// Robot wildlife that roams the planet. Built with the same `animal` helper as
// the original critters so `critters.ts` can walk and pat them unchanged.
// Owned by the "sky and cleanup" session.

import * as THREE from 'three';
import { animal, fourLegs, U, type AnimalData, type Piece } from './character';

const PLATE = 0x8994a1;
const PLATE_D = 0x6c7682;
const JOINT = 0x4a525c;
const DARK = 0x333a42;
const GLOW = 0x7ff2ff;

/**
 * A mechanical deer: bolted plate armour over a dark frame, cyan sensor eyes
 * and antler tips. The body is merged into one mesh by `animal`; the glowing
 * parts are separate basic-material spheres so they read at night.
 */
export function buildRobotDeer(): THREE.Group {
  const body: Piece[] = [
    // Torso: a long plate over a darker underframe.
    { geo: U.box, color: PLATE, p: [0, 0.8, 0], s: [0.36, 0.34, 0.92] },
    { geo: U.box, color: PLATE_D, p: [0, 0.62, 0.02], s: [0.4, 0.16, 0.84] },
    { geo: U.box, color: DARK, p: [0, 0.8, 0.48], s: [0.3, 0.28, 0.16] },
    // Shoulder and hip actuator rings.
    { geo: U.cyl, color: JOINT, p: [0, 0.72, 0.32], s: [0.16, 0.44, 0.16], r: [0, 0, Math.PI / 2] },
    { geo: U.cyl, color: JOINT, p: [0, 0.72, -0.3], s: [0.15, 0.42, 0.15], r: [0, 0, Math.PI / 2] },
    // Neck and head.
    { geo: U.box, color: PLATE_D, p: [0, 1.02, 0.44], s: [0.2, 0.4, 0.2], r: [-0.38, 0, 0] },
    { geo: U.box, color: PLATE, p: [0, 1.22, 0.62], s: [0.26, 0.22, 0.34] },
    { geo: U.box, color: DARK, p: [0, 1.18, 0.82], s: [0.16, 0.13, 0.14] },
    // Ear vanes.
    { geo: U.cone, color: PLATE_D, p: [-0.12, 1.38, 0.56], s: [0.13, 0.2, 0.05], r: [0, 0, 0.32] },
    { geo: U.cone, color: PLATE_D, p: [0.12, 1.38, 0.56], s: [0.13, 0.2, 0.05], r: [0, 0, -0.32] },
    // Vent grille and tail.
    { geo: U.box, color: DARK, p: [0, 0.86, -0.44], s: [0.22, 0.2, 0.06] },
    { geo: U.box, color: PLATE_D, p: [0, 0.92, -0.5], s: [0.1, 0.24, 0.08], r: [0.5, 0, 0] }
  ];

  // Antlers: steel beams with branched tines.
  for (const s of [-1, 1]) {
    body.push({ geo: U.box, color: JOINT, p: [0.09 * s, 1.44, 0.58], s: [0.055, 0.36, 0.055], r: [0, 0, -0.34 * s] });
    body.push({ geo: U.box, color: JOINT, p: [0.22 * s, 1.62, 0.56], s: [0.045, 0.26, 0.045], r: [0, 0, -0.78 * s] });
    body.push({ geo: U.box, color: JOINT, p: [0.18 * s, 1.58, 0.7], s: [0.04, 0.2, 0.04], r: [-0.55, 0, -0.4 * s] });
    body.push({ geo: U.box, color: JOINT, p: [0.3 * s, 1.76, 0.54], s: [0.035, 0.16, 0.035], r: [0, 0, -1.15 * s] });
  }

  const deer = animal('walk', 1.4, body, fourLegs(0.15, 0.32, 0.1, 0.57, 0x5c6672));
  const pivot = (deer.userData as AnimalData).pivot;
  const glow = new THREE.MeshBasicMaterial({ color: GLOW });

  const spark = (x: number, y: number, z: number, r: number) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 5), glow);
    m.position.set(x, y, z);
    pivot.add(m);
  };
  spark(-0.085, 1.25, 0.8, 0.035);
  spark(0.085, 1.25, 0.8, 0.035);
  // Antler tips glow cyan.
  spark(-0.34, 1.84, 0.53, 0.045);
  spark(0.34, 1.84, 0.53, 0.045);
  spark(-0.24, 1.72, 0.57, 0.032);
  spark(0.24, 1.72, 0.57, 0.032);

  return deer;
}
