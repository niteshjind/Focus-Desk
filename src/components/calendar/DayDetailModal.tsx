import React from 'react';
import { Modal } from '../ui/Modal';
import { CompletedTask, TaskNote } from '../../types/focusdeck';
import { Badge } from '../ui/Badge';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Clock, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useHistoryStore } from '../../store/historyStore';

export interface DayDetailModalProps {
  isOpen: boolean;
  date: Date | null;
  dayKey: string;
  completedTasks: CompletedTask[];
  dueTasks: TaskNote[];
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  date,
  completedTasks,
  dueTasks,
  onClose,
}) => {
  const removeCompletedTask = useHistoryStore((s) => s.removeCompletedTask);

  if (!date) return null;

  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formattedDate}
      subtitle={`Daily Work Log • ${completedTasks.length} task${completedTasks.length === 1 ? '' : 's'} completed`}
      headerColor="bg-[#6BCB77]"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 text-left">
        {/* Completed Tasks Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-heading font-black text-xs uppercase tracking-wider text-[#111111]">
            <CheckCircle2 className="w-4 h-4 text-[#6BCB77]" />
            Completed Work ({completedTasks.length})
          </div>

          {completedTasks.length === 0 ? (
            <p className="text-xs text-[#111111]/60 font-semibold p-3 border-[2px] border-dashed border-[#111111]/30 bg-neutral-50 text-center">
              No tasks completed on this day.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto p-1">
              {completedTasks.map((task) => {
                let timeStr = '';
                try {
                  timeStr = format(parseISO(task.completedAt), 'hh:mm a');
                } catch {
                  timeStr = '';
                }

                return (
                  <div
                    key={task.id}
                    className="p-3 border-[2px] border-[#111111] bg-white shadow-[2px_2px_0_#111111] flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      {task.title && (
                        <div className="font-heading font-black text-xs uppercase truncate text-[#111111]">
                          {task.title}
                        </div>
                      )}
                      <p className="text-xs font-semibold text-[#111111]/80 break-words mt-0.5">
                        {task.body}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {task.subject && (
                          <Badge variant="paper" size="sm">
                            {task.subject}
                          </Badge>
                        )}
                        {timeStr && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#111111]/60">
                            <Clock className="w-3 h-3" />
                            {timeStr}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeCompletedTask(task.id)}
                      className="p-1 text-[#111111]/40 hover:text-[#FF4D4D] hover:bg-[#FF4D4D]/10 transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Due Tasks on this day */}
        {dueTasks.length > 0 && (
          <div className="flex flex-col gap-2 pt-3 border-t-[2px] border-[#111111]/10">
            <div className="flex items-center gap-2 font-heading font-black text-xs uppercase tracking-wider text-[#111111]">
              <CalendarIcon className="w-4 h-4 text-[#FF8C42]" />
              Due on this day ({dueTasks.length})
            </div>
            <div className="flex flex-col gap-1.5">
              {dueTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-2 border-[2px] border-[#111111] bg-[#FFF8E7] text-xs font-bold flex items-center justify-between"
                >
                  <span className="truncate">{t.title || t.body}</span>
                  <Badge variant="yellow" size="sm">
                    PENDING
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
