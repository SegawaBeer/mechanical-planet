// Energy River zone (能量河流): canyon country cut by glowing channels.
// Owned by the "terrain and energy river" session.

import * as THREE from 'three';
import { BIOMES, biomeById, channelField, oceanField } from '../biomes';
import { G, emit, footprint, part, rnd, type Ctx } from '../kit';
import { PLANET_RADIUS, offsetDir, surfaceFrame, tangentBasis } from '../planet';
import type { ZoneApi, ZoneModule } from './types';

const METAL = [0x2b3741, 0x36434e, 0x46545f];
const ENERGY = 0x2fe6ff;
const ENERGY_HOT = 0x9ff5ff;

const center = () => biomeById('river').center;

/** True on a causeway: a channel that the crossing strips have lifted dry. */
function onCrossing(d: THREE.Vector3): boolean {
  return channelField(d) < 0 && oceanField(d) >= 0;
}

/** Direction at fraction `t` along the great circle from `a` to `b`. */
function arcDir(a: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3): THREE.Vector3 {
  const len = a.angleTo(b);
  if (len < 1e-5) return out.copy(a);
  const s1 = Math.sin((1 - t) * len) / Math.sin(len);
  const s2 = Math.sin(t * len) / Math.sin(len);
  return out.copy(a).multiplyScalar(s1).addScaledVector(b, s2).normalize();
}

const _t = new THREE.Vector3();
const _r = new THREE.Vector3();
const _f = new THREE.Vector3();

/** Yaw that turns a surface frame's local +Z along the arc from `a` to `b`. */
function arcYaw(a: THREE.Vector3, b: THREE.Vector3, d: THREE.Vector3): number {
  _t.copy(b).addScaledVector(d, -b.dot(d));
  if (_t.lengthSq() < 1e-8) return 0;
  _t.normalize();
  tangentBasis(d, 0, _r, _f);
  return Math.atan2(_t.dot(_r), _t.dot(_f));
}

// --------------------------------------------------------------- beacon

function beacon(api: ZoneApi): void {
  const c = api.ctx;
  const f = api.at(0, 0, 0);
  api.exclude(0, 0, 3);

  // Stepped base, low enough that the floating marker still reads above it.
  part(c.solid, G.cyl8, METAL[1], f, { s: [3.3, 0.22, 3.3] });
  part(c.solid, G.cyl8, METAL[2], f, { p: [0, 0.22, 0], s: [2.5, 0.2, 2.5] });
  part(c.solid, G.cyl8, METAL[0], f, { p: [0, 0.42, 0], s: [1.7, 0.18, 1.7] });
  footprint(c, f, 1.7);

  // Ring of glowing conduits feeding the pedestal.
  const n = 10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const px = Math.sin(a) * 2.1;
    const pz = Math.cos(a) * 2.1;
    // Conduit running in from the ring, then a lamp head on top of it.
    part(c.solid, G.box, METAL[0], f, { p: [px, 0, pz], s: [0.22, 0.3, 0.22], r: [0, -a, 0] });
    part(c.glow, G.cyl8, i % 2 ? ENERGY : ENERGY_HOT, f, { p: [px, 0.3, pz], s: [0.17, 0.26, 0.17] });
    part(c.glow, G.box, ENERGY, f, { p: [px, 0.06, pz], s: [0.5, 0.06, 0.16], r: [0, -a, 0] });
  }
  // A cold core ring in the middle of the pedestal.
  part(c.glow, G.cyl8, ENERGY, f, { p: [0, 0.6, 0], s: [1.1, 0.1, 1.1] });
  part(c.glow, G.cyl8, ENERGY_HOT, f, { p: [0, 0.7, 0], s: [0.45, 0.1, 0.45] });
  emit(c, f, ENERGY, 2.4, 16, [0, 0.9, 0]);
}

// --------------------------------------------------------------- fountains

/**
 * A crater with an energy jet that erupts every few seconds. The jet is a live
 * object rather than baked scenery because it moves; the crater around it is
 * baked as usual.
 */
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

  // The well itself: a disc of light sunk in the crater.
  part(c.glow, G.cyl8, ENERGY, f, { p: [0, 0.12, 0], s: [3.1, 0.08, 3.1] });
  part(c.glow, G.cyl8, ENERGY_HOT, f, { p: [0, 0.17, 0], s: [1.3, 0.07, 1.3] });
  emit(c, f, ENERGY, 2.6, 18, [0, 1.2, 0]);

  // Live jets, placed in world space from the ground frame.
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
  const coreGeo = new THREE.ConeGeometry(0.5, 1, 9, 1, true).translate(0, 0.5, 0);
  const core = new THREE.Mesh(coreGeo, jetMat);
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
    // One burst: fast rise, slow collapse, then a pause before the next.
    const burst = p < 0.42 ? Math.sin((p / 0.42) * Math.PI) : 0;
    const height = 0.2 + burst * 3.6;
    core.scale.set(0.75 + burst * 0.55, height, 0.75 + burst * 0.55);
    jetMat.opacity = 0.25 + burst * 0.7;
    for (let i = 0; i < sides.length; i++) {
      const s = 0.15 + burst * (1.6 + i * 0.35) * (0.8 + 0.2 * Math.sin(t * 3 + i));
      sides[i].scale.set(1, s, 1);
    }
    sideMat.opacity = 0.15 + burst * 0.45;
    const ring = 1 + burst * 1.9;
    splash.scale.set(ring, ring, ring);
    splashMat.opacity = burst * 0.55 * (1 - burst * 0.4);
  });
}

// --------------------------------------------------------------- rock

/** A jagged spire: stacked cones leaning slightly off the ground normal. */
function spire(api: ZoneApi, east: number, north: number, height: number): void {
  const c = api.ctx;
  const yaw = c.rng() * Math.PI * 2;
  const f = api.at(east, north, yaw);
  api.exclude(east, north, 2.2);
  const lean = rnd(c, -0.16, 0.16);
  part(c.solid, G.cone6, METAL[0], f, { s: [height * 0.42, height, height * 0.42], r: [lean, 0, lean * 0.6] });
  part(c.solid, G.cone4, METAL[2], f, {
    p: [rnd(c, -0.3, 0.3), height * 0.62, rnd(c, -0.3, 0.3)],
    s: [height * 0.24, height * 0.55, height * 0.24],
    r: [lean * 0.8, c.rng() * 3, lean]
  });
  // A seam of light running up the broken face.
  part(c.glow, G.box, ENERGY, f, {
    p: [height * 0.1, height * 0.3, height * 0.14],
    s: [0.1, height * 0.32, 0.1],
    r: [lean, 0, lean * 0.6]
  });
  footprint(c, f, height * 0.2);
}

/** A ridge of broken rock along the lip of a channel. */
function ridge(api: ZoneApi, east: number, north: number, heading: number): void {
  const c = api.ctx;
  const blocks = 4;
  for (let i = 0; i < blocks; i++) {
    const along = (i - (blocks - 1) / 2) * rnd(c, 1.1, 1.6);
    const ex = east + Math.sin(heading) * along;
    const nz = north + Math.cos(heading) * along;
    const f = api.at(ex, nz, c.rng() * Math.PI * 2);
    part(c.solid, G.dodeca, METAL[i % 3], f, {
      s: [rnd(c, 1.2, 2.2), rnd(c, 1.4, 3.4), rnd(c, 1.2, 2.0)],
      r: [rnd(c, -0.12, 0.12), c.rng() * 3, rnd(c, -0.12, 0.12)]
    });
    if (i === 0) footprint(c, api.at(ex, nz, 0), 1.4);
  }
  api.exclude(east, north, 3.2);
}

/** A cluster of glowing crystals pushing up through the plates. */
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

// --------------------------------------------------------------- bridges

/** Metal deck plates where a crossing causeway spans a channel. */
function bridge(api: ZoneApi, a: THREE.Vector3, b: THREE.Vector3, from: number, to: number, steps: number): void {
  const c = api.ctx;
  const d = new THREE.Vector3();
  const plates = THREE.MathUtils.clamp(Math.round(((to - from) * 0.4) / 0.75), 2, 30);
  const perPlate = (to - from) / plates;
  for (let i = 0; i <= plates; i++) {
    const t = (from + i * perPlate) / steps;
    arcDir(a, b, THREE.MathUtils.clamp(t, 0, 1), d);
    const yaw = arcYaw(a, b, d);
    const f = surfaceFrame(d, yaw, new THREE.Matrix4(), 0.04);
    part(c.solid, G.box, METAL[2], f, { s: [3.6, 0.2, 1.05] });
    part(c.solid, G.box, METAL[0], f, { p: [0, 0.2, 0], s: [0.28, 0.34, 1.05] });
    // Rails of light down both edges.
    part(c.glow, G.box, ENERGY, f, { p: [1.62, 0.2, 0], s: [0.13, 0.12, 1.05] });
    part(c.glow, G.box, ENERGY, f, { p: [-1.62, 0.2, 0], s: [0.13, 0.12, 1.05] });
  }
}

function bridges(api: ZoneApi): void {
  const a = center();
  const d = new THREE.Vector3();
  for (const other of BIOMES) {
    if (other.id === 'river') continue;
    const b = other.center;
    const len = a.angleTo(b) * PLANET_RADIUS;
    const steps = Math.max(4, Math.round(len / 0.4));
    let start = -1;
    for (let k = 0; k <= steps; k++) {
      arcDir(a, b, k / steps, d);
      const wet = channelField(d) < 0;
      if (wet && start < 0) start = k;
      if ((!wet || k === steps) && start >= 0) {
        const end = wet ? k : k - 1;
        if (end - start >= 2) bridge(api, a, b, Math.max(0, start - 1), Math.min(steps, end + 1), steps);
        start = -1;
      }
    }
  }
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
    beacon(api);
    fountain(api, 7.5, 1.5, 0);
    fountain(api, -6.2, 6.4, 1.6);
    fountain(api, 1.4, -9.2, 3.1);

    // Landmarks around the zone: ridges hug the banks, spires stand on open
    // plates, all skipped wherever a crossing causeway runs.
    const c = biomeById('river').center;
    const d = new THREE.Vector3();
    const ring = (radius: number, count: number, offset: number, pick: (east: number, north: number, ch: number) => void) => {
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + offset;
        const east = Math.sin(ang) * radius;
        const north = Math.cos(ang) * radius;
        d.copy(c);
        offsetDir(d, east, north);
        if (onCrossing(d)) continue;
        pick(east, north, channelField(d));
      }
    };

    ring(8.5, 16, 0.2, (e, n, ch) => {
      if (ch > 0.02 && ch < 0.12) ridge(api, e, n, 0.2);
    });
    ring(12.5, 18, 0.9, (e, n, ch) => {
      if (ch > 0.02 && ch < 0.12) ridge(api, e, n, 0.9);
      else if (ch > 0.35) spire(api, e, n, rnd(api.ctx, 5.5, 9.5));
    });
    ring(16, 14, 1.7, (e, n, ch) => {
      if (ch > 0.3) spire(api, e, n, rnd(api.ctx, 4, 7));
    });

    // Crystal fields on the open ground, well clear of the beacon.
    ring(10, 8, 2.3, (e, n, ch) => {
      if (ch < 0.12) return;
      const f = api.at(e, n, api.ctx.rng() * 3);
      footprint(api.ctx, f, 0.9);
      crystals(api.ctx, f, rnd(api.ctx, 1.1, 1.9));
    });

    bridges(api);
  },
  scatter: [
    { p: 0.05, build: plateRock },
    { p: 0.022, build: smallCrystals },
    { p: 0.025, build: pipeStub }
  ]
};
