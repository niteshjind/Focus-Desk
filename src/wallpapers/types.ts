export interface WallpaperRenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  speed: number;
  time: number;
  deltaTime: number;
  dpr: number;
}

export interface ProceduralWallpaperEngine {
  init?: (ctx: WallpaperRenderContext) => void;
  render: (ctx: WallpaperRenderContext) => void;
  cleanup?: () => void;
}
