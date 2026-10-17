import { subDays, parseISO, differenceInCalendarDays, format } from 'date-fns';
import { CompletedTask, StreakStats } from '../types/focusdeck';
import { getDayKey } from './dates';

export const MILESTONES = [3, 7, 14, 30, 60, 100, 365] as const;

/**
 * Pure function to compute streak statistics from completed task history.
 * Single source of truth.
 */
export function computeStreak(
  completedTasks: CompletedTask[],
  now: Date = new Date(),
  dayStartHour: number = 0
): StreakStats {
  if (!completedTasks || completedTasks.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalTasksCompleted: 0,
      totalActiveDays: 0,
      isActiveToday: false,
      isAtRisk: false,
      nextMilestone: MILESTONES[0],
      unlockedMilestones: [],
    };
  }

  // Map every task to its effective dayKey based on dayStartHour
  const activeDaysSet = new Set<string>();
  for (const task of completedTasks) {
    const key = getDayKey(task.completedAt, dayStartHour);
    activeDaysSet.add(key);
  }

  const todayKey = getDayKey(now, dayStartHour);
  const nowEffective = dayStartHour > 0 && now.getHours() < dayStartHour ? subDays(now, 1) : now;
  const yesterdayKey = format(subDays(nowEffective, 1), 'yyyy-MM-dd');

  const isActiveToday = activeDaysSet.has(todayKey);
  const wasActiveYesterday = activeDaysSet.has(yesterdayKey);

  // Compute Current Streak
  let currentStreak = 0;
  let isAtRisk = false;

  if (isActiveToday) {
    // Count consecutive days ending today
    let checkDate = nowEffective;
    while (activeDaysSet.has(format(checkDate, 'yyyy-MM-dd'))) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }
    isAtRisk = false;
  } else if (wasActiveYesterday) {
    // User hasn't finished a task today, but streak from yesterday is still valid
    let checkDate = subDays(nowEffective, 1);
    while (activeDaysSet.has(format(checkDate, 'yyyy-MM-dd'))) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }
    isAtRisk = true;
  } else {
    currentStreak = 0;
    isAtRisk = false;
  }

  // Compute Longest Streak (All-Time)
  const sortedDays = Array.from(activeDaysSet).sort();
  let longestStreak = 0;
  let currentRun = 0;
  let prevDate: Date | null = null;

  for (const dayStr of sortedDays) {
    const currDate = parseISO(dayStr);
    if (!prevDate) {
      currentRun = 1;
    } else {
      const diff = differenceInCalendarDays(currDate, prevDate);
      if (diff === 1) {
        currentRun++;
      } else if (diff > 1) {
        currentRun = 1;
      }
      // diff === 0 shouldn't happen due to Set, but safe
    }
    if (currentRun > longestStreak) {
      longestStreak = currentRun;
    }
    prevDate = currDate;
  }

  // Longest streak is at least current streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Unlocked & Next Milestones
  const unlockedMilestones = MILESTONES.filter((m) => longestStreak >= m);
  const nextMilestone =
    MILESTONES.find((m) => currentStreak < m) ?? MILESTONES[MILESTONES.length - 1];

  return {
    currentStreak,
    longestStreak,
    totalTasksCompleted: completedTasks.length,
    totalActiveDays: activeDaysSet.size,
    isActiveToday,
    isAtRisk,
    nextMilestone,
    unlockedMilestones,
  };
}
