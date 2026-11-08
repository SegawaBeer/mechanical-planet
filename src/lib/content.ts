// Copy for the beacon panels. Each section feeds one beacon in
// `game/wonders.ts`.

export type LootLink = { label: string; url: string };

export type LootItem = {
  title: string;
  subtitle?: string;
  body?: string;
  links: LootLink[];
  badge?: 'current' | 'active' | 'shipped' | 'archived';
};

export type SectionId = 'work' | 'education' | 'projects' | 'resume' | 'blog' | 'contact';

export type Section = {
  id: SectionId;
  label: string;
  color: number;
  items: LootItem[];
};

export const name = '机械星球';
export const tagline = '一颗被轨道矿车环绕的机械星球。';

const placeholder = (title: string): LootItem[] => [{ title, body: '记录待补。', links: [] }];

export const sections: Section[] = [
  { id: 'work', label: '区域 1', color: 0xff6b35, items: placeholder('区域记录') },
  { id: 'education', label: '区域 2', color: 0x5fd3ff, items: placeholder('区域记录') },
  { id: 'projects', label: '区域 3', color: 0xffb703, items: placeholder('区域记录') },
  { id: 'resume', label: '区域 4', color: 0x9b7bff, items: placeholder('区域记录') },
  { id: 'blog', label: '日志', color: 0x7be4bc, items: placeholder('行动记录') },
  { id: 'contact', label: '信号', color: 0xf39868, items: placeholder('信号') }
];
