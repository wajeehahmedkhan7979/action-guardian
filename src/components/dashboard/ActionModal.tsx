import { AIAction } from '@/types/action';
import { StatusBadge } from './StatusBadge';
import { ActionTypeBadge } from './ActionTypeBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, X, Calendar, Cpu, Link2, Info } from 'lucide-react';
import { format } from 'date-fns';

interface ActionModalProps {
  action: AIAction | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ActionModal({
  action,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ActionModalProps) {
  if (!action) return null;

  const isPending = action.status === 'pending';
  const confidencePercent = action.metadata?.confidence
    ? Math.round(action.metadata.confidence * 100)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg animate-scale-in"
        aria-describedby="action-modal-description"
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ActionTypeBadge type={action.actionType} />
            <StatusBadge status={action.status} />
          </div>
          <DialogTitle className="text-xl">{action.description}</DialogTitle>
          <DialogDescription id="action-modal-description">
            Action ID: {action.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-muted rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Timestamp</p>
                <p className="font-medium">
                  {format(action.timestamp, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-muted rounded-lg">
                <Link2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entity</p>
                <p className="font-medium">{action.entity}</p>
              </div>
            </div>

            {action.metadata?.source && (
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-muted rounded-lg">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="font-medium">{action.metadata.source}</p>
                </div>
              </div>
            )}

            {confidencePercent !== null && (
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-muted rounded-lg">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <span className="font-medium">{confidencePercent}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          {action.metadata?.details && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Details</p>
              <p className="text-sm">{action.metadata.details}</p>
            </div>
          )}

          {/* Related Entities */}
          {action.metadata?.relatedEntities && action.metadata.relatedEntities.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Related Entities</p>
              <div className="flex flex-wrap gap-2">
                {action.metadata.relatedEntities.map((entity, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-secondary rounded-md"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isPending && (
          <div className="flex items-center gap-2 pt-4 border-t" role="group" aria-label="Action buttons">
            <Button
              onClick={() => {
                onApprove(action.id);
                onClose();
              }}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground focus-ring"
              aria-label="Approve this action"
            >
              <Check className="w-4 h-4 mr-2" aria-hidden="true" />
              Approve Action
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onReject(action.id);
                onClose();
              }}
              className="flex-1 focus-ring"
              aria-label="Reject this action"
            >
              <X className="w-4 h-4 mr-2" aria-hidden="true" />
              Reject Action
            </Button>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="pt-2 text-xs text-muted-foreground text-center" aria-hidden="true">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">A</kbd> to approve, 
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono ml-1">R</kbd> to reject
        </div>
      </DialogContent>
    </Dialog>
  );
}
