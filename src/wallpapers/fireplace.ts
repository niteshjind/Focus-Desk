import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

interface Ember {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  color: string;
}

export class FireplaceWallpaper implements ProceduralWallpaperEngine {
  private embers: Ember[] = [];

  init(ctx: WallpaperRenderContext) {
    const count = 50;
    const colors = ['#f59e0b', '#ef4444', '#f97316', '#fbbf24'];
    this.embers = [];
    for (let i = 0; i < count; i++) {
      this.embers.push({
        x: ctx.width * 0.4 + Math.random() * (ctx.width * 0.2),
        y: ctx.height * 0.7 + Math.random() * (ctx.height * 0.3),
        size: Math.random() * 4 + 2,
        speedY: Math.random() * 2 + 1.5,
        speedX: (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, time, speed } = ctx;

    // Dark cozy hearth background
    c.fillStyle = '#0f0502';
    c.fillRect(0, 0, width, height);

    if (this.embers.length === 0) {
      this.init(ctx);
    }

    // Flickering fire glow at bottom center
    const flicker = Math.sin(time * 0.005) * 0.08 + Math.cos(time * 0.012) * 0.05;
    const hearthX = width * 0.5;
    const hearthY = height * 0.9;
    const glowRadius = Math.min(width, height) * 0.5;

    const glow = c.createRadialGradient(hearthX, hearthY, 20, hearthX, hearthY, glowRadius);
    glow.addColorStop(0, `rgba(249, 115, 22, ${0.45 + flicker})`);
    glow.addColorStop(0.4, `rgba(239, 68, 68, ${0.25 + flicker})`);
    glow.addColorStop(1, 'transparent');

    c.fillStyle = glow;
    c.beginPath();
    c.arc(hearthX, hearthY, glowRadius, 0, Math.PI * 2);
    c.fill();

    // Floating embers
    c.save();
    c.globalCompositeOperation = 'screen';

    for (const ember of this.embers) {
      ember.y -= ember.speedY * speed;
      ember.x += (ember.speedX + Math.sin(ember.y * 0.05) * 0.5) * speed;
      ember.alpha -= 0.006 * speed;

      if (ember.alpha <= 0 || ember.y < height * 0.2) {
        ember.y = height * 0.85 + Math.random() * (height * 0.15);
        ember.x = width * 0.4 + Math.random() * (width * 0.2);
        ember.alpha = Math.random() * 0.8 + 0.2;
      }

      c.fillStyle = ember.color;
      c.globalAlpha = ember.alpha;
      c.beginPath();
      c.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      c.fill();
    }

    c.restore();
  }
}
