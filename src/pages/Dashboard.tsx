import { useState, useMemo, useCallback } from 'react';
import { ActionFilters } from '@/types/action';
import { useActions } from '@/context/ActionsContext';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionList } from '@/components/dashboard/ActionList';
import { ActionModal } from '@/components/dashboard/ActionModal';
import { BulkActionToolbar } from '@/components/dashboard/BulkActionToolbar';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { toast } from 'sonner';
import { AIAction } from '@/types/action';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function Dashboard() {
  const { actions, counts, handleApprove, handleReject, updateActionStatus } = useActions();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [filters, setFilters] = useState<ActionFilters>({
    status: 'pending',
    actionType: 'all',
    sortBy: 'newest',
    searchQuery: '',
  });

  // Filtered and sorted actions
  const filteredActions = useMemo(() => {
    let result = [...actions];

    if (filters.status !== 'all') {
      result = result.filter((a) => a.status === filters.status);
    }

    if (filters.actionType !== 'all') {
      result = result.filter((a) => a.actionType === filters.actionType);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.description.toLowerCase().includes(query) ||
          a.entity.toLowerCase().includes(query) ||
          a.id.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'entity':
          return a.entity.localeCompare(b.entity);
        default:
          return 0;
      }
    });

    return result;
  }, [actions, filters]);

  // Pending selected count for bulk actions
  const pendingSelectedCount = useMemo(() => {
    return [...selectedIds].filter((id) => {
      const action = actions.find((a) => a.id === id);
      return action?.status === 'pending';
    }).length;
  }, [selectedIds, actions]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === filteredActions.length) {
        return new Set();
      }
      return new Set(filteredActions.map((a) => a.id));
    });
  }, [filteredActions]);

  const handleViewDetails = useCallback((action: AIAction) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  }, []);

  const handleBulkApprove = useCallback(() => {
    const pendingSelected = [...selectedIds].filter((id) => {
      const action = actions.find((a) => a.id === id);
      return action?.status === 'pending';
    });

    pendingSelected.forEach((id) => {
      updateActionStatus(id, 'approved');
    });

    toast.success(`${pendingSelected.length} actions approved`);
    setSelectedIds(new Set());
  }, [selectedIds, actions, updateActionStatus]);

  const handleBulkReject = useCallback(() => {
    const pendingSelected = [...selectedIds].filter((id) => {
      const action = actions.find((a) => a.id === id);
      return action?.status === 'pending';
    });

    pendingSelected.forEach((id) => {
      updateActionStatus(id, 'rejected');
    });

    toast.error(`${pendingSelected.length} actions rejected`);
    setSelectedIds(new Set());
  }, [selectedIds, actions, updateActionStatus]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const onApprove = useCallback(
    (id: string) => {
      handleApprove(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [handleApprove]
  );

  const onReject = useCallback(
    (id: string) => {
      handleReject(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [handleReject]
  );

  // Get current focused action
  const focusedAction = filteredActions[focusedIndex] || null;

  // Keyboard navigation
  useKeyboardNavigation({
    onApprove: () => {
      if (focusedAction && focusedAction.status === 'pending') {
        onApprove(focusedAction.id);
      }
    },
    onReject: () => {
      if (focusedAction && focusedAction.status === 'pending') {
        onReject(focusedAction.id);
      }
    },
    onOpenDetails: () => {
      if (focusedAction) {
        handleViewDetails(focusedAction);
      }
    },
    onNavigateUp: () => {
      setFocusedIndex((prev) => Math.max(0, prev - 1));
    },
    onNavigateDown: () => {
      setFocusedIndex((prev) => Math.min(filteredActions.length - 1, prev + 1));
    },
    onSelectCurrent: () => {
      if (focusedAction) {
        handleSelect(focusedAction.id);
      }
    },
    enabled: !isModalOpen,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Action Review</h1>
          <p className="text-muted-foreground">
            Review and approve AI-generated actions
          </p>
        </div>

        {/* Keyboard shortcuts hint */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
              <Keyboard className="w-4 h-4" />
              <span className="text-xs">Shortcuts</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Keyboard Shortcuts</h4>
              <div className="grid gap-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approve</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">A</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reject</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">R</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">View Details</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Navigate</span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono ml-1">↓</kbd>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Select</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">Space</kbd>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        pendingCount={counts.pending}
        approvedCount={counts.approved}
        rejectedCount={counts.rejected}
        totalVisible={filteredActions.length}
        selectedCount={selectedIds.size}
        onSelectAll={handleSelectAll}
        allSelected={selectedIds.size === filteredActions.length && filteredActions.length > 0}
      />

      <ActionList
        actions={filteredActions}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onApprove={onApprove}
        onReject={onReject}
        onViewDetails={handleViewDetails}
      />

      <ActionModal
        action={selectedAction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={onApprove}
        onReject={onReject}
      />

      <BulkActionToolbar
        selectedCount={selectedIds.size}
        pendingSelectedCount={pendingSelectedCount}
        onApproveAll={handleBulkApprove}
        onRejectAll={handleBulkReject}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}
