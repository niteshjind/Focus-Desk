import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DayCell } from './DayCell';
import { DayDetailModal } from './DayDetailModal';
import { useHistoryStore } from '../../store/historyStore';
import { useNotesStore } from '../../store/notesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getCalendarGrid, getDayKey } from '../../lib/dates';
import { format, addMonths, subMonths, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const completedTasks = useHistoryStore((s) => s.completedTasks);
  const notes = useNotesStore((s) => s.notes);
  const weekStart = useSettingsStore((s) => s.weekStart);
  const dayStartHour = useSettingsStore((s) => s.dayStartHour);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const gridDays = getCalendarGrid(year, month, weekStart);

  // Group completed tasks by dayKey
  const completedByDay = React.useMemo(() => {
    const map = new Map<string, typeof completedTasks>();
    for (const task of completedTasks) {
      const key = getDayKey(task.completedAt, dayStartHour);
      const list = map.get(key) || [];
      list.push(task);
      map.set(key, list);
    }
    return map;
  }, [completedTasks, dayStartHour]);

  // Group due tasks by dueDate
  const dueByDay = React.useMemo(() => {
    const map = new Map<string, typeof notes>();
    for (const note of notes) {
      if (note.dueDate) {
        const list = map.get(note.dueDate) || [];
        list.push(note);
        map.set(note.dueDate, list);
      }
    }
    return map;
  }, [notes]);

  // Weekly summary
  const weeklyStats = React.useMemo(() => {
    const now = new Date();
    const weekInterval = {
      start: startOfWeek(now, { weekStartsOn: weekStart }),
      end: endOfWeek(now, { weekStartsOn: weekStart }),
    };

    let thisWeekCount = 0;
    const dailyCounts: Record<string, number> = {};

    for (const task of completedTasks) {
      const taskDate = new Date(task.completedAt);
      if (isWithinInterval(taskDate, weekInterval)) {
        thisWeekCount++;
        const dayName = format(taskDate, 'EEE');
        dailyCounts[dayName] = (dailyCounts[dayName] || 0) + 1;
      }
    }

    let bestDay = '—';
    let maxDone = 0;
    for (const [day, count] of Object.entries(dailyCounts)) {
      if (count > maxDone) {
        maxDone = count;
        bestDay = `${day} (${count})`;
      }
    }

    return { thisWeekCount, bestDay };
  }, [completedTasks, weekStart]);

  const weekDayLabels =
    weekStart === 1
      ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
      : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const selectedDayKey = selectedDate ? getDayKey(selectedDate, dayStartHour) : '';
  const selectedCompleted = selectedDayKey ? completedByDay.get(selectedDayKey) || [] : [];
  const selectedDue = selectedDayKey ? dueByDay.get(selectedDayKey) || [] : [];

  return (
    <Card
      title="Daily Work Log"
      icon={<CalendarIcon className="w-4 h-4 text-[#111111]" />}
      headerColor="bg-[#6BCB77]"
      className="w-full"
      bodyClassName="p-3"
      headerAction={
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            color="paper"
            variant="icon"
            onClick={() => setCurrentMonthDate(subMonths(currentMonthDate, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            color="paper"
            variant="icon"
            onClick={() => setCurrentMonthDate(addMonths(currentMonthDate, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            color="paper"
            onClick={() => setCurrentMonthDate(new Date())}
            className="text-[11px] px-2 py-0.5"
          >
            Today
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5">
        {/* Month & Year Title */}
        <div className="text-left font-heading font-black text-sm uppercase tracking-wider text-[#111111]">
          {format(currentMonthDate, 'MMMM yyyy')}
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-heading font-black text-[10px] text-[#111111]/70 uppercase">
          {weekDayLabels.map((label) => (
            <div key={label} className="py-0.5">
              {label}
            </div>
          ))}
        </div>

        {/* Monthly Grid */}
        <div className="grid grid-cols-7 gap-1">
          {gridDays.map((d, index) => {
            const key = getDayKey(d, dayStartHour);
            const count = completedByDay.get(key)?.length || 0;
            const hasDue = (dueByDay.get(key)?.length || 0) > 0;
            const isSelected = selectedDate ? getDayKey(selectedDate, dayStartHour) === key : false;

            return (
              <DayCell
                key={index}
                date={d}
                currentMonthDate={currentMonthDate}
                completedCount={count}
                hasDueTasks={hasDue}
                isSelected={isSelected}
                onClick={() => setSelectedDate(d)}
              />
            );
          })}
        </div>

        {/* This Week Summary */}
        <div className="mt-2 pt-2 border-t-[2px] border-[#111111]/15 flex items-center justify-between text-xs font-bold text-[#111111] bg-white p-2 border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]">
          <span className="flex items-center gap-1">
            <span className="font-heading font-black text-[11px] uppercase">This Week:</span>
            <span className="font-mono text-[#6BCB77] bg-[#111111] px-1.5 py-0.2">
              {weeklyStats.thisWeekCount} done
            </span>
          </span>
          <span className="text-[11px] text-[#111111]/70">
            Best: <span className="font-mono text-[#111111]">{weeklyStats.bestDay}</span>
          </span>
        </div>
      </div>

      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={!!selectedDate}
        date={selectedDate}
        dayKey={selectedDayKey}
        completedTasks={selectedCompleted}
        dueTasks={selectedDue}
        onClose={() => setSelectedDate(null)}
      />
    </Card>
  );
};
