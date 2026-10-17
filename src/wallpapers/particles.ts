import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

export class ParticlesWallpaper implements ProceduralWallpaperEngine {
  private particles: Particle[] = [];

  init(ctx: WallpaperRenderContext) {
    const count = Math.floor((ctx.width * ctx.height) / 18000) + 15;
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * ctx.width,
        y: Math.random() * ctx.height,
        radius: Math.random() * 45 + 25,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.35 + 0.15,
      });
    }
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, speed } = ctx;

    if (this.particles.length === 0) {
      this.init(ctx);
    }

    // Rich dark indigo backdrop
    c.fillStyle = '#09081a';
    c.fillRect(0, 0, width, height);

    c.save();
    c.globalCompositeOperation = 'screen';

    for (const p of this.particles) {
      p.x += p.vx * speed;
      p.y += p.vy * speed;

      if (p.x - p.radius < 0 || p.x + p.radius > width) p.vx *= -1;
      if (p.y - p.radius < 0 || p.y + p.radius > height) p.vy *= -1;

      const grad = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');

      c.fillStyle = grad;
      c.globalAlpha = p.alpha;
      c.beginPath();
      c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      c.fill();
    }

    c.restore();
  }
}
