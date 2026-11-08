// Shadow Fortress zone (暗影要塞): a purple-black fortress, the dangerous zone.
// Owned by the "ark and fortress" session.

import * as THREE from 'three';
import { G, emit, footprint, part, pick, rnd, type Ctx } from '../kit';
import type { ZoneApi, ZoneModule } from './types';

// Deep purple stone, never black, with magenta edges so the silhouette reads
// against the night.
const WALL = 0x3d2c4f;
const WALL_B = 0x4d3a63;
const WALL_D = 0x31243f;
const MAGENTA = 0xff3dd0;
const VIOLET = 0xb04cff;
const RED = 0xff3355;

const RING = 12;
/** Half-width of a gate, as an angle on the ring. */
const GATE_HALF = 2.7 / RING;

const GATE_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, Math.PI * 2];

// ---------------------------------------------------------------- walls

function wallPanel(c: Ctx, api: ZoneApi, theta: number, halfArc: number, h: number): void {
  const f = api.at(RING * Math.sin(theta), RING * Math.cos(theta), theta, -0.45);
  const len = 2 * RING * Math.sin(halfArc) + 0.5;
  part(c.solid, G.box, WALL, f, { p: [0, 0, 0], s: [len, h, 1.6] });
  part(c.solid, G.box, WALL_D, f, { p: [0, h, 0], s: [len, 0.3, 2.0] });
  part(c.solid, G.box, WALL_B, f, { p: [0, h * 0.62, 0.82], s: [len, 0.4, 0.28] });
  part(c.solid, G.box, WALL_B, f, { p: [0, h * 0.26, 0.8], s: [len, 0.4, 0.3] });
  // Battlement blocks, a bright top edge, and glow slots on both faces.
  for (let k = -1; k <= 1; k++) {
    part(c.solid, G.box, WALL_D, f, { p: [k * len * 0.3, h + 0.3, 0.6], s: [0.9, 0.9, 0.65] });
    part(c.glow, G.box, MAGENTA, f, { p: [k * len * 0.28, h * 0.6, -0.83], s: [0.18, h * 0.42, 0.06] });
  }
  // Magenta line along the parapet, and a low band that lights the walk inside.
  part(c.glow, G.box, MAGENTA, f, { p: [0, h + 0.02, 0.86], s: [len * 0.98, 0.1, 0.08] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, h * 0.16, -0.84], s: [len * 0.94, 0.12, 0.07] });
  footprint(c, f, len * 0.56);
}

function gate(api: ZoneApi, c: Ctx, theta: number): void {
  const f = api.at(RING * Math.sin(theta), RING * Math.cos(theta), theta, -0.45);
  // Two posts framing the opening, joined by a lintel.
  for (const side of [-1, 1]) {
    part(c.solid, G.box, WALL_D, f, { p: [side * 2.6, 0, 0], s: [1.1, 4.6, 1.9] });
    part(c.solid, G.box, WALL_B, f, { p: [side * 2.6, 3.5, 0], s: [1.3, 0.5, 2.1] });
    part(c.solid, G.cone4, WALL_D, f, { p: [side * 2.6, 4.6, 0], s: [1.2, 1.1, 1.2], r: [0, Math.PI / 4, 0] });
    part(c.glow, G.box, RED, f, { p: [side * 2.05, 2.6, -0.85], s: [0.16, 0.7, 0.06] });
    // Magenta frame down the inner edge of each post.
    part(c.glow, G.box, MAGENTA, f, { p: [side * 2.05, 0.15, -0.85], s: [0.13, 4.1, 0.06] });
    part(c.glow, G.box, MAGENTA, f, { p: [side * 2.05, 0.15, 0.98], s: [0.13, 4.1, 0.06] });
    footprint(c, f, 0.9, [side * 2.6, 0]);
  }
  part(c.solid, G.box, WALL_D, f, { p: [0, 4.0, 0], s: [4.2, 0.7, 1.9] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 3.95, -0.85], s: [3.6, 0.16, 0.06] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 4.72, 0.98], s: [3.6, 0.16, 0.06] });
  emit(c, f, MAGENTA, 1.0, 11, [0, 3.4, -0.6]);
}

// ---------------------------------------------------------------- towers

function tower(c: Ctx, api: ZoneApi, theta: number): THREE.Matrix4 {
  const f = api.at(RING * Math.sin(theta), RING * Math.cos(theta), theta, -0.6);
  part(c.solid, G.cone4, WALL_D, f, { p: [0, -0.3, 0], s: [4.6, 2.6, 4.6], r: [0, Math.PI / 4, 0] });
  part(c.solid, G.box, WALL, f, { p: [0, 2.1, 0], s: [3.2, 2.9, 3.2], r: [0, Math.PI / 4, 0] });
  part(c.solid, G.box, WALL_B, f, { p: [0, 4.9, 0], s: [3.6, 0.5, 3.6], r: [0, Math.PI / 4, 0] });
  part(c.solid, G.box, WALL_D, f, { p: [0, 5.4, 0], s: [2.6, 1.0, 2.6] });
  // Buttresses at the four faces.
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 4;
    const r = 1.65;
    part(c.solid, G.box, WALL, f, { p: [Math.sin(a) * r, 0, Math.cos(a) * r], s: [0.7, 3.4, 0.7], r: [0, -a, 0] });
    part(c.solid, G.cone4, WALL_D, f, { p: [Math.sin(a) * r, 3.4, Math.cos(a) * r], s: [0.9, 0.9, 0.9], r: [0, Math.PI / 4, 0] });
  }
  // Corner spikes.
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2;
    part(c.solid, G.cone4, WALL_D, f, { p: [Math.sin(a) * 1.5, 5.9, Math.cos(a) * 1.5], s: [0.5, 1.6, 0.5], r: [0, Math.PI / 4, 0] });
  }
  part(c.glow, G.box, MAGENTA, f, { p: [0, 3.2, 0], s: [2.4, 0.14, 2.4], r: [0, Math.PI / 4, 0] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 4.92, 0], s: [3.3, 0.12, 3.3], r: [0, Math.PI / 4, 0] });
  part(c.glow, G.box, VIOLET, f, { p: [0, 5.42, 0], s: [2.5, 0.1, 2.5] });
  emit(c, f, MAGENTA, 1.1, 10, [0, 5.4, 0]);
  footprint(c, f, 2.5);
  return f;
}

/** A turret head that sweeps side to side on top of a tower. */
function turret(api: ZoneApi, f: THREE.Matrix4, phase: number): void {
  const group = new THREE.Group();
  group.position.set(0, 6.4, 0).applyMatrix4(f);
  const base = new THREE.Quaternion().setFromRotationMatrix(f);
  group.quaternion.copy(base);

  const hullMat = new THREE.MeshStandardMaterial({ color: WALL_B, flatShading: true, roughness: 0.7, metalness: 0.35 });
  const darkMat = new THREE.MeshStandardMaterial({ color: WALL_D, flatShading: true, roughness: 0.8, metalness: 0.25 });
  const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.5, 6), hullMat);
  dome.position.y = 0.25;
  group.add(dome);
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.95, 1.6), hullMat);
  head.position.y = 0.95;
  group.add(head);
  for (const x of [-0.45, 0.45]) {
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 1.7), darkMat);
    barrel.position.set(x, 1.05, 1.5);
    group.add(barrel);
  }
  const eye = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.1), new THREE.MeshBasicMaterial({ color: MAGENTA, toneMapped: false }));
  eye.position.set(0, 1.15, 0.83);
  group.add(eye);

  api.addDynamic(group, (_dt, t) => {
    group.quaternion.copy(base).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(t * 0.42 + phase) * 0.75));
  });
}

// ---------------------------------------------------------------- spire

function spire(c: Ctx, api: ZoneApi): void {
  const f = api.at(-3.5, 6.0, 0.3, -0.4);
  // Octagonal dais.
  part(c.solid, G.cyl8, WALL_D, f, { p: [0, -0.3, 0], s: [6.2, 0.7, 6.2] });
  part(c.solid, G.cyl8, WALL_B, f, { p: [0, 0.4, 0], s: [4.6, 0.4, 4.6] });
  part(c.solid, G.box, WALL_B, f, { p: [0, 0.8, -2.9], s: [2.4, 0.9, 0.5] });
  part(c.glow, G.box, MAGENTA, f, { p: [0, 1.2, -2.66], s: [2.0, 0.14, 0.1] });

  // Stacked, twisted slabs: a jagged needle rather than a smooth obelisk.
  let y = 0.8;
  let s = 3.4;
  for (let i = 0; i < 6; i++) {
    const h = 2.4 - i * 0.18;
    part(c.solid, G.box, i % 2 ? WALL : WALL_D, f, { p: [0, y, 0], s: [s, h, s], r: [0, i * 0.22, 0] });
    part(c.solid, G.box, WALL_B, f, { p: [0, y + h * 0.55, 0], s: [s * 1.06, 0.22, s * 1.06], r: [0, i * 0.22, 0] });
    if (i < 4) {
      const tint = i % 2 ? VIOLET : MAGENTA;
      part(c.glow, G.box, tint, f, { p: [0, y + h * 0.3, s * 0.53], s: [s * 0.5, 0.16, 0.08], r: [0, i * 0.22, 0] });
      part(c.glow, G.box, tint, f, { p: [0, y + h * 0.3, -s * 0.53], s: [s * 0.5, 0.16, 0.08], r: [0, i * 0.22, 0] });
    }
    y += h;
    s *= 0.76;
  }
  part(c.solid, G.cone4, WALL_D, f, { p: [0, y, 0], s: [1.9, 3.4, 1.9], r: [0, 0.7, 0] });
  // Shards leaning against the base.
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    part(c.solid, G.cone4, pick(c, [WALL, WALL_D]), f, {
      p: [Math.sin(a) * 2.6, 0.2, Math.cos(a) * 2.6],
      s: [0.7, rnd(c, 1.6, 3.0), 0.7],
      r: [Math.sin(a) * 0.3, a, -Math.cos(a) * 0.3]
    });
  }
  part(c.glow, G.sphere, VIOLET, f, { p: [0, y + 3.2, 0], s: 1.1 });
  emit(c, f, VIOLET, 2.0, 16, [0, y + 2.4, 0]);
  emit(c, f, VIOLET, 0.8, 10, [0, 2.0, 0]);
  footprint(c, f, 3.4);
}

// ---------------------------------------------------------------- fences and mines

/** Laser bars across a gate approach. They flicker and do not block. */
function laserFence(api: ZoneApi, theta: number, radius: number): void {
  const f = api.at(radius * Math.sin(theta), radius * Math.cos(theta), theta, 0);
  const group = new THREE.Group();
  f.decompose(group.position, group.quaternion, group.scale);
  const mat = new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.8, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false });
  const postMat = new THREE.MeshStandardMaterial({ color: WALL_D, flatShading: true });
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.6, 0.3), postMat);
    post.position.set(side * 1.9, 1.3, 0);
    group.add(post);
  }
  for (let i = 0; i < 4; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.09, 0.09), mat);
    bar.position.set(0, 0.5 + i * 0.62, 0);
    group.add(bar);
  }
  const phase = theta * 3.1;
  api.addDynamic(group, (_dt, t) => {
    mat.opacity = 0.3 + 0.55 * (0.5 + 0.5 * Math.sin(t * 9 + phase)) * (0.65 + 0.35 * Math.sin(t * 23 + phase * 2));
  });
}

/** Mines: squat discs with a red light that pulses. */
function mines(api: ZoneApi, spots: [number, number][]): void {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);
  const glowMat = new THREE.MeshBasicMaterial({ color: RED, toneMapped: false });
  const frames = spots.map(([e, n]) => api.at(e, n, 0));
  frames.forEach((f, i) => {
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5), glowMat);
    lamp.position.set(0, 0.85, 0).applyMatrix4(f);
    lamp.userData.phase = i * 1.7;
    group.add(lamp);
  });
  api.addDynamic(group, (_dt, t) => {
    for (const child of group.children) {
      const phase = (child.userData.phase as number) ?? 0;
      child.scale.setScalar(Math.sin(t * 2.6 + phase) > 0 ? 1 : 0.15);
    }
  });
}

function mineBody(c: Ctx, f: THREE.Matrix4): void {
  part(c.solid, G.cyl8, WALL_D, f, { p: [0, -0.1, 0], s: [1.5, 0.5, 1.5] });
  part(c.solid, G.box, WALL_B, f, { p: [0, 0.4, 0], s: [0.5, 0.3, 0.5] });
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + 0.4;
    part(c.solid, G.box, WALL, f, { p: [Math.sin(a) * 0.55, 0.05, Math.cos(a) * 0.55], s: [0.5, 0.14, 0.18], r: [0, -a, 0] });
  }
  footprint(c, f, 0.85);
}

// ---------------------------------------------------------------- scatter

function spike(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.8, 1.8);
  footprint(c, f, 0.35);
  part(c.solid, G.cone4, WALL_B, f, { s: [0.6, h, 0.6], r: [0, c.rng() * 3, 0] });
}

function rubble(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.9, 1.9);
  footprint(c, f, s * 0.55);
  part(c.solid, G.box, pick(c, [WALL, WALL_D]), f, { p: [0, 0.1, 0], s: [s, rnd(c, 0.5, 1.1), s * 0.8], r: [rnd(c, -0.25, 0.25), c.rng() * 3, rnd(c, -0.25, 0.25)] });
  if (c.rng() < 0.5) {
    part(c.solid, G.box, WALL_B, f, { p: [s * 0.5, 0.6, 0], s: [0.6, 0.5, 0.7], r: [0, c.rng() * 3, 0.3] });
  }
}

function crystal(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.9, 2.2);
  footprint(c, f, 0.4);
  const tint = pick(c, [0x4a3d63, 0x5b3d7a, 0x3d3350]);
  part(c.solid, G.cone4, tint, f, { p: [0, 0, 0], s: [0.5, h, 0.5], r: [rnd(c, -0.3, 0.3), c.rng() * 3, rnd(c, -0.3, 0.3)] });
  part(c.glow, G.box, VIOLET, f, { p: [0, 0.15, 0], s: [0.3, h * 0.35, 0.3], r: [0, c.rng() * 3, 0] });
}

// ---------------------------------------------------------------- zone

function buildFortress(c: Ctx, api: ZoneApi): void {
  // Wall ring: three panels between each pair of gates.
  for (let q = 0; q < 4; q++) {
    const a = GATE_ANGLES[q] + GATE_HALF;
    const b = GATE_ANGLES[q + 1] - GATE_HALF;
    const span = b - a;
    for (let j = 0; j < 3; j++) {
      wallPanel(c, api, a + (span * (j + 0.5)) / 3, span / 6, 3.4 + (j === 1 ? 0.5 : 0));
    }
    gate(api, c, GATE_ANGLES[q]);
  }

  // Corner towers, each with a scanning head.
  for (let k = 0; k < 4; k++) {
    const theta = (GATE_ANGLES[k] + GATE_ANGLES[k + 1]) / 2;
    const f = tower(c, api, theta);
    turret(api, f, k * 1.9);
  }

  spire(c, api);

  // Laser fences inside three of the gates.
  laserFence(api, 0, 8.6);
  laserFence(api, Math.PI / 2, 8.6);
  laserFence(api, Math.PI, 8.0);

  // Mines in the courtyard.
  const spots: [number, number][] = [
    [6.5, 5.5], [-6.0, -1.0], [7.0, -3.0], [2.2, -7.0], [-2.0, -7.5], [3.0, 3.0]
  ];
  for (const [e, n] of spots) mineBody(c, api.at(e, n, 0, -0.1));
  mines(api, spots);
  emit(c, api.at(6.5, 5.5, 0), RED, 0.5, 6, [0, 0.9, 0]);

  // Two torches on the inner face of the wall keep the courtyard readable.
  for (const [e, n, yaw] of [
    [9.1, 5.3, -0.6],
    [-9.1, -5.3, 2.5]
  ] as [number, number, number][]) {
    const f = api.at(e, n, yaw, -0.3);
    part(c.solid, G.box, WALL_D, f, { p: [0, 0, 0], s: [0.7, 0.4, 0.7] });
    part(c.solid, G.box, WALL_B, f, { p: [0, 0.4, 0], s: [0.3, 2.6, 0.3] });
    part(c.glow, G.sphere, MAGENTA, f, { p: [0, 3.1, 0], s: 0.45 });
    emit(c, f, MAGENTA, 1.3, 11, [0, 3.2, 0]);
    footprint(c, f, 0.7);
  }

  api.exclude(0, 0, 14.5);
  api.exclude(0, 12, 4);
  api.exclude(0, -12, 4);
  api.exclude(12, 0, 4);
  api.exclude(-12, 0, 4);
}

export const fortressZone: ZoneModule = {
  id: 'fortress',
  build(api) {
    buildFortress(api.ctx, api);
  },
  scatter: [
    { p: 0.05, build: spike },
    { p: 0.03, build: rubble },
    { p: 0.025, build: crystal }
  ]
};
