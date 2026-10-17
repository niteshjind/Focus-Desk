import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerColor?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerColor = 'bg-[#FFD93D]',
  maxWidth = 'max-w-lg',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`
              relative w-full ${maxWidth} bg-[#FFF8E7] text-[#111111]
              border-[3px] border-[#111111] shadow-[8px_8px_0_#111111]
              flex flex-col max-h-[90vh] overflow-hidden z-10
            `}
          >
            {/* Header */}
            <div
              className={`
                border-b-[3px] border-[#111111] px-5 py-3 flex items-center justify-between
                ${headerColor}
              `}
            >
              <div>
                <h2 className="font-heading font-black text-lg uppercase tracking-wide">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs font-semibold text-[#111111]/80">{subtitle}</p>
                )}
              </div>
              <Button
                variant="icon"
                color="paper"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-[#111111]" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
