import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Wallpaper } from '../types/focusdeck';
import { deleteWallpaperBlob } from '../lib/db';

export const BUILTIN_WALLPAPERS: Wallpaper[] = [
  {
    id: 'rain',
    name: 'Rainy Window',
    kind: 'builtin',
    builtinKey: 'rain',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stars',
    name: 'Starry Night',
    kind: 'builtin',
    builtinKey: 'stars',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    kind: 'builtin',
    builtinKey: 'aurora',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lofiSunset',
    name: 'Lo-fi Sunset',
    kind: 'builtin',
    builtinKey: 'lofiSunset',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sakura',
    name: 'Falling Sakura',
    kind: 'builtin',
    builtinKey: 'sakura',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'matrix',
    name: 'Matrix of Code',
    kind: 'builtin',
    builtinKey: 'matrix',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'particles',
    name: 'Floating Bokeh',
    kind: 'builtin',
    builtinKey: 'particles',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'oceanWaves',
    name: 'Ocean Waves',
    kind: 'builtin',
    builtinKey: 'oceanWaves',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fireplace',
    name: 'Cozy Fireplace',
    kind: 'builtin',
    builtinKey: 'fireplace',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'snowfall',
    name: 'Peaceful Snowfall',
    kind: 'builtin',
    builtinKey: 'snowfall',
    createdAt: new Date().toISOString(),
  },
];

interface WallpaperState {
  customWallpapers: Wallpaper[];
  addCustomWallpaper: (wp: Wallpaper) => void;
  removeCustomWallpaper: (id: string) => Promise<void>;
  renameCustomWallpaper: (id: string, name: string) => void;
  getAllWallpapers: () => Wallpaper[];
}

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set, get) => ({
      customWallpapers: [],

      addCustomWallpaper: (wp) => {
        set((state) => ({
          customWallpapers: [wp, ...state.customWallpapers],
        }));
      },

      removeCustomWallpaper: async (id) => {
        const target = get().customWallpapers.find((w) => w.id === id);
        if (target?.blobKey) {
          try {
            await deleteWallpaperBlob(target.blobKey);
          } catch (e) {
            console.error('Failed to delete wallpaper blob', e);
          }
        }
        set((state) => ({
          customWallpapers: state.customWallpapers.filter((w) => w.id !== id),
        }));
      },

      renameCustomWallpaper: (id, name) => {
        set((state) => ({
          customWallpapers: state.customWallpapers.map((w) =>
            w.id === id ? { ...w, name } : w
          ),
        }));
      },

      getAllWallpapers: () => {
        return [...BUILTIN_WALLPAPERS, ...get().customWallpapers];
      },
    }),
    {
      name: 'focusdeck_wallpapers',
    }
  )
);
