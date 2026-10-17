import React, { useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { FlameIcon } from './FlameIcon';
import { MilestoneBadge } from './MilestoneBadge';
import { useHistoryStore } from '../../store/historyStore';
import { useSettingsStore } from '../../store/settingsStore';
import { computeStreak, MILESTONES } from '../../lib/streak';
import { fireMilestoneConfetti } from '../../lib/confetti';
import { Flame, Trophy, CheckCheck, CalendarCheck, AlertTriangle } from 'lucide-react';

export interface StreakWidgetProps {
  onMilestoneReached?: (milestone: number) => void;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ onMilestoneReached }) => {
  const completedTasks = useHistoryStore((s) => s.completedTasks);
  const dayStartHour = useSettingsStore((s) => s.dayStartHour);

  const streakStats = computeStreak(completedTasks, new Date(), dayStartHour);
  const prevLongestRef = useRef(streakStats.longestStreak);

  // Check if a new milestone was reached
  useEffect(() => {
    const prevLongest = prevLongestRef.current;
    const currentLongest = streakStats.longestStreak;

    if (currentLongest > prevLongest) {
      for (const m of MILESTONES) {
        if (currentLongest >= m && prevLongest < m) {
          fireMilestoneConfetti();
          onMilestoneReached?.(m);
        }
      }
    }
    prevLongestRef.current = currentLongest;
  }, [streakStats.longestStreak, onMilestoneReached]);

  return (
    <Card
      title="Study Streak"
      icon={<Flame className="w-4 h-4 text-[#FF8C42]" />}
      headerColor="bg-[#FF8C42]"
      className="w-full"
      bodyClassName="p-4"
    >
      <div className="flex flex-col gap-4 text-left">
        {/* Main Streak Counter Block */}
        <div className="flex items-center justify-between p-3.5 bg-white border-[2px] border-[#111111] shadow-[3px_3px_0_#111111]">
          <div className="flex items-center gap-3">
            <FlameIcon
              isActive={streakStats.isActiveToday}
              isAtRisk={streakStats.isAtRisk}
              size="lg"
            />
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-3xl text-[#111111]">
                  {streakStats.currentStreak}
                </span>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#111111]/70">
                  {streakStats.currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
                </span>
              </div>
              <div className="text-[11px] font-bold text-[#111111]/80 mt-0.5">
                {streakStats.isActiveToday ? (
                  <span className="text-[#6BCB77] font-black">✓ Completed today! Streak extended.</span>
                ) : streakStats.isAtRisk ? (
                  <span className="text-[#FF8C42] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    Finish 1 task today to keep your streak!
                  </span>
                ) : (
                  <span>Complete a task today to ignite your streak.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 border-[2px] border-[#111111] bg-white shadow-[2px_2px_0_#111111]">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-[#FF8C42]" />
            <div className="font-mono font-bold text-base text-[#111111]">
              {streakStats.longestStreak}
            </div>
            <div className="text-[9px] font-heading font-black uppercase text-[#111111]/70">
              Longest
            </div>
          </div>

          <div className="p-2 border-[2px] border-[#111111] bg-white shadow-[2px_2px_0_#111111]">
            <CheckCheck className="w-4 h-4 mx-auto mb-1 text-[#6BCB77]" />
            <div className="font-mono font-bold text-base text-[#111111]">
              {streakStats.totalTasksCompleted}
            </div>
            <div className="text-[9px] font-heading font-black uppercase text-[#111111]/70">
              Total Done
            </div>
          </div>

          <div className="p-2 border-[2px] border-[#111111] bg-white shadow-[2px_2px_0_#111111]">
            <CalendarCheck className="w-4 h-4 mx-auto mb-1 text-[#4D96FF]" />
            <div className="font-mono font-bold text-base text-[#111111]">
              {streakStats.totalActiveDays}
            </div>
            <div className="text-[9px] font-heading font-black uppercase text-[#111111]/70">
              Active Days
            </div>
          </div>
        </div>

        {/* Milestone Badges Bar */}
        <div className="flex flex-col gap-1.5 pt-2 border-t-[2px] border-[#111111]/10">
          <div className="font-heading font-black text-[10px] uppercase tracking-wider text-[#111111]/70">
            Milestones
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MILESTONES.map((m) => (
              <MilestoneBadge
                key={m}
                days={m}
                isUnlocked={streakStats.unlockedMilestones.includes(m)}
                isNext={streakStats.nextMilestone === m}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
