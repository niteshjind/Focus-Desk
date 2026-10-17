import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  durationMs?: number;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const typeIcons = {
  success: <CheckCircle2 className="w-5 h-5 text-[#111111]" />,
  warning: <AlertTriangle className="w-5 h-5 text-[#111111]" />,
  info: <Info className="w-5 h-5 text-[#111111]" />,
};

const typeColors = {
  success: 'bg-[#6BCB77]',
  warning: 'bg-[#FF8C42]',
  info: 'bg-[#4D96FF]',
};

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`
              pointer-events-auto border-[3px] border-[#111111] shadow-[6px_6px_0_#111111]
              bg-[#FFF8E7] text-[#111111] p-3 flex items-start gap-3
            `}
          >
            <div className={`p-1.5 border-[2px] border-[#111111] shrink-0 ${typeColors[toast.type]}`}>
              {typeIcons[toast.type]}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              {toast.title && (
                <div className="font-heading font-black text-sm uppercase tracking-wide">
                  {toast.title}
                </div>
              )}
              <div className="text-xs font-semibold text-[#111111]/90 break-words">
                {toast.message}
              </div>
              {toast.action && (
                <div className="mt-2">
                  <Button
                    size="sm"
                    color="yellow"
                    onClick={() => {
                      toast.action?.onClick();
                      onDismiss(toast.id);
                    }}
                  >
                    {toast.action.label}
                  </Button>
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-black/10 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4 text-[#111111]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
