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
import { TaskNote, NoteColor, Priority } from '../../types/focusdeck';
import { computeStreak } from '../../lib/streak';

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
    <div className="relative z-10 w-full h-[calc(100vh-62px)] flex flex-col overflow-hidden">
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
            flex-1 h-full overflow-hidden transition-all
            ${mobileTab === 'notes' ? 'block' : 'hidden sm:block'}
          `}
        >
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
        </main>

        {/* Right Sidebar Widgets: Calendar, Streak, Timer, Sounds */}
        <aside
          className={`
            w-full sm:w-80 md:w-96 flex flex-col gap-4 overflow-y-auto pr-1 pb-16 sm:pb-4
            ${mobileTab !== 'notes' ? 'block' : 'hidden sm:flex'}
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
          <div className="hidden sm:flex flex-col gap-4">
            <StreakWidget />
            <CalendarWidget />
            <PomodoroWidget />
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
