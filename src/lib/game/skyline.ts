// Sky scenery: gold ore trains that lay their own track as they go.
// Owned by the "sky, wildlife and interface" session.
//
// There is no permanent ring. Each train rides a slowly drifting great circle,
// and the rail under it is a fixed pool of InstancedMesh segments: the ones in
// front of the engine grow in over 0.3 s, the ones behind the last cart shrink
// away a few seconds after it passes. No geometry is created per frame.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Length of one rail segment, in surface units. */
const SEG_LEN = 2.2;
/** Seconds a fresh segment takes to grow in front of the engine. */
const GROW = 0.3;
/** Extra stretch of track that stays whole behind the last cart. */
const TAIL_HOLD = 1.6;
/** Seconds the trailing track takes to shrink away. */
const TAIL_FADE = 3.2;

type TrainSpec = {
  radius: number;
  /** Tilt of the orbital plane. */
  tiltX: number;
  tiltZ: number;
  /** Ground speed along the route, in units per second. */
  speed: number;
  carts: number;
  ore: number;
  /** Starting angle along the route. */
  phase: number;
  /** World axis the route plane slowly turns about, and how fast. */
  drift: THREE.Vector3;
  driftSpeed: number;
};

type Train = {
  spec: TrainSpec;
  slots: number;
  geo: THREE.BufferGeometry;
  fade: THREE.InstancedBufferAttribute;
  rails: THREE.InstancedMesh;
  body: THREE.InstancedMesh;
  ore: THREE.InstancedMesh;
  engine: THREE.InstancedMesh;
  lamp: THREE.InstancedMesh;
  beam: THREE.InstancedMesh;
  base: THREE.Quaternion;
};

const TAU = Math.PI * 2;

function wrapPi(a: number): number {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
}

export class Skyline {
  readonly group = new THREE.Group();

  private trains: Train[] = [];
  private _m = new THREE.Matrix4();
  private _p = new THREE.Vector3();
  private _q = new THREE.Quaternion();
  private _s = new THREE.Vector3();
  private _x = new THREE.Vector3();
  private _y = new THREE.Vector3();
  private _z = new THREE.Vector3();
  private _ring = new THREE.Quaternion();
  private _drift = new THREE.Quaternion();

  constructor(seed: number) {
    void seed;
    const specs: TrainSpec[] = [
      { radius: 57, tiltX: 0.3, tiltZ: 0.14, speed: 3.4, carts: 7, ore: 0xffb347, phase: 0.4, drift: new THREE.Vector3(0.15, 1, 0.1).normalize(), driftSpeed: 0.026 },
      { radius: 62, tiltX: -0.24, tiltZ: 0.34, speed: 4.6, carts: 9, ore: 0x63e2ff, phase: 2.3, drift: new THREE.Vector3(1, 0.2, 0.35).normalize(), driftSpeed: 0.019 },
      { radius: 66, tiltX: 0.14, tiltZ: -0.26, speed: 5.5, carts: 8, ore: 0xffc95e, phase: 4.3, drift: new THREE.Vector3(0.4, 0.6, 1).normalize(), driftSpeed: 0.032 }
    ];

    const baseSeg = this.buildSegmentGeometry();
    const bodyGeo = mergeGeometries(
      [
        new THREE.BoxGeometry(1.7, 0.85, 2.5),
        new THREE.BoxGeometry(1.78, 0.12, 2.56).translate(0, 0.4, 0),
        new THREE.BoxGeometry(1.5, 0.5, 0.08).translate(0, 0.62, 1.16),
        new THREE.BoxGeometry(1.5, 0.5, 0.08).translate(0, 0.62, -1.16),
        new THREE.BoxGeometry(0.16, 0.5, 2.2).translate(-0.86, -0.14, 0),
        new THREE.BoxGeometry(0.16, 0.5, 2.2).translate(0.86, -0.14, 0)
      ],
      false
    )!;
    const oreGeo = mergeGeometries(
      [
        new THREE.BoxGeometry(1.24, 0.5, 2.06).translate(0, 0.66, 0),
        new THREE.BoxGeometry(0.9, 0.34, 1.5).translate(0, 0.95, 0),
        new THREE.BoxGeometry(1.5, 0.26, 0.6).translate(0, 0.9, 0.5)
      ],
      false
    )!;
    const engineGeo = mergeGeometries(
      [
        new THREE.BoxGeometry(1.8, 1.0, 3.0),
        new THREE.BoxGeometry(1.4, 0.42, 0.9).translate(0, 0.66, -1.1),
        new THREE.CylinderGeometry(0.22, 0.3, 0.5, 8).rotateX(Math.PI / 2).translate(0, 0.86, -1.5),
        new THREE.BoxGeometry(0.3, 0.3, 2.2).translate(-0.85, -0.2, 0),
        new THREE.BoxGeometry(0.3, 0.3, 2.2).translate(0.85, -0.2, 0)
      ],
      false
    )!;
    const lampGeo = new THREE.SphereGeometry(0.26, 8, 6).translate(0, 0.86, -1.72);
    const beamGeo = new THREE.ConeGeometry(0.75, 5.5, 10, 1, true).rotateX(-Math.PI / 2).translate(0, 0.86, -4.4);

    const gold = new THREE.MeshStandardMaterial({
      color: 0xd9a93c,
      metalness: 0.9,
      roughness: 0.3,
      emissive: 0x8a5f14,
      emissiveIntensity: 0.18
    });
    const goldRail = gold.clone();
    goldRail.emissiveIntensity = 0.16;
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff1c9 });
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffdca0,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const oreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (const spec of specs) {
      const slots = Math.ceil((TAU * spec.radius) / SEG_LEN);
      const geo = baseSeg.clone();
      const fade = new THREE.InstancedBufferAttribute(new Float32Array(slots).fill(0), 1);
      fade.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aFade', fade);

      const rails = new THREE.InstancedMesh(geo, this.fadeMaterial(goldRail), slots);
      rails.frustumCulled = false;
      rails.castShadow = false;

      const body = new THREE.InstancedMesh(bodyGeo, gold, spec.carts);
      body.frustumCulled = false;
      body.castShadow = true;
      const ore = new THREE.InstancedMesh(oreGeo, oreMat, spec.carts);
      ore.frustumCulled = false;
      const engine = new THREE.InstancedMesh(engineGeo, gold, 1);
      engine.frustumCulled = false;
      engine.castShadow = true;
      const lamp = new THREE.InstancedMesh(lampGeo, lampMat, 1);
      lamp.frustumCulled = false;
      const beam = new THREE.InstancedMesh(beamGeo, beamMat, 1);
      beam.frustumCulled = false;

      const c = new THREE.Color(spec.ore);
      for (let i = 0; i < spec.carts; i++) ore.setColorAt(i, c);
      if (ore.instanceColor) ore.instanceColor.needsUpdate = true;

      this.group.add(rails, body, ore, engine, lamp, beam);
      this.trains.push({
        spec,
        slots,
        geo,
        fade,
        rails,
        body,
        ore,
        engine,
        lamp,
        beam,
        base: new THREE.Quaternion().setFromEuler(new THREE.Euler(spec.tiltX, 0, spec.tiltZ))
      });
    }
    baseSeg.dispose();
  }

  /** Two rails and a pair of ties, merged once and instanced per segment. */
  private buildSegmentGeometry(): THREE.BufferGeometry {
    const parts = [
      new THREE.BoxGeometry(0.13, 0.11, SEG_LEN - 0.12).translate(-0.27, 0, 0),
      new THREE.BoxGeometry(0.13, 0.11, SEG_LEN - 0.12).translate(0.27, 0, 0),
      new THREE.BoxGeometry(0.82, 0.07, 0.2).translate(0, -0.06, SEG_LEN * 0.3),
      new THREE.BoxGeometry(0.82, 0.07, 0.2).translate(0, -0.06, -SEG_LEN * 0.3)
    ];
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /** Copy of a material that fades per instance, driven by `aFade`. */
  private fadeMaterial(source: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
    const m = source.clone();
    m.transparent = true;
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aFade;\nvarying float vFade;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFade = aFade;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vFade;')
        .replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.a *= vFade;');
    };
    return m;
  }

  /** Route plane for one train at time `t`: the base tilt, slowly precessing. */
  private planeQuat(train: Train, t: number, out: THREE.Quaternion): THREE.Quaternion {
    this._drift.setFromAxisAngle(train.spec.drift, t * train.spec.driftSpeed);
    return out.copy(this._drift).multiply(train.base);
  }

  /** Quaternion that puts an object at angle `a` on the route, nose along it. */
  private basis(q: THREE.Quaternion, a: number, out: THREE.Quaternion): THREE.Quaternion {
    this._y.set(Math.cos(a), 0, Math.sin(a));
    this._z.set(-Math.sin(a), 0, Math.cos(a));
    this._x.set(0, -1, 0);
    this._m.makeBasis(this._x, this._y, this._z);
    return out.setFromRotationMatrix(this._m).premultiply(q);
  }

  private place(mesh: THREE.InstancedMesh, index: number, q: THREE.Quaternion, radius: number, a: number, scale: number): void {
    this.basis(q, a, this._q);
    this._p.set(Math.cos(a), 0, Math.sin(a)).applyQuaternion(q).multiplyScalar(radius);
    this._s.set(scale, scale, scale);
    this._m.compose(this._p, this._q, this._s);
    mesh.setMatrixAt(index, this._m);
  }

  update(dt: number, t: number): void {
    void dt;
    for (const train of this.trains) {
      const ring = this.planeQuat(train, t, this._ring);
      const speed = train.spec.speed;
      const radius = train.spec.radius;
      const omega = speed / radius;
      const head = train.spec.phase + omega * t;
      const trainLen = (train.spec.carts + 1) * 3.3;
      const ahead = speed * GROW;
      const fadeLen = speed * TAIL_FADE;
      const step = TAU / train.slots;
      const alpha = train.fade.array as Float32Array;

      for (let i = 0; i < train.slots; i++) {
        const angle = i * step;
        const gap = wrapPi(angle - head) * radius;
        let scale = 0;
        let a = 0;
        if (gap > 0) {
          // Ahead of the engine: grows in over GROW seconds as the head nears.
          if (gap < ahead) {
            const u = 1 - gap / ahead;
            scale = Math.max(0.02, u * u * (3 - 2 * u));
            a = 1;
          }
        } else {
          const behind = -gap;
          if (behind <= trainLen + TAIL_HOLD) {
            scale = 1;
            a = 1;
          } else if (behind < trainLen + TAIL_HOLD + fadeLen) {
            const u = (behind - trainLen - TAIL_HOLD) / fadeLen;
            scale = Math.max(0, 1 - u);
            a = 1 - u;
          }
        }
        if (scale > 0.001) {
          this.place(train.rails, i, ring, radius - 0.5, angle, scale);
        } else {
          this._m.makeScale(0, 0, 0);
          train.rails.setMatrixAt(i, this._m);
        }
        alpha[i] = a * a;
      }
      train.fade.needsUpdate = true;
      train.rails.instanceMatrix.needsUpdate = true;

      // Carts trail the engine along the route.
      for (let k = 0; k < train.spec.carts; k++) {
        const ang = head - ((k + 1) * 3.3) / radius;
        this.place(train.body, k, ring, radius, ang, 1);
        this.place(train.ore, k, ring, radius, ang, 1);
      }
      this.place(train.engine, 0, ring, radius, head, 1.05);
      this.place(train.lamp, 0, ring, radius, head, 1);
      this.place(train.beam, 0, ring, radius, head, 1);
      train.body.instanceMatrix.needsUpdate = true;
      train.ore.instanceMatrix.needsUpdate = true;
      train.engine.instanceMatrix.needsUpdate = true;
      train.lamp.instanceMatrix.needsUpdate = true;
      train.beam.instanceMatrix.needsUpdate = true;
    }
  }
}
