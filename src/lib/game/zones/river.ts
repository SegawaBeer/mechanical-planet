// Energy River zone (能量河流): a sea with an island in the middle, and three
// bridges out to the land zones. Owned by the "terrain and energy river" session.

import * as THREE from 'three';
import { BRIDGES, biomeById, type BridgeLine } from '../biomes';
import { G, emit, footprint, part, rnd, type Ctx } from '../kit';
import { PLANET_RADIUS, SEA_LEVEL, surfaceRadius, tangentBasis } from '../planet';
import type { ZoneApi, ZoneModule } from './types';

const METAL = [0x2b3741, 0x36434e, 0x46545f];
const ENERGY = 0x2fe6ff;
const ENERGY_HOT = 0x9ff5ff;

const islandCentre = () => biomeById('river').center;

// --------------------------------------------------------------- bridges

const _up = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();

/** Mesh for one deck: plates, rails with a light strip, and piers to the bed. */
function buildDeck(c: Ctx, deck: BridgeLine): void {
  const width = 3.5;
  const half = width / 2;
  // The first and last samples are the registered overhang, so the model starts
  // and ends one sample inside them and never stands outside the walkable deck.
  for (let i = 1; i < deck.points.length - 2; i++) {
    const a = deck.points[i];
    const b = deck.points[i + 1];
    const pa = a.clone().multiplyScalar(deck.heights[i]);
    const pb = b.clone().multiplyScalar(deck.heights[i + 1]);
    const mid = pa.clone().add(pb).multiplyScalar(0.5);
    _up.copy(mid).normalize();
    _fwd.copy(pb).sub(pa);
    const segLen = _fwd.length() * 1.06;
    _fwd.addScaledVector(_up, -_fwd.dot(_up)).normalize();
    _right.crossVectors(_up, _fwd).normalize();
    _m.makeBasis(_right, _up, _fwd);
    _m.setPosition(mid);
    const y = -0.24;
    part(c.solid, G.box, METAL[2], _m, { p: [0, y, 0], s: [width, 0.24, segLen] });
    part(c.solid, G.box, METAL[0], _m, { p: [half - 0.12, 0, 0], s: [0.14, 0.7, segLen] });
    part(c.solid, G.box, METAL[0], _m, { p: [-half + 0.12, 0, 0], s: [0.14, 0.7, segLen] });
    part(c.glow, G.box, ENERGY, _m, { p: [half - 0.12, 0.7, 0], s: [0.16, 0.1, segLen] });
    part(c.glow, G.box, ENERGY, _m, { p: [-half + 0.12, 0.7, 0], s: [0.16, 0.1, segLen] });
    // A pier every few segments, down to the bed.
    if (i % 3 === 0) {
      const bed = Math.min(surfaceRadius(a), deck.heights[i] - 0.3);
      const h = Math.max(0.4, deck.heights[i] - 0.24 - bed + 1.2);
      part(c.solid, G.cyl6, METAL[1], _m, { p: [0, -h, 0], s: [0.5, h, 0.5] });
    }
  }
}

/** Draw every deck the water layout published, and keep scatter off them. */
function bridges(api: ZoneApi): void {
  const c = api.ctx;
  const centre = islandCentre();
  const right = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  tangentBasis(centre, 0, right, fwd);
  for (const deck of BRIDGES) {
    buildDeck(c, deck);
    for (let i = 0; i < deck.points.length; i += 3) {
      const p = deck.points[i];
      const flat = p.clone().addScaledVector(centre, -centre.dot(p));
      if (flat.lengthSq() < 1e-10) continue;
      flat.normalize();
      const ang = centre.angleTo(p) * PLANET_RADIUS;
      api.exclude(flat.dot(right) * ang, flat.dot(fwd) * ang, 3);
    }
  }
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

function fountain(api: ZoneApi, east: number, north: number, phase: number): void {
  const c = api.ctx;
  const f = api.at(east, north, 0);
  api.exclude(east, north, 3.4);
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

export const riverZone: ZoneModule = {
  id: 'river',
  build(api) {
    bridges(api);
    beacon(api);
    fountain(api, 6.4, 1.6, 0);
    fountain(api, -5.4, 5.2, 1.6);
    fountain(api, 1.2, -7.6, 3.1);
    for (const [e, n, s] of [[7.4, -3.2, 1.6], [-7.2, -2.4, 1.3], [3.4, 7.4, 1.2]]) {
      const f = api.at(e, n, 0);
      api.exclude(e, n, 2.4);
      footprint(api.ctx, f, 0.9);
      crystals(api.ctx, f, s);
    }
  },
  scatter: [
    { p: 0.05, build: plateRock },
    { p: 0.022, build: smallCrystals },
    { p: 0.025, build: pipeStub }
  ]
};
