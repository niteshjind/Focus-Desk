import { create } from 'zustand';

export type TimerMode = 'focus' | 'short' | 'long' | 'custom';

export const TIMER_PRESETS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
  custom: 45 * 60,
};

interface TimerState {
  mode: TimerMode;
  customMinutes: number;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  sessionsCompleted: number;

  setMode: (mode: TimerMode, customMin?: number) => void;
  setCustomMinutes: (min: number) => void;
  adjustMinutes: (delta: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeSession: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'focus',
  customMinutes: 25,
  timeLeft: 25 * 60,
  totalDuration: 25 * 60,
  isRunning: false,
  sessionsCompleted: 0,

  setMode: (mode, customMin) => {
    const min = customMin ?? (mode === 'custom' ? get().customMinutes : TIMER_PRESETS[mode] / 60);
    const duration = mode === 'custom' ? min * 60 : TIMER_PRESETS[mode];
    set({
      mode,
      customMinutes: mode === 'custom' ? min : get().customMinutes,
      totalDuration: duration,
      timeLeft: duration,
      isRunning: false,
    });
  },

  setCustomMinutes: (min) => {
    const validMin = Math.max(1, Math.min(360, min));
    const duration = validMin * 60;
    set({
      mode: 'custom',
      customMinutes: validMin,
      totalDuration: duration,
      timeLeft: duration,
      isRunning: false,
    });
  },

  adjustMinutes: (delta) => {
    const { timeLeft, totalDuration } = get();
    const newSeconds = Math.max(60, timeLeft + delta * 60);
    set({
      timeLeft: newSeconds,
      totalDuration: Math.max(totalDuration, newSeconds),
    });
  },

  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () => {
    const { mode, customMinutes } = get();
    const duration = mode === 'custom' ? customMinutes * 60 : TIMER_PRESETS[mode];
    set({
      timeLeft: duration,
      totalDuration: duration,
      isRunning: false,
    });
  },

  tick: () => {
    const { timeLeft, isRunning } = get();
    if (!isRunning) return;
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      get().completeSession();
    }
  },

  completeSession: () => {
    const { mode, sessionsCompleted } = get();
    set({
      isRunning: false,
      sessionsCompleted: mode === 'focus' || mode === 'custom' ? sessionsCompleted + 1 : sessionsCompleted,
    });
  },
}));
