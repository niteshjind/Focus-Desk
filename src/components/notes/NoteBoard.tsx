import React, { useState } from 'react';
import { TaskNote, NoteColor, Priority } from '../../types/focusdeck';
import { StickyNote } from './StickyNote';
import { NoteEditorModal } from './NoteEditorModal';
import { EmptyState } from './EmptyState';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useNotesStore } from '../../store/notesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { AlertTriangle } from 'lucide-react';

export interface NoteBoardProps {
  notes: TaskNote[];
  totalCount: number;
  onClearFilters?: () => void;
  onCompleteTask: (note: TaskNote) => void;
  isEditorOpen: boolean;
  onOpenEditor: () => void;
  onCloseEditor: () => void;
  onFocusTask?: (id: string) => void;
}

export const NoteBoard: React.FC<NoteBoardProps> = ({
  notes,
  totalCount,
  onClearFilters,
  onCompleteTask,
  isEditorOpen,
  onOpenEditor,
  onCloseEditor,
  onFocusTask,
}) => {
  const [editingNote, setEditingNote] = useState<TaskNote | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const updatePosition = useNotesStore((s) => s.updatePosition);
  const bringToFront = useNotesStore((s) => s.bringToFront);
  const removeNote = useNotesStore((s) => s.removeNote);
  const loadSampleNotes = useNotesStore((s) => s.loadSampleNotes);

  const view = useSettingsStore((s) => s.view);

  const handleSaveNote = (data: {
    title?: string;
    body: string;
    color: NoteColor;
    priority?: Priority;
    subject?: string;
    dueDate?: string;
    dueTime?: string;
  }) => {
    if (editingNote) {
      updateNote(editingNote.id, data);
      setEditingNote(null);
    } else {
      addNote(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingNoteId) {
      removeNote(deletingNoteId);
      setDeletingNoteId(null);
    }
  };

  const isListView = view === 'list';

  const isFiltered = totalCount > 0 && notes.length === 0;

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden">
      {notes.length === 0 ? (
        <EmptyState
          onNewNote={onOpenEditor}
          isFiltered={isFiltered}
          onClearFilters={onClearFilters}
          onLoadSamples={loadSampleNotes}
        />
      ) : isListView ? (
        <div className="flex flex-col gap-3 max-h-[calc(100vh-220px)] overflow-y-auto p-2">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              isListView={true}
              onComplete={onCompleteTask}
              onEdit={(n) => {
                setEditingNote(n);
                onOpenEditor();
              }}
              onDelete={(id) => setDeletingNoteId(id)}
              onFocusTask={onFocusTask}
            />
          ))}
        </div>
      ) : (
        <div className="relative w-full h-full min-h-[600px]">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              isListView={false}
              onComplete={onCompleteTask}
              onEdit={(n) => {
                setEditingNote(n);
                onOpenEditor();
              }}
              onDelete={(id) => setDeletingNoteId(id)}
              onPositionChange={(id, x, y) => updatePosition(id, x, y)}
              onBringToFront={(id) => bringToFront(id)}
              onFocusTask={onFocusTask}
            />
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        noteToEdit={editingNote}
        onClose={() => {
          setEditingNote(null);
          onCloseEditor();
        }}
        onSave={handleSaveNote}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingNoteId}
        onClose={() => setDeletingNoteId(null)}
        title="Delete Sticky Note?"
        headerColor="bg-[#FF4D4D]"
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 border-[2px] border-[#111111] bg-[#FF4D4D] text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#111111]">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t-[2px] border-[#111111]/10">
            <Button size="sm" variant="ghost" onClick={() => setDeletingNoteId(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleConfirmDelete}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
