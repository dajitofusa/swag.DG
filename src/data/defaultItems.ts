import { PortalItem, DisguiseOption } from '../types';

export const DISGUISE_PRESETS: DisguiseOption[] = [
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes | Google Classroom',
    iconUrl: 'https://ssl.gstatic.com/classroom/favicon.png',
    previewType: 'classroom'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    iconUrl: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    previewType: 'docs'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas Student',
    iconUrl: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    previewType: 'canvas'
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    title: 'Dashboard | Khan Academy Practice',
    iconUrl: 'https://www.khanacademy.org/favicon.ico',
    previewType: 'khan'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Quantum computing - Wikipedia',
    iconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    previewType: 'wikipedia'
  },
  {
    id: 'nova',
    name: 'Nova Workspace (Default)',
    title: 'Nova Workspace | Student Resource Portal',
    iconUrl: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2'><path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z'/></svg>",
    previewType: 'classroom'
  }
];

export const CATEGORIES = [
  'All',
  'Favorites',
  'Recently Launched',
  'Logic & Strategy',
  'Physics & Reaction',
  'Retro Mechanics',
  'Agility & Speed',
  'Idle & Simulation',
  'Productivity & Tools',
  'Custom Links'
] as const;
