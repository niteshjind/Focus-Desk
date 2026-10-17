import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

export class AuroraWallpaper implements ProceduralWallpaperEngine {
  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, time, speed } = ctx;

    // Dark night sky base
    c.fillStyle = '#050c18';
    c.fillRect(0, 0, width, height);

    const t = time * 0.0008 * speed;

    // Wave layers with soft additive glow
    c.save();
    c.globalCompositeOperation = 'screen';

    const layers = [
      { color: 'rgba(52, 211, 153, 0.45)', freq: 0.002, amp: 90, speed: 1.0, yBase: height * 0.35 },
      { color: 'rgba(56, 189, 248, 0.35)', freq: 0.0025, amp: 110, speed: 1.3, yBase: height * 0.42 },
      { color: 'rgba(192, 132, 252, 0.30)', freq: 0.0018, amp: 80, speed: 0.8, yBase: height * 0.48 },
      { color: 'rgba(16, 185, 129, 0.25)', freq: 0.003, amp: 100, speed: 1.5, yBase: height * 0.55 },
    ];

    for (const l of layers) {
      c.beginPath();
      c.moveTo(0, height);

      for (let x = 0; x <= width; x += 15) {
        const y =
          l.yBase +
          Math.sin(x * l.freq + t * l.speed) * l.amp +
          Math.cos(x * l.freq * 0.6 + t * l.speed * 0.8) * (l.amp * 0.5);
        c.lineTo(x, y);
      }

      c.lineTo(width, height);
      c.closePath();

      const grad = c.createLinearGradient(0, l.yBase - l.amp, 0, height);
      grad.addColorStop(0, l.color);
      grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      c.fillStyle = grad;
      c.fill();
    }

    c.restore();
  }
}
