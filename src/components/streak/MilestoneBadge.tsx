import React from 'react';
import { Award, Lock } from 'lucide-react';

export interface MilestoneBadgeProps {
  days: number;
  isUnlocked: boolean;
  isNext?: boolean;
}

export const MilestoneBadge: React.FC<MilestoneBadgeProps> = ({
  days,
  isUnlocked,
  isNext,
}) => {
  return (
    <div
      title={isUnlocked ? `Unlocked! ${days}-Day Consistency Milestone` : `Locked (${days} Days)`}
      className={`
        flex items-center gap-1.5 px-2 py-1 border-[2px] border-[#111111] select-none text-xs font-bold
        ${
          isUnlocked
            ? 'bg-[#FFD93D] shadow-[2px_2px_0_#111111] text-[#111111]'
            : isNext
            ? 'bg-white border-dashed text-[#111111]/70'
            : 'bg-neutral-200/50 text-neutral-400 border-neutral-300'
        }
      `}
    >
      {isUnlocked ? (
        <Award className="w-3.5 h-3.5 text-[#FF8C42] fill-[#FF8C42]" />
      ) : (
        <Lock className="w-3 h-3 text-neutral-400" />
      )}
      <span className="font-heading font-black">{days}d</span>
    </div>
  );
};
