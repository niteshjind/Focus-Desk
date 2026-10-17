import { describe, it, expect } from 'vitest';
import { getDayKey, formatFullDate, formatClockTime, getCalendarGrid } from '../src/lib/dates';

describe('Date Utilities', () => {
  it('formats getDayKey correctly for standard midnight day start', () => {
    const d = new Date('2026-10-17T15:30:00');
    expect(getDayKey(d, 0)).toBe('2026-10-17');
  });

  it('adjusts day key for night owls before dayStartHour', () => {
    const earlyMorning = new Date('2026-10-18T02:30:00');
    // If day starts at 4 AM, 2:30 AM counts as previous day (Oct 17)
    expect(getDayKey(earlyMorning, 4)).toBe('2026-10-17');

    const pastDayStart = new Date('2026-10-18T04:01:00');
    expect(getDayKey(pastDayStart, 4)).toBe('2026-10-18');
  });

  it('formats full date and clock time correctly', () => {
    const d = new Date('2026-10-17T14:05:09');
    expect(formatFullDate(d)).toBe('Saturday, Oct 17, 2026');
    expect(formatClockTime(d, true)).toBe('14:05:09');
    expect(formatClockTime(d, false)).toBe('02:05:09 PM');
  });

  it('generates correct calendar grid with padding days', () => {
    // October 2026: 31 days, starts on Thursday
    const grid = getCalendarGrid(2026, 9, 1); // 9 = October (0-indexed)
    expect(grid.length % 7).toBe(0);
    expect(grid.length).toBeGreaterThanOrEqual(35);
  });
});
