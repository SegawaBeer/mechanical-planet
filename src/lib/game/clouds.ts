import * as THREE from 'three';
import { deriveSeed, seededRng } from './noise';
import { PLANET_RADIUS } from './planet';
import type { PlanetProfile } from './space';

type Cloud = { mesh: THREE.Mesh; axis: THREE.Vector3; base: THREE.Vector3; speed: number; angle: number; altitude: number };

/**
 * Thin metallic haze bands drifting around the planet, plus one huge ringed
 * planet hanging far out in the dusk sky. The bands are wide, flat and dark,
 * so they read as industrial smog rather than cotton-wool clouds, and they
 * never block the ground for long.
 */
export class Clouds {
  group = new THREE.Group();
  private clouds: Cloud[] = [];

  constructor(seed: number, profile: PlanetProfile) {
    const rng = seededRng(deriveSeed(seed, 5));
    const isEarth = profile.archetype === 'earth';
    const mat = new THREE.MeshStandardMaterial({
      color: isEarth ? 0x9aa6ad : profile.cloud,
      roughness: 0.62,
      metalness: 0.35,
      transparent: true,
      opacity: isEarth ? 0.5 : profile.archetype === 'ember' ? 0.42 : 0.38,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const puff = new THREE.SphereGeometry(1, 7, 5);
    const count = Math.max(6, Math.round(profile.cloudCount * 0.6));
    for (let i = 0; i < count; i++) {
      const parts: THREE.BufferGeometry[] = [];
      // A band is two or three long, very flat slabs laid end to end.
      const n = 2 + Math.floor(rng() * 2);
      for (let k = 0; k < n; k++) {
        const g = puff.clone();
        const s = 1.1 + rng() * 0.9;
        g.scale(s * 4.6, s * 0.09, s * 1.1);
        g.rotateY(rng() * Math.PI);
        g.translate((k - n / 2) * 5.2 + rng() * 1.6, rng() * 0.5, (rng() - 0.5) * 3.2);
        parts.push(g);
      }
      const merged = mergeSimple(parts);
      const mesh = new THREE.Mesh(merged, mat);
      const base = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize();
      const axis = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize();
      this.clouds.push({ mesh, axis, base, speed: 0.006 + rng() * 0.012, angle: rng() * 6, altitude: 17 + rng() * 9 });
      this.group.add(mesh);
    }

    this.buildRingedPlanet();

    if (profile.archetype === 'fracture' || profile.archetype === 'rime') {
      const debrisCount = profile.archetype === 'fracture' ? 30 : 18;
      const debris = new THREE.InstancedMesh(
        new THREE.DodecahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({ color: profile.terrain[1], roughness: 0.92, flatShading: true }),
        debrisCount
      );
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      for (let i = 0; i < debrisCount; i++) {
        const a = (i / debrisCount) * Math.PI * 2 + rng() * 0.12;
        const radius = 53 + rng() * 7;
        position.set(Math.cos(a) * radius, (rng() - 0.5) * 2.2, Math.sin(a) * radius);
        rotation.setFromEuler(new THREE.Euler(rng() * 3, rng() * 3, rng() * 3));
        const s = 0.45 + rng() * (profile.archetype === 'fracture' ? 1.6 : 0.8);
        scale.set(s, s * (0.55 + rng()), s);
        debris.setMatrixAt(i, matrix.compose(position, rotation, scale));
      }
      debris.rotation.set(0.38, 0.16, -0.24);
      debris.name = 'orbital-debris';
      this.group.add(debris);
    }

    if (profile.archetype === 'crystal') {
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: profile.accent,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(55 + i * 2.4, 0.11 + i * 0.05, 5, 160), ringMaterial);
        ring.rotation.set(Math.PI / 2 + i * 0.08, 0.25, 0.38 + i * 0.12);
        ring.name = 'crystal-ring';
        this.group.add(ring);
      }
    }

    if (profile.archetype === 'bloom' || profile.archetype === 'spore') {
      const positions = new Float32Array(180 * 3);
      const point = new THREE.Vector3();
      for (let i = 0; i < 180; i++) {
        point.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize().multiplyScalar(47 + rng() * 7);
        positions.set([point.x, point.y, point.z], i * 3);
      }
      const spores = new THREE.BufferGeometry();
      spores.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const motes = new THREE.Points(
        spores,
        new THREE.PointsMaterial({ color: profile.accent, size: 0.16, transparent: true, opacity: 0.72, sizeAttenuation: true })
      );
      motes.name = 'atmospheric-spores';
      this.group.add(motes);
    }
  }

  /**
   * A ringed gas giant hanging low and far out, big enough to fill a corner of
   * the sky when the player looks up. Basic materials: it is scenery and should
   * not pick up the planet's own key light.
   */
  private buildRingedPlanet(): void {
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(42, 36, 24),
      new THREE.MeshBasicMaterial({ color: 0x5d4f8c })
    );
    const band = new THREE.Mesh(
      new THREE.SphereGeometry(42.4, 36, 12, 0, Math.PI * 2, 1.1, 0.22),
      new THREE.MeshBasicMaterial({ color: 0x7b6aa8, transparent: true, opacity: 0.75 })
    );
    const band2 = new THREE.Mesh(
      new THREE.SphereGeometry(42.4, 36, 12, 0, Math.PI * 2, 1.75, 0.12),
      new THREE.MeshBasicMaterial({ color: 0x483f75, transparent: true, opacity: 0.6 })
    );
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc9a882, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(56, 78, 96), ringMat);
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(82, 88, 96), ringMat);
    const rings = new THREE.Group();
    rings.add(ring, ring2);
    rings.rotation.set(-1.16, 0.22, 0.1);

    const giant = new THREE.Group();
    giant.add(body, band, band2, rings);
    giant.position.set(40, 200, 240);
    giant.lookAt(0, 0, 0);
    giant.name = 'ringed-planet';
    this.group.add(giant);
  }

  update(dt: number): void {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3();
    const m = new THREE.Matrix4();
    const right = new THREE.Vector3();
    const fwd = new THREE.Vector3();
    for (const c of this.clouds) {
      c.angle += c.speed * dt;
      q.setFromAxisAngle(c.axis, c.angle);
      up.copy(c.base).applyQuaternion(q);
      c.mesh.position.copy(up).multiplyScalar(PLANET_RADIUS + c.altitude);
      c.mesh.up.copy(up);
      upwardBasis(c.axis, up, right, fwd);
      m.makeBasis(right, up, fwd);
      c.mesh.quaternion.setFromRotationMatrix(m);
    }
  }
}

/** Orthonormal (right, up, fwd) with `fwd` along the drift direction. */
function upwardBasis(axis: THREE.Vector3, up: THREE.Vector3, right: THREE.Vector3, fwd: THREE.Vector3): void {
  right.crossVectors(axis, up).normalize();
  fwd.crossVectors(right, up);
}

function mergeSimple(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let count = 0;
  for (const p of parts) count += (p.index ? p.toNonIndexed() : p).attributes.position.count;
  const pos = new Float32Array(count * 3);
  let off = 0;
  for (const p of parts) {
    const g = p.index ? p.toNonIndexed() : p;
    pos.set(g.attributes.position.array as Float32Array, off);
    off += g.attributes.position.count * 3;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}
