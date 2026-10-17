import { describe, it, expect } from 'vitest';
import { computeStreak } from '../src/lib/streak';
import { CompletedTask } from '../src/types/focusdeck';
import { subDays, format, parseISO } from 'date-fns';

function createTask(dateStr: string, id: string = Math.random().toString()): CompletedTask {
  return {
    id,
    body: 'Sample task',
    color: 'yellow',
    completedAt: dateStr,
    dayKey: format(parseISO(dateStr), 'yyyy-MM-dd'),
  };
}

describe('computeStreak', () => {
  const baseNow = new Date('2026-10-17T14:00:00');

  it('returns zeroes when no tasks completed', () => {
    const stats = computeStreak([], baseNow);
    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(0);
    expect(stats.isActiveToday).toBe(false);
    expect(stats.isAtRisk).toBe(false);
  });

  it('counts 1 day streak when task completed today', () => {
    const tasks = [createTask('2026-10-17T10:00:00')];
    const stats = computeStreak(tasks, baseNow);
    expect(stats.currentStreak).toBe(1);
    expect(stats.longestStreak).toBe(1);
    expect(stats.isActiveToday).toBe(true);
    expect(stats.isAtRisk).toBe(false);
  });

  it('marks streak as at risk if task done yesterday but none today', () => {
    const yesterday = format(subDays(baseNow, 1), "yyyy-MM-dd'T'12:00:00");
    const tasks = [createTask(yesterday)];
    const stats = computeStreak(tasks, baseNow);
    expect(stats.currentStreak).toBe(1);
    expect(stats.isActiveToday).toBe(false);
    expect(stats.isAtRisk).toBe(true);
  });

  it('resets current streak to 0 if gap of 2 or more days', () => {
    const twoDaysAgo = format(subDays(baseNow, 2), "yyyy-MM-dd'T'12:00:00");
    const tasks = [createTask(twoDaysAgo)];
    const stats = computeStreak(tasks, baseNow);
    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(1);
    expect(stats.isAtRisk).toBe(false);
  });

  it('correctly calculates consecutive days and unlocks milestone', () => {
    const tasks = [
      createTask('2026-10-17T11:00:00'),
      createTask('2026-10-16T11:00:00'),
      createTask('2026-10-15T11:00:00'),
    ];
    const stats = computeStreak(tasks, baseNow);
    expect(stats.currentStreak).toBe(3);
    expect(stats.longestStreak).toBe(3);
    expect(stats.unlockedMilestones).toContain(3);
  });

  it('preserves historical longest streak even after reset', () => {
    // 4-day streak in September
    const tasks = [
      createTask('2026-09-01T10:00:00'),
      createTask('2026-09-02T10:00:00'),
      createTask('2026-09-03T10:00:00'),
      createTask('2026-09-04T10:00:00'),
      // Gap until today
      createTask('2026-10-17T10:00:00'),
    ];
    const stats = computeStreak(tasks, baseNow);
    expect(stats.currentStreak).toBe(1);
    expect(stats.longestStreak).toBe(4);
    expect(stats.unlockedMilestones).toContain(3);
  });

  it('respects dayStartHour (night owl mode)', () => {
    // 2:00 AM on Oct 18 is part of Oct 17 when dayStartHour is 4
    const nightTimeNow = new Date('2026-10-18T02:00:00');
    const taskOnOct17 = createTask('2026-10-17T23:00:00');
    
    const stats = computeStreak([taskOnOct17], nightTimeNow, 4);
    // Because 2:00 AM Oct 18 still counts as Oct 17, isActiveToday is true!
    expect(stats.isActiveToday).toBe(true);
    expect(stats.currentStreak).toBe(1);
  });
});
