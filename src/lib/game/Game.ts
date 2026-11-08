import * as THREE from 'three';
import { Input } from './input';
import { Ambience } from './audio';
import { biomeAt, biomeById, isOcean, layoutBiomes, type BiomeId } from './biomes';
import { setNoiseSeed } from './noise';
import { hashSeed } from './seed';
import {
  PLANET_RADIUS,
  SEA_LEVEL,
  buildGround,
  buildStars,
  buildWater,
  configurePlanet,
  tangentBasis,
  walkRadius,
  offsetDir,
  surfaceFrame
} from './planet';
import { NIGHT } from './night';
import { LightPool, emitter, type Emitter } from './lights';
import { buildWorldProps, type Dynamic } from './props';
import {
  buildAlienCritter,
  buildBear,
  buildCrab,
  buildDeer,
  buildDuck,
  buildFox,
  buildFrog,
  buildGoat,
  buildPenguin,
  buildRabbit,
  buildSheep,
  buildTurtle
} from './character';
import { Critter, Hearts } from './critters';
import { Clouds } from './clouds';
import { Skyline } from './skyline';
import { buildRobotDeer } from './wildlife';
import { Aurora, SkyAurora } from './aurora';
import { Constellations, Meteors, Moon, Planets, type PlanetTarget } from './sky';
import { patchSurface, type SurfaceFx } from './surfaceFx';
import { ColliderGrid } from './collision';
import { WONDERS, wonderAction, wonderDir, type Wonder } from './wonders';
import { loadFound, saveFound } from './progress';
import { Weather, weatherFor } from './weather';
import type { BiomeCaption } from './store';
import { Shards } from './shards';
import { Fireworks } from './fireworks';
import { Protagonist, type Form } from './robots/protagonist';
import { TransformBurst } from './robots/burst';
import type { SchemeId } from './robots/scheme';
import { equip } from './models';
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
import { ShipParts, buildSpaceship } from './spaceship';
import {
  EARTH_SEED,
  MAX_FUEL,
  SHARD_FUEL,
  SHIP_PARTS,
  loadShipProgress,
  planetProfile,
  saveShipProgress,
  spaceDestinations,
  type PlanetProfile,
  type ShipProgress,
  type SpaceDestination,
  type SpaceStatus
} from './space';

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
  /** Ship inventory or fuel changed. */
  onSpace: (status: SpaceStatus) => void;
  /** The player entered or left direct-control spaceflight. */
  onFlight: (flying: boolean) => void;
  /** The ship physically reached one of the destination planets. */
  onArrive: (destination: SpaceDestination) => void;
  /** A ship part, crafting, or refuelling event needs a toast. */
  onSpaceNotice: (notice: { kicker: string; text: string }) => void;
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
/** Radius of the machine's footprint, in surface units. */
const PLAYER_RADIUS = 0.38;
const VEHICLE_RADIUS = 0.55;
/** Length of the transform effect, in seconds; the model swaps halfway. */
const TRANSFORM_TIME = 1;
/** Journal stats are written to storage this often, in seconds, not every step. */
const JOURNAL_FLUSH = 4;
const CAM_MIN = 5;
const CAM_MAX = 28;
const GLOBE_MARGIN = 10;
/** Spaceflight is always moving; Shift/touch-run raises the cruise speed. */
const FLIGHT_SPEED = 34;
const FLIGHT_BOOST = 56;
const FLIGHT_TURN = 1.35;
/** Distance above a destination surface at which the landing computer takes over. */
const LANDING_APPROACH = 16;
const LANDING_DURATION = 2.4;

const _e = new THREE.Euler();

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _v4 = new THREE.Vector3();
// Light-space axes, used to quantise the shadow camera; see `snapShadowFocus`.
const _lx = new THREE.Vector3();
const _ly = new THREE.Vector3();
const _m = new THREE.Matrix4();
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
  private shipProgress: ShipProgress;

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
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
  private planets: Planets;
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

  // Starship: salvage is scattered on Earth; the completed ship can be flown
  // to any generated destination and set down on its visible terrain.
  private parts: ShipParts | null = null;
  private ship: THREE.Group;
  private shipDir = new THREE.Vector3();
  private readonly destinations: SpaceDestination[];
  private flying = false;
  private arriving = false;
  private flightForward = new THREE.Vector3();
  private flightUp = new THREE.Vector3();
  private flightSpeed = 0;
  private flightWarning = 0;
  private landingTarget: PlanetTarget | null = null;
  private landingElapsed = 0;
  private landingStart = new THREE.Vector3();
  private landingEnd = new THREE.Vector3();
  private landingUp = new THREE.Vector3();
  private landingStartRotation = new THREE.Quaternion();
  private landingEndRotation = new THREE.Quaternion();

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
    this.shipProgress = loadShipProgress();
    this.destinations = spaceDestinations(this.seed, this.depth);
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
    this.scene.add(this.ground, this.water, this.stars, this.constellations.group, this.meteors.group);
    this.scene.add(this.moon.group);

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
    this.shipDir.copy(fire);
    offsetDir(this.shipDir, 1.1, -1.8);
    for (let i = 0; i < 10 && isOcean(this.shipDir); i++) offsetDir(this.shipDir, -0.11, 0.18);
    this.ship = buildSpaceship(this.shipProgress.crafted);
    surfaceFrame(this.shipDir, -0.35, _m, 0.08).decompose(this.ship.position, this.ship.quaternion, this.ship.scale);
    this.ship.visible = false;
    this.scene.add(this.ship);
    this.planets = new Planets(seed, this.destinations, this.shipDir);
    this.planets.group.visible = false;
    this.scene.add(this.planets.group);
    if (false as boolean) {
      this.parts = new ShipParts(
        seed,
        this.colliders,
        this.lights,
        this.shipProgress.parts,
        [this.shipDir, ...WONDERS.map((wonder) => wonderDir(wonder))]
      );
      this.scene.add(this.parts.group);
    }
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
    this.scene.add(this.burst.group);
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
    this.callbacks.onSpace(this.spaceStatus);
    this.applyLighting();

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

  /** Current ship objective, fuel, and planet identity for the HUD. */
  get spaceStatus(): SpaceStatus {
    return {
      parts: this.parts?.foundCount ?? this.shipProgress.parts.length,
      totalParts: SHIP_PARTS.length,
      crafted: this.shipProgress.crafted,
      fuel: this.shipProgress.fuel,
      maxFuel: MAX_FUEL,
      planetName: this.profile.name,
      planetKind: this.profile.kind,
      depth: this.depth,
      isEarth: this.seed === EARTH_SEED
    };
  }

  /** Fully recharge the grounded ship at Earth's landing pad. */
  refuelShip(): void {
    if (!this.shipProgress.crafted || this.flying || this.seed !== EARTH_SEED || this.shipProgress.fuel >= MAX_FUEL) return;
    const added = MAX_FUEL - this.shipProgress.fuel;
    this.audio.start();
    this.exitIntro();
    this.shipProgress = { ...this.shipProgress, fuel: MAX_FUEL };
    saveShipProgress(this.shipProgress);
    this.audio.sparkle();
    this.callbacks.onSpace(this.spaceStatus);
    this.callbacks.onSpaceNotice({
      kicker: 'Landing pad recharge',
      text: `Fuel cells restored · +${added} fuel`
    });
    this.promptId = null;
  }

  /** Board the completed ship and hand its movement to the player. */
  launchFlight(): void {
    if (!this.shipProgress.crafted || this.flying) return;
    const target = this.planets.targets.find(({ destination }) => destination.fuelCost <= this.shipProgress.fuel);
    if (!target) {
      this.callbacks.onSpaceNotice({
        kicker: 'Flight computer',
        text: 'Collect starlight shards, or recall Earth for a full recharge'
      });
      return;
    }
    this.audio.start();
    this.exitIntro();
    if (this.globe) this.setGlobe(false);
    this.setOverlayOpen(false);
    this.flying = true;
    this.arriving = false;
    this.flightWarning = 0;
    this.landingTarget = null;
    this.landingElapsed = 0;
    this.player.setVisible(false);
    this.ship.position.copy(this.shipDir).multiplyScalar(walkRadius(this.shipDir) + 2.5);
    this.flightForward.copy(target.position).sub(this.ship.position).normalize();
    this.flightUp.copy(this.shipDir).addScaledVector(this.flightForward, -this.shipDir.dot(this.flightForward));
    if (this.flightUp.lengthSq() < 1e-6) tangentBasis(this.flightForward, 0, _v1, this.flightUp);
    this.flightUp.normalize();
    this.flightSpeed = 10;
    this.transition = 1.4;
    this.placeFlightShip();
    this.callbacks.onPrompt(null);
    this.callbacks.onFlight(true);
  }

  /** Abort a flight and put the ship back on its landing pad. */
  landFlight(): void {
    if (!this.flying || this.arriving) return;
    this.flying = false;
    this.flightSpeed = 0;
    this.player.setVisible(true);
    surfaceFrame(this.shipDir, -0.35, _m, 0.08).decompose(this.ship.position, this.ship.quaternion, this.ship.scale);
    this.transition = 1.2;
    this.callbacks.onFlight(false);
    this.callbacks.onSpaceNotice({ kicker: 'Flight computer', text: 'Returned to the landing pad' });
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
    this.planets.dispose();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) m.dispose();
      }
    });
    this.renderer.dispose();
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
    if (input.consumeEscape()) {
      if (this.overlayOpen) this.callbacks.onEscape();
      else if (this.flying) this.landFlight();
      else this.callbacks.onEscape();
    }
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

    if (this.flying) {
      if (!this.overlayOpen && hop) {
        this.landFlight();
        return;
      }
      if (!this.overlayOpen) this.steerFlight(-orbit.dx * 0.0035, -orbit.dy * 0.0035);
      return;
    }

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
    if (click && !this.overlayOpen && !this.globe && !this.flying) this.pickCrew(click);
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
      const byShip = !gem && this.ship.visible && this.shipDir.angleTo(this.dir) * PLANET_RADIUS < INTERACT_RANGE + 0.8;
      const pal = gem || byShip ? null : this.nearestCritter();
      if (gem) this.findWonder(gem);
      else if (byShip) this.useShip();
      else if (pal) this.petCritter(pal);
    }

    if (this.globe && !this.intro && (input.moveX !== 0 || input.moveY !== 0)) this.setGlobe(false);
    void dt;
  }

  // ---------------------------------------------------------------- player

  private updatePlayer(dt: number): void {
    if (this.flying) {
      this.updateFlight(dt);
      return;
    }

    this.updateDrive(dt);

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
    this.placePlayer();
    this.updateBiome(dt);
    if (Math.abs(this.moveSpeed) > 0.2) {
      this.pickUpShard();
      this.pickUpPart();
    }
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
      this.heading.applyQuaternion(_q);
      this.heading.addScaledVector(up, -this.heading.dot(up)).normalize();
    }

    if (Math.abs(this.moveSpeed) > 0.01 && !this.globe) {
      const ang = (this.moveSpeed * dt) / PLANET_RADIUS;
      _v2.copy(up).multiplyScalar(Math.cos(ang)).addScaledVector(this.heading, Math.sin(ang)).normalize();
      if (isOcean(_v2)) {
        // The energy channels are out of bounds; the machine stops at the edge.
        this.moveSpeed *= vehicle ? 0.4 : 0.15;
        if (Math.abs(this.moveSpeed) < 0.15) this.moveSpeed = 0;
      } else {
        this.colliders.resolve(_v2, vehicle ? VEHICLE_RADIUS : PLAYER_RADIUS);
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
    if (this.shipProgress.crafted && this.shipProgress.fuel < MAX_FUEL) {
      const before = this.shipProgress.fuel;
      this.shipProgress = { ...this.shipProgress, fuel: Math.min(MAX_FUEL, before + SHARD_FUEL) };
      saveShipProgress(this.shipProgress);
      this.callbacks.onSpace(this.spaceStatus);
      this.callbacks.onSpaceNotice({
        kicker: 'Starship fuel',
        text: `Starlight refined · +${this.shipProgress.fuel - before} fuel`
      });
    }
    if (this.shards.foundCount >= this.shards.total) {
      this.fireworks.celebrate(this.player.root.position, 4.5);
      this.award('starfall');
    }
    this.flushJournal(true);
  }

  /** Collect one of Earth's five scattered ship parts. */
  private pickUpPart(): void {
    if (!this.parts || this.shipProgress.crafted) return;
    const idx = this.parts.collect(this.dir);
    if (idx < 0) return;
    this.shipProgress = { ...this.shipProgress, parts: this.parts.foundIndices };
    saveShipProgress(this.shipProgress);
    this.audio.sparkle();
    this.callbacks.onSpace(this.spaceStatus);
    const complete = this.shipProgress.parts.length >= SHIP_PARTS.length;
    this.callbacks.onSpaceNotice({
      kicker: complete ? 'Starship ready' : 'Part recovered',
      text: complete
        ? `${SHIP_PARTS[idx]} found · return to the landing pad`
        : `${SHIP_PARTS[idx]} · ${this.shipProgress.parts.length}/${SHIP_PARTS.length}`
    });
    this.promptId = null;
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
      this.audio.setMood(b.id);
      const weather = weatherFor(b.id);
      this.weather.set(weather);
      this.weather.setFireflies(b.id === 'river');
      this.audio.setWeather(weather === 'rain' ? 'rain' : weather === 'snow' || weather === 'leaves' ? 'wind' : weather === 'embers' ? 'ember' : null);
    }
  }

  /** Stand the driven machine on the surface at `dir`, facing `heading`. */
  private placePlayer(): void {
    this.placeRig(this.player.root, this.dir, this.heading, this.hopH);
  }

  /** Stand any machine on the surface, with its own up and forward. */
  private placeRig(root: THREE.Object3D, dir: THREE.Vector3, heading: THREE.Vector3, lift = 0): void {
    root.position.copy(dir).multiplyScalar(walkRadius(dir) + lift);
    _v2.crossVectors(dir, heading).normalize();
    _m.makeBasis(_v2, dir, heading);
    root.quaternion.setFromRotationMatrix(_m);
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
    if (!hover || this.overlayOpen || this.globe || this.flying) {
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

    if (this.flying) {
      desiredPos.copy(this.ship.position).addScaledVector(this.flightForward, -10).addScaledVector(this.flightUp, 4.2);
      desiredLook.copy(this.ship.position).addScaledVector(this.flightForward, 15);
      desiredUp.copy(this.flightUp);
    } else if (this.globe) {
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
    const lift = 0.3 + NIGHT.moonHeight * 0.65;
    const moonDir = right.multiplyScalar(-1.15).addScaledVector(camUp, lift).addScaledVector(back, 0.6).normalize();
    const focus = this.flying ? _v4.copy(this.ship.position) : this.globe ? _v4.set(0, 0, 0) : _v4.copy(this.player.root.position);
    this.snapShadowFocus(focus, moonDir);
    this.moonLight.target.position.copy(focus);
    this.moonLight.position.copy(focus).addScaledVector(moonDir, 140);
    this.moonLight.target.updateMatrixWorld();
    this.moon.update(this.camera);
  }

  // ---------------------------------------------------------------- world

  private updateWorld(dt: number): void {
    const t = this.time;
    this.planets.update(dt, t);

    // Swell on the energy channels.
    (this.water.userData.uniforms as { uTime: { value: number } }).uTime.value = t;
    for (const d of this.dynamics) d.update(dt, t);

    for (const c of this.critters) c.update(dt, t);
    this.hearts.update(dt, this.camera.quaternion);
    this.clouds.update(dt);
    this.skyline.update(dt, t);
    this.weather.setHidden(this.globe || this.flying);
    this.weather.update(dt, t, this.dir);
    // Rain darkens the ground it falls on and snow settles on whatever faces the sky.
    this.fx.setCenter(this.player.root.position);
    this.fx.setWet(this.weather.rainLevel);
    this.fx.setSnow(this.weather.snowLevel);
    this.aurora.update(dt, t);
    this.skyAurora.setHidden(this.globe || this.flying);
    this.skyAurora.update(dt, t);
    this.constellations.update(t);
    this.meteors.update(dt);
    this.shards.update(dt, t);
    this.parts?.update(dt, t);
    this.fireworks.update(dt);
    // A streak counts as seen if it crosses the sky while the player is on the ground.
    if (this.meteors.group.visible) {
      if (!this.meteorSeen && !this.globe && !this.flying && !this.intro) {
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

    // Hand the pooled lights to whichever sources are nearest the active machine.
    this.lights.update(t, this.flying ? this.ship.position : this.player.root.position);
  }

  /**
   * Settle the world into its one lighting mood. There is no clock to sample,
   * so this runs once, at build time.
   */
  private applyLighting(): void {
    // `buildWater` already applies the current planet profile.
    (this.stars.material as THREE.PointsMaterial).opacity = 1;
    this.constellations.setOpacity(1);
    this.meteors.setOpacity(1);
    // Lava, embers, and crystals burn brighter against a dark sky.
    if (this.glowMat) this.glowMat.color.setScalar(1.4);
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

  // ---------------------------------------------------------------- starship
  /** Apply one yaw/pitch step while preserving an orthonormal flight frame. */
  private steerFlight(yaw: number, pitch: number): void {
    if (yaw !== 0) {
      _q.setFromAxisAngle(this.flightUp, yaw);
      this.flightForward.applyQuaternion(_q).normalize();
    }
    _v1.crossVectors(this.flightUp, this.flightForward).normalize();
    if (pitch !== 0) {
      _q.setFromAxisAngle(_v1, -pitch);
      this.flightForward.applyQuaternion(_q).normalize();
      this.flightUp.applyQuaternion(_q).normalize();
    }
    _v1.crossVectors(this.flightUp, this.flightForward).normalize();
    this.flightUp.crossVectors(this.flightForward, _v1).normalize();
  }

  private placeFlightShip(): void {
    _v1.crossVectors(this.flightUp, this.flightForward).normalize();
    _m.makeBasis(_v1, this.flightUp, this.flightForward);
    this.ship.quaternion.setFromRotationMatrix(_m);
  }

  /** Commit fuel and prepare a controlled descent onto visible terrain. */
  private beginPlanetLanding(target: PlanetTarget): void {
    this.shipProgress = { ...this.shipProgress, fuel: this.shipProgress.fuel - target.destination.fuelCost };
    saveShipProgress(this.shipProgress);
    this.callbacks.onSpace(this.spaceStatus);
    this.arriving = true;
    this.flightSpeed = 0;
    this.landingTarget = target;
    this.landingElapsed = 0;
    this.landingStart.copy(this.ship.position);
    this.landingStartRotation.copy(this.ship.quaternion);
    this.landingUp.copy(this.ship.position).sub(target.position).normalize();
    this.landingEnd.copy(target.position).addScaledVector(this.landingUp, target.surfaceRadius(this.landingUp) + 0.08);

    _v2.copy(this.flightUp).addScaledVector(this.landingUp, -this.flightUp.dot(this.landingUp));
    if (_v2.lengthSq() < 1e-6) tangentBasis(this.landingUp, 0, _v1, _v2);
    else _v2.normalize();
    _v1.crossVectors(this.landingUp, _v2).normalize();
    _m.makeBasis(_v1, this.landingUp, _v2);
    this.landingEndRotation.setFromRotationMatrix(_m);
    this.planets.beginLanding(target);
    this.callbacks.onSpaceNotice({
      kicker: 'Landing approach',
      text: `Descending to ${target.destination.name}`
    });
  }

  /** Ease the hull from forward flight into a feet-down touchdown. */
  private updatePlanetLanding(dt: number): void {
    const target = this.landingTarget;
    if (!target) return;
    this.landingElapsed += dt;
    const progress = Math.min(1, this.landingElapsed / LANDING_DURATION);
    const eased = progress * progress * (3 - 2 * progress);
    this.ship.position.lerpVectors(this.landingStart, this.landingEnd, eased);
    this.ship.position.addScaledVector(this.landingUp, Math.sin(progress * Math.PI) * 1.6);
    this.ship.quaternion.slerpQuaternions(this.landingStartRotation, this.landingEndRotation, eased);
    this.flightUp.set(0, 1, 0).applyQuaternion(this.ship.quaternion).normalize();
    this.flightForward.set(0, 0, 1).applyQuaternion(this.ship.quaternion).normalize();
    if (progress < 1) return;

    const destination = target.destination;
    this.landingTarget = null;
    this.callbacks.onFlight(false);
    queueMicrotask(() => {
      if (!this.disposed) this.callbacks.onArrive(destination);
    });
  }

  /** Advance direct-control flight and hand a close approach to the landing computer. */
  private updateFlight(dt: number): void {
    if (this.arriving) {
      this.updatePlanetLanding(dt);
      return;
    }
    const steering = !this.overlayOpen;
    if (steering) this.steerFlight(this.input.moveX * FLIGHT_TURN * dt, this.input.moveY * FLIGHT_TURN * dt);
    const cruise = steering ? (this.input.run ? FLIGHT_BOOST : FLIGHT_SPEED) : 0;
    this.flightSpeed += (cruise - this.flightSpeed) * Math.min(1, dt * 2.8);
    this.ship.position.addScaledVector(this.flightForward, this.flightSpeed * dt);
    this.placeFlightShip();
    this.flightWarning = Math.max(0, this.flightWarning - dt);

    const distanceFromOriginSq = this.ship.position.lengthSq();
    if (distanceFromOriginSq < (PLANET_RADIUS + 2) ** 2 || distanceFromOriginSq > 520 ** 2) {
      this.landFlight();
      return;
    }

    for (const target of this.planets.targets) {
      const approachRadius = target.radius + LANDING_APPROACH;
      if (this.ship.position.distanceToSquared(target.position) > approachRadius * approachRadius) continue;
      if (target.destination.fuelCost > this.shipProgress.fuel) {
        if (this.flightWarning === 0) {
          this.callbacks.onSpaceNotice({
            kicker: 'Route locked',
            text: `${target.destination.name} needs ${target.destination.fuelCost} fuel`
          });
          this.flightWarning = 2.5;
        }
        _v2.copy(this.ship.position).sub(target.position).normalize();
        this.ship.position.copy(target.position).addScaledVector(_v2, approachRadius + 2);
        this.flightForward.reflect(_v2).normalize();
        this.flightUp.addScaledVector(this.flightForward, -this.flightUp.dot(this.flightForward)).normalize();
        this.placeFlightShip();
        return;
      }

      this.beginPlanetLanding(target);
      return;
    }
  }



  private useShip(): void {
    this.audio.start();
    this.exitIntro();
    if (!this.shipProgress.crafted) {
      const missing = SHIP_PARTS.length - this.shipProgress.parts.length;
      if (missing > 0) {
        this.callbacks.onSpaceNotice({
          kicker: 'Wrecked starship',
          text: `Recover ${missing} more ${missing === 1 ? 'part' : 'parts'} before crafting`
        });
        return;
      }
      this.shipProgress = { ...this.shipProgress, crafted: true, fuel: MAX_FUEL };
      saveShipProgress(this.shipProgress);
      this.replaceShip(true);
      this.fireworks.celebrate(this.ship.position, 6);
      this.audio.sparkle();
      this.callbacks.onSpace(this.spaceStatus);
      this.callbacks.onSpaceNotice({
        kicker: 'Starship crafted',
        text: 'Engines online · board the ship to venture into space'
      });
      this.promptId = null;
      return;
    }
    if (this.seed === EARTH_SEED && this.shipProgress.fuel < MAX_FUEL) {
      this.refuelShip();
      return;
    }
    this.launchFlight();
  }

  private replaceShip(crafted: boolean): void {
    const old = this.ship;
    this.scene.remove(old);
    old.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) material.dispose();
    });
    this.ship = buildSpaceship(crafted);
    surfaceFrame(this.shipDir, -0.35, _m, 0.08).decompose(this.ship.position, this.ship.quaternion, this.ship.scale);
    this.scene.add(this.ship);
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
    const idle = this.globe || this.flying || this.overlayOpen || this.photo;
    const gem = idle ? null : this.nearestGem();
    const byShip =
      !idle && !gem && this.ship.visible && this.shipDir.angleTo(this.dir) * PLANET_RADIUS < INTERACT_RANGE + 0.8;
    const pal = idle || gem || byShip ? null : this.nearestCritter();
    let prompt: Prompt | null = null;
    if (gem) {
      prompt = {
        id: gem.wonder.id,
        action: wonderAction(gem.wonder),
        found: this.found.includes(gem.wonder.id)
      };
    }
    else if (byShip) {
      const missing = SHIP_PARTS.length - this.shipProgress.parts.length;
      prompt = this.shipProgress.crafted
        ? this.seed === EARTH_SEED && this.shipProgress.fuel < MAX_FUEL
          ? { id: 'ship-refuel', action: 'Refuel spaceship', found: false, kicker: `${this.shipProgress.fuel}/${MAX_FUEL} fuel · full landing-pad recharge` }
          : { id: 'ship-board', action: 'Board ship', found: false, kicker: `${this.shipProgress.fuel}/${MAX_FUEL} fuel · fly to a planet` }
        : missing === 0
          ? { id: 'ship-craft', action: 'Craft your spaceship', found: false, kicker: 'All five parts recovered' }
          : { id: `ship-parts-${missing}`, action: `Recover ${missing} more ${missing === 1 ? 'part' : 'parts'}`, found: false, kicker: 'Wrecked starship' };
    } else if (pal) {
      prompt = {
        id: `pet-${pal.id}${pal.following ? '-friend' : pal.petted ? '-again' : ''}`,
        action: pal.following ? `Pet your ${pal.name}` : pal.petted ? `Say hello to the ${pal.name}` : `Pet the ${pal.name}`,
        found: false,
        kicker: pal.following ? 'Your companion' : pal.petted ? 'Pet again to make a friend' : 'A curious animal'
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
