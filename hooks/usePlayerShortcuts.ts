
import { useEffect } from 'react';

interface ShortcutHandlers {
  onPlayPause: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export const usePlayerShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Safety Check: Ignore if typing in an input field, textarea, or contentEditable element
      const target = e.target as HTMLElement;
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || 
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      switch (key) {
        case ' ':
        case 'k':
          e.preventDefault(); // Prevent page scroll
          handlers.onPlayPause();
          break;
        
        case 'f':
          e.preventDefault();
          handlers.onToggleFullscreen();
          break;

        case 'm':
          e.preventDefault();
          handlers.onToggleMute();
          break;

        case 'arrowright':
        case 'l':
          e.preventDefault();
          handlers.onSeekForward();
          break;

        case 'arrowleft':
        case 'j':
          e.preventDefault();
          handlers.onSeekBackward();
          break;

        case 'arrowup':
          e.preventDefault(); // Prevent page scroll
          handlers.onVolumeUp();
          break;

        case 'arrowdown':
          e.preventDefault(); // Prevent page scroll
          handlers.onVolumeDown();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]); // Re-bind if handlers change
};
