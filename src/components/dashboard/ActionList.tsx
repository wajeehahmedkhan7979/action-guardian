import { AIAction } from '@/types/action';
import { ActionCard } from './ActionCard';
import { AnimatePresence, motion } from 'framer-motion';
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="p-4 bg-muted rounded-full mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          No actions found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no actions matching your current filters. Try adjusting your search or filters.
        </p>
      </motion.div>
    );
  }

  return (
    <div 
      className="space-y-3"
      role="list"
      aria-label={`Action list with ${actions.length} items`}
    >
      <AnimatePresence mode="popLayout">
        {actions.map((action, index) => (
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
