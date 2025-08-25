import { useEffect } from 'react';

export function useShortcuts(handlers: {
  onSlashFocusSearch?: () => void;
  onEscape?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onSlashFocusSearch?.();
      }
      if (e.key === 'Escape') {
        handlers.onEscape?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers]);
}
