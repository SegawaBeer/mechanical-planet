// The energy burst that covers a transformation: an expanding cyan ring, a
// swelling glow, and a spray of sparks. One instance is reused for every
// transform, and sits at the machine's feet in its own frame.

import * as THREE from 'three';

const LIFE = 1.0;
const SPARKS = 44;

export class TransformBurst {
  readonly group = new THREE.Group();
  private ringMain: THREE.Mesh;
  private ringLow: THREE.Mesh;
  private glow: THREE.Mesh;
  private sparks: THREE.Points;
  private dirs: THREE.Vector3[] = [];
  private t = LIFE;
  private owned: THREE.BufferGeometry[] = [];
  private ownedMaterials: THREE.Material[] = [];

  constructor() {
    this.group.visible = false;

    const ringGeo = new THREE.RingGeometry(0.82, 1.06, 40);
    this.owned.push(ringGeo);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x18c8ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.ownedMaterials.push(ringMat);
    this.ringMain = new THREE.Mesh(ringGeo, ringMat);
    this.ringMain.rotation.x = -Math.PI / 2;
    this.ringMain.position.y = 0.05;
    this.ringLow = new THREE.Mesh(ringGeo, ringMat.clone());
    this.ownedMaterials.push(this.ringLow.material as THREE.Material);
    this.ringLow.rotation.x = -Math.PI / 2;
    this.ringLow.position.y = 0.02;

    const glowGeo = new THREE.SphereGeometry(0.62, 16, 12);
    this.owned.push(glowGeo);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x2fd8ee,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.ownedMaterials.push(glowMat);
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.glow.position.y = 0.9;

    const positions = new Float32Array(SPARKS * 3);
    for (let i = 0; i < SPARKS; i++) {
      const a = (i / SPARKS) * Math.PI * 2 + Math.random() * 0.4;
      const up = Math.random() * 0.9;
      const v = new THREE.Vector3(Math.cos(a) * (1 - up * 0.4), 0.25 + up, Math.sin(a) * (1 - up * 0.4)).normalize();
      this.dirs.push(v);
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.owned.push(sparkGeo);
    const sparkMat = new THREE.PointsMaterial({
      color: 0x7df0ff,
      size: 0.1,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    this.ownedMaterials.push(sparkMat);
    this.sparks = new THREE.Points(sparkGeo, sparkMat);

    this.group.add(this.ringMain, this.ringLow, this.glow, this.sparks);
  }

  /** Fire the burst at a world position and orientation. */
  play(position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    this.group.position.copy(position);
    this.group.quaternion.copy(quaternion);
    this.group.visible = true;
    this.t = 0;
  }

  /** True while the burst is showing; the Game swaps forms halfway through. */
  get running(): boolean {
    return this.t < LIFE;
  }

  update(dt: number): void {
    if (this.t >= LIFE) {
      this.group.visible = false;
      return;
    }
    this.t = Math.min(LIFE, this.t + dt);
    const t = this.t / LIFE;

    const ringT = Math.min(1, t / 0.75);
    const ringScale = 0.45 + ringT * 2.7;
    this.ringMain.scale.setScalar(ringScale);
    this.ringMain.position.y = 0.05 + t * 0.6;
    (this.ringMain.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - ringT) * 0.7);
    const lowT = Math.min(1, t / 0.9);
    this.ringLow.scale.setScalar(0.4 + lowT * 3.3);
    (this.ringLow.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - lowT) * 0.7);

    const grow = Math.sin(Math.min(1, t * 1.35) * Math.PI * 0.62);
    this.glow.scale.setScalar(0.6 + grow * 0.9);
    (this.glow.material as THREE.MeshBasicMaterial).opacity = Math.max(0, Math.sin(t * Math.PI) * 0.26);

    const pos = this.sparks.geometry.getAttribute('position') as THREE.BufferAttribute;
    const reach = 0.5 + t * 4.2;
    for (let i = 0; i < SPARKS; i++) {
      const d = this.dirs[i];
      pos.setXYZ(i, d.x * reach, 0.35 + d.y * reach * 0.9 + Math.sin(t * Math.PI) * 0.5, d.z * reach);
    }
    pos.needsUpdate = true;
    (this.sparks.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - t * 1.15);
  }

  dispose(): void {
    for (const g of this.owned) g.dispose();
    for (const m of this.ownedMaterials) m.dispose();
  }
}
