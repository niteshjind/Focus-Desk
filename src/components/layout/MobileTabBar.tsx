import React from 'react';
import { Layers, Calendar, Flame, Sparkles } from 'lucide-react';

export type MobileTab = 'notes' | 'calendar' | 'streak' | 'wallpapers';

export interface MobileTabBarProps {
  activeTab: MobileTab;
  onChange: (tab: MobileTab) => void;
  streakCount: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onChange,
  streakCount,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFF8E7] border-t-[3px] border-[#111111] shadow-[0_-4px_0_#111111] flex items-center justify-around py-2">
      <button
        onClick={() => onChange('notes')}
        className={`flex flex-col items-center gap-1 font-heading text-[10px] font-black uppercase transition-transform ${
          activeTab === 'notes' ? 'text-[#111111] scale-110' : 'text-[#111111]/50'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span>Notes</span>
      </button>

      <button
        onClick={() => onChange('calendar')}
        className={`flex flex-col items-center gap-1 font-heading text-[10px] font-black uppercase transition-transform ${
          activeTab === 'calendar' ? 'text-[#111111] scale-110' : 'text-[#111111]/50'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>Log</span>
      </button>

      <button
        onClick={() => onChange('streak')}
        className={`flex flex-col items-center gap-1 font-heading text-[10px] font-black uppercase transition-transform ${
          activeTab === 'streak' ? 'text-[#FF8C42] scale-110' : 'text-[#111111]/50'
        }`}
      >
        <div className="relative">
          <Flame className="w-5 h-5 text-[#FF8C42]" />
          <span className="absolute -top-1 -right-2 text-[9px] font-mono font-bold px-1 bg-[#111111] text-[#FFF8E7]">
            {streakCount}
          </span>
        </div>
        <span>Streak</span>
      </button>

      <button
        onClick={() => onChange('wallpapers')}
        className={`flex flex-col items-center gap-1 font-heading text-[10px] font-black uppercase transition-transform ${
          activeTab === 'wallpapers' ? 'text-[#111111] scale-110' : 'text-[#111111]/50'
        }`}
      >
        <Sparkles className="w-5 h-5 text-[#FFD93D]" />
        <span>Themes</span>
      </button>
    </nav>
  );
};
