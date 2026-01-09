import { ActionFilters, ActionStatus, ActionType } from '@/types/action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  filters: ActionFilters;
  onFiltersChange: (filters: ActionFilters) => void;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalVisible: number;
  selectedCount: number;
  onSelectAll: () => void;
  allSelected: boolean;
}

export function FilterBar({
  filters,
  onFiltersChange,
  pendingCount,
  approvedCount,
  rejectedCount,
  totalVisible,
  selectedCount,
  onSelectAll,
  allSelected,
}: FilterBarProps) {
  const updateFilter = <K extends keyof ActionFilters>(
    key: K,
    value: ActionFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const statusTabs: { value: ActionStatus | 'all'; label: string; count?: number }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending', count: pendingCount },
    { value: 'approved', label: 'Approved', count: approvedCount },
    { value: 'rejected', label: 'Rejected', count: rejectedCount },
  ];

  const hasActiveFilters =
    filters.actionType !== 'all' ||
    filters.sortBy !== 'newest' ||
    filters.searchQuery !== '';

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateFilter('status', tab.value)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-all
              ${
                filters.status === tab.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Select All */}
        <div className="flex items-center gap-2 pr-3 border-r">
          <Checkbox
            checked={allSelected && totalVisible > 0}
            onCheckedChange={onSelectAll}
            aria-label="Select all visible actions"
          />
          <span className="text-sm text-muted-foreground">
            {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
          </span>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
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

        {/* Action Type Filter */}
        <Select
          value={filters.actionType}
          onValueChange={(value) => updateFilter('actionType', value as ActionType | 'all')}
        >
          <SelectTrigger className="w-[150px]">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Action Type" />
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

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            updateFilter('sortBy', value as 'newest' | 'oldest' | 'entity')
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="entity">By Entity</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFiltersChange({
                ...filters,
                actionType: 'all',
                sortBy: 'newest',
                searchQuery: '',
              })
            }
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
