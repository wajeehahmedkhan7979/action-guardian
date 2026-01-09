import { useState, useMemo, useCallback } from 'react';
import { AIAction, ActionFilters, ActionStatus } from '@/types/action';
import { mockActions } from '@/data/mockActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionList } from '@/components/dashboard/ActionList';
import { ActionModal } from '@/components/dashboard/ActionModal';
import { BulkActionToolbar } from '@/components/dashboard/BulkActionToolbar';
import { toast } from 'sonner';
import { Undo2 } from 'lucide-react';

interface ActionHistory {
  action: AIAction;
  previousStatus: ActionStatus;
}

const Index = () => {
  const [actions, setActions] = useState<AIAction[]>(mockActions);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const [filters, setFilters] = useState<ActionFilters>({
    status: 'pending',
    actionType: 'all',
    sortBy: 'newest',
    searchQuery: '',
  });

  // Counts
  const counts = useMemo(() => {
    return {
      pending: actions.filter((a) => a.status === 'pending').length,
      approved: actions.filter((a) => a.status === 'approved').length,
      rejected: actions.filter((a) => a.status === 'rejected').length,
    };
  }, [actions]);

  // Filtered and sorted actions
  const filteredActions = useMemo(() => {
    let result = [...actions];

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter((a) => a.status === filters.status);
    }

    // Filter by action type
    if (filters.actionType !== 'all') {
      result = result.filter((a) => a.actionType === filters.actionType);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.description.toLowerCase().includes(query) ||
          a.entity.toLowerCase().includes(query) ||
          a.id.toLowerCase().includes(query)
      );
    }

    // Sort
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

  // Update action status
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
        return prev.map((a) =>
          a.id === id ? { ...a, status: newStatus } : a
        );
      });
    },
    []
  );

  // Handle approve
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
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [updateActionStatus]
  );

  // Handle reject
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
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [updateActionStatus]
  );

  // Handle undo
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

  // Handle select
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

  // Handle view details
  const handleViewDetails = useCallback((action: AIAction) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  }, []);

  // Bulk approve
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

  // Bulk reject
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

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        totalActions={actions.length}
        pendingActions={counts.pending}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            pendingCount={counts.pending}
            approvedCount={counts.approved}
            rejectedCount={counts.rejected}
          />

          <ActionList
            actions={filteredActions}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetails={handleViewDetails}
          />
        </div>
      </main>

      <ActionModal
        action={selectedAction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <BulkActionToolbar
        selectedCount={selectedIds.size}
        onApproveAll={handleBulkApprove}
        onRejectAll={handleBulkReject}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};

export default Index;
