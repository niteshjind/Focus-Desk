import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '../types/focusdeck';

interface SettingsState extends Settings {
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
  setFocusTaskId: (id: string | null) => void;
}

const defaultSettings: Settings = {
  activeWallpaperId: 'rain',
  dim: 15,
  blur: 0,
  speed: 1.0,
  paused: false,
  accent: 'yellow',
  noteFont: 'sans',
  weekStart: 1, // Monday
  dayStartHour: 0,
  clock24h: false,
  reduceMotion: false,
  view: 'board',
  focusTaskId: null,
  focusAutoHideSeconds: 10, // Default 10 seconds of inactivity before auto-hiding
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),
      resetSettings: () => set(defaultSettings),
      setFocusTaskId: (id) => set({ focusTaskId: id }),
    }),
    {
      name: 'focusdeck_settings',
    }
  )
);
