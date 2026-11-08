// Sky scenery: ore trains running on rails in the sky around the planet.
// Owned by the "sky and cleanup" session.
//
// Three tilted rail rings circle the planet well above the ground. Each ring
// carries one long train of ore carts, all of it drawn from a handful of
// InstancedMeshes, so the whole skyline costs about seven draw calls.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

type RingSpec = {
  radius: number;
  /** Tilt of the ring's orbital plane, in radians. */
  tiltX: number;
  tiltZ: number;
  speed: number;
  carts: number;
  ore: number;
  phase: number;
};

export class Skyline {
  readonly group = new THREE.Group();

  private rings: RingSpec[] = [];
  private quats: THREE.Quaternion[] = [];
  private cartBody!: THREE.InstancedMesh;
  private cartOre!: THREE.InstancedMesh;
  private engine!: THREE.InstancedMesh;
  private lamp!: THREE.InstancedMesh;
  private beam!: THREE.InstancedMesh;
  private total = 0;

  private _m = new THREE.Matrix4();
  private _q = new THREE.Quaternion();
  private _p = new THREE.Vector3();
  private _x = new THREE.Vector3();
  private _y = new THREE.Vector3();
  private _z = new THREE.Vector3();

  constructor(seed: number) {
    void seed;
    this.rings = [
      { radius: 56, tiltX: 0.34, tiltZ: 0.12, speed: 0.052, carts: 7, ore: 0xffa63c, phase: 0.4 },
      { radius: 61, tiltX: -0.26, tiltZ: 0.3, speed: -0.041, carts: 9, ore: 0x63e2ff, phase: 2.1 },
      { radius: 65, tiltX: 0.16, tiltZ: -0.22, speed: 0.033, carts: 8, ore: 0xffb84d, phase: 4.2 }
    ];
    this.quats = this.rings.map((r) => new THREE.Quaternion().setFromEuler(new THREE.Euler(r.tiltX, 0, r.tiltZ)));

    this.buildTracks();
    this.buildTrains();
  }

  // ---------------------------------------------------------------- statics

  /** One merged mesh for all three rails, and one for the support struts. */
  private buildTracks(): void {
    const railParts: THREE.BufferGeometry[] = [];
    const strutMatrices: THREE.Matrix4[] = [];

    this.rings.forEach((ring, i) => {
      const q = this.quats[i];
      const m = new THREE.Matrix4().makeRotationFromQuaternion(q);
      // Torus lies in its own XY plane; stand it up so the ring runs in XZ.
      const rail = new THREE.TorusGeometry(ring.radius, 0.16, 4, 180);
      rail.rotateX(Math.PI / 2);
      rail.applyMatrix4(m);
      railParts.push(rail);

      // A second, thinner rail below the first reads as a twin beam track.
      const lower = new THREE.TorusGeometry(ring.radius, 0.07, 3, 180);
      lower.rotateX(Math.PI / 2);
      lower.translate(0, -0.42, 0);
      lower.applyMatrix4(m);
      railParts.push(lower);

      const n = 18;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + i * 0.11;
        const basis = this.ringBasis(q, a);
        // The strut hangs off the track's underside, leaning back along the rail.
        const radial = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)).applyQuaternion(q);
        const point = radial.clone().multiplyScalar(ring.radius);
        const lean = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.34));
        basis.multiply(lean);
        this._p.copy(point).addScaledVector(radial, -2.6);
        strutMatrices.push(
          new THREE.Matrix4().compose(this._p, basis, new THREE.Vector3(0.2, 5.2, 0.2))
        );
      }
    });

    const railGeo = mergeGeometries(railParts, false)!;
    for (const g of railParts) g.dispose();
    const rail = new THREE.Mesh(
      railGeo,
      new THREE.MeshStandardMaterial({ color: 0x3c4753, metalness: 0.75, roughness: 0.45, emissive: 0x101c22, emissiveIntensity: 1 })
    );
    rail.frustumCulled = false;
    rail.name = 'ore-rails';
    this.group.add(rail);

    // Struts: one instanced mesh for the whole planet.
    const struts = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x2f3944, metalness: 0.7, roughness: 0.55, emissive: 0x0d171d, emissiveIntensity: 1 }),
      strutMatrices.length
    );
    strutMatrices.forEach((m, i) => struts.setMatrixAt(i, m));
    struts.instanceMatrix.needsUpdate = true;
    struts.frustumCulled = false;
    struts.name = 'ore-struts';
    this.group.add(struts);
  }

  /** Quaternion that puts a cart at `a` on the ring, long axis along the rail. */
  private ringBasis(q: THREE.Quaternion, a: number): THREE.Quaternion {
    this._y.set(Math.cos(a), 0, Math.sin(a)); // outward, away from the planet
    this._z.set(-Math.sin(a), 0, Math.cos(a)); // forward along the rail
    this._x.set(0, -1, 0);
    const m = new THREE.Matrix4().makeBasis(this._x, this._y, this._z);
    return new THREE.Quaternion().setFromRotationMatrix(m).premultiply(q);
  }

  // ---------------------------------------------------------------- trains

  private buildTrains(): void {
    this.total = this.rings.reduce((n, r) => n + r.carts, 0);

    const bodyGeo = mergeGeometries(
      [
        new THREE.BoxGeometry(1.7, 0.85, 2.5),
        new THREE.BoxGeometry(1.78, 0.12, 2.56).translate(0, 0.4, 0),
        new THREE.BoxGeometry(1.5, 0.5, 0.08).translate(0, 0.62, 1.16),
        new THREE.BoxGeometry(1.5, 0.5, 0.08).translate(0, 0.62, -1.16)
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

    const metal = new THREE.MeshStandardMaterial({ color: 0x6b4a32, metalness: 0.65, roughness: 0.5, emissive: 0x120a06, emissiveIntensity: 1 });
    const metalDark = new THREE.MeshStandardMaterial({ color: 0x3a4250, metalness: 0.7, roughness: 0.5 });

    this.cartBody = new THREE.InstancedMesh(bodyGeo, metal, this.total);
    this.cartBody.castShadow = true;
    this.cartBody.frustumCulled = false;
    this.group.add(this.cartBody);

    // Ore glows in its own colour per ring: a basic material keeps the
    // per-instance colour bright instead of washing out under a white emissive.
    this.cartOre = new THREE.InstancedMesh(oreGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), this.total);
    this.cartOre.frustumCulled = false;
    this.group.add(this.cartOre);

    this.engine = new THREE.InstancedMesh(engineGeo, metalDark, this.rings.length);
    this.engine.castShadow = true;
    this.engine.frustumCulled = false;
    this.group.add(this.engine);

    this.lamp = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.26, 8, 6).translate(0, 0.86, -1.72),
      new THREE.MeshBasicMaterial({ color: 0xfff0c8 }),
      this.rings.length
    );
    this.lamp.frustumCulled = false;
    this.group.add(this.lamp);

    // Headlight beam: a narrow additive cone from the engine nose.
    const beamGeo = new THREE.ConeGeometry(0.75, 5.5, 10, 1, true).rotateX(-Math.PI / 2).translate(0, 0.86, -4.4);
    this.beam = new THREE.InstancedMesh(
      beamGeo,
      new THREE.MeshBasicMaterial({ color: 0xffe2a8, transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
      this.rings.length
    );
    this.beam.frustumCulled = false;
    this.group.add(this.beam);

    // Per-instance ore colours.
    const c = new THREE.Color();
    let i = 0;
    for (const ring of this.rings) {
      c.setHex(ring.ore);
      for (let k = 0; k < ring.carts; k++) this.cartOre.setColorAt(i++, c);
    }
    if (this.cartOre.instanceColor) this.cartOre.instanceColor.needsUpdate = true;
  }

  update(dt: number, t: number): void {
    void dt;
    const spacing = 3.3;
    let cartIndex = 0;
    this.rings.forEach((ring, ri) => {
      const q = this.quats[ri];
      const head = ring.phase + t * ring.speed;
      this.place(this.engine, ri, q, ring.radius, head, 1.05);

      for (let k = 0; k < ring.carts; k++) {
        const a = head - ((k + 1) * spacing) / ring.radius;
        this.place(this.cartBody, cartIndex, q, ring.radius, a, 1);
        this.place(this.cartOre, cartIndex, q, ring.radius, a, 1);
        cartIndex++;
      }
      this.place(this.lamp, ri, q, ring.radius, head, 1);
      this.place(this.beam, ri, q, ring.radius, head, 1);
    });
    this.cartBody.instanceMatrix.needsUpdate = true;
    this.cartOre.instanceMatrix.needsUpdate = true;
    this.engine.instanceMatrix.needsUpdate = true;
    this.lamp.instanceMatrix.needsUpdate = true;
    this.beam.instanceMatrix.needsUpdate = true;
  }

  private place(mesh: THREE.InstancedMesh, index: number, q: THREE.Quaternion, radius: number, a: number, scale: number): void {
    const basis = this.ringBasis(q, a);
    this._p.set(Math.cos(a), 0, Math.sin(a)).applyQuaternion(q).multiplyScalar(radius);
    this._q.copy(basis);
    this._m.compose(this._p, this._q, new THREE.Vector3(scale, scale, scale));
    mesh.setMatrixAt(index, this._m);
  }
}
