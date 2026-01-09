import { AIAction } from '@/types/action';
import { ActionCard } from './ActionCard';
import { AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface ActionListProps {
  actions: AIAction[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (action: AIAction) => void;
}

export function ActionList({
  actions,
  selectedIds,
  onSelect,
  onApprove,
  onReject,
  onViewDetails,
}: ActionListProps) {
  if (actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          No actions found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no actions matching your current filters. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            isSelected={selectedIds.has(action.id)}
            onSelect={onSelect}
            onApprove={onApprove}
            onReject={onReject}
            onViewDetails={onViewDetails}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
