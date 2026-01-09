import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  onApprove?: () => void;
  onReject?: () => void;
  onOpenDetails?: () => void;
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  onSelectCurrent?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onApprove,
  onReject,
  onOpenDetails,
  onNavigateUp,
  onNavigateDown,
  onSelectCurrent,
  enabled = true,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'a':
          if (onApprove) {
            event.preventDefault();
            onApprove();
          }
          break;
        case 'r':
          if (onReject) {
            event.preventDefault();
            onReject();
          }
          break;
        case 'enter':
          if (onOpenDetails) {
            event.preventDefault();
            onOpenDetails();
          }
          break;
        case 'arrowup':
        case 'k':
          if (onNavigateUp) {
            event.preventDefault();
            onNavigateUp();
          }
          break;
        case 'arrowdown':
        case 'j':
          if (onNavigateDown) {
            event.preventDefault();
            onNavigateDown();
          }
          break;
        case ' ':
          if (onSelectCurrent) {
            event.preventDefault();
            onSelectCurrent();
          }
          break;
        case 'escape':
          // Blur current focus
          (document.activeElement as HTMLElement)?.blur();
          break;
      }
    },
    [onApprove, onReject, onOpenDetails, onNavigateUp, onNavigateDown, onSelectCurrent]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
