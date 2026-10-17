import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export class SakuraWallpaper implements ProceduralWallpaperEngine {
  private petals: Petal[] = [];

  init(ctx: WallpaperRenderContext) {
    const count = Math.floor((ctx.width * ctx.height) / 12000) + 20;
    const colors = ['#fbcfe8', '#f472b6', '#fda4af', '#fce7f3'];
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * ctx.width,
        y: Math.random() * ctx.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.5 + 0.8,
        speedX: Math.random() * 1.2 - 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, speed } = ctx;

    if (this.petals.length === 0) {
      this.init(ctx);
    }

    // Soft pastel dusk sky background
    const bg = c.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#2d1b36');
    bg.addColorStop(0.5, '#4a2545');
    bg.addColorStop(1, '#662e5b');
    c.fillStyle = bg;
    c.fillRect(0, 0, width, height);

    for (const petal of this.petals) {
      petal.y += petal.speedY * speed;
      petal.x += (petal.speedX + Math.sin(petal.y * 0.02) * 0.6) * speed;
      petal.rotation += petal.rotationSpeed * speed;

      if (petal.y > height + 20) {
        petal.y = -20;
        petal.x = Math.random() * width;
      }
      if (petal.x > width + 20) {
        petal.x = -20;
      }

      c.save();
      c.translate(petal.x, petal.y);
      c.rotate(petal.rotation);

      // Draw sakura petal shape
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(petal.size / 2, -petal.size / 2, petal.size, 0, 0, petal.size * 1.5);
      c.bezierCurveTo(-petal.size, 0, -petal.size / 2, -petal.size / 2, 0, 0);

      c.fillStyle = petal.color;
      c.globalAlpha = 0.75;
      c.fill();
      c.restore();
    }
  }
}
