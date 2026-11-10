// Energy River zone (能量河流): canyon country cut by a glowing river.
// Owned by the "terrain and energy river" session.

import * as THREE from 'three';
import { biomeById, RIVERS } from '../biomes';
import { G, emit, footprint, part, rnd, type Ctx } from '../kit';
import { PLANET_RADIUS, surfaceFrame, tangentBasis } from '../planet';
import type { ZoneApi, ZoneModule } from './types';

const METAL = [0x2b3741, 0x36434e, 0x46545f];
const ENERGY = 0x2fe6ff;
const ENERGY_HOT = 0x9ff5ff;

/** The main channel of the river network. */
const mainRiver = () => RIVERS[0];

/**
 * Direction `offset` units out from the river bank at fraction `u` along the
 * main channel, on the side given by `sign`. Returns null before the channels
 * have been laid out.
 */
function bankDir(u: number, offset: number, sign: number): THREE.Vector3 | null {
  const line = mainRiver();
  if (!line || line.points.length < 4) return null;
  const last = line.points.length - 1;
  const i = Math.round(THREE.MathUtils.clamp(u, 0, 1) * last);
  const p = line.points[i];
  const tan = new THREE.Vector3().subVectors(line.points[Math.min(last, i + 2)], line.points[Math.max(0, i - 2)]);
  tan.addScaledVector(p, -tan.dot(p));
  if (tan.lengthSq() < 1e-10) return null;
  tan.normalize();
  const side = new THREE.Vector3().crossVectors(p, tan).normalize().multiplyScalar(sign);
  const off = (line.half[i] + offset) / PLANET_RADIUS;
  return p.clone().multiplyScalar(Math.cos(off)).addScaledVector(side, Math.sin(off)).normalize();
}

/** Local [east, north] of a direction, in the zone's own frame. */
function localOf(d: THREE.Vector3): [number, number] {
  const centre = biomeById('river').center;
  const right = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  tangentBasis(centre, 0, right, fwd);
  const flat = d.clone().addScaledVector(centre, -centre.dot(d));
  const len = flat.length();
  if (len < 1e-8) return [0, 0];
  flat.divideScalar(len);
  const ang = centre.angleTo(d) * PLANET_RADIUS;
  return [flat.dot(right) * ang, flat.dot(fwd) * ang];
}

function excludeAt(api: ZoneApi, d: THREE.Vector3, radius: number): void {
  const [east, north] = localOf(d);
  api.exclude(east, north, radius);
}

// --------------------------------------------------------------- beacon

function beacon(api: ZoneApi): void {
  const c = api.ctx;
  const f = api.at(0, 0, 0);
  api.exclude(0, 0, 3);
  part(c.solid, G.cyl8, METAL[1], f, { s: [3.3, 0.22, 3.3] });
  part(c.solid, G.cyl8, METAL[2], f, { p: [0, 0.22, 0], s: [2.5, 0.2, 2.5] });
  part(c.solid, G.cyl8, METAL[0], f, { p: [0, 0.42, 0], s: [1.7, 0.18, 1.7] });
  footprint(c, f, 1.7);
  const n = 10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const px = Math.sin(a) * 2.1;
    const pz = Math.cos(a) * 2.1;
    part(c.solid, G.box, METAL[0], f, { p: [px, 0, pz], s: [0.22, 0.3, 0.22], r: [0, -a, 0] });
    part(c.glow, G.cyl8, i % 2 ? ENERGY : ENERGY_HOT, f, { p: [px, 0.3, pz], s: [0.17, 0.26, 0.17] });
    part(c.glow, G.box, ENERGY, f, { p: [px, 0.06, pz], s: [0.5, 0.06, 0.16], r: [0, -a, 0] });
  }
  part(c.glow, G.cyl8, ENERGY, f, { p: [0, 0.6, 0], s: [1.1, 0.1, 1.1] });
  part(c.glow, G.cyl8, ENERGY_HOT, f, { p: [0, 0.7, 0], s: [0.45, 0.1, 0.45] });
  emit(c, f, ENERGY, 2.4, 16, [0, 0.9, 0]);
}

// --------------------------------------------------------------- fountains

/** A springhead on the river bank: a ring of stone with an energy jet. */
function fountain(api: ZoneApi, d: THREE.Vector3, phase: number): void {
  const c = api.ctx;
  const f = surfaceFrame(d, 0, new THREE.Matrix4());
  excludeAt(api, d, 3.4);
  const rocks = 13;
  for (let i = 0; i < rocks; i++) {
    const a = (i / rocks) * Math.PI * 2;
    const r = 2.05 + rnd(c, -0.2, 0.35);
    part(c.solid, G.dodeca, METAL[i % 3], f, {
      p: [Math.sin(a) * r, 0, Math.cos(a) * r],
      s: [rnd(c, 0.9, 1.5), rnd(c, 0.8, 1.9), rnd(c, 0.9, 1.4)],
      r: [rnd(c, -0.15, 0.15), a, rnd(c, -0.15, 0.15)]
    });
  }
  footprint(c, f, 2.2);
  part(c.glow, G.cyl8, ENERGY, f, { p: [0, 0.12, 0], s: [3.1, 0.08, 3.1] });
  part(c.glow, G.cyl8, ENERGY_HOT, f, { p: [0, 0.17, 0], s: [1.3, 0.07, 1.3] });
  emit(c, f, ENERGY, 2.6, 18, [0, 1.2, 0]);

  const g = new THREE.Group();
  f.decompose(g.position, g.quaternion, g.scale);
  g.matrixAutoUpdate = false;
  g.updateMatrix();
  const jetMat = new THREE.MeshBasicMaterial({
    color: ENERGY_HOT,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide
  });
  const core = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 9, 1, true).translate(0, 0.5, 0), jetMat);
  g.add(core);
  const splashMat = new THREE.MeshBasicMaterial({
    color: ENERGY,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide
  });
  const splash = new THREE.Mesh(new THREE.RingGeometry(0.55, 1, 20), splashMat);
  splash.rotation.x = -Math.PI / 2;
  splash.position.y = 0.24;
  g.add(splash);
  const sideMat = jetMat.clone();
  sideMat.opacity = 0.5;
  const sideGeo = new THREE.ConeGeometry(0.2, 1, 6, 1, true).translate(0, 0.5, 0);
  const sides = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(sideGeo, sideMat);
    const a = (i / 3) * Math.PI * 2 + 0.5;
    m.position.set(Math.sin(a) * 0.7, 0.15, Math.cos(a) * 0.7);
    g.add(m);
    return m;
  });
  const period = 4.2;
  api.addDynamic(g, (_dt, t) => {
    const p = (((t + phase) % period) + period) % period / period;
    const burst = p < 0.42 ? Math.sin((p / 0.42) * Math.PI) : 0;
    const height = 0.2 + burst * 3.6;
    core.scale.set(0.75 + burst * 0.55, height, 0.75 + burst * 0.55);
    jetMat.opacity = 0.25 + burst * 0.7;
    for (let i = 0; i < sides.length; i++) {
      sides[i].scale.set(1, 0.15 + burst * (1.6 + i * 0.35) * (0.8 + 0.2 * Math.sin(t * 3 + i)), 1);
    }
    sideMat.opacity = 0.15 + burst * 0.45;
    const ring = 1 + burst * 1.9;
    splash.scale.set(ring, ring, ring);
    splashMat.opacity = burst * 0.55 * (1 - burst * 0.4);
  });
}

// --------------------------------------------------------------- rock

/** A cluster of glowing crystals pushing up through the ground. */
function crystals(c: Ctx, f: THREE.Matrix4, scale: number): void {
  const n = 3 + Math.floor(c.rng() * 4);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + c.rng();
    const r = c.rng() * 0.9 * scale;
    const h = (0.7 + c.rng() * 1.6) * scale;
    part(c.glow, G.tetra, i % 3 === 0 ? ENERGY_HOT : ENERGY, f, {
      p: [Math.sin(a) * r, 0, Math.cos(a) * r],
      s: [h * 0.45, h, h * 0.45],
      r: [c.rng() * 0.5 - 0.25, c.rng() * 3, c.rng() * 0.5 - 0.25]
    });
  }
  emit(c, f, ENERGY, 1.3, 9, [0, 0.9 * scale, 0]);
}

// --------------------------------------------------------------- scatter

function plateRock(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.6, 1.3);
  footprint(c, f, 0.5 * s);
  part(c.solid, G.dodeca, 0x3f4f5c, f, { s: [s * 1.2, s * 0.7, s], r: [0, c.rng() * 3, 0] });
}

function smallCrystals(c: Ctx, f: THREE.Matrix4): void {
  crystals(c, f, rnd(c, 0.45, 0.85));
}

function pipeStub(c: Ctx, f: THREE.Matrix4): void {
  const h = rnd(c, 0.5, 1.4);
  footprint(c, f, 0.35);
  part(c.solid, G.cyl6, METAL[1], f, { s: [0.42, h, 0.42], r: [rnd(c, -0.1, 0.1), 0, rnd(c, -0.1, 0.1)] });
  part(c.glow, G.cyl8, c.rng() < 0.5 ? ENERGY : ENERGY_HOT, f, { p: [0, h, 0], s: [0.3, 0.1, 0.3] });
}

/** A shelf of stacked plates on the canyon rim, for scale. */
function rimStack(c: Ctx, f: THREE.Matrix4): void {
  const s = rnd(c, 0.9, 1.6);
  footprint(c, f, 0.8 * s);
  let lift = 0;
  const n = 2 + Math.floor(c.rng() * 3);
  for (let i = 0; i < n; i++) {
    const wide = s * (1.5 - i * 0.22);
    part(c.solid, G.cyl6, METAL[i % 3], f, {
      p: [rnd(c, -0.1, 0.1), lift, rnd(c, -0.1, 0.1)],
      s: [wide * 2, s * 0.35, wide * 1.6],
      r: [rnd(c, -0.05, 0.05), c.rng() * 3, rnd(c, -0.05, 0.05)]
    });
    lift += s * 0.34;
  }
}

export const riverZone: ZoneModule = {
  id: 'river',
  build(api) {
    beacon(api);
    // Springheads on three bends, so the water reads as the source of the zone.
    const fountains: [number, number, number][] = [
      [0.22, 4.4, 1],
      [0.54, 5.2, -1],
      [0.79, 3.8, 1]
    ];
    let phase = 0;
    for (const [u, off, sign] of fountains) {
      const d = bankDir(u, off, sign);
      if (!d) continue;
      fountain(api, d, phase);
      phase += 1.7;
    }
    // Crystal clusters along the rim of the canyon.
    const clusters: [number, number, number, number][] = [
      [0.32, 2.6, -1, 1.5],
      [0.66, 2.4, 1, 1.2],
      [0.46, 16, 1, 1.0]
    ];
    for (const [u, off, sign, scale] of clusters) {
      const d = bankDir(u, off, sign);
      if (!d) continue;
      const f = surfaceFrame(d, 0, new THREE.Matrix4());
      excludeAt(api, d, 2.4);
      footprint(api.ctx, f, 0.9);
      crystals(api.ctx, f, scale);
    }
  },
  scatter: [
    { p: 0.05, build: plateRock },
    { p: 0.022, build: smallCrystals },
    { p: 0.025, build: pipeStub },
    { p: 0.012, build: rimStack }
  ]
};
