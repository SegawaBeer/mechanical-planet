import * as THREE from 'three';
import { Input } from './input';
import { Ambience } from './audio';
import { biomeAt, biomeById, isOcean, layoutBiomes, type BiomeId } from './biomes';
import { setNoiseSeed } from './noise';
import { hashSeed } from './seed';
import {
  PLANET_RADIUS,
  surfaceNormal,
  buildGround,
  buildStars,
  buildWater,
  configurePlanet,
  tangentBasis,
  walkRadius,
  offsetDir
} from './planet';
import { GLOBE_ATMOSPHERE, NIGHT, ZONE_ATMOSPHERE, type Atmosphere, type ZoneAtmosphereId } from './night';
import { SkyEnvironment } from './look';
import { LightPool, emitter, type Emitter } from './lights';
import { buildWorldProps, type Dynamic } from './props';
import { Critter, Hearts } from './critters';
import { Clouds } from './clouds';
import { Skyline } from './skyline';
import { buildRobotDeer } from './wildlife';
import { Aurora, SkyAurora } from './aurora';
import { Constellations, Meteors, Moon, Sun } from './sky';
import { patchSurface, type SurfaceFx } from './surfaceFx';
import { ColliderGrid, nearBridge } from './collision';
import { WONDERS, wonderAction, wonderDir, type Wonder } from './wonders';
import { loadFound, saveFound } from './progress';
import { Weather, weatherFor } from './weather';
import type { BiomeCaption } from './store';
import { Shards } from './shards';
import { Fireworks } from './fireworks';
import { Protagonist, type Form } from './robots/protagonist';
import { TransformBurst } from './robots/burst';
import { Crowd } from './robots/crowd';
import type { SchemeId } from './robots/scheme';
import { equip, updateShadowBudget } from './models';
import { controlState } from './ui/control';
import {
  JOURNAL_BIOMES,
  biomeJournalKey,
  speciesFor,
  loadJournal,
  loadShards,
  milestoneById,
  saveJournal,
  saveShards,
  type Journal,
  type Milestone,
  type MilestoneId
} from './journal';
import { EARTH_SEED, planetProfile, type PlanetProfile } from './space';

/** Interaction card. `kicker` overrides the wonder wording, for example for the boat. */
export type Prompt = { id: string; action: string; found: boolean; kicker?: string };

export type GameOptions = {
  /** World seed label. Defaults to Earth. */
  seed?: string;
  /** Number of outward jumps made from Earth. */
  depth?: number;
};

export type GameCallbacks = {
  onBiome: (b: BiomeCaption | null) => void;
  onPrompt: (p: Prompt | null) => void;
  onFound: (ids: string[]) => void;
  onOpenWonder: (w: Wonder) => void;
  onGlobe: (globe: boolean) => void;
  onIntroEnd: () => void;
  onHelp: () => void;
  onEscape: () => void;
  /** Photo mode entered or left; the page hides the HUD while it is on. */
  onPhoto: (photo: boolean) => void;
  /** The journal changed: a new biome, species, milestone, or a stat tick. */
  onJournal: (j: Journal) => void;
  /** Starlight shards collected on this planet. */
  onShards: (found: number, total: number) => void;
  /** A milestone was just earned. */
  onMilestone: (m: Milestone) => void;
  /** The player asked for the journal. */
  onJournalOpen: () => void;
};

// Tank-style driving: forward/back along the machine's own heading, left/right
// turning it. The robot walks and the vehicle rolls; each has its own speed
// rules, so these constants come in pairs.
const WALK_SPEED = 4.6;
const RUN_SPEED = 8.2;
/** Robot form turns on the spot. */
const ROBOT_TURN = 2.6;
/** Vehicle cruise, boost, and how much of the cruise it keeps in reverse. */
const VEH_SPEED = 12;
const VEH_BOOST = 17.5;
const VEH_REVERSE = 0.35;
/** Per-second approaches to the target speed: throttle up fast, coast down slow. */
const VEH_ACCEL = 1.7;
const VEH_COAST = 0.42;
/** Vehicle yaw rate at walking pace; it eases off with speed so turns swing wide. */
const VEH_TURN = 1.6;
const GRAVITY = 24;
const HOP_VELOCITY = 7.5;
const INTERACT_RANGE = 3.6;
/** How close the player has to be to pet an animal, in surface units. */
const PET_RANGE = 2.8;
/** Collision radii, in surface units, matched to the models rather than to the
 * old blocky explorer: the humanoid is about 1.4 wide at the shoulders and the
 * vehicle about 1.2 wide and 2.4 long. */
const PLAYER_RADIUS = 0.7;
const VEHICLE_RADIUS = 0.6;
/** How far the nose and tail sample sits from the vehicle's centre. */
const VEHICLE_HALF = 0.8;
/** Push-out radius for other machines and animals sharing the ground. */
const ACTOR_RADIUS = 0.8;
const ANIMAL_RADIUS = 0.6;
/** Length of the transform effect, in seconds; the model swaps halfway. */
const TRANSFORM_TIME = 1;
/** Nose-to-tail length of the vehicle form, for sampling the ground under it. */
const VEHICLE_LENGTH = 2.2;
/** Journal stats are written to storage this often, in seconds, not every step. */
const JOURNAL_FLUSH = 4;
const CAM_MIN = 5;
const CAM_MAX = 28;
const GLOBE_MARGIN = 10;

/** Critter species are stored under English keys; show Chinese. */
const CRITTER_LABEL: Record<string, string> = { 'robot deer': '机械鹿' };
const critterLabel = (name: string): string => CRITTER_LABEL[name] ?? name;

const _e = new THREE.Euler();

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _v4 = new THREE.Vector3();
// Light-space axes, used to quantise the shadow camera; see `snapShadowFocus`.
const _lx = new THREE.Vector3();
const _ly = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _up = new THREE.Vector3();
const _walkFwd = new THREE.Vector3();
const _walkRight = new THREE.Vector3();
const _sample = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _size = new THREE.Vector2();

type Gem = {
  wonder: Wonder;
  dir: THREE.Vector3;
  mesh: THREE.Mesh;
  ring: THREE.Mesh;
  frameQ: THREE.Quaternion;
  base: THREE.Vector3;
  up: THREE.Vector3;
  /** The marker's own light, followed along as it bobs. */
  light: Emitter;
};

/** One machine the player may drive, and where it stands while idle. */
type Crew = {
  rig: Protagonist;
  id: SchemeId;
  /** Unit direction on the sphere: where the machine is standing. */
  dir: THREE.Vector3;
  /** Tangent forward direction: which way it is facing. */
  heading: THREE.Vector3;
};

const CREW_NAMES: Record<'river' | 'citadel' | 'ark' | 'fortress', string> = {
  river: '河道巡逻者',
  citadel: '铁堡守卫',
  ark: '方舟工程师',
  fortress: '要塞斥候'
};

export class Game {
  readonly input: Input;
  readonly audio = new Ambience();
  /** Label of the seed this world was generated from. */
  readonly seed: string;
  found: string[];
  /** The traveller's journal, shared across every planet. */
  journal: Journal;
  /** Procedural identity and visual traits of the current planet. */
  readonly profile: PlanetProfile;
  /** Number of outward jumps made from Earth. */
  readonly depth: number;

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  /** Eased lighting; `atmoTarget` is where it is heading. */
  private atmoNow = {
    sky: new THREE.Color(),
    fog: new THREE.Color(),
    fogDensity: 0,
    hemiSky: new THREE.Color(),
    hemiGround: new THREE.Color(),
    hemiIntensity: 0,
    key: new THREE.Color(),
    keyIntensity: 0,
    keyHeight: 0.42,
    exposure: 1,
    stars: 1
  };
  private atmoTarget: Atmosphere = ZONE_ATMOSPHERE.river;
  private zoneAtmo: ZoneAtmosphereId = 'river';
  private fog: THREE.FogExp2;
  private camera: THREE.PerspectiveCamera;
  /** Key light. Pale moonlight, kept camera-relative; see `updateCamera`. */
  private moonLight: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private ground: THREE.Mesh;
  private water: THREE.Mesh;
  private stars: THREE.Points;
  private constellations: Constellations;
  private meteors: Meteors;
  private moon: Moon;
  /** The oversized pale sun of the sky three-piece set; scenery, not the key light. */
  private sun: Sun;
  /** Pre-filtered sky environment, rebuilt once per zone change. */
  private env: SkyEnvironment;
  /** Point lights lent to whichever light sources are nearest the player. */
  private lights = new LightPool(8);
  private glowMat: THREE.MeshBasicMaterial | null = null;
  private raycaster = new THREE.Raycaster();
  private callbacks: GameCallbacks;
  private canvas: HTMLCanvasElement;

  // Player: a unit direction on the sphere plus a tangent heading. The heading
  // is the machine's own front, and every input is relative to it.
  private dir = new THREE.Vector3();
  private heading = new THREE.Vector3();
  private player: Protagonist;
  /** Every machine the player can take over; the protagonist is first. */
  private crews: Crew[] = [];
  private activeCrew: Crew | null = null;
  private readonly ndc = new THREE.Vector2();
  /** Shared state object for machines standing idle. */
  private idleState = { speed: 0, speed01: 0, airborne: false, steer: 0, time: 0 };
  /** Patrolling and duelling machines that fill the zones; never controllable. */
  private crowd: Crowd;
  /** Smoothed up axis of whatever is being driven; see `placeRig`. */
  private rigUp = new THREE.Vector3(0, 1, 0);
  private rigUpReady = false;
  private burst = new TransformBurst();
  private hopH = 0;
  private hopV = 0;
  private airborne = false;
  /** Signed ground speed along the heading; negative is reversing. */
  private moveSpeed = 0;
  /** Steering input this frame, kept so the vehicle can roll into the turn. */
  private steer = 0;
  /** Seconds left of the transform effect; zero when idle. */
  private transformTime = 0;
  private transformSwapped = false;
  /** Camera shake amplitude left over from a transform, decays to zero. */
  private shake = 0;
  /** Seconds before the camera starts swinging back behind the heading. */
  private orbitHold = 0;
  private colliders: ColliderGrid;

  // Camera: a tangent "forward" carried along with the player, pitch, distance.
  private camForward = new THREE.Vector3();
  private camPitch = 0.92;
  private camDist = 15;
  private camPos = new THREE.Vector3();
  private camLook = new THREE.Vector3();
  private camUp = new THREE.Vector3(0, 1, 0);
  private globe = true;
  private intro = true;
  private globeYaw = 0;
  private globePitch = 0.35;
  private globeZoom = 1;
  private transition = 0;
  private dragThisFrame = false;

  // Scenery that moves.
  private dynamics: Dynamic[] = [];
  private critters: Critter[] = [];
  private hearts = new Hearts();
  private clouds: Clouds;
  private skyline: Skyline;
  private aurora: Aurora;
  private skyAurora: SkyAurora;
  private weather = new Weather();
  /** Snow settling and wet ground on the lit materials. */
  private fx: SurfaceFx;
  private gems: Gem[] = [];
  private shards: Shards;
  private fireworks = new Fireworks();
  /** The animal currently tagging along, if any. */
  private companion: Critter | null = null;
  /** True while the current shooting star has already been counted. */
  private meteorSeen = false;
  /** Seconds until the journal's running stats are next saved. */
  private journalFlush = JOURNAL_FLUSH;
  private journalDirty = false;

  private promptId: string | null = null;
  private biomeId: string | null = null;
  private biomeTimer = 0;
  private overlayOpen = false;
  private photo = false;
  private raf = 0;
  private last = 0;
  private time = 0;
  private disposed = false;
  private handlePageHide = () => this.persistJournalOnExit();

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks, options: GameOptions = {}) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.journal = loadJournal();

    // Seed every generator before anything reads terrain, biome, or progress state.
    this.seed = options.seed ?? EARTH_SEED;
    this.depth = this.seed === EARTH_SEED ? 0 : Math.max(1, Math.floor(options.depth ?? 1));
    this.found = loadFound(this.seed);
    this.profile = planetProfile(this.seed);
    if (!this.journal.planets.includes(this.seed)) {
      this.journal.planets = [...this.journal.planets, this.seed];
      this.journalDirty = true;
    }
    const seed = hashSeed(this.seed);
    configurePlanet(this.profile);
    setNoiseSeed(seed);
    layoutBiomes(seed);
    this.clouds = new Clouds(seed, this.profile);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.scene.background = new THREE.Color(this.profile.sky);

    // Metals need a sky to reflect. `look.ts` paints the zone's own sky into an
    // equirectangular canvas and pre-filters it once; the map is replaced when
    // the atmosphere changes, never per frame.
    this.env = new SkyEnvironment(this.renderer);
    this.env.request('river', performance.now(), true);
    this.scene.environment = this.env.texture;
    this.scene.environmentIntensity = 1;

    this.fog = new THREE.FogExp2(0x9fd8ea, 0);
    this.scene.fog = this.fog;

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1400);

    this.hemi = new THREE.HemisphereLight(NIGHT.hemiSky, NIGHT.hemiGround, NIGHT.hemiIntensity);
    this.scene.add(this.hemi);
    this.moonLight = new THREE.DirectionalLight(NIGHT.moon, NIGHT.moonIntensity);
    this.moonLight.castShadow = true;
    this.moonLight.shadow.mapSize.set(2048, 2048);
    this.moonLight.shadow.camera.near = 1;
    this.moonLight.shadow.camera.far = 320;
    this.moonLight.shadow.bias = -0.0005;
    // `setShadowBounds` sets `normalBias` too: it depends on the texel size,
    // which changes between walking and globe view.
    this.setShadowBounds(PLANET_RADIUS + 14);
    this.scene.add(this.moonLight, this.moonLight.target, this.lights.group);

    this.ground = buildGround();
    this.water = buildWater();
    this.stars = buildStars(seed);
    this.constellations = new Constellations(seed);
    this.meteors = new Meteors(seed);
    this.moon = new Moon(seed);
    this.sun = new Sun(seed);
    this.scene.add(this.ground, this.water, this.stars, this.constellations.group, this.meteors.group);
    this.scene.add(this.moon.group, this.sun.group);

    const props = buildWorldProps(seed);
    if (props.solid) this.scene.add(props.solid);
    if (props.glow) {
      this.scene.add(props.glow);
      this.glowMat = props.glow.material as THREE.MeshBasicMaterial;
    }
    if (props.night) this.scene.add(props.night);
    for (const e of props.lights) this.lights.add(e);
    this.colliders = new ColliderGrid(props.colliders);
    const fire = wonderDir(WONDERS[0]);
    this.shards = new Shards(seed, this.colliders, this.lights, loadShards(this.seed));
    this.scene.add(this.shards.group, this.fireworks.group);
    this.fireworks.onBurst = () => this.audio.pop();
    // Snow and rain land on the ground and the props through the same patch.
    this.fx = patchSurface([this.ground.material as THREE.Material, ...(props.solid ? [props.solid.material as THREE.Material] : [])], NIGHT.rim);

    // Moving scenery the zone modules built.
    this.dynamics = props.dynamics;
    for (const d of this.dynamics) this.scene.add(d.object);

    // Wonder markers.
    for (const w of WONDERS) {
      const frame = props.wonderFrames.get(w.id)!;
      const found = this.found.includes(w.id);
      const gemMat = new THREE.MeshStandardMaterial({
        color: found ? 0xffd166 : 0x9fe8ff,
        emissive: found ? 0xffb703 : 0x5fd3ff,
        emissiveIntensity: 0.9,
        roughness: 0.3,
        flatShading: true
      });
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), gemMat);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.05, 1.28, 28),
        new THREE.MeshBasicMaterial({ color: found ? 0xffd166 : 0xbdf0ff, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
      );
      ring.matrixAutoUpdate = false;
      ring.matrix.copy(frame).multiply(_m.makeTranslation(0, 0.08, 0)).multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      const up = new THREE.Vector3().setFromMatrixColumn(frame, 1).normalize();
      const base = new THREE.Vector3().setFromMatrixPosition(frame);
      const frameQ = new THREE.Quaternion().setFromRotationMatrix(frame);
      this.scene.add(mesh, ring);
      const light = this.lights.add(
        emitter(mesh.position, found ? 0xffb703 : 0x5fd3ff, 15, 9, { flicker: 0.35, phase: this.gems.length * 1.7 })
      );
      this.gems.push({ wonder: w, dir: wonderDir(w), mesh, ring, frameQ, base, up, light });
    }

    // Critters.
    const spawn = (
      model: THREE.Group,
      name: string,
      biome: Exclude<BiomeId, 'ocean'>,
      e: number,
      n: number,
      roam: number,
      speed: number,
      seed: number
    ) => {
      const home = offsetDir(biomeById(biome).center.clone(), e, n);
      // The river zone is mostly sea now; step an animal back toward its zone
      // centre until it is standing on the island.
      for (let i = 0; i < 10 && isOcean(home); i++) offsetDir(home, -e * 0.14, -n * 0.14);
      const c = new Critter(model, `${name.replace(' ', '-')}-${seed}`, name, home, roam, speed, seed, this.colliders);
      c.group.traverse((o) => {
        if (o instanceof THREE.Mesh) o.castShadow = true;
      });
      this.critters.push(c);
      this.scene.add(c.group);
    };
    // Wildlife: roams and can be patted, but cannot be controlled.
    spawn(buildRobotDeer(), 'robot deer', 'river', 6, 3, 6, 1.8, 1);
    spawn(buildRobotDeer(), 'robot deer', 'river', -5, -4, 6, 1.7, 2);
    spawn(buildRobotDeer(), 'robot deer', 'citadel', 7, -5, 6, 1.6, 3);
    spawn(buildRobotDeer(), 'robot deer', 'river', 9, -8, 6, 1.7, 4);
    spawn(buildRobotDeer(), 'robot deer', 'citadel', -9, 6, 6, 1.5, 5);
    spawn(buildRobotDeer(), 'robot deer', 'ark', 3, 7, 6, 1.6, 6);
    spawn(buildRobotDeer(), 'robot deer', 'ark', -6, -6, 6, 1.7, 7);
    spawn(buildRobotDeer(), 'robot deer', 'fortress', 7, 4, 6, 1.5, 8);

    this.skyline = new Skyline(seed);
    this.scene.add(this.clouds.group, this.skyline.group, this.weather.group, this.hearts.group);
    this.aurora = new Aurora(biomeById('river').center, PLANET_RADIUS);
    this.skyAurora = new SkyAurora(seed);
    this.scene.add(this.aurora.group, this.skyAurora.group);

    // Player starts a few steps from the campfire, facing it.
    this.dir.copy(fire);
    offsetDir(this.dir, 1.4, -3.6);
    // Some seeds put that spot in the sea; step back toward the fire until it is dry land.
    for (let i = 0; i < 12 && isOcean(this.dir); i++) offsetDir(this.dir, -0.14, 0.36);
    this.colliders.resolve(this.dir, PLAYER_RADIUS);
    this.heading.copy(fire).addScaledVector(this.dir, -fire.dot(this.dir)).normalize();
    this.camForward.copy(this.heading);
    this.player = new Protagonist('hero', '主角');
    this.activeCrew = { rig: this.player, id: 'hero', dir: this.dir.clone(), heading: this.heading.clone() };
    this.crews.push(this.activeCrew);

    // One machine per zone, standing a few steps off its beacon and facing it.
    for (const id of ['river', 'citadel', 'ark', 'fortress'] as const) {
      const rig = new Protagonist(id, CREW_NAMES[id]);
      const centre = biomeById(id).center;
      const d = offsetDir(centre.clone(), 4, -4);
      this.colliders.resolve(d, PLAYER_RADIUS);
      const facing = centre.clone().addScaledVector(d, -centre.dot(d));
      if (facing.lengthSq() < 1e-8) tangentBasis(d, 0, _v1, facing);
      facing.normalize();
      this.placeRig(rig.root, d, facing);
      this.crews.push({ rig, id, dir: d, heading: facing });
    }
    for (const crew of this.crews) {
      crew.rig.root.traverse((o) => {
        if (o instanceof THREE.Mesh) o.castShadow = true;
      });
      // The picking sphere is invisible and must not drop a shadow.
      crew.rig.hit.castShadow = false;
      this.scene.add(crew.rig.root);
    }
    this.crowd = new Crowd(this.colliders);
    this.scene.add(this.crowd.group, this.burst.group);
    this.rigUpReady = false;
    this.placePlayer();
    this.publishControl();

    // Real GLB models stream in behind the code-built machines. A role without
    // a model, or a file that fails, keeps its built-in form.
    for (const crew of this.crews) {
      void equip(crew.rig, crew.id)
        .then(() => {
          if (this.disposed) return;
          if (crew.rig === this.player) this.placePlayer();
        })
        .catch(() => {});
    }

    // Globe view first: the camera hangs above the player's hemisphere.
    this.globePitch = Math.asin(THREE.MathUtils.clamp(this.dir.y, -0.9, 0.9)) + 0.25;
    this.globeYaw = Math.atan2(this.dir.x, this.dir.z);
    this.resize();
    this.camPos.copy(this.globeDirection()).multiplyScalar(this.globeDistance());
    this.camLook.set(0, 0, 0);

    this.input = new Input(canvas);
    this.input.onFirstGesture(() => this.exitIntro());
    window.addEventListener('pagehide', this.handlePageHide);
    this.applyAtmosphere(0, true);

    this.resize();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  // ---------------------------------------------------------------- public

  /** Dev aid: jump the player to a zone, `east`/`north` surface units from its centre, facing the centre. */
  debugTeleport(id: BiomeId, east = 0, north = -6): void {
    const c = biomeById(id).center;
    this.dir.copy(c);
    offsetDir(this.dir, east, north);
    this.colliders.resolve(this.dir, PLAYER_RADIUS);
    _v1.copy(c).addScaledVector(this.dir, -c.dot(this.dir));
    if (_v1.lengthSq() < 1e-8) tangentBasis(this.dir, 0, _v2, _v1);
    this.heading.copy(_v1).normalize();
    this.camForward.copy(this.heading);
    this.exitIntro();
    if (this.globe) this.setGlobe(false);
    this.moveSpeed = 0;
    this.placePlayer();
  }

  /** Dev aid: which animals and crowd machines are on or beside a bridge. */
  debugOnBridge(): { deer: string[]; crowd: number } {
    return {
      deer: this.critters.filter((c) => nearBridge(c.dir)).map((c) => c.id),
      crowd: this.crowd.onBridge()
    };
  }

  setOverlayOpen(open: boolean): void {
    this.overlayOpen = open;
    this.input.enabled = !open;
    if (open) {
      this.canvas.style.cursor = '';
      this.input.touchMove.x = 0;
      this.input.touchMove.y = 0;
      this.input.touchRun = false;
    }
  }

  toggleGlobe(): void {
    if (this.intro) this.exitIntro();
    else this.setGlobe(!this.globe);
  }

  /** Starlight shards collected on this planet, and how many it holds. */
  get shardProgress(): { found: number; total: number } {
    return { found: this.shards.foundCount, total: this.shards.total };
  }

  toggleMute(): boolean {
    this.audio.start();
    return this.audio.toggle();
  }

  startAudio(): void {
    this.audio.start();
  }

  /** True while photo mode hides the HUD, the click marker, and prompts. */
  get photoMode(): boolean {
    return this.photo;
  }

  togglePhoto(): void {
    this.setPhoto(!this.photo);
  }

  setPhoto(on: boolean): void {
    if (this.photo === on) return;
    this.photo = on;
    this.exitIntro();
    this.callbacks.onPhoto(on);
  }

  /**
   * Capture the current view as a PNG. Renders a frame and reads the canvas in
   * the same tick, because the drawing buffer is not preserved between frames.
   */
  snapshot(): Promise<Blob | null> {
    this.renderer.render(this.scene, this.camera);
    return new Promise((resolve) => this.canvas.toBlob((blob) => resolve(blob), 'image/png'));
  }

  dispose(): void {
    window.removeEventListener('pagehide', this.handlePageHide);
    this.persistJournalOnExit();
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.input.dispose();
    this.audio.dispose();
    this.burst.dispose();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) m.dispose();
      }
    });
    this.renderer.dispose();
    this.env.dispose();
  }

  // ---------------------------------------------------------------- loop

  private frame = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    // Clamp below as well: a frame stepped from the console can run ahead of the clock.
    const dt = THREE.MathUtils.clamp((now - this.last) / 1000, 0, 0.05);
    this.last = now;
    this.time += dt;
    this.resize();
    this.handleInput(dt);
    this.updatePlayer(dt);
    this.updateCamera(dt);
    this.updateWorld(dt);
    this.updatePrompt();
    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w === 0 || h === 0) return;
    const size = this.renderer.getSize(_size);
    if (size.x !== w || size.y !== h) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  private exitIntro(): void {
    if (!this.intro) return;
    this.intro = false;
    // The first gesture is also the first chance to start the soundtrack.
    this.audio.start();
    this.callbacks.onIntroEnd();
    this.setGlobe(false);
  }

  private setGlobe(on: boolean): void {
    if (this.globe === on) return;
    this.globe = on;
    this.transition = 1.6;
    if (on) {
      // Start the orbit from wherever the camera is so the pull-back is smooth.
      const d = _v1.copy(this.camPos).normalize();
      this.globePitch = Math.asin(THREE.MathUtils.clamp(d.y, -0.95, 0.95));
      this.globeYaw = Math.atan2(d.x, d.z);
    }
    this.setShadowBounds(on ? PLANET_RADIUS + 14 : 30);
    this.updateAtmosphereTarget();
    this.canvas.style.cursor = '';
    this.callbacks.onGlobe(on);
  }

  private setShadowBounds(extent: number): void {
    const shadow = this.moonLight.shadow;
    const cam = shadow.camera;
    cam.left = -extent;
    cam.right = extent;
    cam.top = extent;
    cam.bottom = -extent;
    cam.updateProjectionMatrix();
    // Globe view spreads the same shadow map over the whole planet, so a texel
    // there covers roughly twice the ground it does while walking. Offsetting
    // the lookup by one texel's worth along the normal is what keeps a
    // flat-shaded slope from shadowing itself into serrated black edges; tying
    // it to the texel size keeps both views equally clean.
    shadow.normalBias = this.shadowTexel();
  }

  /** Ground covered by one shadow-map texel, in world units. */
  private shadowTexel(): number {
    const shadow = this.moonLight.shadow;
    return (shadow.camera.right * 2) / shadow.mapSize.x;
  }

  /**
   * Quantise the shadow camera's focus to its own texel grid. The camera
   * follows the player, so without this the map re-rasterises at a slightly
   * different sub-texel offset every frame and every shadow edge in the world
   * crawls and shimmers as you walk.
   */
  private snapShadowFocus(focus: THREE.Vector3, lightDir: THREE.Vector3): void {
    const texel = this.shadowTexel();
    // `LightShadow` points the shadow camera from the light back at the target,
    // so its local axes follow from `lightDir` and the camera's own up vector.
    const up = this.moonLight.shadow.camera.up;
    _lx.crossVectors(up, lightDir);
    if (_lx.lengthSq() < 1e-6) _lx.set(1, 0, 0); // light straight along `up`
    _lx.normalize();
    _ly.crossVectors(lightDir, _lx).normalize();
    const x = focus.dot(_lx);
    const y = focus.dot(_ly);
    focus.addScaledVector(_lx, Math.round(x / texel) * texel - x);
    focus.addScaledVector(_ly, Math.round(y / texel) * texel - y);
  }

  /** Camera distance at which the whole planet fits the viewport, in either orientation. */
  private globeDistance(): number {
    const vfov = THREE.MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    const half = Math.min(vfov, hfov) / 2;
    return ((PLANET_RADIUS + GLOBE_MARGIN) / Math.sin(half)) * this.globeZoom;
  }

  private globeDirection(): THREE.Vector3 {
    const cp = Math.cos(this.globePitch);
    return _v2.set(cp * Math.sin(this.globeYaw), Math.sin(this.globePitch), cp * Math.cos(this.globeYaw));
  }

  // ---------------------------------------------------------------- input

  private handleInput(dt: number): void {
    const input = this.input;
    if (input.consumeEscape()) this.callbacks.onEscape();
    if (input.consumeHelp()) this.callbacks.onHelp();
    if (input.consumePhoto() && !this.overlayOpen) this.togglePhoto();
    if (input.consumeJournal()) this.callbacks.onJournalOpen();

    const globe = input.consumeGlobe();
    const orbit = input.consumeOrbit();
    const zoom = input.consumeZoom();
    const click = input.consumeClick();
    const hop = input.consumeHop();
    const interact = input.consumeInteract();
    const transform = input.consumeTransform();
    this.dragThisFrame = orbit.dx !== 0 || orbit.dy !== 0;
    if (this.dragThisFrame) this.orbitHold = 1.2;

    if (globe && !this.overlayOpen) this.toggleGlobe();
    if (this.globe) {
      this.globeYaw -= orbit.dx * 0.006;
      this.globePitch = THREE.MathUtils.clamp(this.globePitch + orbit.dy * 0.005, -1.2, 1.2);
    } else {
      if (orbit.dx !== 0) {
        _q.setFromAxisAngle(this.dir, -orbit.dx * 0.006);
        this.camForward.applyQuaternion(_q);
      }
      this.camPitch = THREE.MathUtils.clamp(this.camPitch + orbit.dy * 0.005, 0.22, 1.35);
    }

    if (zoom !== 0) {
      if (this.globe) this.globeZoom = THREE.MathUtils.clamp(this.globeZoom * Math.exp(zoom * 0.1), 0.65, 1.7);
      else this.camDist = THREE.MathUtils.clamp(this.camDist * Math.exp(zoom * 0.12), CAM_MIN, CAM_MAX);
    }

    // Clicking a machine takes it over; a click on the ground does nothing.
    if (click && !this.overlayOpen && !this.globe) this.pickCrew(click);
    if (input.takeHoverChange()) this.updatePickCursor();

    if (transform && !this.overlayOpen) {
      if (this.globe) this.setGlobe(false);
      this.startTransform();
    }

    // Tab hands control back to the protagonist, wherever it was left standing.
    if (input.consumeHeroReturn() && !this.overlayOpen && !this.globe) {
      const hero = this.crews[0];
      if (hero) this.takeControl(hero);
    }

    if (hop && !this.overlayOpen && this.player.form === 'robot') {
      this.audio.start();
      if (this.globe) this.setGlobe(false);
      if (!this.airborne) {
        this.hopV = HOP_VELOCITY;
        this.airborne = true;
        this.audio.hop();
        this.journal.hops += 1;
        this.journalDirty = true;
        if (this.journal.hops >= 100) this.award('grasshopper');
      }
    }

    if (interact && !this.overlayOpen && !this.globe) {
      const gem = this.nearestGem();
      const pal = gem ? null : this.nearestCritter();
      if (gem) this.findWonder(gem);
      else if (pal) this.petCritter(pal);
    }

    if (this.globe && !this.intro && (input.moveX !== 0 || input.moveY !== 0)) this.setGlobe(false);
    void dt;
  }

  // ---------------------------------------------------------------- player

  private updatePlayer(dt: number): void {
    this.updateDrive(dt);
    if (!this.globe && this.pushOutOfActors(this.dir)) {
      // Being shoved off a walker or an animal kills the momentum.
      this.moveSpeed *= 0.5;
      // Being shoved must not shove us into a wall: settle the body again.
      this.resolveBody(this.dir, this.heading, this.player.form === 'vehicle');
      this.heading.addScaledVector(this.dir, -this.heading.dot(this.dir)).normalize();
      this.camForward.addScaledVector(this.dir, -this.camForward.dot(this.dir)).normalize();
    }

    if (this.transformTime > 0) {
      this.transformTime = Math.max(0, this.transformTime - dt);
      if (!this.transformSwapped && this.transformTime <= TRANSFORM_TIME / 2) {
        this.transformSwapped = true;
        this.swapForm();
      }
    }
    this.burst.update(dt);

    if (this.airborne) {
      this.hopH += this.hopV * dt;
      this.hopV -= GRAVITY * dt;
      if (this.hopH <= 0) {
        this.hopH = 0;
        this.hopV = 0;
        this.airborne = false;
      }
    }

    const vehicle = this.player.form === 'vehicle';
    const speed01 = Math.min(1, Math.abs(this.moveSpeed) / (vehicle ? VEH_SPEED : RUN_SPEED));
    this.player.update(dt, {
      speed: this.moveSpeed,
      speed01,
      airborne: this.airborne,
      steer: this.steer,
      time: this.time
    });
    // One footstep per foot landing, so the sound lands with the boot.
    if (this.player.footStrike && !this.airborne) this.audio.step(speed01 > 0.75);
    this.placePlayer(dt);
    this.updateBiome(dt);
    if (Math.abs(this.moveSpeed) > 0.2) this.pickUpShard();
  }

  /**
   * Throttle and steer along the machine's own heading. The robot walks and
   * turns on the spot; the vehicle builds speed with inertia, coasts when the
   * throttle is released, and turns more widely the faster it goes.
   */
  private updateDrive(dt: number): void {
    const up = this.dir;
    const vehicle = this.player.form === 'vehicle';
    const mx = this.overlayOpen || this.globe ? 0 : this.input.moveX;
    const my = this.overlayOpen || this.globe ? 0 : this.input.moveY;
    const run = this.input.run;
    this.steer = mx;

    let target: number;
    if (vehicle) {
      const top = run ? VEH_BOOST : VEH_SPEED;
      target = my * (my < 0 ? top * VEH_REVERSE : top);
      const rate = Math.abs(target) > Math.abs(this.moveSpeed) ? VEH_ACCEL : VEH_COAST;
      this.moveSpeed += (target - this.moveSpeed) * Math.min(1, dt * rate);
      if (target === 0 && Math.abs(this.moveSpeed) < 0.03) this.moveSpeed = 0;
    } else {
      target = my * (run ? RUN_SPEED : WALK_SPEED);
      this.moveSpeed += (target - this.moveSpeed) * Math.min(1, dt * 14);
      if (target === 0 && Math.abs(this.moveSpeed) < 0.03) this.moveSpeed = 0;
    }

    if (mx !== 0) {
      let turnRate: number;
      if (vehicle) {
        // The rudder bites in proportion to speed, and swings wider at the top.
        const bite = 0.32 + 0.68 * Math.min(1, Math.abs(this.moveSpeed) / (VEH_SPEED * 0.7));
        turnRate = VEH_TURN * bite * (1 - 0.3 * Math.min(1, Math.abs(this.moveSpeed) / VEH_SPEED));
        // Reversing steers the other way, the way a car does.
        if (this.moveSpeed < -0.05) turnRate = -turnRate;
      } else {
        turnRate = ROBOT_TURN;
      }
      _q.setFromAxisAngle(up, mx * turnRate * dt);
      _v3.copy(this.heading).applyQuaternion(_q);
      _v3.addScaledVector(up, -_v3.dot(up)).normalize();
      // A long vehicle cannot spin its nose or tail into a wall: the turn is
      // refused rather than letting the body clip through.
      if (!vehicle || !this.bodyBlocked(up, _v3)) {
        this.heading.copy(_v3);
      }
    }

    if (Math.abs(this.moveSpeed) > 0.01 && !this.globe) {
      const ang = (this.moveSpeed * dt) / PLANET_RADIUS;
      _v2.copy(up).multiplyScalar(Math.cos(ang)).addScaledVector(this.heading, Math.sin(ang)).normalize();
      if (isOcean(_v2)) {
        // The energy channels are out of bounds; the machine stops at the edge.
        this.moveSpeed *= vehicle ? 0.4 : 0.15;
        if (Math.abs(this.moveSpeed) < 0.15) this.moveSpeed = 0;
      } else {
        this.resolveBody(_v2, this.heading, vehicle);
        up.copy(_v2);
        this.heading.addScaledVector(up, -this.heading.dot(up)).normalize();
        this.camForward.addScaledVector(up, -this.camForward.dot(up)).normalize();
        this.journal.paces += Math.abs(this.moveSpeed) * dt;
        this.journalDirty = true;
        if (this.journal.paces >= 1000) this.award('wanderer');
      }
    }
  }

  /** Start the transform: the burst plays, the sound fires, the model swaps midway. */
  private startTransform(): void {
    if (this.transformTime > 0 || this.globe || this.overlayOpen) return;
    this.audio.start();
    this.transformTime = TRANSFORM_TIME;
    this.transformSwapped = false;
    this.shake = 0.4;
    this.audio.transform();
    this.burst.play(this.player.root.position, this.player.root.quaternion);
  }

  private swapForm(): void {
    const next: Form = this.player.form === 'robot' ? 'vehicle' : 'robot';
    this.player.setForm(next);
    if (next === 'robot') {
      // A robot that just landed cannot still be rolling at boost speed.
      this.moveSpeed = THREE.MathUtils.clamp(this.moveSpeed, -RUN_SPEED * 0.5, RUN_SPEED);
      this.airborne = false;
      this.hopH = 0;
      this.hopV = 0;
    }
    this.publishControl();
  }

  /** Tell the on-screen badge who is being driven and in which form. */
  private publishControl(): void {
    controlState.set({ name: this.player.name, form: this.player.form, isHero: this.player.scheme === 'hero' });
  }

  /** Collect a shard the walker has driven onto. */
  private pickUpShard(): void {
    const idx = this.shards.collect(this.dir);
    if (idx < 0) return;
    saveShards(this.seed, this.shards.foundIndices);
    this.audio.sparkle();
    this.journal.shards += 1;
    this.journalDirty = true;
    this.callbacks.onShards(this.shards.foundCount, this.shards.total);
    if (this.shards.foundCount >= this.shards.total) {
      this.fireworks.celebrate(this.player.root.position, 4.5);
      this.award('starfall');
    }
    this.flushJournal(true);
  }

  /** Biome caption and shore scan, on a quarter-second cadence. */
  private updateBiome(dt: number): void {
    this.biomeTimer -= dt;
    if (this.biomeTimer > 0) return;
    this.biomeTimer = 0.25;
    const b = biomeAt(this.dir);
    if (b.id !== this.biomeId) {
      this.biomeId = b.id;
      this.callbacks.onBiome({ name: b.name, kind: b.kind, index: b.index, tagline: b.tagline });
      const journalKey = biomeJournalKey(this.seed, b.id);
      if (!this.journal.biomes.includes(journalKey)) {
        this.journal.biomes = [...this.journal.biomes, journalKey];
        if (JOURNAL_BIOMES.every((id) => this.journal.biomes.includes(biomeJournalKey(this.seed, id)))) this.award('cartographer');
        this.flushJournal(true);
      }
      this.setZoneAtmosphere(b.id);
      this.audio.setMood(b.id);
      const weather = weatherFor(b.id);
      this.weather.set(weather);
      this.weather.setFireflies(b.id === 'river');
      this.audio.setWeather(weather === 'rain' ? 'rain' : weather === 'snow' || weather === 'leaves' ? 'wind' : weather === 'embers' ? 'ember' : null);
    }
  }

  /** Stand the driven machine on the surface at `dir`, facing `heading`. */
  private placePlayer(dt = 0): void {
    const ease = dt > 0 ? 1 - Math.exp(-dt * 9) : 1;
    const length = this.player.form === 'vehicle' ? VEHICLE_LENGTH : 0;
    this.placeRig(this.player.root, this.dir, this.heading, this.hopH, ease, length);
  }

  /**
   * Stand a machine on the surface facing `heading`. Its up is the terrain
   * normal blended with the radial direction: riding the normal alone makes it
   * pitch with every rock, riding the radial alone leaves it standing upright
   * while its nose buries itself in a slope. `upEase` below 1 smooths that tilt
   * from frame to frame. `bodyLength` samples the ground under the nose and
   * tail as well, so a long vehicle cannot sink either end into a rise.
   */
  private placeRig(
    root: THREE.Object3D,
    dir: THREE.Vector3,
    heading: THREE.Vector3,
    lift = 0,
    upEase = 1,
    bodyLength = 0
  ): void {
    surfaceNormal(dir, _up).multiplyScalar(0.6).addScaledVector(dir, 0.4).normalize();
    if (upEase >= 1 || !this.rigUpReady) {
      this.rigUp.copy(_up);
      this.rigUpReady = true;
    } else {
      this.rigUp.lerp(_up, upEase).normalize();
    }

    _walkFwd.copy(heading).addScaledVector(this.rigUp, -heading.dot(this.rigUp));
    if (_walkFwd.lengthSq() < 1e-8) _walkFwd.copy(heading);
    _walkFwd.normalize();
    _walkRight.crossVectors(this.rigUp, _walkFwd).normalize();
    _m.makeBasis(_walkRight, this.rigUp, _walkFwd);
    root.quaternion.setFromRotationMatrix(_m);

    let radius = walkRadius(dir);
    const half = bodyLength * 0.5;
    if (half > 0) {
      const ang = half / PLANET_RADIUS;
      _sample.copy(dir).multiplyScalar(Math.cos(ang)).addScaledVector(_walkFwd, Math.sin(ang)).normalize();
      radius = Math.max(radius, walkRadius(_sample));
      _sample.copy(dir).multiplyScalar(Math.cos(ang)).addScaledVector(_walkFwd, -Math.sin(ang)).normalize();
      radius = Math.max(radius, walkRadius(_sample));
    }
    root.position.copy(dir).multiplyScalar(radius + lift);
  }

  /**
   * Push the machine's body out of the props. A humanoid is close to a disc; a
   * vehicle is two and a half times longer than it is wide, so the nose and
   * tail each get their own disc and their correction is applied to the centre.
   */
  private resolveBody(dir: THREE.Vector3, heading: THREE.Vector3, vehicle: boolean): void {
    this.colliders.resolve(dir, vehicle ? VEHICLE_RADIUS : PLAYER_RADIUS);
    if (!vehicle) return;
    const ang = VEHICLE_HALF / PLANET_RADIUS;
    for (let i = 0; i < 2; i++) {
      const sign = i === 0 ? 1 : -1;
      _v2.copy(dir).multiplyScalar(Math.cos(ang)).addScaledVector(heading, sign * Math.sin(ang)).normalize();
      _v1.copy(_v2);
      if (!this.colliders.resolve(_v2, VEHICLE_RADIUS)) continue;
      _v1.subVectors(_v2, _v1);
      dir.add(_v1).normalize();
      this.colliders.resolve(dir, VEHICLE_RADIUS);
    }
  }

  /** True when the nose or tail disc would sit inside a prop at this heading. */
  private bodyBlocked(dir: THREE.Vector3, heading: THREE.Vector3): boolean {
    const ang = VEHICLE_HALF / PLANET_RADIUS;
    for (let i = 0; i < 2; i++) {
      const sign = i === 0 ? 1 : -1;
      _v2.copy(dir).multiplyScalar(Math.cos(ang)).addScaledVector(heading, sign * Math.sin(ang)).normalize();
      if (this.colliders.blocked(_v2, VEHICLE_RADIUS)) return true;
    }
    return false;
  }

  /**
   * Keep the driven machine out of the other machines and the animals. Only
   * the driven side is moved: everything else stands its ground.
   */
  private pushOutOfActors(dir: THREE.Vector3): boolean {
    let moved = false;
    const test = (other: THREE.Vector3, radius: number): void => {
      const cos = THREE.MathUtils.clamp(dir.dot(other), -1, 1);
      _v2.copy(dir).addScaledVector(other, -cos);
      const sin = _v2.length();
      const ang = Math.atan2(sin, cos);
      const minAng = radius / PLANET_RADIUS;
      if (ang >= minAng) return;
      if (sin < 1e-8) _v2.set(0, 1, 0).cross(other).normalize();
      else _v2.normalize();
      const push = minAng - ang + 1e-5;
      dir.multiplyScalar(Math.cos(push)).addScaledVector(_v2, Math.sin(push)).normalize();
      moved = true;
    };
    for (const crew of this.crews) {
      if (crew.rig === this.player) continue;
      test(crew.dir, ACTOR_RADIUS + PLAYER_RADIUS);
    }
    for (const critter of this.critters) test(critter.dir, ANIMAL_RADIUS + PLAYER_RADIUS);
    for (const other of this.crowd.positions()) test(other, ACTOR_RADIUS + PLAYER_RADIUS);
    return moved;
  }

  // ---------------------------------------------------------------- take-over

  /**
   * Hand control to another machine. Its own position, heading and form are
   * restored; the one being left stands exactly where it was, idling.
   */
  private takeControl(crew: Crew): void {
    if (crew === this.activeCrew) return;
    if (this.activeCrew) {
      this.activeCrew.dir.copy(this.dir);
      this.activeCrew.heading.copy(this.heading);
    }
    this.activeCrew = crew;
    this.player = crew.rig;
    this.dir.copy(crew.dir);
    this.heading.copy(crew.heading);
    this.camForward.copy(this.heading);
    this.moveSpeed = 0;
    this.steer = 0;
    this.airborne = false;
    this.hopH = 0;
    this.hopV = 0;
    this.transformTime = 0;
    this.transformSwapped = false;
    this.biomeTimer = 0;
    this.biomeId = null;
    this.orbitHold = 0;
    // A long transition is what turns into a camera flight across the planet.
    this.transition = 1.4;
    if (this.globe) this.setGlobe(false);
    this.audio.start();
    this.audio.hop();
    this.rigUpReady = false;
    this.placePlayer();
    this.publishControl();
    this.updatePickCursor();
    this.promptId = null;
  }

  /** Resolve a screen click against the machines that are not being driven. */
  private pickCrew(click: { x: number; y: number }): void {
    const candidates = this.crews.filter((c) => c.rig !== this.player);
    this.ndc.set(click.x, click.y);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hits = this.raycaster.intersectObjects(candidates.map((c) => c.rig.hit), false);
    if (hits.length === 0) return;
    const crew = candidates.find((c) => c.rig.hit === hits[0].object);
    if (crew) this.takeControl(crew);
  }

  /** A hand cursor while the pointer is over a machine that can be taken over. */
  private updatePickCursor(): void {
    const hover = this.input.hoverPointer;
    if (!hover || this.overlayOpen || this.globe) {
      this.canvas.style.cursor = '';
      return;
    }
    const candidates = this.crews.filter((c) => c.rig !== this.player);
    this.ndc.set(hover.x, hover.y);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = this.raycaster.intersectObjects(candidates.map((c) => c.rig.hit), false).length > 0;
    this.canvas.style.cursor = hit ? 'pointer' : '';
  }

  // ---------------------------------------------------------------- camera

  private updateCamera(dt: number): void {
    const desiredPos = _v1;
    const desiredLook = _v2;
    const desiredUp = _v3;

    if (this.globe) {
      if (!this.dragThisFrame) this.globeYaw += dt * 0.05;
      desiredPos.copy(this.globeDirection()).multiplyScalar(this.globeDistance());
      desiredLook.set(0, 0, 0);
      desiredUp.set(0, 1, 0);
      if (Math.abs(this.globePitch) > 1.0) desiredUp.set(Math.sin(this.globeYaw), 0, Math.cos(this.globeYaw)).multiplyScalar(-Math.sign(this.globePitch));
    } else {
      const up = this.dir;
      const playerPos = this.player.root.position;
      // Trail behind the machine's own heading. A drag holds the offset for a
      // moment before it recentres, so looking around still feels free.
      this.orbitHold = Math.max(0, this.orbitHold - dt);
      if (this.orbitHold === 0) {
        const k = 1 - Math.exp(-dt * (this.player.form === 'vehicle' ? 2.4 : 4.2));
        this.camForward.lerp(this.heading, k);
        this.camForward.addScaledVector(this.dir, -this.camForward.dot(this.dir));
        if (this.camForward.lengthSq() > 1e-8) this.camForward.normalize();
      }
      const vehicle = this.player.form === 'vehicle';
      const dist = this.camDist * (vehicle ? 1.12 : 1);
      desiredPos
        .copy(playerPos)
        .addScaledVector(up, Math.sin(this.camPitch) * dist + 0.9)
        .addScaledVector(this.camForward, -Math.cos(this.camPitch) * dist);
      desiredLook.copy(playerPos).addScaledVector(up, vehicle ? 1 : 1.35);
      desiredUp.copy(up);
    }

    this.transition = Math.max(0, this.transition - dt);
    const rate = this.transition > 0 ? 3.2 : 11;
    const k = 1 - Math.exp(-dt * rate);
    this.camPos.lerp(desiredPos, k);
    this.camLook.lerp(desiredLook, k);
    this.camUp.lerp(desiredUp, k).normalize();
    this.camera.position.copy(this.camPos);
    if (this.shake > 0) {
      // A short jolt on the transform, fading as the square of what is left.
      this.shake = Math.max(0, this.shake - dt * 1.8);
      const a = this.shake * this.shake * 2.6;
      this.camera.position.x += (Math.random() - 0.5) * a;
      this.camera.position.y += (Math.random() - 0.5) * a;
      this.camera.position.z += (Math.random() - 0.5) * a;
    }
    this.camera.up.copy(this.camUp);
    this.camera.lookAt(this.camLook);
    this.camera.updateMatrixWorld();

    // The moonlight rides over the camera's left shoulder so the visible face
    // of the planet always catches some light and shadows fall consistently.
    // The moon in the sky is scenery at a fixed seeded point; keeping the key
    // light off it is what stops half the planet going unplayably dark.
    const right = _v1.setFromMatrixColumn(this.camera.matrixWorld, 0);
    const camUp = _v2.setFromMatrixColumn(this.camera.matrixWorld, 1);
    const back = _v3.setFromMatrixColumn(this.camera.matrixWorld, 2);
    const lift = 0.3 + this.atmoNow.keyHeight * 0.65;
    const moonDir = right.multiplyScalar(-1.15).addScaledVector(camUp, lift).addScaledVector(back, 0.6).normalize();
    const focus = this.globe ? _v4.set(0, 0, 0) : _v4.copy(this.player.root.position);
    this.snapShadowFocus(focus, moonDir);
    this.moonLight.target.position.copy(focus);
    this.moonLight.position.copy(focus).addScaledVector(moonDir, 140);
    this.moonLight.target.updateMatrixWorld();
    this.moon.update(this.camera);
    this.sun.update(dt, this.camera);
  }

  // ---------------------------------------------------------------- world

  private updateWorld(dt: number): void {
    const t = this.time;
    this.applyAtmosphere(dt);
    this.crowd.update(dt, t, this.globe ? null : this.dir, this.dir);

    // Swell on the energy channels.
    (this.water.userData.uniforms as { uTime: { value: number } }).uTime.value = t;
    for (const d of this.dynamics) d.update(dt, t);

    for (const c of this.critters) c.update(dt, t);
    this.hearts.update(dt, this.camera.quaternion);
    this.clouds.update(dt);
    this.skyline.update(dt, t);
    this.weather.setHidden(this.globe);
    this.weather.update(dt, t, this.dir);
    // Rain darkens the ground it falls on and snow settles on whatever faces the sky.
    this.fx.setCenter(this.player.root.position);
    this.fx.setWet(this.weather.rainLevel);
    this.fx.setSnow(this.weather.snowLevel);
    this.aurora.update(dt, t);
    this.skyAurora.setHidden(this.globe);
    this.skyAurora.update(dt, t);
    this.constellations.update(t);
    this.meteors.update(dt);
    this.shards.update(dt, t);
    this.fireworks.update(dt);
    // A streak counts as seen if it crosses the sky while the player is on the ground.
    if (this.meteors.group.visible) {
      if (!this.meteorSeen && !this.globe && !this.intro) {
        this.meteorSeen = true;
        this.award('stargazer');
      }
    } else {
      this.meteorSeen = false;
    }
    if (this.companion && !this.companion.following) this.companion = null;
    this.flushJournal(false, dt);

    for (let i = 0; i < this.gems.length; i++) {
      const g = this.gems[i];
      const found = this.found.includes(g.wonder.id);
      const bob = Math.sin(t * 1.6 + i) * 0.18;
      g.mesh.position.copy(g.base).addScaledVector(g.up, 2.5 + bob);
      _q.setFromAxisAngle(g.up, t * 0.9 + i);
      g.mesh.quaternion.copy(_q).multiply(g.frameQ);
      const pulse = found ? 0.6 : 0.8 + Math.sin(t * 3 + i) * 0.35;
      (g.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 2.2;
      (g.ring.material as THREE.MeshBasicMaterial).opacity = found ? 0.3 : 0.35 + Math.sin(t * 3 + i) * 0.15;
      // `light.pos` is the marker's own position vector, so it follows the bob.
      g.light.intensity = 15 * pulse;
    }

    // Machines nobody is driving look around on their own.
    this.idleState.time = t;
    for (const crew of this.crews) if (crew.rig !== this.player) crew.rig.update(dt, this.idleState);

    // Far machines stop drawing into the shadow map; see `models`.
    updateShadowBudget(this.crews.map((crew) => crew.rig), this.player);
    // The picking spheres are invisible and must never drop a shadow.
    for (const crew of this.crews) crew.rig.hit.castShadow = false;

    // Hand the pooled lights to whichever sources are nearest the active machine.
    this.lights.update(t, this.player.root.position);
  }

  // ---------------------------------------------------------------- atmosphere

  /** Follow whichever zone the driven machine is standing in. */
  private setZoneAtmosphere(zone: ZoneAtmosphereId): void {
    this.zoneAtmo = zone;
    this.updateAtmosphereTarget();
  }

  /** Globe view takes over the lighting entirely while it is open. */
  private updateAtmosphereTarget(): void {
    this.atmoTarget = this.globe ? GLOBE_ATMOSPHERE : ZONE_ATMOSPHERE[this.zoneAtmo];
  }

  /**
   * Ease the lighting toward its target and apply it. A zone border takes
   * about a second and a half to settle; `instant` snaps it, for build time.
   */
  private applyAtmosphere(dt: number, instant = false): void {
    const now = this.atmoNow;
    const to = this.atmoTarget;
    const k = instant ? 1 : 1 - Math.exp(-dt * 3);
    now.sky.lerp(to.sky, k);
    now.fog.lerp(to.fog, k);
    now.fogDensity += (to.fogDensity - now.fogDensity) * k;
    now.hemiSky.lerp(to.hemiSky, k);
    now.hemiGround.lerp(to.hemiGround, k);
    now.hemiIntensity += (to.hemiIntensity - now.hemiIntensity) * k;
    now.key.lerp(to.key, k);
    now.keyIntensity += (to.keyIntensity - now.keyIntensity) * k;
    now.keyHeight += (to.keyHeight - now.keyHeight) * k;
    now.exposure += (to.exposure - now.exposure) * k;
    now.stars += (to.stars - now.stars) * k;

    (this.scene.background as THREE.Color).copy(now.sky);
    this.fog.color.copy(now.fog);
    this.fog.density = now.fogDensity;
    this.scene.fog = now.fogDensity > 0.0004 ? this.fog : null;
    this.hemi.color.copy(now.hemiSky);
    this.hemi.groundColor.copy(now.hemiGround);
    this.hemi.intensity = now.hemiIntensity;
    this.moonLight.color.copy(now.key);
    this.moonLight.intensity = now.keyIntensity;
    this.renderer.toneMappingExposure = now.exposure;

    // Stars only make sense against a dark sky; the bright zones fade them out.
    (this.stars.material as THREE.PointsMaterial).opacity = now.stars;
    this.constellations.setOpacity(now.stars);
    this.meteors.setOpacity(now.stars);

    // The reflected sky follows the atmosphere. `request` is a no-op until the
    // zone actually changes, and the bake itself is throttled inside.
    const clock = performance.now();
    this.env.request(this.globe ? 'globe' : this.zoneAtmo, clock);
    this.env.update(clock);
    this.scene.environment = this.env.texture;

    // Lava, embers, and crystals burn brighter against a dark sky.
    if (this.glowMat) this.glowMat.color.setScalar(1.1 + 0.5 * (1 - now.stars));
  }

  // ---------------------------------------------------------------- journal

  /** Record a milestone the first time it is earned, and tell the page. */
  private award(id: MilestoneId): void {
    if (this.journal.milestones.includes(id)) return;
    this.journal.milestones = [...this.journal.milestones, id];
    this.flushJournal(true);
    this.callbacks.onMilestone(milestoneById(id));
  }

  /** Persist monotonic journal progress without publishing UI during teardown. */
  private persistJournalOnExit(): void {
    if (!this.journalDirty) return;
    if (this.journal.planets.length >= 3 && !this.journal.milestones.includes('traveller')) {
      this.journal.milestones = [...this.journal.milestones, 'traveller'];
    }
    this.journal = saveJournal(this.journal);
    this.journalDirty = false;
  }

  /**
   * Save the journal and publish it. Steps and hops change every frame, so
   * those only flush on a timer; `now` forces it for the events that matter.
   */
  private flushJournal(now: boolean, dt = 0): void {
    this.journalFlush -= dt;
    if (!now && this.journalFlush > 0) return;
    this.journalFlush = JOURNAL_FLUSH;
    if (!this.journalDirty && !now) return;
    this.journalDirty = false;
    if (this.journal.planets.length >= 3 && !this.journal.milestones.includes('traveller')) {
      this.journal.milestones = [...this.journal.milestones, 'traveller'];
      this.callbacks.onMilestone(milestoneById('traveller'));
    }
    this.journal = saveJournal(this.journal);
    this.callbacks.onJournal(this.journal);
  }

  // ---------------------------------------------------------------- wonders

  private nearestGem(): Gem | null {
    let best: Gem | null = null;
    let bestDist = INTERACT_RANGE;
    for (const g of this.gems) {
      const d = g.dir.angleTo(this.dir) * PLANET_RADIUS;
      if (d < bestDist) {
        bestDist = d;
        best = g;
      }
    }
    return best;
  }

  /** Animal within petting reach, if any. */
  private nearestCritter(): Critter | null {
    let best: Critter | null = null;
    let bestDist = PET_RANGE;
    for (const c of this.critters) {
      const d = c.dir.angleTo(this.dir) * PLANET_RADIUS;
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
    return best;
  }

  /** Pat an animal: it turns and bounces, hearts rise, and the explorer crouches. */
  private petCritter(c: Critter): void {
    this.audio.start();
    this.exitIntro();
    // A second pat wins the animal over: it tags along for a while.
    const befriend = c.petted && !c.following;
    c.pet(this.dir);
    if (befriend) {
      if (this.companion && this.companion !== c) this.companion.release();
      this.companion = c;
      c.follow(this.dir);
      this.award('friend');
    }
    if (!this.journal.species.includes(c.name)) {
      this.journal.species = [...this.journal.species, c.name];
      if (speciesFor(this.profile.archetype).every((sp) => this.journal.species.includes(sp))) this.award('zoologist');
      this.flushJournal(true);
    }
    this.hearts.burst(c.group.position, c.dir, 3);
    this.audio.pet();
    this.moveSpeed = 0;
    // Face the animal.
    _v1.copy(c.dir).addScaledVector(this.dir, -c.dir.dot(this.dir));
    if (_v1.lengthSq() > 1e-6) this.heading.copy(_v1).normalize();
    this.promptId = null; // re-emit the prompt with the "again" wording
  }

  private updatePrompt(): void {
    const idle = this.globe || this.overlayOpen || this.photo;
    const gem = idle ? null : this.nearestGem();
    const pal = idle || gem ? null : this.nearestCritter();
    let prompt: Prompt | null = null;
    if (gem) {
      prompt = {
        id: gem.wonder.id,
        action: wonderAction(gem.wonder),
        found: this.found.includes(gem.wonder.id)
      };
    } else if (pal) {
      const animal = critterLabel(pal.name);
      prompt = {
        id: `pet-${pal.id}${pal.following ? '-friend' : pal.petted ? '-again' : ''}`,
        action: pal.following ? `和${animal}亲近一下` : pal.petted ? `向${animal}打个招呼` : `抚摸${animal}`,
        found: false,
        kicker: pal.following ? '你的同伴' : pal.petted ? '再摸一次就能交个朋友' : '一只好奇的机械兽'
      };
    }
    const id = prompt?.id ?? null;
    if (id === this.promptId) return;
    this.promptId = id;
    this.callbacks.onPrompt(prompt);
  }

  private findWonder(gem: Gem): void {
    const w = gem.wonder;
    this.audio.start();
    if (!this.found.includes(w.id)) {
      this.found = [...this.found, w.id];
      saveFound(this.found, this.seed, this.depth);
      this.callbacks.onFound(this.found);
      this.audio.chime();
      const mat = gem.mesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(0xffd166);
      mat.emissive.setHex(0xffb703);
      (gem.ring.material as THREE.MeshBasicMaterial).color.setHex(0xffd166);
      this.promptId = null; // re-emit the prompt with found = true
      if (this.found.length >= WONDERS.length) {
        this.fireworks.celebrate(this.player.root.position, 8);
        this.award('wonders');
      }
    }
    // Face the wonder.
    this.heading.copy(gem.dir).addScaledVector(this.dir, -gem.dir.dot(this.dir));
    if (this.heading.lengthSq() > 1e-6) this.heading.normalize();
    this.callbacks.onOpenWonder(w);
  }
}
