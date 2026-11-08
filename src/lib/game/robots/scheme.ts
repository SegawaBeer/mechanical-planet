// Colour schemes shared by every robot form. One scheme drives both the robot
// and the vehicle it turns into, so the two always read as the same machine.

import * as THREE from 'three';

export type Scheme = {
  /** Main armour panels. */
  primary: number;
  /** Secondary shells: limbs, underbody, cabin. */
  secondary: number;
  /** Bare metal: joints, trim, bumpers. */
  trim: number;
  /** A small bright stripe or fin. */
  accent: number;
  /** Glowing eyes and form lights. */
  eye: number;
};

export const SCHEMES = {
  hero: { primary: 0xd8442f, secondary: 0x3a72d4, trim: 0xd4dde4, accent: 0xffc93c, eye: 0x5ff2ff },
  river: { primary: 0x2f7fd0, secondary: 0x9ad8ee, trim: 0xb9c4cc, accent: 0x7cf3c8, eye: 0x64f0ff },
  citadel: { primary: 0xb8352a, secondary: 0x5d4a2a, trim: 0xd9c27a, accent: 0xffb703, eye: 0xffd166 },
  ark: { primary: 0xe6edf2, secondary: 0x2fa89a, trim: 0xa8b4bd, accent: 0x7cf3c8, eye: 0x9ffcff },
  fortress: { primary: 0x5b2d8e, secondary: 0x161320, trim: 0x3d3752, accent: 0xc04bff, eye: 0xb46bff }
} satisfies Record<string, Scheme>;

export type SchemeId = keyof typeof SCHEMES;

const cache = new Map<string, THREE.MeshStandardMaterial>();

/**
 * Painted metal, one instance per colour so both forms share their shells.
 * Metalness stays low: there is no environment map on this planet, and a
 * metallic surface with nothing to reflect renders near-black.
 */
export function metal(color: number, roughness = 0.5, metalness = 0.18): THREE.MeshStandardMaterial {
  const key = `${color}-${roughness}-${metalness}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const m = new THREE.MeshStandardMaterial({ color, roughness, metalness, flatShading: true });
  cache.set(key, m);
  return m;
}

/** Self-lit part that never takes shadow: eyes, running lights, form seams. */
export function glowing(color: number, intensity = 2.2): THREE.MeshStandardMaterial {
  const key = `glow-${color}-${intensity}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const m = new THREE.MeshStandardMaterial({
    color: 0x0b1418,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.3,
    metalness: 0.2
  });
  cache.set(key, m);
  return m;
}
