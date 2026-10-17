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

  return (
    <header className="relative z-20 w-full bg-[#FFF8E7] border-b-[3px] border-[#111111] shadow-[0_4px_0_#111111] px-4 py-2 flex items-center justify-between gap-3 select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#FFD93D] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center -rotate-3">
          <Layers className="w-5 h-5 text-[#111111] stroke-[2.5]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-lg tracking-wider text-[#111111] uppercase leading-none">
            FocusDeck
          </span>
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#111111]/60">
            Study Dashboard
          </span>
        </div>
      </div>

      {/* Live Digital Clock & Date */}
      <div className="hidden md:flex flex-col items-center px-4 py-1 bg-white border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]">
        <span className="font-mono font-bold text-sm text-[#111111] leading-none tracking-wider">
          {formattedTime}
        </span>
        <span className="text-[10px] font-heading font-black uppercase text-[#111111]/70 mt-0.5">
          {formattedDate}
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
