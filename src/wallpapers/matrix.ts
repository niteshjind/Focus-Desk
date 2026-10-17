import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

export class MatrixWallpaper implements ProceduralWallpaperEngine {
  private drops: number[] = [];
  private chars = '0123456789ABCDEFΣΠΩλψθ$+-*/=><~#%&';
  private fontSize = 16;
  private lastUpdate = 0;

  init(ctx: WallpaperRenderContext) {
    const columns = Math.floor(ctx.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -50);
    }
  }

  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, time, speed } = ctx;

    const interval = 45 / speed;
    if (time - this.lastUpdate < interval) {
      return;
    }
    this.lastUpdate = time;

    // Soft fade effect for phosphor trails
    c.fillStyle = 'rgba(5, 10, 8, 0.08)';
    c.fillRect(0, 0, width, height);

    if (this.drops.length === 0) {
      this.init(ctx);
    }

    c.font = `${this.fontSize}px 'Space Mono', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Bright leading character
      c.fillStyle = '#bbf7d0';
      c.fillText(char, x, y);

      // Trailing softer green
      c.fillStyle = '#22c55e';
      c.fillText(this.chars[Math.floor(Math.random() * this.chars.length)], x, y - this.fontSize);

      if (y > height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }
}
