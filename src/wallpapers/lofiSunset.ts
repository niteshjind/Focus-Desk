import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

export class LofiSunsetWallpaper implements ProceduralWallpaperEngine {
  private clouds: Cloud[] = [];

  init(ctx: WallpaperRenderContext) {
    this.clouds = [
      { x: 50, y: ctx.height * 0.25, width: 220, height: 45, speed: 0.3, opacity: 0.25 },
      { x: ctx.width * 0.5, y: ctx.height * 0.35, width: 320, height: 55, speed: 0.2, opacity: 0.35 },
      { x: ctx.width * 0.8, y: ctx.height * 0.18, width: 180, height: 40, speed: 0.4, opacity: 0.2 },
      { x: ctx.width * 0.2, y: ctx.height * 0.48, width: 260, height: 50, speed: 0.25, opacity: 0.3 },
    ];
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, speed } = ctx;

    if (this.clouds.length === 0) {
      this.init(ctx);
    }

    // Synthwave Sunset gradient
    const sky = c.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#2b1055');
    sky.addColorStop(0.35, '#75225b');
    sky.addColorStop(0.6, '#b83b5e');
    sky.addColorStop(0.85, '#f08a5d');
    sky.addColorStop(1, '#ffc764');
    c.fillStyle = sky;
    c.fillRect(0, 0, width, height);

    // Glowing Sun Disc
    const sunX = width * 0.5;
    const sunY = height * 0.55;
    const sunRadius = Math.min(width, height) * 0.18;

    const sunGlow = c.createRadialGradient(sunX, sunY, sunRadius * 0.2, sunX, sunY, sunRadius * 1.5);
    sunGlow.addColorStop(0, 'rgba(255, 230, 100, 0.9)');
    sunGlow.addColorStop(0.5, 'rgba(255, 120, 80, 0.6)');
    sunGlow.addColorStop(1, 'rgba(255, 100, 100, 0)');

    c.fillStyle = sunGlow;
    c.beginPath();
    c.arc(sunX, sunY, sunRadius * 1.5, 0, Math.PI * 2);
    c.fill();

    // Drifting retro clouds
    for (const cloud of this.clouds) {
      cloud.x += cloud.speed * speed;
      if (cloud.x > width + cloud.width) {
        cloud.x = -cloud.width;
      }

      c.fillStyle = `rgba(45, 15, 60, ${cloud.opacity})`;
      c.beginPath();
      c.roundRect(cloud.x, cloud.y, cloud.width, cloud.height, 20);
      c.fill();
    }
  }
}
