// Sky railway: three ore trains on permanent rings high above the planet.
//
// Each ring is a closed circle of sleepers and two rails, merged into one
// static mesh and tilted once in the constructor; a second merged mesh adds the
// glowing edges. Nothing moves with the trains but the carts, so the track
// never grows, shrinks or seams.
//
// The trains, their cargo and three derelict satellites are InstancedMeshes
// built once here. update() only rewrites instance matrices, and reuses the
// same scratch objects every frame.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
/** Cart geometry is built with its wheel bottoms at y = 0; this sits them on the rail top. */
const RAIL_TOP = 0.25;
/** Gap between cart centres along the ring. */
const CART_GAP = 3.4;
/** Arc distance from the head unit to the first cart. */
const HEAD_GAP = 4.6;

type RingSpec = {
  /** Circle radius, measured from the planet centre. Must be >= 72. */
  radius: number;
  tiltX: number;
  tiltZ: number;
  /** Units per second along the ring. */
  speed: number;
  cars: number;
  ore: number;
  /** Starting angle along the ring. */
  phase: number;
};

type Ring = {
  spec: RingSpec;
  quat: THREE.Quaternion;
  /** Index of this ring's first cart in the shared cart instances. */
  cartStart: number;
  headSlot: number;
};

type SatelliteSpec = {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  phase: number;
  tumble: THREE.Vector3;
  scale: number;
};

/** Give a part a flat vertex colour so many parts can share one material. */
function tint(geo: THREE.BufferGeometry, hex: number): THREE.BufferGeometry {
  const c = new THREE.Color(hex);
  const n = geo.getAttribute('position').count;
  const data = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    data[i * 3] = c.r;
    data[i * 3 + 1] = c.g;
    data[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(data, 3));
  return geo;
}

function box(w: number, h: number, d: number, x: number, y: number, z: number, hex: number, ry = 0): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  return tint(g, hex);
}

function tube(rt: number, rb: number, h: number, seg: number, hex: number, x: number, y: number, z: number, rx = 0, rz = 0): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg);
  if (rz) g.rotateZ(rz);
  if (rx) g.rotateX(rx);
  g.translate(x, y, z);
  return tint(g, hex);
}

export class Skyline {
  readonly group = new THREE.Group();

  private rings: Ring[] = [];
  private carts: THREE.InstancedMesh;
  private cargo: THREE.InstancedMesh;
  private heads: THREE.InstancedMesh;
  private lamps: THREE.InstancedMesh;
  private cartLamps: THREE.InstancedMesh;
  private satellites: THREE.InstancedMesh;
  private satSpecs: SatelliteSpec[];

  private _m = new THREE.Matrix4();
  private _p = new THREE.Vector3();
  private _q = new THREE.Quaternion();
  private _b = new THREE.Quaternion();
  private _s = new THREE.Vector3(1, 1, 1);
  private _up = new THREE.Vector3(0, 1, 0);
  private _fwd = new THREE.Vector3();
  private _right = new THREE.Vector3();
  private _basis = new THREE.Matrix4();
  private _euler = new THREE.Euler();

  constructor(seed: number) {
    void seed;

    const specs: RingSpec[] = [
      { radius: 74, tiltX: 0.44, tiltZ: 0.16, speed: 4.4, cars: 7, ore: 0xffa63c, phase: 0.4 },
      { radius: 79, tiltX: -0.3, tiltZ: 0.46, speed: 5.2, cars: 8, ore: 0x5fe0ff, phase: 2.4 },
      { radius: 84, tiltX: 0.2, tiltZ: -0.4, speed: 6, cars: 6, ore: 0xffd66e, phase: 4.4 }
    ];

    const trackMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.45,
      roughness: 0.42,
      emissive: 0x5c4011,
      emissiveIntensity: 1.15
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffc478,
      toneMapped: false,
      transparent: true,
      opacity: 0.62,
      depthWrite: false
    });
    const cartMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.5,
      roughness: 0.38,
      emissive: 0x1c1206,
      emissiveIntensity: 0.8
    });
    const cargoMat = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.42,
      flatShading: true
    });
    const satMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.6,
      roughness: 0.52,
      emissive: 0x0b1018,
      emissiveIntensity: 0.5
    });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff2c2, toneMapped: false });

    let totalCarts = 0;
    for (const spec of specs) {
      const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(spec.tiltX, 0, spec.tiltZ));

      const track = this.buildTrack(spec.radius);
      track.applyQuaternion(quat);
      const trackMesh = new THREE.Mesh(track, trackMat);
      trackMesh.matrixAutoUpdate = false;
      trackMesh.castShadow = false;
      trackMesh.receiveShadow = false;
      this.group.add(trackMesh);

      const glow = this.buildGlow(spec.radius);
      glow.applyQuaternion(quat);
      const glowMesh = new THREE.Mesh(glow, glowMat);
      glowMesh.matrixAutoUpdate = false;
      glowMesh.castShadow = false;
      glowMesh.receiveShadow = false;
      glowMesh.renderOrder = 1;
      this.group.add(glowMesh);

      this.rings.push({ spec, quat, cartStart: totalCarts, headSlot: this.rings.length });
      totalCarts += spec.cars;
    }

    const cartGeo = this.buildCart();
    const cargoGeo = this.buildCargo();
    const headGeo = this.buildHead();
    const lampGeo = this.buildLamps();

    this.carts = new THREE.InstancedMesh(cartGeo, cartMat, totalCarts);
    this.cargo = new THREE.InstancedMesh(cargoGeo, cargoMat, totalCarts);
    this.heads = new THREE.InstancedMesh(headGeo, cartMat, specs.length);
    this.lamps = new THREE.InstancedMesh(lampGeo, lampMat, specs.length);
    this.cartLamps = new THREE.InstancedMesh(this.buildCartLamp(), lampMat, totalCarts);
    for (const mesh of [this.carts, this.cargo, this.heads, this.lamps, this.cartLamps]) {
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      this.group.add(mesh);
    }

    const ore = new THREE.Color();
    for (const ring of this.rings) {
      ore.set(ring.spec.ore);
      for (let k = 0; k < ring.spec.cars; k++) this.cargo.setColorAt(ring.cartStart + k, ore);
    }
    this.carts.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.cargo.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.heads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.lamps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.cartLamps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    if (this.cargo.instanceColor) this.cargo.instanceColor.needsUpdate = true;

    // Derelict satellites on their own shell beyond the rings: they tumble as
    // they orbit, so they read as broken machinery rather than little trains.
    this.satSpecs = [
      { radius: 98, tiltX: 0.55, tiltZ: -0.3, speed: 0.014, phase: 0.3, tumble: new THREE.Vector3(0.11, 0.07, 0.05), scale: 1 },
      { radius: 110, tiltX: -0.75, tiltZ: 0.28, speed: 0.01, phase: 2.5, tumble: new THREE.Vector3(-0.07, 0.09, 0.06), scale: 0.85 },
      { radius: 122, tiltX: 0.95, tiltZ: 0.6, speed: 0.007, phase: 4.2, tumble: new THREE.Vector3(0.05, -0.06, 0.1), scale: 1.15 }
    ];
    const satGeo = this.buildSatellite();
    this.satellites = new THREE.InstancedMesh(satGeo, satMat, this.satSpecs.length);
    this.satellites.frustumCulled = false;
    this.satellites.castShadow = false;
    this.satellites.receiveShadow = false;
    this.satellites.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.group.add(this.satellites);
  }

  /** Closed loop of sleepers and two rails, in the ring plane at y = 0. */
  private buildTrack(radius: number): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [];
    const circ = TAU * radius;
    const ties = Math.max(160, Math.round(circ / 1.35));
    for (let i = 0; i < ties; i++) {
      const a = (i / ties) * TAU;
      parts.push(box(1.55, 0.16, 0.52, Math.cos(a) * radius, 0, Math.sin(a) * radius, 0x59452a, -a));
    }
    const segs = Math.max(96, Math.round(circ / 3.2));
    const len = (circ / segs) * 1.12;
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * TAU;
      for (const side of [-0.42, 0.42]) {
        const r = radius + side;
        parts.push(box(0.15, 0.17, len, Math.cos(a) * r, 0.165, Math.sin(a) * r, 0xc9a03f, -a));
      }
    }
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /**
   * Bright line along each rail, on top and underneath: the top edge makes the
   * rail glow when seen from above, the bottom edge makes the ring read as a
   * thin bright arc when the train passes over a player on the ground.
   */
  private buildGlow(radius: number): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [];
    const circ = TAU * radius;
    const segs = Math.max(96, Math.round(circ / 3.2));
    const len = (circ / segs) * 1.12;
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * TAU;
      parts.push(box(0.34, 0.035, len, Math.cos(a) * radius, -0.105, Math.sin(a) * radius, 0xffffff, -a));
      for (const side of [-0.42, 0.42]) {
        const r = radius + side;
        parts.push(box(0.05, 0.03, len, Math.cos(a) * r, 0.258, Math.sin(a) * r, 0xffffff, -a));
        parts.push(box(0.13, 0.045, len, Math.cos(a) * r, 0.06, Math.sin(a) * r, 0xffffff, -a));
      }
    }
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /** Ore hopper: wheels, dark underframe, gold hopper and rim. */
  private buildCart(): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [
      box(1.55, 0.28, 3, 0, 0.64, 0, 0x8a6f30),
      box(1.2, 0.26, 2.7, 0, 0.44, 0, 0x2f281c),
      box(0.16, 0.62, 2.92, -0.74, 1.06, 0, 0x6d5423),
      box(0.16, 0.62, 2.92, 0.74, 1.06, 0, 0x6d5423),
      box(1.64, 0.62, 0.16, 0, 1.06, 1.42, 0x6d5423),
      box(1.64, 0.62, 0.16, 0, 1.06, -1.42, 0x6d5423),
      box(1.7, 0.1, 0.14, 0, 1.4, 1.42, 0xf2c464),
      box(1.7, 0.1, 0.14, 0, 1.4, -1.42, 0xf2c464),
      box(0.1, 0.1, 2.92, -0.74, 1.4, 0, 0xf2c464),
      box(0.1, 0.1, 2.92, 0.74, 1.4, 0, 0xf2c464),
      box(1.5, 0.1, 0.12, 0, 0.88, 0.72, 0x4c3a19),
      box(1.5, 0.1, 0.12, 0, 0.88, -0.24, 0x4c3a19),
      box(0.2, 0.2, 0.24, -0.5, 0.62, 1.62, 0x32291a),
      box(0.2, 0.2, 0.24, 0.5, 0.62, 1.62, 0x32291a)
    ];
    for (const z of [-0.98, 0.98]) {
      for (const x of [-0.42, 0.42]) {
        parts.push(tube(0.32, 0.32, 0.16, 12, 0x1b1712, x, 0.32, z, 0, Math.PI / 2));
      }
    }
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /** Faceted ore load, tinted per instance. */
  private buildCargo(): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [];
    const lump = (r: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, ry: number) => {
      const g = new THREE.IcosahedronGeometry(r, 0);
      g.scale(sx, sy, sz);
      g.rotateY(ry);
      g.translate(x, y, z);
      parts.push(g);
    };
    lump(0.62, -0.24, 1.3, 0.68, 1, 0.72, 1.05, 0.3);
    lump(0.7, 0.26, 1.36, 0.02, 1.05, 0.8, 1, 1.2);
    lump(0.6, -0.22, 1.3, -0.66, 1, 0.75, 1.1, 2.1);
    lump(0.5, 0.3, 1.52, -0.6, 0.9, 0.85, 0.9, 0.8);
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /** Engine unit: long chassis, boiler, funnel, cab and six wheels. */
  private buildHead(): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [
      box(1.62, 0.34, 4.3, 0, 0.62, 0.1, 0x8a6f30),
      box(1.2, 0.26, 3.7, 0, 0.42, 0, 0x2f281c),
      box(1.12, 0.1, 3.5, 0, 0.82, 0.2, 0x6d5423),
      box(1.3, 0.74, 1.05, 0, 1.32, -1.5, 0xb08a3e),
      box(1.44, 0.1, 1.16, 0, 1.74, -1.5, 0x6d5423),
      box(1.05, 0.56, 0.2, 0, 1.02, 2.18, 0x3a3122),
      box(0.18, 0.18, 0.26, -0.5, 0.62, 2.24, 0x32291a),
      box(0.18, 0.18, 0.26, 0.5, 0.62, 2.24, 0x32291a),
      box(0.08, 0.12, 2.8, -0.52, 0.5, 0.1, 0xb08a3e),
      box(0.08, 0.12, 2.8, 0.52, 0.5, 0.1, 0xb08a3e)
    ];
    parts.push(tube(0.62, 0.62, 2.05, 14, 0xc09a48, 0, 1.14, 0.55, Math.PI / 2));
    parts.push(tube(0.24, 0.32, 0.58, 10, 0x6d5423, 0, 1.76, 1.22));
    parts.push(tube(0.2, 0.45, 0.55, 12, 0x3a3122, 0, 1.08, 2.0, Math.PI / 2));
    parts.push(tube(0.13, 0.13, 0.14, 8, 0x2a2118, 0, 2.05, 1.22));
    for (const z of [-1.25, 0, 1.25]) {
      for (const x of [-0.42, 0.42]) {
        parts.push(tube(0.34, 0.34, 0.16, 12, 0x1b1712, x, 0.34, z, 0, Math.PI / 2));
      }
    }
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /** Warm strips down both flanks: the train reads as a lit shape from the ground. */
  private buildCartLamp(): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [];
    for (const x of [-0.83, 0.83]) {
      const g = new THREE.BoxGeometry(0.04, 0.09, 2.2);
      g.translate(x, 0.62, 0);
      parts.push(g);
    }
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  private buildLamps(): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [];
    for (const x of [-0.4, 0.4]) {
      const g = new THREE.SphereGeometry(0.13, 10, 7);
      g.translate(x, 1.14, 2.28);
      parts.push(g);
    }
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /** Wrecked satellite: body, dish, mast and two solar wings. */
  private buildSatellite(): THREE.BufferGeometry {
    const parts: THREE.BufferGeometry[] = [
      tube(0.55, 0.62, 1.5, 10, 0x8b8f98, 0, 0, 0),
      tube(0.06, 0.5, 0.55, 10, 0x9aa0a8, 0.55, 0.75, 0.2, 0.4),
      box(0.05, 1.1, 0.05, -0.2, 1.05, -0.2, 0x6f747c),
      box(0.9, 0.06, 0.06, -0.9, 0.35, 0, 0x6f747c),
      box(0.9, 0.06, 0.06, 0.9, 0.35, 0, 0x6f747c),
      box(1.7, 0.05, 0.85, -1.95, 0.35, 0, 0x24466f),
      box(1.7, 0.05, 0.85, 1.95, 0.35, 0, 0x24466f),
      box(1.72, 0.02, 0.09, -1.95, 0.38, 0.36, 0x9aa0a8),
      box(1.72, 0.02, 0.09, 1.95, 0.38, 0.36, 0x9aa0a8),
      box(0.5, 0.4, 0.4, 0, -0.95, 0, 0x5c6068)
    ];
    const geo = mergeGeometries(parts, false)!;
    for (const p of parts) p.dispose();
    return geo;
  }

  /** Put `mesh` instance at angle `a` on a ring, tangent-forward and ring-normal up. */
  private place(mesh: THREE.InstancedMesh, index: number, ring: Ring, a: number, lift: number): void {
    const radius = ring.spec.radius;
    this._fwd.set(-Math.sin(a), 0, Math.cos(a));
    this._right.copy(this._up).cross(this._fwd).normalize();
    this._basis.makeBasis(this._right, this._up, this._fwd);
    this._b.setFromRotationMatrix(this._basis);
    this._q.copy(ring.quat).multiply(this._b);
    this._p.set(Math.cos(a) * radius, lift, Math.sin(a) * radius).applyQuaternion(ring.quat);
    this._m.compose(this._p, this._q, this._s);
    mesh.setMatrixAt(index, this._m);
  }

  update(dt: number, t: number): void {
    void dt;
    for (const ring of this.rings) {
      const spec = ring.spec;
      const omega = spec.speed / spec.radius;
      const head = spec.phase + omega * t;
      const tail = HEAD_GAP;
      this.place(this.heads, ring.headSlot, ring, head, RAIL_TOP);
      this.place(this.lamps, ring.headSlot, ring, head, RAIL_TOP);
      for (let k = 0; k < spec.cars; k++) {
        const a = head - (tail + k * CART_GAP) / spec.radius;
        this.place(this.carts, ring.cartStart + k, ring, a, RAIL_TOP);
        this.place(this.cargo, ring.cartStart + k, ring, a, RAIL_TOP);
        this.place(this.cartLamps, ring.cartStart + k, ring, a, RAIL_TOP);
      }
    }
    this.carts.instanceMatrix.needsUpdate = true;
    this.cargo.instanceMatrix.needsUpdate = true;
    this.heads.instanceMatrix.needsUpdate = true;
    this.lamps.instanceMatrix.needsUpdate = true;
    this.cartLamps.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < this.satSpecs.length; i++) {
      const s = this.satSpecs[i];
      const a = s.phase + s.speed * t;
      this._b.setFromEuler(this._euler.set(s.tiltX, 0, s.tiltZ));
      this._q.setFromEuler(this._euler.set(t * s.tumble.x, t * s.tumble.y, t * s.tumble.z));
      this._p.set(Math.cos(a) * s.radius, 0, Math.sin(a) * s.radius).applyQuaternion(this._b);
      this._s.setScalar(s.scale);
      this._m.compose(this._p, this._q, this._s);
      this.satellites.setMatrixAt(i, this._m);
      this._s.set(1, 1, 1);
    }
    this.satellites.instanceMatrix.needsUpdate = true;
  }
}
