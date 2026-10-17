import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export class StarsWallpaper implements ProceduralWallpaperEngine {
  private stars: Star[] = [];
  private shootingStar: ShootingStar | null = null;
  private nextShootingStarTime = 0;

  init(ctx: WallpaperRenderContext) {
    const starColors = ['#FFFFFF', '#E0F2FE', '#FEF9C3', '#EDE9FE'];
    const count = Math.floor((ctx.width * ctx.height) / 6000);
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * ctx.width,
        y: Math.random() * ctx.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }
    this.nextShootingStarTime = performance.now() + 3000 + Math.random() * 5000;
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, speed } = ctx;

    // Deep cosmic background
    const bg = c.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#030712');
    bg.addColorStop(0.5, '#0b0f19');
    bg.addColorStop(1, '#090514');
    c.fillStyle = bg;
    c.fillRect(0, 0, width, height);

    if (this.stars.length === 0) {
      this.init(ctx);
    }

    // Render twinkling stars
    for (const star of this.stars) {
      star.alpha += star.twinkleSpeed * speed;
      const opacity = 0.3 + 0.7 * Math.abs(Math.sin(star.alpha));

      c.save();
      c.globalAlpha = opacity;
      c.fillStyle = star.color;
      c.beginPath();
      c.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    // Handle shooting stars
    const now = performance.now();
    if (!this.shootingStar && now > this.nextShootingStarTime) {
      this.shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 100 + 80,
        speed: (Math.random() * 12 + 15) * speed,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1.0,
        active: true,
      };
      this.nextShootingStarTime = now + 4000 + Math.random() * 8000;
    }

    if (this.shootingStar && this.shootingStar.active) {
      const ss = this.shootingStar;
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.015 * speed;

      if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
        this.shootingStar = null;
      } else {
        c.save();
        c.strokeStyle = `rgba(255, 255, 255, ${ss.alpha})`;
        c.lineWidth = 2;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(ss.x, ss.y);
        c.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        c.stroke();
        c.restore();
      }
    }
  }
}
