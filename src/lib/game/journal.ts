// The traveller's journal: everything the explorer has seen and done across
// every planet, persisted in localStorage. This module has no Three.js import,
// so pages outside the game can read it without pulling in the game bundle.

import type { BiomeId } from './biomes';
import type { PlanetArchetype } from './space';

const JOURNAL_KEY = 'planet_journal';
const SHARDS_KEY = 'planet_shards';

/** Land biomes plus the sea, in the order the journal lists them. */
export const JOURNAL_BIOMES: BiomeId[] = ['river', 'citadel', 'ark', 'fortress', 'ocean'];

/** Earth keeps its legacy ids; alien regions are scoped to the planet that was explored. */
export function biomeJournalKey(seed: string, biome: BiomeId): string {
  return seed === 'earth' ? biome : `${seed}:${biome}`;
}

/** The planet's mechanical wildlife. `Critter` records the model's own name,
 *  so these strings have to match the names the game spawns. */
export const SPECIES = ['robot deer'] as const;

type AlienArchetype = Exclude<PlanetArchetype, 'earth'>;

export const ALIEN_SPECIES: Record<AlienArchetype, readonly [string, string, string]> = {
  bloom: ['glimmerback', 'dew hopper', 'lantern grazer'],
  reef: ['coral skitter', 'tide bulb', 'pearl grazer'],
  crystal: ['prism walker', 'glass skitter', 'sun hopper'],
  rime: ['rime walker', 'ice skitter', 'comet puff'],
  ember: ['cinderback', 'magma skitter', 'coal hopper'],
  fracture: ['orbit grazer', 'rift skitter', 'null hopper'],
  spore: ['cap walker', 'spore skitter', 'puffling']
};

export function speciesFor(archetype: PlanetArchetype): readonly string[] {
  return archetype === 'earth' ? SPECIES : ALIEN_SPECIES[archetype];
}

/** Starlight shards scattered over each planet. */
export const SHARD_COUNT = 12;

export type MilestoneId =
  | 'sailor'
  | 'stargazer'
  | 'friend'
  | 'zoologist'
  | 'cartographer'
  | 'wanderer'
  | 'grasshopper'
  | 'starfall'
  | 'wonders'
  | 'traveller';

export type Milestone = { id: MilestoneId; title: string; blurb: string };

export const MILESTONES: Milestone[] = [
  { id: 'wonders', title: '信标全亮', blurb: '点亮一颗星球上的全部信标。' },
  { id: 'cartographer', title: '测绘者', blurb: '踏遍每一个区域，以及区域之间的能量河道。' },
  { id: 'zoologist', title: '众生之友', blurb: '摸过星球上的每一种机器动物。' },
  { id: 'friend', title: '同行者', blurb: '有一只机器动物愿意跟着你走。' },
  { id: 'sailor', title: '渡河人', blurb: '放下小艇，离开河岸。' },
  { id: 'stargazer', title: '观星者', blurb: '看见一颗划过天空的流星。' },
  { id: 'starfall', title: '晶块归位', blurb: '收集一颗星球上全部的能量晶块。' },
  { id: 'wanderer', title: '远行者', blurb: '走过一千步。' },
  { id: 'grasshopper', title: '跳跃者', blurb: '跳一百次。' },
  { id: 'traveller', title: '星际旅人', blurb: '去过三颗不同的星球。' }
];

export type Journal = {
  /** Biomes the explorer has stood in, across every planet. */
  biomes: string[];
  /** Animal species petted at least once. */
  species: string[];
  milestones: MilestoneId[];
  /** Surface units walked on foot. */
  paces: number;
  hops: number;
  /** Seed labels of the planets visited. */
  planets: string[];
  /** Shards collected, summed over every planet. */
  shards: number;
};

export const emptyJournal = (): Journal => ({
  biomes: [],
  species: [],
  milestones: [],
  paces: 0,
  hops: 0,
  planets: [],
  shards: 0
});

const strings = (v: unknown): string[] => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string'))] : []);
const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, v) : 0);

export function loadJournal(): Journal {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return emptyJournal();
    const j = JSON.parse(raw) as Partial<Journal>;
    const ids = new Set<string>(MILESTONES.map((m) => m.id));
    return {
      biomes: strings(j.biomes),
      species: strings(j.species),
      milestones: strings(j.milestones).filter((id): id is MilestoneId => ids.has(id)),
      paces: num(j.paces),
      hops: num(j.hops),
      planets: strings(j.planets),
      shards: num(j.shards)
    };
  } catch {
    return emptyJournal();
  }
}

export function saveJournal(journal: Journal): Journal {
  try {
    const stored = loadJournal();
    const merged: Journal = {
      biomes: [...new Set([...stored.biomes, ...journal.biomes])],
      species: [...new Set([...stored.species, ...journal.species])],
      milestones: [...new Set([...stored.milestones, ...journal.milestones])],
      paces: Math.max(stored.paces, journal.paces),
      hops: Math.max(stored.hops, journal.hops),
      planets: [...new Set([...stored.planets, ...journal.planets])],
      shards: Math.max(stored.shards, journal.shards)
    };
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return journal;
  }
}

/** Indices of the shards already collected on the planet with this seed. */
export function loadShards(seed: string): number[] {
  try {
    const raw = localStorage.getItem(`${SHARDS_KEY}:${seed}`);
    if (!raw) return [];
    return (JSON.parse(raw) as unknown[]).filter((x): x is number => typeof x === 'number' && x >= 0 && x < SHARD_COUNT);
  } catch {
    return [];
  }
}

export function saveShards(seed: string, found: number[]): void {
  try {
    localStorage.setItem(`${SHARDS_KEY}:${seed}`, JSON.stringify(found));
  } catch {
    /* storage unavailable */
  }
}

export function milestoneById(id: MilestoneId): Milestone {
  return MILESTONES.find((m) => m.id === id)!;
}
