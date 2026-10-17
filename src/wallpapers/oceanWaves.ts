import { ProceduralWallpaperEngine, WallpaperRenderContext } from './types';

export class OceanWavesWallpaper implements ProceduralWallpaperEngine {
  render(ctx: WallpaperRenderContext) {
    const { ctx: c, width, height, time, speed } = ctx;

    // Deep sea gradient
    const sky = c.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#02182b');
    sky.addColorStop(0.5, '#042848');
    sky.addColorStop(1, '#053c6d');
    c.fillStyle = sky;
    c.fillRect(0, 0, width, height);

    const t = time * 0.0012 * speed;

    const waveLayers = [
      { color: '#094d82', y: height * 0.55, amp: 22, freq: 0.003, speed: 1.0 },
      { color: '#0c6291', y: height * 0.65, amp: 28, freq: 0.0035, speed: 1.4 },
      { color: '#1375a6', y: height * 0.75, amp: 34, freq: 0.004, speed: 1.8 },
      { color: '#1c8ebf', y: height * 0.85, amp: 40, freq: 0.0045, speed: 2.2 },
    ];

    for (const wave of waveLayers) {
      c.beginPath();
      c.moveTo(0, height);

      for (let x = 0; x <= width; x += 10) {
        const y =
          wave.y +
          Math.sin(x * wave.freq + t * wave.speed) * wave.amp +
          Math.cos(x * wave.freq * 0.5 + t * wave.speed * 0.7) * (wave.amp * 0.4);
        c.lineTo(x, y);
      }

      c.lineTo(width, height);
      c.closePath();

      c.fillStyle = wave.color;
      c.fill();
    }
  }
}
