import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompletedTask, TaskNote } from '../types/focusdeck';
import { getDayKey } from '../lib/dates';
import { useSettingsStore } from './settingsStore';

interface HistoryState {
  completedTasks: CompletedTask[];
  lastCompletedTask: CompletedTask | null;
  addCompletedTask: (note: TaskNote) => CompletedTask;
  undoLastTask: () => CompletedTask | null;
  removeCompletedTask: (id: string) => void;
  clearHistory: () => void;
  importHistory: (tasks: CompletedTask[]) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      completedTasks: [],
      lastCompletedTask: null,

      addCompletedTask: (note) => {
        const dayStartHour = useSettingsStore.getState().dayStartHour;
        const now = new Date();
        const completed: CompletedTask = {
          id: note.id,
          title: note.title,
          body: note.body,
          subject: note.subject,
          color: note.color,
          completedAt: now.toISOString(),
          dayKey: getDayKey(now, dayStartHour),
          dueTime: note.dueTime,
        };

        set((state) => ({
          completedTasks: [completed, ...state.completedTasks],
          lastCompletedTask: completed,
        }));

        return completed;
      },

      undoLastTask: () => {
        const { lastCompletedTask, completedTasks } = get();
        if (!lastCompletedTask) return null;

        set({
          completedTasks: completedTasks.filter((t) => t.id !== lastCompletedTask.id),
          lastCompletedTask: null,
        });

        return lastCompletedTask;
      },

      removeCompletedTask: (id) => {
        set((state) => ({
          completedTasks: state.completedTasks.filter((t) => t.id !== id),
          lastCompletedTask: state.lastCompletedTask?.id === id ? null : state.lastCompletedTask,
        }));
      },

      clearHistory: () => set({ completedTasks: [], lastCompletedTask: null }),

      importHistory: (tasks) => set({ completedTasks: tasks, lastCompletedTask: null }),
    }),
    {
      name: 'focusdeck_history',
    }
  )
);
