import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { deriveSeed, seededRng } from './noise';
import { PLANET_RADIUS, tangentBasis } from './planet';
import type { PlanetProfile } from './space';
import { landBiomeBlend } from './biomes';
import { GLOBE_ATMOSPHERE, SKY_GRADIENT, type SkyGradient } from './night';

type Satellite = {
  mesh: THREE.Mesh;
  lamp: THREE.Mesh;
  /** Orbit radius from the planet centre. */
  radius: number;
  /** Fixed tilt of the orbit plane. */
  orbit: THREE.Quaternion;
  speed: number;
  phase: number;
  tumbleAxis: THREE.Vector3;
  tumbleSpeed: number;
  blinkPhase: number;
  blinkSpeed: number;
};

const OLDSILVER = 0x8b9099;
const DARKMETAL = 0x5a6068;
const RUST = 0x8a5a3c;
const VERDIGRIS = 0x6b8372;
const PANEL = 0x1d3560;
const PANEL_LINE = 0x3a5b8c;
const DARK = 0x33383f;

const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _e = new THREE.Euler();
const _m = new THREE.Matrix4();
const _c = new THREE.Color();

type P = {
  geo: THREE.BufferGeometry;
  color: number;
  p?: [number, number, number];
  s?: number | [number, number, number];
  r?: [number, number, number];
};

/** Bake pieces into one vertex-coloured geometry. */
function mergeTinted(pieces: P[]): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const piece of pieces) {
    const g = piece.geo.index ? piece.geo.toNonIndexed() : piece.geo.clone();
    const p = piece.p ?? [0, 0, 0];
    const r = piece.r ?? [0, 0, 0];
    const s = piece.s ?? 1;
    _p.set(p[0], p[1], p[2]);
    _e.set(r[0], r[1], r[2]);
    _q.setFromEuler(_e);
    if (typeof s === 'number') _s.set(s, s, s);
    else _s.set(s[0], s[1], s[2]);
    g.applyMatrix4(_m.compose(_p, _q, _s));
    for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal') g.deleteAttribute(name);
    const n = g.attributes.position.count;
    const arr = new Float32Array(n * 3);
    _c.setHex(piece.color);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = _c.r;
      arr[i * 3 + 1] = _c.g;
      arr[i * 3 + 2] = _c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    parts.push(g);
  }
  const merged = mergeGeometries(parts, false)!;
  merged.computeVertexNormals();
  for (const p of parts) p.dispose();
  return merged;
}

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
const UNIT_CONE = new THREE.ConeGeometry(0.5, 1, 8);
const UNIT_DISC = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);

/** A solar panel with raised cell lines, optionally cropped or cocked askew. */
function panel(x: number, y: number, z: number, w: number, h: number, tilt: number, broken = false): P[] {
  const out: P[] = [
    { geo: UNIT_BOX, color: PANEL, p: [x, y, z], s: [w, 0.06, h], r: [0, 0, tilt] },
    // Mast back to the body.
    { geo: UNIT_BOX, color: DARKMETAL, p: [x * 0.55, y, z], s: [Math.abs(x) * 0.9, 0.06, 0.08] }
  ];
  const lines = broken ? 2 : 3;
  for (let i = 0; i < lines; i++) {
    const t = (i + 1) / (lines + 1) - 0.5;
    out.push({
      geo: UNIT_BOX,
      color: PANEL_LINE,
      p: [x, y + 0.04, z + t * h],
      s: [w * (broken ? 0.5 : 0.96), 0.03, 0.035],
      r: [0, 0, tilt]
    });
  }
  for (let i = 0; i < 2; i++) {
    const t = (i + 1) / 3 - 0.5;
    out.push({
      geo: UNIT_BOX,
      color: PANEL_LINE,
      p: [x + t * w * 0.9, y + 0.04, z],
      s: [0.035, 0.03, h * 0.9],
      r: [0, 0, tilt]
    });
  }
  return out;
}

/** Low-poly derelict satellite. Three variants, all from boxes and cylinders. */
function buildSatellite(variant: number): THREE.BufferGeometry {
  const pieces: P[] = [];
  const hull = variant === 1 ? RUST : OLDSILVER;

  if (variant === 0) {
    pieces.push(
      { geo: UNIT_BOX, color: hull, p: [0, 0, 0], s: [1.1, 1.0, 2.2] },
      { geo: UNIT_BOX, color: DARKMETAL, p: [0, 0, 1.16], s: [1.2, 0.7, 0.24] },
      { geo: UNIT_CYL, color: DARK, p: [0, 0, -1.28], s: [0.5, 0.5, 0.5], r: [Math.PI / 2, 0, 0] },
      { geo: UNIT_BOX, color: VERDIGRIS, p: [0.34, 0.42, -0.4], s: [0.5, 0.16, 0.8] },
      // Dish on a short mast.
      { geo: UNIT_BOX, color: DARKMETAL, p: [0, 0.72, 0.5], s: [0.09, 0.5, 0.09] },
      { geo: UNIT_CONE, color: 0xa9a091, p: [0, 1.02, 0.5], s: [0.62, 0.4, 0.62], r: [Math.PI, 0, 0] }
    );
    pieces.push(...panel(1.62, 0, 0, 1.9, 1.1, 0.08));
    pieces.push(...panel(-1.62, 0, 0, 1.9, 1.1, -0.22, true));
  } else if (variant === 1) {
    pieces.push(
      { geo: UNIT_CYL, color: hull, p: [0, 0, 0], s: [1.2, 2.6, 1.2], r: [Math.PI / 2, 0, 0] },
      { geo: UNIT_BOX, color: DARKMETAL, p: [0, 0, -1.32], s: [1.0, 1.0, 0.3] },
      { geo: UNIT_CYL, color: DARK, p: [0, 0, 1.4], s: [0.42, 0.34, 0.42], r: [Math.PI / 2, 0, 0] },
      { geo: UNIT_BOX, color: VERDIGRIS, p: [-0.2, -0.4, 0.3], s: [0.6, 0.14, 0.6] },
      // Whip antenna, bent.
      { geo: UNIT_BOX, color: DARKMETAL, p: [0.5, 0.95, -0.5], s: [0.05, 1.9, 0.05], r: [0, 0, 0.16] },
      { geo: UNIT_BOX, color: DARKMETAL, p: [0.72, 1.8, -0.5], s: [0.05, 0.4, 0.05], r: [0, 0, 0.9] }
    );
    // One big panel above the hull, cocked over.
    pieces.push(...panel(0, 0.95, 0, 3.0, 1.7, 0.34));
  } else {
    pieces.push(
      { geo: UNIT_BOX, color: hull, p: [0, 0, 0], s: [1.5, 0.85, 1.7] },
      { geo: UNIT_BOX, color: DARKMETAL, p: [0, 0.5, 0], s: [1.0, 0.24, 1.1] },
      { geo: UNIT_CYL, color: DARK, p: [0, 0, 0.95], s: [0.36, 0.4, 0.36], r: [Math.PI / 2, 0, 0] },
      { geo: UNIT_BOX, color: RUST, p: [-0.55, 0.42, -0.4], s: [0.36, 0.2, 0.9] },
      { geo: UNIT_BOX, color: DARKMETAL, p: [0, -0.62, 0], s: [0.1, 0.45, 0.1] },
      { geo: UNIT_DISC, color: 0xb0a795, p: [0, -0.92, 0], s: [0.8, 0.1, 0.8] }
    );
    pieces.push(...panel(1.75, 0, 0, 1.7, 1.0, 0));
    pieces.push(...panel(-1.55, 0.1, 0, 1.3, 1.0, 0.46));
  }

  return mergeTinted(pieces);
}

/**
 * The sky as a vertical gradient rather than one flat colour. A big inverted
 * sphere follows the camera; the gradient is measured against the planet's
 * radial up, so the horizon really is the horizon wherever the player stands.
 * Near the globe camera distance the dome fades out into space and the orbit
 * background takes over.
 *
 * Vertical aurora curtains ride on the same object: they are built from the
 * zone's own gradient, so the river, ark and fortress skies carry them while
 * the citadel's clear daylight keeps only a trace. They fade out with the dome
 * in globe view.
 */
class SkyDome {
  readonly mesh: THREE.Mesh;
  private mat: THREE.ShaderMaterial;
  private target = {
    zenith: new THREE.Color(),
    horizon: new THREE.Color(),
    haze: new THREE.Color(),
    aurora: 0,
    space: 0
  };
  private up = new THREE.Vector3(0, 1, 0);
  private right = new THREE.Vector3(1, 0, 0);
  private fwd = new THREE.Vector3(0, 0, 1);
  private ready = false;
  private curtains: THREE.Mesh;
  private curtainMat: THREE.ShaderMaterial;
  private curtainTime = 0;
  private curtainStrength = 0;

  constructor() {
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uZenith: { value: new THREE.Color() },
        uHorizon: { value: new THREE.Color() },
        uHaze: { value: new THREE.Color() },
        uSpace: { value: GLOBE_ATMOSPHERE.sky.clone() },
        uUp: { value: new THREE.Vector3(0, 1, 0) },
        uSpaceMix: { value: 0 }
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vDir;
        uniform vec3 uZenith;
        uniform vec3 uHorizon;
        uniform vec3 uHaze;
        uniform vec3 uSpace;
        uniform vec3 uUp;
        uniform float uSpaceMix;

        void main() {
          vec3 dir = normalize(vDir);
          float h = dot(dir, normalize(uUp));
          // Dark overhead, pale at the horizon. On a radius-42 planet the land
          // curves away 30 degrees below the tangent, so the whole sky a ground
          // camera can see lies in the lower part of this sphere: the ramp is
          // mapped to that band, not to the full hemisphere.
          float t = smoothstep(-0.5, 0.12, h);
          vec3 col = mix(uHorizon, uZenith, pow(t, 0.9));
          // A band of haze lying on the horizon line.
          float band = pow(1.0 - clamp(abs(h + 0.42) * 3.0, 0.0, 1.0), 4.0);
          col = mix(col, uHaze, band * 0.45);
          col = mix(col, uSpace, uSpaceMix);
          // One part in 255 of noise: 8-bit gradients band without it.
          float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
          col += (n - 0.5) * 0.006;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(800, 32, 16), this.mat);
    this.mesh.name = 'sky-dome';
    this.mesh.renderOrder = -10000;
    this.mesh.frustumCulled = false;
    this.mesh.onBeforeRender = (_r, _s, camera) => this.follow(camera);
    this.mesh.matrixAutoUpdate = false;

    const curtain = curtainSky();
    this.curtainMat = curtain.material;
    this.curtains = curtain.mesh;
    // A child of the dome, so it follows the camera for free. It draws after
    // the dome but before the sun, and never writes depth.
    this.mesh.add(this.curtains);
  }

  /** Follow the camera and pick the sky of the zone the eye is standing in. */
  private follow(camera: THREE.Camera): void {
    const cam = camera as THREE.PerspectiveCamera;
    if (!cam.isPerspectiveCamera) return;
    this.mesh.position.copy(cam.position);
    this.mesh.updateMatrix();
    this.mesh.updateMatrixWorld();

    // The eye's up is the radial direction from the planet centre.
    this.up.copy(cam.position);
    if (this.up.lengthSq() < 1e-6) this.up.set(0, 1, 0);
    else this.up.normalize();
    (this.mat.uniforms.uUp.value as THREE.Vector3).copy(this.up);
    tangentBasis(this.up, 0, this.right, this.fwd);
    (this.curtainMat.uniforms.uUp.value as THREE.Vector3).copy(this.up);
    (this.curtainMat.uniforms.uRight.value as THREE.Vector3).copy(this.right);
    (this.curtainMat.uniforms.uFwd.value as THREE.Vector3).copy(this.fwd);

    const dist = cam.position.length();
    this.target.space = THREE.MathUtils.smoothstep(dist, 78, 118);

    const blend = landBiomeBlend(this.up);
    const a: SkyGradient = SKY_GRADIENT[blend.primary.id];
    const b: SkyGradient = SKY_GRADIENT[blend.secondary.id];
    const w = blend.mix;
    this.target.zenith.copy(a.zenith).lerp(b.zenith, w);
    this.target.horizon.copy(a.horizon).lerp(b.horizon, w);
    this.target.haze.copy(a.haze).lerp(b.haze, w);
    this.target.aurora = THREE.MathUtils.lerp(a.aurora, b.aurora, w);

    if (!this.ready) {
      this.ready = true;
      this.apply(1);
    }
  }

  /** Move the uniforms toward the zone the camera has arrived in. */
  update(dt: number): void {
    if (!this.ready) return;
    this.curtainTime += dt;
    this.apply(1 - Math.exp(-dt * 2.6));
  }

  private apply(k: number): void {
    const u = this.mat.uniforms;
    (u.uZenith.value as THREE.Color).lerp(this.target.zenith, k);
    (u.uHorizon.value as THREE.Color).lerp(this.target.horizon, k);
    (u.uHaze.value as THREE.Color).lerp(this.target.haze, k);
    u.uSpaceMix.value += (this.target.space - (u.uSpaceMix.value as number)) * k;

    // Curtains fade with the dome's own trip into space, and with the zone's
    // own aurora strength.
    this.curtainStrength += (this.target.aurora - this.curtainStrength) * k;
    const strength = this.curtainStrength * (1 - (u.uSpaceMix.value as number));
    this.curtainMat.uniforms.uStrength.value = strength;
    this.curtainMat.uniforms.uTime.value = this.curtainTime;
    this.curtains.visible = strength > 0.01;
  }
}

/** Vertices along and up a curtain band. */
const CURTAIN_SEGMENTS = 72;
/** Curtain bands, each at its own bearing and height. */
const CURTAIN_BANDS = 5;
/** Rows up a curtain: enough for the crown to bend without a visible crease. */
const CURTAIN_ROWS = 4;
/** Radius the curtains hang at, inside the dome and well inside the stars. */
const CURTAIN_RADIUS = 600;

const CURTAIN_VERT = /* glsl */ `
uniform vec3 uUp;
uniform vec3 uRight;
uniform vec3 uFwd;
uniform float uTime;
attribute float aSide;
attribute float aHeight;
attribute float aBand;
varying float vSide;
varying float vHeight;
varying float vBand;

void main() {
  float band = aBand;
  // The visible sky starts below the tangent plane, because the planet's own
  // curve puts the horizon 30 degrees down. Curtains hang in that band.
  float baseElev = -0.24 + mod(band, 3.0) * 0.03;
  float topElev = 0.26 + mod(band, 2.0) * 0.08;
  float elev = mix(baseElev, topElev, aHeight);
  // Five bands around the sky, each sweeping 70 degrees, so a ground view
  // always catches at least one of them.
  float az = band * 1.2566 + (aSide - 0.5) * 1.22 + uTime * (0.004 + band * 0.0012);
  // A slow sway, stronger at the crown, so the curtain ripples like cloth.
  float sway = sin(aSide * 9.42 + uTime * 0.11 + band * 2.3) * 0.045 * (0.35 + aHeight);
  vec3 dir = normalize(uUp * sin(elev + sway) + (uRight * cos(az) + uFwd * sin(az)) * cos(elev + sway));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(dir * ${CURTAIN_RADIUS.toFixed(1)}, 1.0);
  vSide = aSide;
  vHeight = aHeight;
  vBand = aBand;
}
`;

const CURTAIN_FRAG = /* glsl */ `
uniform float uTime;
uniform float uStrength;
varying float vSide;
varying float vHeight;
varying float vBand;

vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(1.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

void main() {
  // Soft ends: the foot lifts off the horizon and the crown dissolves.
  float foot = smoothstep(0.0, 0.35, vHeight);
  float crown = 1.0 - smoothstep(0.72, 1.0, vHeight);
  float side = smoothstep(0.0, 0.24, vSide) * (1.0 - smoothstep(0.76, 1.0, vSide));
  // Thin vertical striations make the band read as a curtain, not a sheet.
  float stripes = 0.55 + 0.45 * sin(vSide * 46.0 + uTime * 0.7 + vBand * 2.1);
  float a = foot * crown * side * stripes * uStrength * 1.8;
  // Green-cyan at the foot, violet at the crown, with each band offset a little.
  float hue = mix(0.4, 0.8, vHeight) + vBand * 0.03;
  vec3 col = hsv2rgb(vec3(fract(hue), 0.65, 0.95));
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}
`;

/** One geometry and one draw call for every curtain band in the sky. */
function curtainSky(): { mesh: THREE.Mesh; material: THREE.ShaderMaterial } {
  const verts = (CURTAIN_SEGMENTS + 1) * CURTAIN_ROWS;
  const count = verts * CURTAIN_BANDS;
  const position = new Float32Array(count * 3);
  const side = new Float32Array(count);
  const height = new Float32Array(count);
  const band = new Float32Array(count);
  const index: number[] = [];
  let v = 0;
  for (let b = 0; b < CURTAIN_BANDS; b++) {
    const start = v;
    for (let row = 0; row < CURTAIN_ROWS; row++) {
      for (let i = 0; i <= CURTAIN_SEGMENTS; i++) {
        // Position is unused by the shader; the attributes carry the shape.
        side[v] = i / CURTAIN_SEGMENTS;
        height[v] = row / (CURTAIN_ROWS - 1);
        band[v] = b;
        v++;
      }
    }
    for (let row = 0; row < CURTAIN_ROWS - 1; row++) {
      for (let i = 0; i < CURTAIN_SEGMENTS; i++) {
        const a = start + row * (CURTAIN_SEGMENTS + 1) + i;
        const c = a + CURTAIN_SEGMENTS + 1;
        index.push(a, c, a + 1, a + 1, c, c + 1);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geo.setAttribute('aSide', new THREE.BufferAttribute(side, 1));
  geo.setAttribute('aHeight', new THREE.BufferAttribute(height, 1));
  geo.setAttribute('aBand', new THREE.BufferAttribute(band, 1));
  geo.setIndex(index);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uUp: { value: new THREE.Vector3(0, 1, 0) },
      uRight: { value: new THREE.Vector3(1, 0, 0) },
      uFwd: { value: new THREE.Vector3(0, 0, 1) },
      uTime: { value: 0 },
      uStrength: { value: 0 }
    },
    vertexShader: CURTAIN_VERT,
    fragmentShader: CURTAIN_FRAG,
    transparent: true,
    depthWrite: false,
    // Terrain in front occludes the curtains: they hang far out, but a hill
    // rising into the lower sky must not get a band of aurora painted on it.
    depthTest: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });

  const mesh = new THREE.Mesh(geo, material);
  mesh.name = 'sky-curtains';
  mesh.renderOrder = -9500;
  mesh.frustumCulled = false;
  mesh.matrixAutoUpdate = true;
  return { mesh, material };
}

/**
 * Derelict satellites drifting above the planet, plus one huge ringed planet
 * hanging far out in the sky. Every satellite is one merged, vertex-coloured
 * mesh — three geometries and two materials are shared by all of them — with a
 * separate red lamp that blinks on its own clock.
 */
export class Clouds {
  group = new THREE.Group();
  private satellites: Satellite[] = [];
  private sky = new SkyDome();
  private time = 0;
  private _q = new THREE.Quaternion();
  private _x = new THREE.Vector3();
  private _y = new THREE.Vector3();
  private _z = new THREE.Vector3();
  private _m = new THREE.Matrix4();
  private _tumble = new THREE.Quaternion();

  constructor(seed: number, profile: PlanetProfile) {
    const rng = seededRng(deriveSeed(seed, 5));

    this.buildRingedPlanet();
    this.buildSatellites(rng);
    this.group.add(this.sky.mesh);

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

  /** Nine derelicts at 10 to 25 units above the surface, each on its own orbit. */
  private buildSatellites(rng: () => number): void {
    const hullMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      metalness: 0.6,
      roughness: 0.55
    });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xff3a2a });
    const variants = [buildSatellite(0), buildSatellite(1), buildSatellite(2)];
    const lampGeo = new THREE.SphereGeometry(0.12, 6, 5);
    const count = 9;

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(variants[i % variants.length], hullMat);
      mesh.castShadow = true;
      mesh.name = `derelict-${i}`;

      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(0.55, 0.6, 0.5);
      mesh.add(lamp);

      const scale = 0.8 + rng() * 0.7;
      mesh.scale.setScalar(scale);

      const orbit = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(rng() * 1.4 - 0.7, rng() * Math.PI * 2, rng() * 1.2 - 0.6)
      );
      const tumbleAxis = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize();

      this.satellites.push({
        mesh,
        lamp,
        radius: PLANET_RADIUS + 10 + rng() * 15,
        orbit,
        speed: 0.006 + rng() * 0.016,
        phase: rng() * Math.PI * 2,
        tumbleAxis,
        tumbleSpeed: 0.05 + rng() * 0.16,
        blinkPhase: rng() * Math.PI * 2,
        blinkSpeed: 0.7 + rng() * 1.1
      });
      this.group.add(mesh);
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
    this.time += dt;
    this.sky.update(dt);
    const t = this.time;
    for (const s of this.satellites) {
      const a = s.phase + s.speed * t;
      this._y.set(Math.cos(a), 0, Math.sin(a)).applyQuaternion(s.orbit);
      this._z.set(-Math.sin(a), 0, Math.cos(a)).applyQuaternion(s.orbit);
      this._x.crossVectors(this._y, this._z);
      this._m.makeBasis(this._x, this._y, this._z);
      s.mesh.quaternion.setFromRotationMatrix(this._m);
      this._tumble.setFromAxisAngle(s.tumbleAxis, t * s.tumbleSpeed);
      s.mesh.quaternion.multiply(this._tumble);
      s.mesh.position.copy(this._y).multiplyScalar(s.radius);

      // Slow pulse, never quite off: a dim red marker light.
      const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.blinkSpeed + s.blinkPhase));
      s.lamp.scale.setScalar(pulse);
    }
  }
}
