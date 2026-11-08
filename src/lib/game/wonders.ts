import * as THREE from 'three';
import { biomeById, type BiomeId } from './biomes';
import { offsetDir } from './planet';
import { WONDER_IDS, type WonderId } from './progress';

export type LootLink = { label: string; url: string };
export type LootItem = {
  title: string;
  subtitle?: string;
  body?: string;
  links: LootLink[];
  badge?: 'current' | 'active' | 'shipped' | 'archived';
};

export type Wonder = {
  id: WonderId;
  /** Verb phrase shown on the interaction card. */
  action: string;
  biome: BiomeId;
  /** Offset from the zone centre in surface units: [east, north]. */
  offset: [number, number];
  /** Facing, radians from north. */
  yaw: number;
  /** Panel heading and short blurb. */
  title: string;
  blurb: string;
  items: LootItem[];
};

const note = (title: string, body: string): LootItem[] => [{ title, body, links: [] }];

/**
 * One beacon per zone. The ids are the save-file keys from `progress.ts`; only
 * the first four are placed, so `WONDERS.length` is the number of zones.
 */
export const WONDERS: Wonder[] = [
  {
    id: WONDER_IDS[0],
    action: '激活能量泉眼',
    biome: 'river',
    offset: [0, 0],
    yaw: 0.6,
    title: '能量泉眼',
    blurb: '星球的能量从这里涌出，流向每一条河道。',
    items: note('能量河流', '全星球的资源补给带。沿着发光的河道走，就能找到其他区域。')
  },
  {
    id: WONDER_IDS[1],
    action: '点亮铁堡信标',
    biome: 'citadel',
    offset: [0, 0],
    yaw: 0,
    title: '铁堡信标',
    blurb: '信标亮起，塔楼里的守卫知道你来了。',
    items: note('铁堡', '多层塔楼与回廊组成的据点，掩体遍布。')
  },
  {
    id: WONDER_IDS[2],
    action: '启动方舟舱门',
    biome: 'ark',
    offset: [0, 0],
    yaw: 0,
    title: '方舟舱门',
    blurb: '沉睡的巨舰发出一声低鸣。',
    items: note('方舟号', '巨型战舰停靠港，倾斜的甲板下藏着复杂的管道和舱室。')
  },
  {
    id: WONDER_IDS[3],
    action: '破解要塞核心',
    biome: 'fortress',
    offset: [0, 0],
    yaw: 0,
    title: '要塞核心',
    blurb: '紫色的光暗了下去，要塞的防线松动了。',
    items: note('暗影要塞', '高风险区域：围墙、炮塔和激光栅栏。')
  }
];

export function wonderAction(wonder: Wonder): string {
  return wonder.action;
}

/** Unit direction of a wonder on the sphere. */
export function wonderDir(w: Wonder, out = new THREE.Vector3()): THREE.Vector3 {
  out.copy(biomeById(w.biome).center);
  return offsetDir(out, w.offset[0], w.offset[1]);
}
