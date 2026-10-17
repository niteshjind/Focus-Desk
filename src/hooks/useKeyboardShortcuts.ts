import { useEffect } from 'react';

export interface ShortcutHandlers {
  onNewNote?: () => void;
  onOpenWallpapers?: () => void;
  onToggleFocusMode?: () => void;
  onFocusCalendar?: () => void;
  onFocusSearch?: () => void;
  onCloseModal?: () => void;
  onShowShortcuts?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (e.key === 'Escape') {
        handlers.onCloseModal?.();
        return;
      }

      if (isInput) return;

      const key = e.key.toLowerCase();

      if (key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onNewNote?.();
      } else if (key === 'w' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onOpenWallpapers?.();
      } else if (key === 'f' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onToggleFocusMode?.();
      } else if (key === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onFocusCalendar?.();
      } else if (e.key === '/') {
        e.preventDefault();
        handlers.onFocusSearch?.();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        handlers.onShowShortcuts?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
