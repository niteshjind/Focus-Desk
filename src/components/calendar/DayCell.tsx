import React from 'react';
import { isToday, isSameMonth, format } from 'date-fns';

export interface DayCellProps {
  date: Date;
  currentMonthDate: Date;
  completedCount: number;
  hasDueTasks: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonthDate,
  completedCount,
  hasDueTasks,
  isSelected,
  onClick,
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonthDate);
  const isCurrentDay = isToday(date);
  const dayNum = format(date, 'd');

  // Heatmap intensity colors based on PRD: 0, 1-2, 3-4, 5+
  let heatmapBg = 'bg-[#FFF8E7]';
  if (completedCount >= 5) {
    heatmapBg = 'bg-[#48bb78] text-[#111111]'; // intense green
  } else if (completedCount >= 3) {
    heatmapBg = 'bg-[#68d391] text-[#111111]'; // medium green
  } else if (completedCount >= 1) {
    heatmapBg = 'bg-[#9ae6b4] text-[#111111]'; // light green
  }

  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-square p-1 border-[2px] border-[#111111] flex flex-col items-center justify-between
        transition-all cursor-pointer select-none text-left
        ${isCurrentMonth ? heatmapBg : 'bg-neutral-200/40 text-neutral-400 opacity-60'}
        ${
          isSelected
            ? 'ring-2 ring-black shadow-[3px_3px_0_#111111] -translate-x-0.5 -translate-y-0.5 z-10'
            : 'hover:shadow-[2px_2px_0_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5'
        }
        ${isCurrentDay ? 'border-[3px] border-[#111111] font-black' : ''}
      `}
    >
      {/* Day Number and Today Highlight */}
      <div className="w-full flex items-center justify-between text-[11px] font-heading font-black">
        <span className={isCurrentDay ? 'underline decoration-[#FFD93D] decoration-2' : ''}>
          {dayNum}
        </span>
        {hasDueTasks && (
          <span
            className="w-2 h-2 rounded-full border border-[#111111] bg-[#FF8C42]"
            title="Has upcoming due tasks"
          />
        )}
      </div>

      {/* Completed count badge */}
      {completedCount > 0 && (
        <div className="w-full text-right">
          <span className="inline-block px-1 bg-[#111111] text-[#FFF8E7] text-[9px] font-mono font-bold">
            {completedCount}
          </span>
        </div>
      )}
    </button>
  );
};
