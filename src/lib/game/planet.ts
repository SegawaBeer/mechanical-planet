import * as THREE from 'three';
import { biomeAt, configureBiomeOcean, isOcean, landBiomeBlend, oceanField, OCEAN, type Biome } from './biomes';
import { deriveSeed, fbm3, hash3, seededRng } from './noise';
import type { PlanetProfile } from './space';

export const PLANET_RADIUS = 42;
/** Radius of the translucent water sphere. */
export const SEA_LEVEL = PLANET_RADIUS + 0.4;

let terrainReliefScale = 1;
let terrainRuggedScale = 1;
let terrainDetailScale = 1;
let terrainCreaseFrequency = 3.2;

/** Apply a profile to all subsequently generated terrain and water. */
export function configurePlanet(profile: PlanetProfile): void {
  const relief = THREE.MathUtils.clamp(profile.relief, 0.4, 1.6);
  const ruggedness = THREE.MathUtils.clamp(profile.ruggedness, 0.4, 1.6);
  terrainReliefScale = relief;
  terrainRuggedScale = ruggedness;
  terrainDetailScale = THREE.MathUtils.lerp(1, ruggedness, 0.65);
  terrainCreaseFrequency = 3.2 * (1 + (ruggedness - 1) * 0.25);
  configureBiomeOcean(profile);
}

/**
 * Distance from the planet centre to the ground along unit direction `d`.
 *
 * The world is plated metal. A broad swell and a fine roll give every zone
 * some lift; on top of that each zone shapes its own ground. Energy channels
 * cut steep-walled canyons, the citadel climbs in stepped tiers, the ark dock
 * flattens into a deck around the hull, and the fortress sits on a raised
 * plateau. Every layer stays gentle enough that props never hang in the air.
 */
export function surfaceRadius(d: THREE.Vector3): number {
  const f = oceanField(d);
  const reliefScale = terrainReliefScale;
  const detailScale = terrainDetailScale;
  if (f < 0) {
    // Channel bed: drops away from the bank so the flow reads as deep.
    const depth = Math.min(1, -f * 14);
    return PLANET_RADIUS - 0.35 - depth * 1.3;
  }
  // Canyon walls: a short steep rise out of the channel, then the plates.
  const rise = Math.min(1, f * 9);
  const swell = fbm3(d.x * 1.9 - 7, d.y * 1.9 + 4, d.z * 1.9 + 9, 3) * 1.4 * reliefScale;
  const roll = fbm3(d.x * 6 + 3, d.y * 6, d.z * 6 - 1, 3) * 0.35 * detailScale;
  const base = 0.6 + swell + roll;
  // Zone shapes cross-fade near a border so no cliff runs along it.
  const blend = landBiomeBlend(d);
  let h = zoneHeight(blend.primary, base, d);
  if (blend.mix > 0) h = THREE.MathUtils.lerp(h, zoneHeight(blend.secondary, base, d), blend.mix);
  const shaped = h >= 0 ? h : Math.max(-0.2, h * 0.15);
  return PLANET_RADIUS + 0.7 + rise * shaped;
}

/** How one zone shapes the basic swell-and-roll ground. */
function zoneHeight(zone: Biome, h: number, d: THREE.Vector3): number {
  const near = THREE.MathUtils.smoothstep(Math.acos(THREE.MathUtils.clamp(zone.center.dot(d), -1, 1)), 0.55, 0.2);
  if (zone.id === 'river') {
    // Ridged mesas between the channels: the canyon country.
    const crease = 1 - Math.abs(fbm3(d.x * terrainCreaseFrequency - 12, d.y * terrainCreaseFrequency + 6, d.z * terrainCreaseFrequency - 2, 3));
    return h + crease * crease * 1.6 * terrainRuggedScale;
  }
  if (zone.id === 'citadel') return Math.round((h + 0.4 * near) / 0.45) * 0.45;
  if (zone.id === 'ark') return THREE.MathUtils.lerp(h, 0.55, near * 0.85);
  return Math.round((h + 1.1 * near) / 0.7) * 0.7;
}

const _na = new THREE.Vector3();
const _nb = new THREE.Vector3();
const _nr = new THREE.Vector3();
const _nf = new THREE.Vector3();

/**
 * Unit normal of the terrain at `d`, found by sampling the height a step east
 * and a step north. Props stand along this rather than along the radius, so a
 * tree on a hillside leans with the hill instead of hovering over it.
 */
export function surfaceNormal(d: THREE.Vector3, out = new THREE.Vector3()): THREE.Vector3 {
  tangentBasis(d, 0, _nr, _nf);
  const step = 0.6;
  const h = surfaceRadius(d);
  const east = (surfaceRadius(offsetDir(_na.copy(d), step, 0)) - h) / step;
  const north = (surfaceRadius(offsetDir(_nb.copy(d), 0, step)) - h) / step;
  return out.copy(d).addScaledVector(_nr, -east).addScaledVector(_nf, -north).normalize();
}

/** Radius a walker stands at: ground on land, the water surface at sea. */
export function walkRadius(d: THREE.Vector3): number {
  return Math.max(surfaceRadius(d), SEA_LEVEL - 0.15);
}

export function surfacePoint(d: THREE.Vector3, out = new THREE.Vector3()): THREE.Vector3 {
  return out.copy(d).multiplyScalar(surfaceRadius(d));
}

const _ref = new THREE.Vector3();
const _up = new THREE.Vector3();
const _right = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _q = new THREE.Quaternion();

/**
 * Tangent basis at `up`: `right` points roughly east and `fwd` roughly north,
 * rotated about `up` by `yaw`.
 *
 * The three axes are ordered so that `right x up = fwd`, which makes
 * `makeBasis(right, up, fwd)` a right-handed rotation. Getting this backwards
 * mirrors every frame built on it: triangle winding reverses, so baked geometry
 * turns inside out and `setFromRotationMatrix` reads a reflection as a rotation.
 */
export function tangentBasis(up: THREE.Vector3, yaw: number, right: THREE.Vector3, fwd: THREE.Vector3): void {
  _ref.set(0, 1, 0);
  if (Math.abs(up.y) > 0.98) _ref.set(1, 0, 0);
  right.crossVectors(up, _ref).normalize();
  fwd.crossVectors(right, up).normalize();
  if (yaw !== 0) {
    _q.setFromAxisAngle(up, yaw);
    right.applyQuaternion(_q);
    fwd.applyQuaternion(_q);
  }
}

/**
 * Placement transform for a prop standing on the ground at direction `d`.
 * Local +Y is the surface normal and local +Z faces `yaw` radians from north.
 */
export function surfaceFrame(d: THREE.Vector3, yaw: number, out: THREE.Matrix4, lift = 0): THREE.Matrix4 {
  const up = surfaceNormal(d, _up);
  tangentBasis(up, yaw, _right, _fwd);
  out.makeBasis(_right, up, _fwd);
  const r = surfaceRadius(d) + lift;
  out.setPosition(d.x * r, d.y * r, d.z * r);
  return out;
}

/** Move a unit direction `east`/`north` units across the surface, in place. */
export function offsetDir(d: THREE.Vector3, east: number, north: number): THREE.Vector3 {
  tangentBasis(d, 0, _right, _fwd);
  const step = _right.multiplyScalar(east).addScaledVector(_fwd, north);
  const len = step.length();
  if (len < 1e-6) return d;
  const ang = len / PLANET_RADIUS;
  step.divideScalar(len);
  d.multiplyScalar(Math.cos(ang)).addScaledVector(step, Math.sin(ang)).normalize();
  return d;
}

/** Plate cell of a direction: faces in one cell share a plate colour. */
function plateHash(d: THREE.Vector3, size: number): number {
  return hash3(Math.floor(d.x * size), Math.floor(d.y * size), Math.floor(d.z * size));
}

/** Cell coordinates of a direction on the plate grid. */
function plateCell(d: THREE.Vector3, size: number, out: [number, number, number]): void {
  out[0] = Math.floor(d.x * size);
  out[1] = Math.floor(d.y * size);
  out[2] = Math.floor(d.z * size);
}

/**
 * Colour for one ground face. Each plate picks one of its zone's three metals,
 * with a rare plate in the zone's accent.
 */
function plateColor(b: Biome, h: number): number {
  if (h > 0.93) return b.accent;
  const palette = b.ground;
  return h < 0.55 ? palette[0] : h < 0.82 ? palette[1] : palette[2];
}

const WALL_DARK = new THREE.Color(0x161d24);
const WALL_LIGHT = new THREE.Color(0x51606c);

export function buildGround(): THREE.Mesh {
  const geo = new THREE.IcosahedronGeometry(1, 46);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const col = new THREE.Color();
  const ca: [number, number, number] = [0, 0, 0];
  const cb: [number, number, number] = [0, 0, 0];
  const cc: [number, number, number] = [0, 0, 0];
  const cm: [number, number, number] = [0, 0, 0];

  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i).normalize();
    b.fromBufferAttribute(pos, i + 1).normalize();
    c.fromBufferAttribute(pos, i + 2).normalize();
    mid.copy(a).add(b).add(c).normalize();

    const biome = biomeAt(mid);
    const f = oceanField(mid);
    let hex: number;
    let seam = false;
    if (biome === OCEAN) hex = OCEAN.ground[hash3(i, 3, 5) < 0.5 ? 0 : 1];
    else if (f < 0.035) hex = biome.beach;
    else {
      const size = biome.id === 'citadel' ? 11 : biome.id === 'fortress' ? 8 : 9;
      // A face that straddles a plate boundary is a seam: every face around it
      // sits inside one cell. That gives seams exactly one face wide, so they
      // read as cut lines rather than as a mottled grid.
      plateCell(mid, size, cm);
      plateCell(a, size, ca);
      plateCell(b, size, cb);
      plateCell(c, size, cc);
      seam = cellDiffers(ca, cm) || cellDiffers(cb, cm) || cellDiffers(cc, cm);
      hex = seam ? biome.ground[2] : plateColor(biome, hash3(cm[0], cm[1], cm[2]));
    }
    col.setHex(hex);

    // Canyon walls: the ground climbing out of a channel is rougher and banded
    // in strata, so the bank reads as cut rock rather than as a plate edge.
    if (f >= 0 && f < 0.26 && biome !== OCEAN) {
      const wall = 1 - Math.min(1, f / 0.26);
      const strata = Math.sin(mid.y * 78 + mid.x * 11) * 0.5 + 0.5;
      col.lerp(WALL_DARK, wall * 0.7);
      col.lerp(WALL_LIGHT, wall * strata * 0.22);
    }
    // Seams sit darker than the plate they divide.
    if (seam) col.multiplyScalar(0.72);
    // Faint per-face variation keeps the flat shading from looking like a texture.
    col.multiplyScalar(0.95 + hash3(i, 7, 13) * 0.1);

    for (let k = 0; k < 3; k++) {
      const p = k === 0 ? a : k === 1 ? b : c;
      const r = surfaceRadius(p);
      pos.setXYZ(i + k, p.x * r, p.y * r, p.z * r);
      colors[(i + k) * 3] = col.r;
      colors[(i + k) * 3 + 1] = col.g;
      colors[(i + k) * 3 + 2] = col.b;
    }
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.deleteAttribute('uv');
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 0.55,
    metalness: 0.45
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'ground';
  return mesh;
}

/** True when two plate cells differ, the test that marks a seam face. */
function cellDiffers(x: [number, number, number], y: [number, number, number]): boolean {
  return x[0] !== y[0] || x[1] !== y[1] || x[2] !== y[2];
}

/** Energy depth, in world units, at which the channel reads as fully open. */
const SHALLOW = 2.6;

/** Palette of the energy channels. Liquid light, not water. */
const ENERGY = {
  deep: 0x0a52c8,
  base: 0x2fe6ff,
  hot: 0xd6fdff
};

/**
 * The energy channels. A sphere at sea level, but shaded as flowing light: two
 * crossed band fields sweep the surface, banks pull the colour toward white
 * hot, and grazing angles glow. Depth comes from `aShore`, baked at build time
 * because the channel bed lives in noise the GPU cannot sample.
 *
 * `uTime` is driven every frame by the Game through `mesh.userData.uniforms`.
 */
export function buildWater(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(SEA_LEVEL, 128, 80);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const shore = new Float32Array(pos.count);
  const d = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    const depth = SEA_LEVEL - surfaceRadius(d);
    shore[i] = 1 - THREE.MathUtils.clamp(depth / SHALLOW, 0, 1);
  }
  geo.setAttribute('aShore', new THREE.BufferAttribute(shore, 1));

  const uniforms = {
    uTime: { value: 0 },
    uDeep: { value: new THREE.Color(ENERGY.deep) },
    uBase: { value: new THREE.Color(ENERGY.base) },
    uHot: { value: new THREE.Color(ENERGY.hot) }
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: true,
    side: THREE.FrontSide,
    vertexShader: /* glsl */ `
      uniform float uTime;
      attribute float aShore;
      varying float vShore;
      varying vec3 vDir;
      varying vec3 vNormalW;
      varying vec3 vViewW;

      void main() {
        vShore = aShore;
        vec3 dir = normalize(position);
        // The sheet is never dead still: a slow rise and fall rolls through it.
        float open = 1.0 - vShore;
        float swell = sin(dir.x * 3.1 + dir.z * 2.4 + uTime * 1.2) * 0.5
                   + sin(dir.y * 2.7 - dir.x * 1.9 - uTime * 0.9) * 0.5;
        vec3 p = position + dir * swell * 0.12 * open;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vDir = dir;
        vNormalW = normalize(mat3(modelMatrix) * dir);
        vViewW = cameraPosition - wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uDeep;
      uniform vec3 uBase;
      uniform vec3 uHot;
      varying float vShore;
      varying vec3 vDir;
      varying vec3 vNormalW;
      varying vec3 vViewW;

      void main() {
        // Trim the sheet where the bed rises out of it, so banks are cut clean.
        if (vShore > 0.997) discard;

        vec3 p = normalize(vDir);
        float t = uTime;

        // Two crossed band fields, warped by a slow swell so the lines wander
        // instead of ringing the planet like latitude lines.
        float warp = sin(p.x * 3.7 + t * 0.5) + sin(p.z * 4.3 - t * 0.4) + sin(p.y * 5.1 + t * 0.31);
        float a = sin(dot(p, vec3(11.0, 7.0, -9.0)) + warp * 0.9 - t * 2.3);
        float b = sin(dot(p, vec3(-8.0, 13.0, 8.0)) + warp * 0.5 + t * 1.4);
        float flow = a * 0.62 + b * 0.38;

        // Narrow crests ride the flow; the troughs fall back to electric blue.
        float crest = smoothstep(0.45, 0.97, flow);
        float trough = smoothstep(0.05, -0.85, flow);
        vec3 col = mix(uBase, uDeep, trough * 0.75);
        col = mix(col, uHot, crest * 0.7);

        // Banks run hot: the light piles up against the metal it cuts through.
        float shore = smoothstep(0.7, 0.99, vShore);
        float pulse = 0.55 + 0.45 * sin(vShore * 24.0 - t * 2.8);
        col = mix(col, uHot, shore * pulse * 0.85);

        // Fine glitter travelling with the flow, so it reads as moving liquid.
        float spark = sin(p.x * 61.0 + t * 3.4) * sin(p.y * 53.0 - t * 2.7) * sin(p.z * 47.0 + t * 3.1);
        col += uHot * pow(max(spark, 0.0), 6.0) * 0.9;

        // Grazing angles glow brighter: the channel is a sheet of light, not paint.
        float fres = pow(1.0 - abs(dot(normalize(vViewW), normalize(vNormalW))), 2.0);
        col += uBase * fres * 0.55;

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'water';
  mesh.userData.uniforms = uniforms;
  return mesh;
}



export function buildStars(seed: number): THREE.Points {
  const rng = seededRng(deriveSeed(seed, 4));
  const n = 1400;
  const arr = new Float32Array(n * 3);
  const d = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    d.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize();
    const r = 520 + rng() * 60;
    arr[i * 3] = d.x * r;
    arr[i * 3 + 1] = d.y * r;
    arr[i * 3 + 2] = d.z * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xcfe3ef,
    size: 1.6,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.7
  });
  return new THREE.Points(geo, mat);
}

export { isOcean };
