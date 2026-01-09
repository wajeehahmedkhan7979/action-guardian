import { AIAction } from '@/types/action';
import { StatusBadge } from './StatusBadge';
import { ActionTypeBadge } from './ActionTypeBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  action: AIAction;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (action: AIAction) => void;
}

export function ActionCard({
  action,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onViewDetails,
}: ActionCardProps) {
  const isPending = action.status === 'pending';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'group relative bg-card border rounded-lg p-4 transition-all duration-200',
        'hover:shadow-md hover:border-primary/20',
        isSelected && 'ring-2 ring-primary/30 border-primary/40'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(action.id)}
            aria-label={`Select action ${action.id}`}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate mb-1">
                {action.description}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <ActionTypeBadge type={action.actionType} />
                <span className="text-xs text-muted-foreground">
                  {action.entity}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
            <StatusBadge status={action.status} />
          </div>

          {/* Actions */}
          {isPending && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Button
                size="sm"
                onClick={() => onApprove(action.id)}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(action.id)}
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetails(action)}
                className="ml-auto"
              >
                <Eye className="w-4 h-4 mr-1" />
                Details
              </Button>
            </div>
          )}

          {!isPending && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetails(action)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
