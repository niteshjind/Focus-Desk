import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Sparkles, Pause, Play } from 'lucide-react';

export interface LiquidGlassTimerOverlayProps {
  onZenChange?: (isZen: boolean) => void;
}

export const LiquidGlassTimerOverlay: React.FC<LiquidGlassTimerOverlayProps> = ({ onZenChange }) => {
  const isRunning = useTimerStore((s) => s.isRunning);
  const timeLeft = useTimerStore((s) => s.timeLeft);
  const pauseTimer = useTimerStore((s) => s.pauseTimer);
  const startTimer = useTimerStore((s) => s.startTimer);

  const rawAutoHide = useSettingsStore((s) => s.focusAutoHideSeconds);
  const focusAutoHideSeconds = rawAutoHide !== undefined ? rawAutoHide : 10;

  const [isZen, setIsZen] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const timerRef = useRef<any>(null);

  // Notify parent component (App.tsx) when Zen mode changes to hide/show rest of UI
  useEffect(() => {
    onZenChange?.(isZen);
  }, [isZen, onZenChange]);

  // Inactivity detection when timer is running
  useEffect(() => {
    if (!isRunning) {
      setIsZen(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const timeoutSec = focusAutoHideSeconds > 0 ? focusAutoHideSeconds : 10;
    if (focusAutoHideSeconds === 0) {
      setIsZen(false);
      return;
    }

    const startInactivityCountdown = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsZen(true);
      }, timeoutSec * 1000);
    };

    const handleUserActivity = (e: Event) => {
      if (e.type === 'mousemove') {
        const me = e as MouseEvent;
        const dx = Math.abs(me.clientX - lastMousePos.current.x);
        const dy = Math.abs(me.clientY - lastMousePos.current.y);
        // Filter sub-6px micro mouse vibrations
        if (dx < 6 && dy < 6) return;
        lastMousePos.current = { x: me.clientX, y: me.clientY };
      }
      setIsZen(false);
      startInactivityCountdown();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'pointerdown', 'wheel'];
    events.forEach((ev) => {
      window.addEventListener(ev, handleUserActivity, { passive: true });
    });

    // Start timer as soon as timer runs
    startInactivityCountdown();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => {
        window.removeEventListener(ev, handleUserActivity);
      });
    };
  }, [isRunning, focusAutoHideSeconds]);

  if (!isRunning && !isZen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <AnimatePresence>
      {isZen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 select-none"
        >
          {/* Fullscreen click catcher: clicking or moving mouse immediately restores full UI */}
          <div
            onClick={() => setIsZen(false)}
            className="absolute inset-0 bg-transparent cursor-default"
          />

          {/* 🌟 Liquid Glass Timer Clock in Center 🌟 */}
          <motion.div
            initial={{ scale: 0.9, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 10, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div
              className="relative px-12 sm:px-16 md:px-24 py-10 md:py-14 rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/10 border border-white/25 text-center transition-transform hover:scale-[1.02]"
              style={{
                boxShadow:
                  '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {/* Liquid Glass Highlight Reflection Glows */}
              <div className="absolute -top-28 -left-28 w-56 h-56 bg-white/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-28 -right-28 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              {/* Simple White Text Clock */}
              <div className="font-mono font-light text-7xl sm:text-8xl md:text-9xl text-white tracking-widest drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] leading-none select-none">
                {timeString}
              </div>

              {/* Subtle Status Line in White */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs md:text-sm font-heading font-semibold tracking-widest text-white/80 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] select-none">
                <Sparkles className="w-4 h-4 text-white/70 animate-pulse" />
                <span>Focus in Progress</span>
              </div>

              {/* Quick Glass Action: Pause / Resume */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isRunning) {
                      pauseTimer();
                    } else {
                      startTimer();
                    }
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-heading font-bold uppercase tracking-wider backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
