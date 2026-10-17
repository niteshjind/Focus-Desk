import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaskNote, NoteColor, Priority } from '../types/focusdeck';

interface NotesState {
  notes: TaskNote[];
  maxZ: number;
  addNote: (data: {
    title?: string;
    body: string;
    color?: NoteColor;
    priority?: Priority;
    subject?: string;
    dueDate?: string;
    dueTime?: string;
    position?: { x: number; y: number; rotation?: number };
  }) => TaskNote;
  updateNote: (id: string, updates: Partial<TaskNote>) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  bringToFront: (id: string) => void;
  removeNote: (id: string) => TaskNote | undefined;
  restoreNote: (note: TaskNote) => void;
  reorderNotes: (activeId: string, overId: string) => void;
  clearNotes: () => void;
  importNotes: (notes: TaskNote[]) => void;
  loadSampleNotes: () => void;
}

const DEFAULT_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple'];

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: 'welcome-note-1',
          title: 'Welcome to FocusDeck! 🎯',
          body: 'This is your distraction-free study space.\n• Drag this note anywhere\n• Click Done when completed\n• Check the streak counter above!',
          color: 'yellow',
          priority: 'high',
          subject: 'FocusDeck',
          position: { x: 30, y: 30, rotation: -1.2, z: 10 },
          createdAt: new Date().toISOString(),
          order: 0,
        },
        {
          id: 'welcome-note-2',
          title: 'Try Live Wallpapers 🌌',
          body: 'Press "W" or click Wallpapers in the top bar to switch backgrounds, adjust dim/blur, or upload your own video & GIF!',
          color: 'blue',
          priority: 'medium',
          subject: 'Tips',
          position: { x: 340, y: 50, rotation: 1.5, z: 9 },
          createdAt: new Date().toISOString(),
          order: 1,
        },
      ],
      maxZ: 10,

      addNote: (data) => {
        const { notes, maxZ } = get();
        const id = 'note-' + Math.random().toString(36).substring(2, 9);
        const nextZ = maxZ + 1;
        // Random tilt between -2deg and +2deg
        const randomRotation = Number(((Math.random() * 4) - 2).toFixed(1));
        
        // Spread position across viewport if not provided
        const defaultX = 40 + ((notes.length * 35) % 300);
        const defaultY = 40 + ((notes.length * 30) % 250);

        const newNote: TaskNote = {
          id,
          title: data.title?.trim() || undefined,
          body: data.body.trim(),
          color: data.color || DEFAULT_COLORS[notes.length % DEFAULT_COLORS.length],
          priority: data.priority,
          subject: data.subject?.trim() || undefined,
          dueDate: data.dueDate,
          dueTime: data.dueTime,
          position: {
            x: data.position?.x ?? defaultX,
            y: data.position?.y ?? defaultY,
            rotation: data.position?.rotation ?? randomRotation,
            z: nextZ,
          },
          createdAt: new Date().toISOString(),
          order: notes.length,
        };

        set({
          notes: [...notes, newNote],
          maxZ: nextZ,
        });

        return newNote;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, ...updates } : note)),
        }));
      },

      updatePosition: (id, x, y) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  position: { ...note.position, x, y },
                }
              : note
          ),
        }));
      },

      bringToFront: (id) => {
        const { maxZ, notes } = get();
        const target = notes.find((n) => n.id === id);
        if (!target || target.position.z === maxZ) return;

        const nextZ = maxZ + 1;
        set((state) => ({
          maxZ: nextZ,
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  position: { ...note.position, z: nextZ },
                }
              : note
          ),
        }));
      },

      removeNote: (id) => {
        const { notes } = get();
        const note = notes.find((n) => n.id === id);
        if (!note) return undefined;

        set({
          notes: notes.filter((n) => n.id !== id),
        });

        return note;
      },

      restoreNote: (note) => {
        const { notes, maxZ } = get();
        const nextZ = maxZ + 1;
        set({
          notes: [...notes, { ...note, position: { ...note.position, z: nextZ } }],
          maxZ: nextZ,
        });
      },

      reorderNotes: (activeId, overId) => {
        const { notes } = get();
        const oldIndex = notes.findIndex((n) => n.id === activeId);
        const newIndex = notes.findIndex((n) => n.id === overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const updated = [...notes];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);

        // Update orders
        set({
          notes: updated.map((note, index) => ({ ...note, order: index })),
        });
      },

      clearNotes: () => set({ notes: [] }),

      importNotes: (notes) => set({ notes }),

      loadSampleNotes: () => {
        const sampleNotes: TaskNote[] = [
          {
            id: 'sample-math-1',
            title: 'Calculus Problem Set 3 📐',
            body: 'Complete exercises 12 to 24 on integration by parts. Check formulas with study group.',
            color: 'yellow',
            priority: 'high',
            subject: 'Math',
            position: { x: 30, y: 30, rotation: -1.2, z: 11 },
            createdAt: new Date().toISOString(),
            order: 0,
          },
          {
            id: 'sample-cs-2',
            title: 'Data Structures Lab 💻',
            body: 'Implement Trie search tree and benchmark lookup times against Hash Map.',
            color: 'blue',
            priority: 'medium',
            subject: 'CS',
            position: { x: 340, y: 50, rotation: 1.5, z: 12 },
            createdAt: new Date().toISOString(),
            order: 1,
          },
          {
            id: 'sample-read-3',
            title: 'History Reading Notes 📖',
            body: 'Summarize Chapter 6 key events and primary source quotes for seminar discussion.',
            color: 'pink',
            priority: 'low',
            subject: 'History',
            position: { x: 180, y: 220, rotation: -0.8, z: 13 },
            createdAt: new Date().toISOString(),
            order: 2,
          },
        ];
        set({ notes: sampleNotes, maxZ: 14 });
      },
    }),
    {
      name: 'focusdeck_notes',
    }
  )
);
