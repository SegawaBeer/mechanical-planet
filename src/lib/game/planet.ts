import * as THREE from 'three';
import {
  BIOMES,
  BRIDGES,
  bridgeHeight,
  configureBiomeOcean,
  isOcean,
  landBiomeBlend,
  oceanField,
  OCEAN,
  RIVERS,
  type Biome
} from './biomes';
import { configureRoadSource, ROAD_EASE, roadHit, roadSurfaceMesh } from './roads';
import { deriveSeed, fbm3, seededRng } from './noise';
import { withCircuitEtch } from './look';
import type { PlanetProfile } from './space';

export const PLANET_RADIUS = 42;
/** Radius of the water sheet: the rivers run in trenches below the open ground. */
export const SEA_LEVEL = PLANET_RADIUS + 0.4;

let terrainReliefScale = 1;
let terrainDetailScale = 1;

/** Apply a profile to all subsequently generated terrain and water. */
export function configurePlanet(profile: PlanetProfile): void {
  const relief = THREE.MathUtils.clamp(profile.relief, 0.4, 1.6);
  const ruggedness = THREE.MathUtils.clamp(profile.ruggedness, 0.4, 1.6);
  terrainReliefScale = relief;
  terrainDetailScale = THREE.MathUtils.lerp(1, ruggedness, 0.65);
  configureBiomeOcean(profile);
}

/**
 * Distance from the planet centre to the ground along unit direction `d`.
 *
 * The four continents share one base ground: a broad swell and a fine roll,
 * shaped by each zone into its own landform. The river is a trench cut into
 * the river zone: its bed drops below the water surface, and the bank climbs
 * steeply back to the surrounding ground. Across a zone border the two zones'
 * heights cross-fade over the same band their colours do, so the seam is a
 * gentle rise or fall and never a wall.
 *
 * Where the road runs over land, the ground is levelled flat across the road
 * band and eases back into the land over `ROAD_EASE` units each side, so the
 * paved surface never cuts into a slope or floats above it. The bridge decks
 * themselves are not part of the ground: over a channel the trench and the
 * water sheet are left exactly as they were.
 */
export function surfaceRadius(d: THREE.Vector3): number {
  const base = rawSurfaceRadius(d);
  const road = roadHit(d);
  if (!road || road.deck) return base;
  // Wider than the paved strip by more than one ground vertex (0.73 units),
  // so every triangle that spans the road is entirely inside the flat band
  // and cannot interpolate up through the surface.
  const inner = road.half + 0.9;
  const outer = inner + ROAD_EASE;
  if (road.dist >= outer) return base;
  let w = 1 - THREE.MathUtils.smoothstep(road.dist, inner, outer);
  // Never raise the bed or the shoreline: the channel stays a channel.
  w *= THREE.MathUtils.smoothstep(oceanField(d), 0, 0.9);
  return w > 0 ? base + (road.height - base) * w : base;
}

/** Terrain before the road levels it; the road profile is sampled from this. */
export function rawSurfaceRadius(d: THREE.Vector3): number {
  const f = oceanField(d);
  if (f < 0) {
    // Bed: deepest under the middle of the channel, so the river reads as a cut.
    const depth = Math.min(1, -f * 0.45);
    return SEA_LEVEL - 0.32 - 2.1 * depth * depth;
  }
  const blend = landBiomeBlend(d);
  const margin = blend.margin * PLANET_RADIUS;
  let h = zoneHeight(blend.primary, d, f);
  if (margin < ZONE_FADE) {
    const w = 0.5 * (1 - THREE.MathUtils.clamp(margin / ZONE_FADE, 0, 1));
    h = THREE.MathUtils.lerp(h, zoneHeight(blend.secondary, d, f), w);
  }
  const bank = THREE.MathUtils.smoothstep(f, BANK_LIP, BANK_LIP + BANK_WIDTH);
  return THREE.MathUtils.lerp(SEA_LEVEL - 0.3, PLANET_RADIUS + h, bank);
}

/** Sand on the banks of the river. */
const SAND = new THREE.Color(0xe8d3a0);

/** How far, in surface units, the bank climbs from the waterline to open ground. */
const BANK_WIDTH = 2.4;
/** The bank reaches the waterline this far outside the sheet, so no water shows through it. */
const BANK_LIP = 0.4;

const _base = { swell: 0, roll: 0 };

/** Broad ground swell and fine roll, shared by every zone, in planet units. */
function groundBase(d: THREE.Vector3): { swell: number; roll: number } {
  _base.swell = fbm3(d.x * 1.7 - 7, d.y * 1.7 + 4, d.z * 1.7 + 9, 3) * 0.75 * terrainReliefScale;
  _base.roll = fbm3(d.x * 6.5 + 3, d.y * 6.5, d.z * 6.5 - 1, 3) * 0.12 * terrainDetailScale;
  return _base;
}

const _tiltEast = new THREE.Vector3();
const _tiltNorth = new THREE.Vector3();

/**
 * Landform of one zone, as an elevation above `PLANET_RADIUS` in planet units.
 *
 * The river country is mesas around a low floodplain; the citadel climbs four
 * shallow terraces to a flat crown the city stands on; the ark is a flat dock
 * plain tilted a little across its width; the fortress is a plateau with a
 * lifted rim. Every slope here stays gentle enough to walk or drive.
 */
function zoneHeight(zone: Biome, d: THREE.Vector3, f: number): number {
  const base = groundBase(d);
  const h = 1.15 + base.swell + base.roll;
  const r = Math.acos(THREE.MathUtils.clamp(zone.center.dot(d), -1, 1)) * PLANET_RADIUS;
  if (zone.id === 'river') {
    // Flat-topped mesas, held low near the water so the canyon floor is walkable.
    const n = fbm3(d.x * 2.4 - 12, d.y * 2.4 + 6, d.z * 2.4 - 2, 3);
    const mesa = THREE.MathUtils.smoothstep(n, 0.02, 0.45);
    const plain = THREE.MathUtils.smoothstep(f, 1.5, 10);
    return h + 0.35 - 0.65 * (1 - plain) + mesa * 1.35 * plain;
  }
  if (zone.id === 'citadel') {
    // Four terraces, 0.45 units a step, rising to a level crown at the heart.
    const k = THREE.MathUtils.clamp((18 - r) / 3.6, 0, 4);
    const i = Math.floor(k);
    const step = THREE.MathUtils.smoothstep(k - i, 0.55, 1);
    return h + 0.3 + (i + step) * 0.45;
  }
  if (zone.id === 'ark') {
    tangentBasis(zone.center, 0, _tiltEast, _tiltNorth);
    const across = THREE.MathUtils.clamp(d.dot(_tiltEast) * PLANET_RADIUS, -30, 30);
    return 2.1 + (base.swell + base.roll) * 0.3 + across * 0.022;
  }
  // fortress
  const plate = 1 - THREE.MathUtils.smoothstep(r, 13, 17);
  const rim = THREE.MathUtils.smoothstep(r, 13, 15.5) * (1 - THREE.MathUtils.smoothstep(r, 15.5, 19));
  return h + 0.25 + plate * 1.4 + rim * 0.7;
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
  const deck = bridgeHeight(d);
  // Where the deck runs into rising ground the ground wins, so a walker is never
  // left standing inside the hillside.
  if (deck !== null) return Math.max(deck, surfaceRadius(d) + 0.03);
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
  // The ark's five-colour patchwork needs a tighter noise so separate patches
  // still show; every other zone uses two or three closely related tones and a
  // broad patch so the ground reads as one plate.
  const freq = b.id === 'ark' ? 7 : 2.2;
  const t = THREE.MathUtils.clamp(fbm3(d.x * freq + 21, d.y * freq - 9, d.z * freq + 3, 2) * 0.5 + 0.5, 0, 1) * (n - 1);
  const i0 = Math.min(n - 1, Math.floor(t));
  const i1 = Math.min(n - 1, i0 + 1);
  out.setHex(palette[i0]).lerp(_pal.setHex(palette[i1]), t - i0);
  const shade = 1 + THREE.MathUtils.clamp(fbm3(d.x * 3.3 - 4, d.y * 3.3 + 8, d.z * 3.3 - 6, 2), -1, 1) * 0.12;
  out.multiplyScalar(shade);
  // Sand at the waterline, fading into the land over a few units.
  if (f < 4) out.lerp(SAND, (1 - THREE.MathUtils.smoothstep(f, 0.2, 3.8)) * 0.92);
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
  let colour: THREE.Color;
  if (margin < ZONE_FADE) {
    zoneGround(blend.primary, d, f, out);
    zoneGround(blend.secondary, d, f, _pal);
    colour = out.lerp(_pal, 0.5 * (1 - THREE.MathUtils.clamp(margin / ZONE_FADE, 0, 1)));
  } else {
    colour = zoneGround(blend.primary, d, f, out);
  }
  // The shelf just under the waterline is shaded like the bed, so the sheet
  // reads as lying in the cut rather than on top of the ground.
  if (f < 1.6) colour.lerp(_pal.setHex(OCEAN.ground[0]), 1 - THREE.MathUtils.smoothstep(f, 0.2, 1.6));
  return colour;
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

  // Machined metal, not painted ground. High metalness with a low roughness
  // turns the flat plains into the mirror-wet sheet the reference asks for:
  // what the player sees is mostly the sky environment, tinted by the zone's
  // own vertex colours. The circuit etch is the faint seam pattern on top.
  const mat = withCircuitEtch(
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.42,
      metalness: 0.82,
      envMapIntensity: 1.05
    }),
    { strength: 0.055, scale: 0.9, color: 0x63d8f0 }
  );
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'ground';
  // The paving rides with the ground rather than the props: the props mesh
  // casts shadows, and a surface a few centimetres up would throw a ragged
  // shadow along its own edges.
  const road = roadSurfaceMesh();
  if (road) {
    // The paving is the same metal family as the plain it cuts through, just a
    // touch rougher, so it catches the horizon band without reading as glass.
    const roadMat = road.material as THREE.MeshStandardMaterial;
    roadMat.roughness = 0.44;
    roadMat.metalness = 0.7;
    roadMat.envMapIntensity = 0.9;
    roadMat.needsUpdate = true;
    mesh.add(road);
  }
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
 * The energy river: a ribbon of light laid in the trench the channels cut, one
 * strip per channel plus a disc for each pool. The sheet is shaded as flowing
 * light: two crossed band fields sweep along it, the banks pull the colour
 * toward white hot, and grazing angles glow. Depth comes from `aShore`, baked
 * at build time because the channel bed lives in noise the GPU cannot sample.
 *
 * `uTime` is driven every frame by the Game through `mesh.userData.uniforms`.
 */
export function buildWater(): THREE.Mesh {
  // The channels are laid out lazily; touching the field once makes sure the
  // ribbons are built from the same river the terrain was shaped around.
  oceanField(new THREE.Vector3(0, 1, 0));

  const positions: number[] = [];
  const shore: number[] = [];
  const index: number[] = [];
  const p = new THREE.Vector3();
  const prev = new THREE.Vector3();
  const next = new THREE.Vector3();
  const tan = new THREE.Vector3();
  const side = new THREE.Vector3();
  const dirV = new THREE.Vector3();

  /** One vertex of the sheet at `off` units sideways from the channel line. */
  const vertex = (r: THREE.Vector3, sin: number, cos: number, off: number): void => {
    const ang = off / PLANET_RADIUS;
    dirV.copy(r).multiplyScalar(cos).addScaledVector(side, sin).normalize();
    positions.push(dirV.x * SEA_LEVEL, dirV.y * SEA_LEVEL, dirV.z * SEA_LEVEL);
    const depth = SEA_LEVEL - surfaceRadius(dirV);
    shore.push(1 - THREE.MathUtils.clamp(depth / SHALLOW, 0, 1));
  };

  for (const river of RIVERS) {
    const rows = river.points.length;
    const start = positions.length / 3;
    if (rows === 1) {
      // A pool: a fan of triangles round one point, wide as its radius.
      const centre = river.points[0];
      const half = river.half[0];
      const seg = 28;
      const radial = new THREE.Vector3();
      side.crossVectors(centre, new THREE.Vector3(0, 1, 0));
      if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
      side.normalize();
      radial.crossVectors(side, centre).normalize();
      vertex(centre, 0, 1, 0);
      for (let k = 0; k < seg; k++) {
        const a = (k / seg) * Math.PI * 2;
        const n = Math.sin(a);
        const c = Math.cos(a);
        const ang = half / PLANET_RADIUS;
        dirV.copy(centre).multiplyScalar(Math.cos(ang))
          .addScaledVector(side, Math.sin(ang) * c)
          .addScaledVector(radial, Math.sin(ang) * n)
          .normalize();
        positions.push(dirV.x * SEA_LEVEL, dirV.y * SEA_LEVEL, dirV.z * SEA_LEVEL);
        const depth = SEA_LEVEL - surfaceRadius(dirV);
        shore.push(1 - THREE.MathUtils.clamp(depth / SHALLOW, 0, 1));
      }
      for (let k = 0; k < seg; k++) {
        const a = start + 1 + k;
        const b = start + 1 + ((k + 1) % seg);
        index.push(start, b, a);
      }
      continue;
    }
    for (let i = 0; i < rows; i++) {
      p.copy(river.points[i]);
      prev.copy(river.points[Math.max(0, i - 1)]);
      next.copy(river.points[Math.min(rows - 1, i + 1)]);
      tan.subVectors(next, prev);
      tan.addScaledVector(p, -tan.dot(p));
      if (tan.lengthSq() < 1e-10) tan.crossVectors(p, new THREE.Vector3(0, 1, 0));
      tan.normalize();
      side.crossVectors(p, tan).normalize();
      const half = river.half[i];
      for (let j = -1; j <= 1; j++) {
        const off = j * half;
        const ang = Math.abs(off) / PLANET_RADIUS;
        vertex(p, Math.sin(ang) * Math.sign(off), Math.cos(ang), off);
      }
    }
    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < 2; j++) {
        const a = start + i * 3 + j;
        const b = a + 1;
        const c = a + 3;
        const d = c + 1;
        // (a, c, b) winds the outward way: +tangent cross +side is +up.
        index.push(a, c, b, b, c, d);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('aShore', new THREE.Float32BufferAttribute(shore, 1));
  geo.setIndex(index);

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

// The road network samples the raw terrain, the water field and the zone
// centres through this registration; `layoutBiomes` invalidates it whenever
// the continents move, so a new seed gets a road fitted to its own planet.
configureRoadSource({
  centres: BIOMES.map((b) => b.center),
  accents: BIOMES.map((b) => b.accent),
  baseRadius: rawSurfaceRadius,
  water: oceanField,
  bridges: BRIDGES
});
