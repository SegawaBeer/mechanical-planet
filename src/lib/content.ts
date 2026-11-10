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

const entry = (title: string, body: string): LootItem[] => [{ title, body, links: [] }];

export const sections: Section[] = [
  {
    id: 'work',
    label: '区域 1',
    color: 0xff6b35,
    items: entry('能量河流', '发光的河道从泉眼涌出，把能量送往星球各处。沿着水流走，是最稳妥的补给路线。')
  },
  {
    id: 'education',
    label: '区域 2',
    color: 0x5fd3ff,
    items: entry('铁堡', '层层叠叠的塔楼围成一座立体城，回廊和掩体交错。站上高处，整片河谷都在眼里。')
  },
  {
    id: 'projects',
    label: '区域 3',
    color: 0xffb703,
    items: entry('方舟号', '一艘停在港湾里的巨型方舟，倾斜的甲板下藏着管道与舱室。引擎沉睡着，偶尔传出一声低鸣。')
  },
  {
    id: 'resume',
    label: '区域 4',
    color: 0x9b7bff,
    items: entry('暗影要塞', '围墙、炮塔和激光栅栏守着一颗危险的核心。进去之前，先把退路想清楚。')
  },
  {
    id: 'blog',
    label: '日志',
    color: 0x7be4bc,
    items: entry('行动记录', '走过的区域、点亮的信标、修补好的飞船，都会记在这里。')
  },
  {
    id: 'contact',
    label: '信号',
    color: 0xf39868,
    items: entry('信号', '矿石列车沿着轨道绕着星球一圈圈跑。想说什么，就让信号替你传出去。')
  }
];
