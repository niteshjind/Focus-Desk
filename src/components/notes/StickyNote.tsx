import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskNote } from '../../types/focusdeck';
import { useSettingsStore } from '../../store/settingsStore';
import { Check, Edit2, Trash2, Calendar, GripHorizontal } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { isPast, parseISO, isToday } from 'date-fns';

export interface StickyNoteProps {
  note: TaskNote;
  isListView?: boolean;
  onComplete: (note: TaskNote) => void;
  onEdit: (note: TaskNote) => void;
  onDelete: (id: string) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
  onBringToFront?: (id: string) => void;
  onFocusTask?: (id: string) => void;
}

const colorStyles: Record<string, string> = {
  yellow: 'bg-[#FFD93D]',
  pink: 'bg-[#FF6B9D]',
  blue: 'bg-[#4D96FF]',
  green: 'bg-[#6BCB77]',
  orange: 'bg-[#FF8C42]',
  purple: 'bg-[#B983FF]',
};

const priorityBadges = {
  low: { label: 'LOW', variant: 'paper' as const },
  medium: { label: 'MED', variant: 'yellow' as const },
  high: { label: 'HIGH', variant: 'danger' as const },
};

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  isListView = false,
  onComplete,
  onEdit,
  onDelete,
  onPositionChange,
  onBringToFront,
  onFocusTask,
}) => {
  const noteFont = useSettingsStore((s) => s.noteFont);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ startX: 0, startY: 0, noteX: note.position.x, noteY: note.position.y });

  const fontClass =
    noteFont === 'hand'
      ? 'font-hand text-lg leading-relaxed'
      : noteFont === 'mono'
      ? 'font-mono text-xs leading-normal'
      : 'font-body text-sm leading-relaxed';

  // Check if overdue
  let isOverdue = false;
  if (note.dueDate) {
    try {
      const dateStr = note.dueTime ? `${note.dueDate}T${note.dueTime}:00` : note.dueDate;
      const due = parseISO(dateStr);
      isOverdue = isPast(due) && (note.dueTime ? true : !isToday(due));
    } catch {
      isOverdue = false;
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isListView) return;
    // Don't drag if clicking buttons or inputs
    if ((e.target as HTMLElement).closest('button, input, textarea')) return;

    onBringToFront?.(note.id);
    setIsDragging(true);
    dragStartPos.current = {
      startX: e.clientX,
      startY: e.clientY,
      noteX: note.position.x,
      noteY: note.position.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isListView) return;
    const dx = e.clientX - dragStartPos.current.startX;
    const dy = e.clientY - dragStartPos.current.startY;
    const newX = Math.max(10, dragStartPos.current.noteX + dx);
    const newY = Math.max(10, dragStartPos.current.noteY + dy);
    onPositionChange?.(note.id, newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const triggerCompletion = () => {
    setIsCompleting(true);
    // After satisfying Done stamp animation, fire completion callback
    setTimeout(() => {
      onComplete(note);
    }, 450);
  };

  const noteBg = colorStyles[note.color] || colorStyles.yellow;

  if (isListView) {
    return (
      <div
        className={`
          flex items-center justify-between p-3.5 border-[3px] border-[#111111] shadow-[4px_4px_0_#111111]
          ${noteBg} text-[#111111] transition-transform hover:-translate-y-0.5
        `}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
          <button
            onClick={triggerCompletion}
            className="w-6 h-6 border-[2px] border-[#111111] bg-white flex items-center justify-center hover:bg-[#6BCB77] transition-colors shrink-0 shadow-[2px_2px_0_#111111]"
            title="Mark as done"
          >
            <Check className="w-4 h-4 text-[#111111] stroke-[3]" />
          </button>

          <div className="min-w-0 flex-1 text-left">
            {note.title && (
              <h4 className="font-heading font-black text-sm uppercase tracking-wide truncate">
                {note.title}
              </h4>
            )}
            <p className={`font-semibold text-xs text-[#111111]/90 truncate ${fontClass}`}>
              {note.body}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {note.priority && (
              <Badge variant={priorityBadges[note.priority].variant} size="sm">
                {priorityBadges[note.priority].label}
              </Badge>
            )}
            {note.subject && (
              <Badge variant="paper" size="sm">
                {note.subject}
              </Badge>
            )}
            {(note.dueDate || note.dueTime) && (
              <Badge variant={isOverdue ? 'danger' : 'paper'} size="sm">
                {isOverdue ? 'OVERDUE' : `${note.dueDate || ''}${note.dueTime ? ` ${note.dueTime}` : ''}`}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 hover:bg-black/10 transition-colors"
            title="Edit note"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#111111]" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 hover:bg-[#FF4D4D]/20 text-[#111111] hover:text-[#FF4D4D] transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={
        isCompleting
          ? { scale: 0.2, opacity: 0, rotate: 15 }
          : { scale: 1, opacity: 1, rotate: note.position.rotation }
      }
      transition={{ duration: 0.35, ease: 'backIn' }}
      style={{
        left: `${note.position.x}px`,
        top: `${note.position.y}px`,
        zIndex: isDragging ? 9999 : note.position.z,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={() => onEdit(note)}
      className={`
        absolute w-64 md:w-72 border-[3px] border-[#111111] shadow-[6px_6px_0_#111111]
        ${noteBg} text-[#111111] p-4 flex flex-col justify-between select-none
        transition-shadow cursor-grab active:cursor-grabbing
        ${isDragging ? 'shadow-[10px_10px_0_#111111] scale-[1.02]' : 'hover:shadow-[8px_8px_0_#111111]'}
      `}
    >
      {/* Satisfying Stamp Animation on Done */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            initial={{ scale: 2, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: -15 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="border-[5px] border-[#FF4D4D] text-[#FF4D4D] font-heading font-black text-3xl px-4 py-2 uppercase tracking-widest bg-white/90 shadow-[4px_4px_0_#111111]">
              DONE!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar / Grab handle */}
      <div className="flex items-center justify-between border-b-[2px] border-[#111111]/20 pb-2 mb-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <GripHorizontal className="w-4 h-4 text-[#111111]/50 shrink-0" />
          {note.subject && (
            <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-[#111111]/80 truncate">
              {note.subject}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {note.priority && (
            <Badge variant={priorityBadges[note.priority].variant} size="sm">
              {priorityBadges[note.priority].label}
            </Badge>
          )}
          {isOverdue && (
            <Badge variant="danger" size="sm">
              OVERDUE
            </Badge>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 my-1 text-left">
        {note.title && (
          <h3 className="font-heading font-black text-base uppercase tracking-wide mb-1 text-[#111111] break-words">
            {note.title}
          </h3>
        )}
        <p className={`font-medium text-[#111111] whitespace-pre-wrap break-words ${fontClass}`}>
          {note.body}
        </p>
      </div>

      {/* Footer bar with Actions and Due Date */}
      <div className="mt-3 pt-2 border-t-[2px] border-[#111111]/20 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#111111]/70">
          {(note.dueDate || note.dueTime) && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{note.dueDate}</span>
              {note.dueTime && <span className="text-[10px] bg-black/10 px-1 font-mono font-bold">{note.dueTime}</span>}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onFocusTask && (
            <button
              onClick={() => onFocusTask(note.id)}
              className="p-1 hover:bg-black/10 transition-colors text-[10px] font-heading font-black uppercase"
              title="Focus on this task"
            >
              Focus
            </button>
          )}
          <button
            onClick={() => onEdit(note)}
            className="p-1 hover:bg-black/10 transition-colors"
            title="Edit note"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#111111]" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 hover:bg-[#FF4D4D]/20 text-[#111111] hover:text-[#FF4D4D] transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={triggerCompletion}
            className="ml-1 px-2 py-0.5 border-[2px] border-[#111111] bg-white text-[#111111] font-heading font-black text-xs hover:bg-[#6BCB77] transition-colors shadow-[2px_2px_0_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1"
            title="Mark Done"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            Done
          </button>
        </div>
      </div>
    </motion.div>
  );
};
