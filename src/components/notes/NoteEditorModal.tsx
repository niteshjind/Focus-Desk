import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ColorPicker } from '../ui/ColorPicker';
import { TaskNote, NoteColor, Priority } from '../../types/focusdeck';

export interface NoteEditorModalProps {
  isOpen: boolean;
  noteToEdit?: TaskNote | null;
  onClose: () => void;
  onSave: (data: {
    title?: string;
    body: string;
    color: NoteColor;
    priority?: Priority;
    subject?: string;
    dueDate?: string;
    dueTime?: string;
  }) => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  noteToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setBody(noteToEdit.body || '');
      setColor(noteToEdit.color || 'yellow');
      setPriority(noteToEdit.priority);
      setSubject(noteToEdit.subject || '');
      setDueDate(noteToEdit.dueDate || '');
      setDueTime(noteToEdit.dueTime || '');
    } else {
      setTitle('');
      setBody('');
      setColor('yellow');
      setPriority(undefined);
      setSubject('');
      setDueDate('');
      setDueTime('');
    }
    setError('');
  }, [noteToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Task content is required.');
      return;
    }

    onSave({
      title: title.trim() || undefined,
      body: body.trim(),
      color,
      priority,
      subject: subject.trim() || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={noteToEdit ? 'Edit Note' : 'Create New Sticky Note'}
      subtitle="Organize your study focus with high-contrast tactile notes"
      maxWidth="max-w-md"
      headerColor={
        color === 'yellow'
          ? 'bg-[#FFD93D]'
          : color === 'pink'
          ? 'bg-[#FF6B9D]'
          : color === 'blue'
          ? 'bg-[#4D96FF]'
          : color === 'green'
          ? 'bg-[#6BCB77]'
          : color === 'orange'
          ? 'bg-[#FF8C42]'
          : 'bg-[#B983FF]'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <Input
          label="Title (Optional)"
          placeholder="e.g. Chapter 4 Practice Problems"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="Task Content *"
          placeholder="What do you need to accomplish?"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={3}
          required
        />

        {/* Color Palette Swatches */}
        <ColorPicker label="Sticky Note Color" value={color} onChange={setColor} />

        {/* Priority & Subject */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 text-left">
            <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#111111]">
              Priority
            </label>
            <div className="flex gap-1.5">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(isSelected ? undefined : p)}
                    className={`
                      flex-1 py-1 font-heading text-xs font-bold uppercase border-[2px] border-[#111111] transition-all
                      ${
                        isSelected
                          ? 'bg-[#FFD93D] shadow-[2px_2px_0_#111111] -translate-y-0.5'
                          : 'bg-white opacity-70 hover:opacity-100'
                      }
                    `}
                  >
                    {p === 'low' ? 'Low' : p === 'medium' ? 'Med' : 'High'}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Subject Tag"
            placeholder="e.g. Math, CS"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Due Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Input
            label="Due Time (Optional)"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>

        {/* Form Actions */}
        <div className="pt-3 border-t-[2px] border-[#111111]/15 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="green">
            {noteToEdit ? 'Save Changes' : 'Stick Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
