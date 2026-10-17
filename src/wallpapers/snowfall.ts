import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

interface Flake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  alpha: number;
}

export class SnowfallWallpaper implements ProceduralWallpaperEngine {
  private flakes: Flake[] = [];

  init(ctx: WallpaperRenderContext) {
    const count = Math.floor((ctx.width * ctx.height) / 8000) + 30;
    this.flakes = [];
    for (let i = 0; i < count; i++) {
      this.flakes.push({
        x: Math.random() * ctx.width,
        y: Math.random() * ctx.height,
        radius: Math.random() * 2.5 + 1.0,
        speedY: Math.random() * 1.5 + 0.6,
        speedX: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, speed } = ctx;

    if (this.flakes.length === 0) {
      this.init(ctx);
    }

    // Crisp midnight winter sky
    const bg = c.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0a1128');
    bg.addColorStop(1, '#1c2541');
    c.fillStyle = bg;
    c.fillRect(0, 0, width, height);

    for (const flake of this.flakes) {
      flake.y += flake.speedY * speed;
      flake.x += (flake.speedX + Math.sin(flake.y * 0.015) * 0.4) * speed;

      if (flake.y > height + 5) {
        flake.y = -5;
        flake.x = Math.random() * width;
      }
      if (flake.x > width + 5) {
        flake.x = -5;
      } else if (flake.x < -5) {
        flake.x = width + 5;
      }

      c.fillStyle = `rgba(255, 255, 255, ${flake.alpha})`;
      c.beginPath();
      c.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      c.fill();
    }
  }
}
