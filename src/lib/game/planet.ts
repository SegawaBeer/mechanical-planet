import * as THREE from 'three';
import { configureBiomeOcean, isOcean, landBiomeBlend, oceanField, OCEAN, type Biome } from './biomes';
import { deriveSeed, fbm3, seededRng } from './noise';
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
  // Canyon walls: a short steep rise out of the channel, then the open ground.
  const rise = Math.min(1, f * 9);
  const swell = fbm3(d.x * 1.9 - 7, d.y * 1.9 + 4, d.z * 1.9 + 9, 3) * 1.4 * reliefScale;
  const roll = fbm3(d.x * 6 + 3, d.y * 6, d.z * 6 - 1, 3) * 0.18 * detailScale;
  const base = 0.6 + swell + roll;
  // Zone shapes cross-fade near a border so no cliff runs along it. The band is
  // as wide as the colour blend, so the two zones meet without a visible seam.
  const blend = landBiomeBlend(d);
  let h = zoneHeight(blend.primary, base, d);
  const margin = blend.margin * PLANET_RADIUS;
  if (margin < ZONE_FADE) {
    const w = 0.5 * (1 - THREE.MathUtils.clamp(margin / ZONE_FADE, 0, 1));
    h = THREE.MathUtils.lerp(h, zoneHeight(blend.secondary, base, d), w);
  }
  const shaped = h >= 0 ? h : Math.max(-0.2, h * 0.15);
  return PLANET_RADIUS + 0.7 + rise * shaped;
}

/** How one zone shapes the basic swell-and-roll ground. */
function zoneHeight(zone: Biome, h: number, d: THREE.Vector3): number {
  const near = THREE.MathUtils.smoothstep(Math.acos(THREE.MathUtils.clamp(zone.center.dot(d), -1, 1)), 0.55, 0.2);
  if (zone.id === 'river') {
    // Rounded mesas between the channels: the canyon country, kept gentle.
    const crease = 1 - Math.abs(fbm3(d.x * terrainCreaseFrequency - 12, d.y * terrainCreaseFrequency + 6, d.z * terrainCreaseFrequency - 2, 3));
    return h + crease * crease * 0.8 * terrainRuggedScale;
  }
  if (zone.id === 'citadel') return h + 0.5 * near;
  if (zone.id === 'ark') return THREE.MathUtils.lerp(h, 0.55, near * 0.85);
  return h + 1.1 * near;
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

/**
 * Radius a walker stands at: ground on land, the water surface at sea.
 *
 * The highest ground within half a unit is used, not just the ground under the
 * exact spot: the mesh only samples its vertices, so on a slope the surface the
 * player sees is the top of the faces around them. Standing on the highest of
 * five samples keeps the feet on that surface instead of sunk into it.
 */
const FOOT_SAMPLES = 0.5;
const _foot = new THREE.Vector3();
export function walkRadius(d: THREE.Vector3): number {
  let r = surfaceRadius(d);
  for (let i = 0; i < 4; i++) {
    const east = i === 0 ? FOOT_SAMPLES : i === 1 ? -FOOT_SAMPLES : 0;
    const north = i === 2 ? FOOT_SAMPLES : i === 3 ? -FOOT_SAMPLES : 0;
    _foot.copy(d);
    offsetDir(_foot, east, north);
    const s = surfaceRadius(_foot);
    if (s > r) r = s;
  }
  return Math.max(r + 0.03, SEA_LEVEL - 0.15);
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

const WALL_DARK = new THREE.Color(0x2a3540);

/**
 * Icosphere whose faces share their vertices, so `computeVertexNormals` gives
 * one smooth normal per direction instead of one per face. `rounds` doubles the
 * edge subdivision each time: 6 rounds is 64 segments per edge.
 */
function smoothSphere(rounds: number): THREE.BufferGeometry {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts: THREE.Vector3[] = [];
  const push = (x: number, y: number, z: number): number => {
    verts.push(new THREE.Vector3(x, y, z).normalize());
    return verts.length - 1;
  };
  push(-1, t, 0); push(1, t, 0); push(-1, -t, 0); push(1, -t, 0);
  push(0, -1, t); push(0, 1, t); push(0, -1, -t); push(0, 1, -t);
  push(t, 0, -1); push(t, 0, 1); push(-t, 0, -1); push(-t, 0, 1);
  const base = [
    0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
    1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
    3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
    4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
  ];
  let faces = base;
  for (let r = 0; r < rounds; r++) {
    const cache = new Map<number, number>();
    const next: number[] = [];
    const mid = (a: number, b: number): number => {
      const key = a < b ? a * 65536 + b : b * 65536 + a;
      const hit = cache.get(key);
      if (hit !== undefined) return hit;
      verts.push(verts[a].clone().add(verts[b]).normalize());
      const i = verts.length - 1;
      cache.set(key, i);
      return i;
    };
    for (let f = 0; f < faces.length; f += 3) {
      const a = faces[f];
      const b = faces[f + 1];
      const c = faces[f + 2];
      const ab = mid(a, b);
      const bc = mid(b, c);
      const ca = mid(c, a);
      next.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
    }
    faces = next;
  }
  // The base table winds outward; make sure subdivision did not flip it.
  const p0 = verts[faces[0]], p1 = verts[faces[1]], p2 = verts[faces[2]];
  const n = new THREE.Vector3().crossVectors(p1.clone().sub(p0), p2.clone().sub(p0));
  if (n.dot(p0) < 0) {
    for (let f = 0; f < faces.length; f += 3) {
      const tmp = faces[f + 1];
      faces[f + 1] = faces[f + 2];
      faces[f + 2] = tmp;
    }
  }
  const positions = new Float32Array(verts.length * 3);
  for (let i = 0; i < verts.length; i++) {
    positions[i * 3] = verts[i].x;
    positions[i * 3 + 1] = verts[i].y;
    positions[i * 3 + 2] = verts[i].z;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setIndex(faces);
  return geo;
}

const _pal = new THREE.Color();

/**
 * Ground colour at one direction. Everything is a function of position, so
 * neighbouring vertices blend into each other: a low-frequency noise picks a
 * place along the zone's palette and another low-frequency noise lifts or drops
 * the tone. There are no plates, no seams and no per-face noise.
 */
/** Ground colour of one zone at `d`, before any blend with a neighbour. */
function zoneGround(b: Biome, d: THREE.Vector3, f: number, out: THREE.Color): THREE.Color {
  if (f < 0.05) return out.setHex(b.beach);
  const palette = b.ground;
  const n = palette.length;
  // Wide palettes (the ark's five colours) need a tighter noise so separate
  // regions still show; blending them at a broad scale would average every hue
  // into one muddy tone.
  const freq = n > 3 ? 7 : 2.2;
  const t = THREE.MathUtils.clamp(fbm3(d.x * freq + 21, d.y * freq - 9, d.z * freq + 3, 2) * 0.5 + 0.5, 0, 1) * (n - 1);
  const i0 = Math.min(n - 1, Math.floor(t));
  const i1 = Math.min(n - 1, i0 + 1);
  out.setHex(palette[i0]).lerp(_pal.setHex(palette[i1]), t - i0);
  const shade = 1 + THREE.MathUtils.clamp(fbm3(d.x * 3.3 - 4, d.y * 3.3 + 8, d.z * 3.3 - 6, 2), -1, 1) * 0.12;
  out.multiplyScalar(shade);
  if (f < 0.3) out.lerp(WALL_DARK, (1 - f / 0.3) * 0.35);
  return out;
}

/** Width, in surface units, over which one zone's ground colour becomes the next. */
const ZONE_FADE = 5;

/**
 * Ground colour at one direction. Pure function of position: neighbouring
 * vertices blend into each other, and across a zone border the two zones'
 * colours cross-fade over `ZONE_FADE` units, so no boundary line shows.
 */
function groundColor(d: THREE.Vector3, out: THREE.Color): THREE.Color {
  const f = oceanField(d);
  if (f < 0) return out.setHex(OCEAN.ground[0]);
  const blend = landBiomeBlend(d);
  const margin = blend.margin * PLANET_RADIUS;
  if (margin < ZONE_FADE) {
    zoneGround(blend.primary, d, f, out);
    zoneGround(blend.secondary, d, f, _pal);
    out.lerp(_pal, 0.5 * (1 - THREE.MathUtils.clamp(margin / ZONE_FADE, 0, 1)));
    return out;
  }
  return zoneGround(blend.primary, d, f, out);
}

export function buildGround(): THREE.Mesh {
  const geo = smoothSphere(6);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const d = new THREE.Vector3();
  const col = new THREE.Color();

  // Displace every shared vertex once, then colour it once.
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    const r = surfaceRadius(d);
    pos.setXYZ(i, d.x * r, d.y * r, d.z * r);
    groundColor(d, col);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    // The scene now carries an environment map, so the metal can stay low and
    // still pick up a little sheen without washing the colours out.
    roughness: 0.55,
    metalness: 0.15
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'ground';
  return mesh;
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
