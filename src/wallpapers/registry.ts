import { ProceduralWallpaperEngine } from './types';
import { RainWallpaper } from './rain';
import { StarsWallpaper } from './stars';
import { AuroraWallpaper } from './aurora';
import { LofiSunsetWallpaper } from './lofiSunset';
import { SakuraWallpaper } from './sakura';
import { MatrixWallpaper } from './matrix';
import { ParticlesWallpaper } from './particles';
import { OceanWavesWallpaper } from './oceanWaves';
import { FireplaceWallpaper } from './fireplace';
import { SnowfallWallpaper } from './snowfall';

export const proceduralWallpaperRegistry: Record<string, ProceduralWallpaperEngine> = {
  rain: new RainWallpaper(),
  stars: new StarsWallpaper(),
  aurora: new AuroraWallpaper(),
  lofiSunset: new LofiSunsetWallpaper(),
  sakura: new SakuraWallpaper(),
  matrix: new MatrixWallpaper(),
  particles: new ParticlesWallpaper(),
  oceanWaves: new OceanWavesWallpaper(),
  fireplace: new FireplaceWallpaper(),
  snowfall: new SnowfallWallpaper(),
};
