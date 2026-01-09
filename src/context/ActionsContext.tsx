import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { AIAction, ActionStatus } from '@/types/action';
import { mockActions } from '@/data/mockActions';
import { toast } from 'sonner';
import { Undo2 } from 'lucide-react';

interface ActionHistory {
  action: AIAction;
  previousStatus: ActionStatus;
}

interface ActionsContextType {
  actions: AIAction[];
  counts: { pending: number; approved: number; rejected: number };
  updateActionStatus: (id: string, newStatus: ActionStatus) => void;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  handleUndo: () => void;
}

const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export function ActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<AIAction[]>(mockActions);
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);

  const counts = useMemo(
    () => ({
      pending: actions.filter((a) => a.status === 'pending').length,
      approved: actions.filter((a) => a.status === 'approved').length,
      rejected: actions.filter((a) => a.status === 'rejected').length,
    }),
    [actions]
  );

  const updateActionStatus = useCallback(
    (id: string, newStatus: ActionStatus) => {
      setActions((prev) => {
        const action = prev.find((a) => a.id === id);
        if (action && action.status !== newStatus) {
          setActionHistory((h) => [
            ...h,
            { action: { ...action }, previousStatus: action.status },
          ]);
        }
        return prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
      });
    },
    []
  );

  const handleUndo = useCallback(() => {
    setActionHistory((prev) => {
      if (prev.length === 0) return prev;
      const lastAction = prev[prev.length - 1];
      setActions((actions) =>
        actions.map((a) =>
          a.id === lastAction.action.id
            ? { ...a, status: lastAction.previousStatus }
            : a
        )
      );
      toast.info('Action undone', {
        icon: <Undo2 className="w-4 h-4" />,
      });
      return prev.slice(0, -1);
    });
  }, []);

  const handleApprove = useCallback(
    (id: string) => {
      updateActionStatus(id, 'approved');
      toast.success('Action approved', {
        description: `Action ${id} has been approved.`,
        action: {
          label: 'Undo',
          onClick: () => handleUndo(),
        },
      });
    },
    [updateActionStatus, handleUndo]
  );

  const handleReject = useCallback(
    (id: string) => {
      updateActionStatus(id, 'rejected');
      toast.error('Action rejected', {
        description: `Action ${id} has been rejected.`,
        action: {
          label: 'Undo',
          onClick: () => handleUndo(),
        },
      });
    },
    [updateActionStatus, handleUndo]
  );

  return (
    <ActionsContext.Provider
      value={{
        actions,
        counts,
        updateActionStatus,
        handleApprove,
        handleReject,
        handleUndo,
      }}
    >
      {children}
    </ActionsContext.Provider>
  );
}

export function useActions() {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useActions must be used within an ActionsProvider');
  }
  return context;
}
