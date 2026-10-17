import React from 'react';
import { useClock } from '../../hooks/useClock';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useHistoryStore } from '../../store/historyStore';
import { useSettingsStore } from '../../store/settingsStore';
import { computeStreak } from '../../lib/streak';
import { FlameIcon } from '../streak/FlameIcon';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  HelpCircle,
  Layers,
} from 'lucide-react';

import { useTimerStore } from '../../store/timerStore';

export interface TopBarProps {
  onOpenWallpapers: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenWallpapers,
  onOpenSettings,
  onOpenShortcuts,
}) => {
  const { formattedTime, formattedDate } = useClock();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const completedTasks = useHistoryStore((s) => s.completedTasks);
  const dayStartHour = useSettingsStore((s) => s.dayStartHour);
  const streakStats = computeStreak(completedTasks, new Date(), dayStartHour);

  const isTimerRunning = useTimerStore((s) => s.isRunning);
  const timeLeft = useTimerStore((s) => s.timeLeft);
  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = timeLeft % 60;
  const timerString = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

  return (
    <header className="relative z-20 w-full bg-[#FFF8E7] border-b-[3px] border-[#111111] shadow-[0_4px_0_#111111] px-2 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-3 select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-7 h-7 sm:w-8 h-8 bg-[#FFD93D] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center -rotate-3 shrink-0">
          <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111] stroke-[2.5]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-sm sm:text-lg tracking-wider text-[#111111] uppercase leading-none">
            FocusDeck
          </span>
          <span className="hidden xs:inline text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest text-[#111111]/60">
            Study Dashboard
          </span>
        </div>
      </div>

      {/* Live Digital Clock / Active Study Timer — Visible on ALL Mobiles and Devices */}
      <div
        className={`flex flex-col items-center px-2 sm:px-4 py-0.5 sm:py-1 border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] transition-colors shrink-0 ${
          isTimerRunning ? 'bg-[#FFD93D]' : 'bg-white'
        }`}
        title={isTimerRunning ? 'Study Timer in progress' : 'Current Time'}
      >
        <span className="font-mono font-bold text-xs sm:text-sm text-[#111111] leading-none tracking-wider flex items-center gap-1">
          {isTimerRunning ? (
            <>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              <span>{timerString}</span>
            </>
          ) : (
            formattedTime
          )}
        </span>
        <span className="hidden sm:block text-[9px] sm:text-[10px] font-heading font-black uppercase text-[#111111]/70 mt-0.5">
          {isTimerRunning ? 'Focus Session' : formattedDate}
        </span>
      </div>

      {/* Right Controls Bar */}
      <div className="flex items-center gap-2">
        {/* Streak Quick Badge */}
        <div
          title={`${streakStats.currentStreak}-Day Consistency Streak`}
          className="flex items-center gap-1.5 px-3 py-1 bg-white border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]"
        >
          <FlameIcon
            isActive={streakStats.isActiveToday}
            isAtRisk={streakStats.isAtRisk}
            size="sm"
          />
          <span className="font-heading font-black text-xs text-[#111111]">
            {streakStats.currentStreak}
          </span>
        </div>

        {/* Action Buttons */}
        <Button
          size="sm"
          color="yellow"
          onClick={onOpenWallpapers}
          icon={<Sparkles className="w-3.5 h-3.5" />}
          className="hidden sm:inline-flex"
        >
          Wallpapers
        </Button>

        <Button
          size="sm"
          variant="icon"
          color="paper"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        <Button
          size="sm"
          variant="icon"
          color="paper"
          onClick={onOpenSettings}
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="icon"
          color="paper"
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
