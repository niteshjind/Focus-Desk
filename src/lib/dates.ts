import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  isPast,
  parseISO,
} from 'date-fns';

/**
 * Returns a 'YYYY-MM-DD' key for a given date, respecting the dayStartHour offset.
 * E.g., if dayStartHour is 4 (4 AM), 2:30 AM on Oct 18 still counts as Oct 17.
 */
export function getDayKey(dateInput: Date | string = new Date(), dayStartHour: number = 0): string {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
  
  if (dayStartHour > 0 && date.getHours() < dayStartHour) {
    const adjusted = subDays(date, 1);
    return format(adjusted, 'yyyy-MM-dd');
  }
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format date for display in TopBar (e.g., "Saturday, Oct 17, 2026")
 */
export function formatFullDate(date: Date = new Date()): string {
  return format(date, 'EEEE, MMM d, yyyy');
}

/**
 * Format clock time (12h or 24h)
 */
export function formatClockTime(date: Date = new Date(), is24h: boolean = false): string {
  return is24h ? format(date, 'HH:mm:ss') : format(date, 'hh:mm:ss a');
}

/**
 * Get grid of days for a monthly calendar view including padding days from adjacent months.
 */
export function getCalendarGrid(year: number, month: number, weekStartsOn: 0 | 1 = 1): Date[] {
  const monthDate = new Date(year, month, 1);
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn });
  return eachDayOfInterval({ start, end });
}

export { isSameDay, isSameMonth, isToday, isPast, parseISO, format };
