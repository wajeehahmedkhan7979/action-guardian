import { useState, useMemo } from 'react';
import { ActionFilters, AIAction, ActionStatus, ActionType } from '@/types/action';
import { useActions } from '@/context/ActionsContext';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ActionTypeBadge } from '@/components/dashboard/ActionTypeBadge';
import { ActionModal } from '@/components/dashboard/ActionModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 15;

export default function History() {
  const { actions, handleApprove, handleReject } = useActions();
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ActionFilters>({
    status: 'all',
    actionType: 'all',
    sortBy: 'newest',
    searchQuery: '',
  });

  // Filter to only show approved/rejected actions
  const historyActions = useMemo(() => {
    let result = actions.filter(
      (a) => a.status === 'approved' || a.status === 'rejected'
    );

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

  // Pagination
  const totalPages = Math.ceil(historyActions.length / ITEMS_PER_PAGE);
  const paginatedActions = historyActions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const updateFilter = <K extends keyof ActionFilters>(
    key: K,
    value: ActionFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Action History</h1>
        <p className="text-muted-foreground">
          View all past approved and rejected actions
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="pl-9"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter('status', value as ActionStatus | 'all')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.actionType}
          onValueChange={(value) => updateFilter('actionType', value as ActionType | 'all')}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="api_call">API Call</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="notification">Notification</SelectItem>
            <SelectItem value="file_operation">File Operation</SelectItem>
            <SelectItem value="integration">Integration</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            updateFilter('sortBy', value as 'newest' | 'oldest' | 'entity')
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="entity">By Entity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedActions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No history found
                </TableCell>
              </TableRow>
            ) : (
              paginatedActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {action.description}
                  </TableCell>
                  <TableCell>
                    <ActionTypeBadge type={action.actionType} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {action.entity}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={action.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(action.timestamp, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAction(action);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, historyActions.length)} of{' '}
            {historyActions.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <ActionModal
        action={selectedAction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
