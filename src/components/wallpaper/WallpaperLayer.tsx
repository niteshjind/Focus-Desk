import React, { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useWallpaperStore } from '../../store/wallpaperStore';
import { proceduralWallpaperRegistry } from '../../wallpapers/registry';
import { getWallpaperBlob } from '../../lib/db';

export const WallpaperLayer: React.FC = () => {
  const activeWallpaperId = useSettingsStore((s) => s.activeWallpaperId);
  const dim = useSettingsStore((s) => s.dim);
  const blur = useSettingsStore((s) => s.blur);
  const speed = useSettingsStore((s) => s.speed);
  const paused = useSettingsStore((s) => s.paused);
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);

  const getAllWallpapers = useWallpaperStore((s) => s.getAllWallpapers);
  const wallpapers = getAllWallpapers();
  const currentWallpaper =
    wallpapers.find((w) => w.id === activeWallpaperId) || wallpapers[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);

  // Tab visibility listener to auto-pause when hidden
  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Load custom uploaded blob if needed
  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    if (currentWallpaper?.blobKey) {
      getWallpaperBlob(currentWallpaper.blobKey).then((record) => {
        if (record && active) {
          createdUrl = URL.createObjectURL(record.blob);
          setMediaBlobUrl(createdUrl);
        }
      });
    } else {
      setMediaBlobUrl(null);
    }

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [currentWallpaper]);

  // Procedural canvas animation loop
  useEffect(() => {
    if (!currentWallpaper || currentWallpaper.kind !== 'builtin') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine =
      proceduralWallpaperRegistry[currentWallpaper.builtinKey || 'rain'] ||
      proceduralWallpaperRegistry.rain;

    let animId: number;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      engine.init?.({
        canvas,
        ctx,
        width,
        height,
        speed,
        time: performance.now(),
        deltaTime: 16,
        dpr,
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const loop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      const shouldAnimate = !paused && !reduceMotion && isTabVisible;

      if (shouldAnimate) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        engine.render({
          canvas,
          ctx,
          width,
          height,
          speed,
          time,
          deltaTime,
          dpr,
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      engine.cleanup?.();
    };
  }, [currentWallpaper, paused, speed, reduceMotion, isTabVisible]);

  const mediaSource = mediaBlobUrl || currentWallpaper?.url;

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Procedural Canvas Layer */}
      {currentWallpaper?.kind === 'builtin' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
        />
      )}

      {/* Video Media Layer */}
      {currentWallpaper?.kind === 'video' && mediaSource && (
        <video
          src={mediaSource}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
      )}

      {/* Image / GIF / URL Media Layer */}
      {(currentWallpaper?.kind === 'image' || currentWallpaper?.kind === 'url') && mediaSource && (
        <img
          src={mediaSource}
          alt={currentWallpaper.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
      )}

      {/* Blur Backdrop Filter */}
      {blur > 0 && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` }}
        />
      )}

      {/* Adjustable Dim Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
        style={{ opacity: dim / 100 }}
      />
    </div>
  );
};
