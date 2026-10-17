export type Priority = 'low' | 'medium' | 'high';

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';

export interface TaskNote {
  id: string;             // uuid
  title?: string;
  body: string;
  color: NoteColor;
  priority?: Priority;
  subject?: string;
  dueDate?: string;       // ISO date (YYYY-MM-DD)
  dueTime?: string;       // time (HH:mm)
  position: { x: number; y: number; rotation: number; z: number };
  createdAt: string;      // ISO datetime
  order: number;
}

export interface CompletedTask {
  id: string;             // same id as the original note
  title?: string;
  body: string;
  subject?: string;
  color: NoteColor;
  completedAt: string;    // ISO datetime
  dayKey: string;         // 'YYYY-MM-DD' in local time (used by calendar and streak)
  dueTime?: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  kind: 'builtin' | 'image' | 'video' | 'url';
  builtinKey?: string;    // for procedural wallpapers
  blobKey?: string;       // IndexedDB key for uploads
  url?: string;
  thumbnail?: string;     // data URL
  createdAt: string;
}

export interface Settings {
  activeWallpaperId: string;
  dim: number;            // 0 to 80%
  blur: number;           // 0 to 20px
  speed: number;          // 0.2 to 2.0x
  paused: boolean;
  accent: NoteColor;
  noteFont: 'mono' | 'sans' | 'hand';
  weekStart: 0 | 1;       // 0: Sunday, 1: Monday
  dayStartHour: number;   // 0 to 23 (e.g. 4 for night owls)
  clock24h: boolean;
  reduceMotion: boolean;
  view: 'board' | 'list';
  focusTaskId?: string | null;
  focusAutoHideSeconds: number; // 0 = disabled, or seconds before hiding UI
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalActiveDays: number;
  isActiveToday: boolean;
  isAtRisk: boolean;
  nextMilestone: number;
  unlockedMilestones: number[];
}
