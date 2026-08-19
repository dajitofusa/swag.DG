export interface PortalItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iframeSrc?: string;
  srcDoc?: string;
  controls: string[];
  tags: string[];
  icon: string;
  accentColor: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan' | 'indigo' | 'fuchsia';
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  isCustom?: boolean;
  featured?: boolean;
  rating?: number;
  addedAt?: number;
}

export interface DisguiseOption {
  id: string;
  name: string;
  title: string;
  iconUrl: string;
  previewType: 'classroom' | 'docs' | 'khan' | 'canvas' | 'wikipedia';
}

export type CategoryType = 
  | 'All'
  | 'Favorites'
  | 'Recently Launched'
  | 'Logic & Strategy'
  | 'Physics & Reaction'
  | 'Retro Mechanics'
  | 'Agility & Speed'
  | 'Idle & Simulation'
  | 'Productivity & Tools'
  | 'Custom Links';

export interface UserSettings {
  panicKey: string;
  activeDisguise: string;
  enableSoundEffects: boolean;
  theaterMode: boolean;
  favorites: string[];
  recentIds: string[];
  customItems: PortalItem[];
}
