import React, { useState, useEffect, useCallback } from 'react';
import { WallpaperLayer } from './components/wallpaper/WallpaperLayer';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './components/layout/Dashboard';
import { WallpaperPickerModal } from './components/wallpaper/WallpaperPickerModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { ShortcutsModal } from './components/layout/ShortcutsModal';
import { LiquidGlassTimerOverlay } from './components/layout/LiquidGlassTimerOverlay';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNotesStore } from './store/notesStore';
import { useHistoryStore } from './store/historyStore';
import { useTimerStore } from './store/timerStore';
import { TaskNote } from './types/focusdeck';

export const App: React.FC = () => {
  const [isWallpapersOpen, setIsWallpapersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [isZen, setIsZen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notes = useNotesStore((s) => s.notes);
  const removeNote = useNotesStore((s) => s.removeNote);
  const restoreNote = useNotesStore((s) => s.restoreNote);

  const addCompletedTask = useHistoryStore((s) => s.addCompletedTask);
  const undoLastTask = useHistoryStore((s) => s.undoLastTask);

  const isTimerRunning = useTimerStore((s) => s.isRunning);
  const startTimer = useTimerStore((s) => s.startTimer);
  const pauseTimer = useTimerStore((s) => s.pauseTimer);

  // Global 1-second ticker for the study timer
  useEffect(() => {
    const interval = setInterval(() => {
      useTimerStore.getState().tick();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after duration (default 6 seconds)
    const duration = toast.durationMs ?? 6000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Complete task flow with 6-second undo
  const handleCompleteTask = useCallback(
    (note: TaskNote) => {
      removeNote(note.id);
      addCompletedTask(note);

      addToast({
        type: 'success',
        title: 'Task Done!',
        message: `"${note.title || note.body.slice(0, 30)}" recorded to work log.`,
        action: {
          label: 'Undo (6s)',
          onClick: () => {
            const undone = undoLastTask();
            if (undone) {
              restoreNote(note);
            }
          },
        },
        durationMs: 6000,
      });
    },
    [removeNote, addCompletedTask, undoLastTask, restoreNote, addToast]
  );

  const handleStartFocus = (id: string) => {
    const note = notes.find((n) => n.id === id);
    startTimer();
    addToast({
      type: 'info',
      title: 'Focus Started',
      message: note ? `Focusing on: ${note.title || note.body.slice(0, 30)}` : 'Study timer started.',
      durationMs: 3000,
    });
  };

  const handleToggleFocus = () => {
    if (isTimerRunning) {
      pauseTimer();
      addToast({
        type: 'info',
        title: 'Timer Paused',
        message: 'Study timer has been paused.',
        durationMs: 2500,
      });
    } else {
      startTimer();
      addToast({
        type: 'info',
        title: 'Timer Started',
        message: 'Focus session in progress.',
        durationMs: 2500,
      });
    }
  };

  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onNewNote: () => setIsNoteEditorOpen(true),
    onOpenWallpapers: () => setIsWallpapersOpen(true),
    onToggleFocusMode: handleToggleFocus,
    onShowShortcuts: () => setIsShortcutsOpen(true),
    onCloseModal: () => {
      setIsWallpapersOpen(false);
      setIsSettingsOpen(false);
      setIsShortcutsOpen(false);
      setIsNoteEditorOpen(false);
    },
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#111111]">
      {/* Background Animated Wallpaper Layer */}
      <WallpaperLayer />

      {/* Main UI Chrome (Smoothly auto-hides when in Zen Focus mode) */}
      <div
        className={`flex flex-col w-full h-full flex-1 min-h-0 overflow-hidden transition-all duration-700 ease-in-out ${
          isZen ? 'opacity-0 pointer-events-none scale-[0.98]' : 'opacity-100 pointer-events-auto scale-100'
        }`}
      >
        <TopBar
          onOpenWallpapers={() => setIsWallpapersOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        <Dashboard
          onCompleteTask={handleCompleteTask}
          isNoteEditorOpen={isNoteEditorOpen}
          onOpenNoteEditor={() => setIsNoteEditorOpen(true)}
          onCloseNoteEditor={() => setIsNoteEditorOpen(false)}
          onOpenWallpapers={() => setIsWallpapersOpen(true)}
          onFocusTask={handleStartFocus}
        />
      </div>

      {/* Liquid Glass Center Countdown Clock (appears after inactivity while timer is running) */}
      <LiquidGlassTimerOverlay onZenChange={setIsZen} />

      {/* Modals & Overlays */}
      <WallpaperPickerModal
        isOpen={isWallpapersOpen}
        onClose={() => setIsWallpapersOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
