import { writable } from 'svelte/store';

/** Who the player is driving right now, for the on-screen badge. */
export type ControlState = {
  /** Display name of the controlled character. */
  name: string;
  form: 'robot' | 'vehicle';
  /** True while the default protagonist is the one being driven. */
  isHero: boolean;
} | null;

export const controlState = writable<ControlState>(null);
