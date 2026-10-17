import React, { useState, useMemo } from 'react';
import { NoteBoard } from '../notes/NoteBoard';
import { NoteFilterBar } from '../notes/NoteFilterBar';
import { CalendarWidget } from '../calendar/CalendarWidget';
import { StreakWidget } from '../streak/StreakWidget';
import { PomodoroWidget } from '../bonus/PomodoroWidget';
import { AmbientSoundWidget } from '../bonus/AmbientSoundWidget';
import { MobileTabBar, MobileTab } from './MobileTabBar';
import { useNotesStore } from '../../store/notesStore';
import { useHistoryStore } from '../../store/historyStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTimerStore } from '../../store/timerStore';
import { TaskNote, NoteColor, Priority } from '../../types/focusdeck';
import { computeStreak } from '../../lib/streak';
import { Timer } from 'lucide-react';

export interface DashboardProps {
  onCompleteTask: (note: TaskNote) => void;
  isNoteEditorOpen: boolean;
  onOpenNoteEditor: () => void;
  onCloseNoteEditor: () => void;
  onOpenWallpapers: () => void;
  onFocusTask: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onCompleteTask,
  isNoteEditorOpen,
  onOpenNoteEditor,
  onCloseNoteEditor,
  onOpenWallpapers,
  onFocusTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<NoteColor | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<Priority | undefined>(undefined);
  const [mobileTab, setMobileTab] = useState<MobileTab>('notes');

  const notes = useNotesStore((s) => s.notes);
  const completedTasks = useHistoryStore((s) => s.completedTasks);
  const dayStartHour = useSettingsStore((s) => s.dayStartHour);

  const streakStats = computeStreak(completedTasks, new Date(), dayStartHour);

  const isTimerRunning = useTimerStore((s) => s.isRunning);
  const timeLeft = useTimerStore((s) => s.timeLeft);
  const startTimer = useTimerStore((s) => s.startTimer);
  const pauseTimer = useTimerStore((s) => s.pauseTimer);
  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = timeLeft % 60;
  const timerString = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

  // Filter & search notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = note.title?.toLowerCase().includes(q);
        const matchesBody = note.body.toLowerCase().includes(q);
        const matchesSubject = note.subject?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBody && !matchesSubject) return false;
      }
      if (selectedColor && note.color !== selectedColor) return false;
      if (selectedPriority && note.priority !== selectedPriority) return false;
      return true;
    });
  }, [notes, searchQuery, selectedColor, selectedPriority]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedColor(undefined);
    setSelectedPriority(undefined);
  };

  return (
    <div className="relative z-10 w-full h-[calc(100dvh-62px)] flex flex-col overflow-hidden">
      {/* Filter / Search Bar across top */}
      <div className="p-3 pb-0 max-w-7xl mx-auto w-full">
        <NoteFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          onClearAllFilters={handleClearAllFilters}
          onNewNote={onOpenNoteEditor}
          filteredCount={filteredNotes.length}
          totalCount={notes.length}
        />
      </div>

      {/* Main Responsive Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-3 flex gap-4 overflow-hidden">
        {/* Left / Center Area: Sticky Notes Board */}
        <main
          className={`
            flex-1 h-full overflow-hidden flex flex-col transition-all
            ${mobileTab === 'notes' ? 'flex' : 'hidden lg:flex'}
          `}
        >
          {/* Quick Study Timer Bar on Mobile (< lg) so timer is ALWAYS visible on every phone */}
          <div className="lg:hidden shrink-0 mb-2">
            <div className="flex items-center justify-between p-2 bg-[#FFF8E7] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xs uppercase flex items-center gap-1 text-[#111111]">
                  <Timer className="w-4 h-4 text-[#FF8C42]" />
                  Focus:
                </span>
                <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 border border-[#111111] text-[#111111]">
                  {timerString}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (isTimerRunning ? pauseTimer() : startTimer())}
                  className={`px-3 py-1 font-heading text-xs font-black uppercase border-[2px] border-[#111111] shadow-[1px_1px_0_#111111] active:translate-y-0.5 transition-all cursor-pointer ${
                    isTimerRunning ? 'bg-[#FF6B6B] text-white' : 'bg-[#6BCB77] text-[#111111]'
                  }`}
                >
                  {isTimerRunning ? 'Pause' : 'Start Focus'}
                </button>
                <button
                  onClick={() => setMobileTab('timer')}
                  className="px-2 py-1 font-heading text-[10px] font-black uppercase bg-[#FFD93D] border-[2px] border-[#111111] shadow-[1px_1px_0_#111111] cursor-pointer"
                >
                  Timer Tab ⏱️
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <NoteBoard
              notes={filteredNotes}
              totalCount={notes.length}
              onClearFilters={handleClearAllFilters}
              onCompleteTask={onCompleteTask}
              isEditorOpen={isNoteEditorOpen}
              onOpenEditor={onOpenNoteEditor}
              onCloseEditor={onCloseNoteEditor}
              onFocusTask={onFocusTask}
            />
          </div>
        </main>

        {/* Right Sidebar Widgets: Calendar, Streak, Timer, Sounds */}
        <aside
          className={`
            w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-1 pb-16 lg:pb-4
            ${mobileTab !== 'notes' ? 'block' : 'hidden lg:flex'}
          `}
        >
          {/* Mobile view widgets */}
          {mobileTab === 'timer' && (
            <div className="flex flex-col gap-4">
              <PomodoroWidget />
              <AmbientSoundWidget />
            </div>
          )}
          {mobileTab === 'calendar' && <CalendarWidget />}
          {mobileTab === 'streak' && <StreakWidget />}

          {/* Desktop view always renders right column widgets */}
          <div className="hidden lg:flex flex-col gap-4">
            <StreakWidget />
            <PomodoroWidget />
            <CalendarWidget />
            <AmbientSoundWidget />
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <MobileTabBar
        activeTab={mobileTab}
        onChange={(tab) => {
          if (tab === 'wallpapers') {
            onOpenWallpapers();
          } else {
            setMobileTab(tab);
          }
        }}
        streakCount={streakStats.currentStreak}
      />
    </div>
  );
};
