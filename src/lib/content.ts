// Placeholder copy for the wonder panels. Each section feeds one wonder in
// `game/wonders.ts`; the real zone stories replace these once the themes are set.

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

export const name = 'Planet Game';
export const tagline = 'A small metal planet waiting to be explored.';

export const resumePath = '#';
export const resumeDevUrl = '#';

const placeholder = (title: string): LootItem[] => [{ title, body: 'Story coming soon.', links: [] }];

export const sections: Section[] = [
  { id: 'work', label: 'ZONE 1', color: 0xff6b35, items: placeholder('Zone 1 record') },
  { id: 'education', label: 'ZONE 2', color: 0x5fd3ff, items: placeholder('Zone 2 record') },
  { id: 'projects', label: 'ZONE 3', color: 0xffb703, items: placeholder('Zone 3 record') },
  { id: 'resume', label: 'ZONE 4', color: 0x9b7bff, items: placeholder('Zone 4 record') },
  { id: 'blog', label: 'LOG', color: 0x7be4bc, items: placeholder('Field log') },
  { id: 'contact', label: 'SIGNAL', color: 0xf39868, items: placeholder('Signal') }
];
