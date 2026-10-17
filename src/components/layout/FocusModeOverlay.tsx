import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskNote } from '../../types/focusdeck';
import { useClock } from '../../hooks/useClock';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Check, Target, Clock } from 'lucide-react';

export interface FocusModeOverlayProps {
  isOpen: boolean;
  focusedNote: TaskNote | null;
  onExit: () => void;
  onComplete: (note: TaskNote) => void;
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({
  isOpen,
  focusedNote,
  onExit,
  onComplete,
}) => {
  const { formattedTime, formattedDate } = useClock();
  const rawAutoHide = useSettingsStore((s) => s.focusAutoHideSeconds);
  const focusAutoHideSeconds = rawAutoHide !== undefined ? rawAutoHide : 10;

  // Inactivity auto-hide state (Zen Liquid Glass Clock mode)
  const [isIdle, setIsIdle] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Inactivity detection: auto-hides UI after configurable seconds of no activity
  useEffect(() => {
    if (!isOpen) {
      setIsIdle(false);
      return;
    }

    const timeoutSeconds = focusAutoHideSeconds > 0 ? focusAutoHideSeconds : 10;
    if (focusAutoHideSeconds === 0) {
      setIsIdle(false);
      return;
    }

    let timer: any = null;

    const startInactivityTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setIsIdle(true);
      }, timeoutSeconds * 1000);
    };

    const handleActivity = (e: Event) => {
      if (e.type === 'mousemove') {
        const me = e as MouseEvent;
        const dx = Math.abs(me.clientX - lastMousePos.current.x);
        const dy = Math.abs(me.clientY - lastMousePos.current.y);
        // Ignore micro mouse vibration (< 5px)
        if (dx < 5 && dy < 5) return;
        lastMousePos.current = { x: me.clientX, y: me.clientY };
      }
      setIsIdle(false);
      startInactivityTimer();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'pointerdown', 'wheel'];
    events.forEach((ev) => {
      window.addEventListener(ev, handleActivity, { passive: true });
    });

    // Start the countdown as soon as Focus Mode opens
    startInactivityTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((ev) => {
        window.removeEventListener(ev, handleActivity);
      });
    };
  }, [isOpen, focusAutoHideSeconds]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-40 overflow-hidden select-none transition-colors duration-500 flex flex-col justify-between p-6 ${
          isIdle ? 'cursor-none' : 'cursor-default'
        }`}
      >
        {/* Fullscreen Invisible Click Catcher to Wake UI when idle */}
        {isIdle && (
          <div
            onClick={() => setIsIdle(false)}
            className="absolute inset-0 z-50 pointer-events-auto bg-transparent cursor-pointer"
            title="Click or move mouse to reveal full controls"
          />
        )}

        {/* Top Minimal Bar (Fades out smoothly when idle) */}
        <div
          className={`
            relative z-20 flex items-center justify-between transition-all duration-700 ease-in-out
            ${
              isIdle
                ? 'opacity-0 -translate-y-6 pointer-events-none'
                : 'opacity-100 translate-y-0 pointer-events-auto'
            }
          `}
        >
          <div className="flex items-center gap-3 bg-[#FFF8E7] px-4 py-2 border-[3px] border-[#111111] shadow-[4px_4px_0_#111111]">
            <Target className="w-5 h-5 text-[#FF8C42] animate-spin-slow" />
            <div className="flex flex-col text-left">
              <span className="font-heading font-black text-sm uppercase tracking-wider text-[#111111]">
                Focus Mode
              </span>
              {focusAutoHideSeconds > 0 && (
                <span className="text-[9px] font-heading font-bold text-[#111111]/60 uppercase">
                  Zen Clock in {focusAutoHideSeconds}s inactivity
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#FFF8E7] px-4 py-2 border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] flex flex-col items-center">
            <span className="font-mono font-bold text-lg text-[#111111] leading-none">
              {formattedTime}
            </span>
            <span className="text-[10px] font-heading font-bold uppercase text-[#111111]/70 mt-0.5">
              {formattedDate}
            </span>
          </div>

          <Button
            size="sm"
            color="paper"
            onClick={onExit}
            icon={<X className="w-4 h-4" />}
          >
            Exit (Esc)
          </Button>
        </div>

        {/* Center Area: Liquid Glass Clock (when idle) OR Focus Task Card (when active) */}
        <div className="relative my-auto w-full flex items-center justify-center">
          {/* 🌟 Liquid Glass Mode Clock (Visible ONLY after UI disappears on inactivity) */}
          <div
            className={`
              transition-all duration-700 ease-out flex flex-col items-center justify-center pointer-events-none
              ${
                isIdle
                  ? 'opacity-100 scale-100 relative'
                  : 'opacity-0 scale-95 pointer-events-none absolute'
              }
            `}
          >
            <div
              className="relative px-12 md:px-16 py-8 md:py-10 rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/10 border border-white/25 text-center"
              style={{
                boxShadow:
                  '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {/* Liquid Glass Highlight Glows */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {/* Simple White Text Clock */}
              <div className="font-mono font-light text-6xl sm:text-7xl md:text-8xl text-white tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] leading-none select-none">
                {formattedTime}
              </div>

              {/* Simple White Date */}
              <div className="mt-3 text-xs md:text-sm font-heading font-semibold tracking-widest text-white/80 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] select-none">
                {formattedDate}
              </div>

              {/* Focused Task Pill in White Glass */}
              {focusedNote && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-heading font-semibold tracking-wide drop-shadow-sm select-none">
                  <span className="w-2 h-2 rounded-full bg-[#6BCB77] animate-pulse" />
                  <span className="truncate max-w-xs">
                    {focusedNote.title || focusedNote.body.slice(0, 30)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Active Focus Card (Visible when user is active) */}
          <div
            className={`
              w-full max-w-lg bg-[#FFF8E7] border-[4px] border-[#111111] shadow-[10px_10px_0_#111111] p-6 text-left transition-all duration-700 ease-in-out
              ${
                isIdle
                  ? 'opacity-0 scale-95 pointer-events-none absolute'
                  : 'opacity-100 scale-100 pointer-events-auto relative'
              }
            `}
          >
            {focusedNote ? (
              <div>
                {/* Note Header */}
                <div className="flex items-center justify-between border-b-[3px] border-[#111111] pb-3 mb-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {focusedNote.subject && (
                      <Badge variant="yellow" size="sm">
                        {focusedNote.subject}
                      </Badge>
                    )}
                    {focusedNote.priority && (
                      <Badge
                        variant={focusedNote.priority === 'high' ? 'danger' : 'paper'}
                        size="sm"
                      >
                        {focusedNote.priority.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  {(focusedNote.dueDate || focusedNote.dueTime) && (
                    <span className="text-xs font-bold text-[#111111]/70">
                      Due: {focusedNote.dueDate} {focusedNote.dueTime}
                    </span>
                  )}
                </div>

                {/* Note Title & Content */}
                {focusedNote.title && (
                  <h1 className="font-heading font-black text-2xl uppercase tracking-wide mb-3 text-[#111111]">
                    {focusedNote.title}
                  </h1>
                )}

                <p className="text-base font-medium text-[#111111] whitespace-pre-wrap leading-relaxed mb-6 font-body">
                  {focusedNote.body}
                </p>

                {/* Focus Card Actions */}
                <div className="flex items-center justify-between pt-4 border-t-[3px] border-[#111111]">
                  <span className="text-xs font-bold text-[#111111]/60">
                    Press <strong>Esc</strong> to return to board
                  </span>
                  <Button
                    size="lg"
                    color="green"
                    onClick={() => {
                      onComplete(focusedNote);
                      onExit();
                    }}
                    icon={<Check className="w-5 h-5 stroke-[3]" />}
                  >
                    Mark Completed
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-[#FFD93D] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] mx-auto flex items-center justify-center mb-3 -rotate-3">
                  <Clock className="w-7 h-7 text-[#111111]" />
                </div>
                <h2 className="font-heading font-black text-xl uppercase tracking-wide mb-2 text-[#111111]">
                  Zen Focus Space
                </h2>
                <p className="text-xs font-bold text-[#111111]/70 mb-5 max-w-sm mx-auto">
                  Take a distraction-free study break. Leave the mouse untouched to enter the Liquid Glass Clock screensaver.
                </p>
                <Button size="md" color="paper" onClick={onExit}>
                  Return to Dashboard (Esc)
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Status Info (Fades out when idle) */}
        <div
          className={`
            relative z-20 flex items-center justify-between text-xs font-bold text-[#111111]/70 bg-[#FFF8E7] px-4 py-1.5 border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] transition-all duration-700 ease-in-out
            ${
              isIdle
                ? 'opacity-0 translate-y-6 pointer-events-none'
                : 'opacity-100 translate-y-0 pointer-events-auto'
            }
          `}
        >
          <span>Press <strong>Esc</strong> to return to dashboard</span>
          <span>Inactivity triggers Liquid Glass Clock mode</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
