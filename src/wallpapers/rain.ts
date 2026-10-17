import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  thickness: number;
}

export class RainWallpaper implements ProceduralWallpaperEngine {
  private drops: Drop[] = [];

  init(ctx: WallpaperRenderContext) {
    const count = Math.floor((ctx.width * ctx.height) / 10000);
    this.drops = [];
    for (let i = 0; i < count; i++) {
      this.drops.push({
        x: Math.random() * ctx.width,
        y: Math.random() * ctx.height,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 8 + 12,
        opacity: Math.random() * 0.4 + 0.2,
        thickness: Math.random() * 1.5 + 0.8,
      });
    }
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, speed } = ctx;

    // Moody dark rain background with subtle gradient
    const bgGradient = c.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#101726');
    bgGradient.addColorStop(1, '#1b2a47');
    c.fillStyle = bgGradient;
    c.fillRect(0, 0, width, height);

    // Subtle window condensation vignette
    c.fillStyle = 'rgba(255, 255, 255, 0.02)';
    c.fillRect(0, 0, width, height);

    if (this.drops.length === 0) {
      this.init(ctx);
    }

    // Draw rain streaks
    c.lineCap = 'round';
    for (const drop of this.drops) {
      drop.y += drop.speed * speed;
      drop.x += (drop.speed * 0.15) * speed; // slight slant

      if (drop.y > height) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
      if (drop.x > width) {
        drop.x = 0;
      }

      c.beginPath();
      c.moveTo(drop.x, drop.y);
      c.lineTo(drop.x + drop.length * 0.15, drop.y + drop.length);
      c.strokeStyle = `rgba(180, 215, 255, ${drop.opacity})`;
      c.lineWidth = drop.thickness;
      c.stroke();
    }
  }
}
