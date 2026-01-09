import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BulkActionToolbarProps {
  selectedCount: number;
  pendingSelectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onClearSelection: () => void;
}

export function BulkActionToolbar({
  selectedCount,
  pendingSelectedCount,
  onApproveAll,
  onRejectAll,
  onClearSelection,
}: BulkActionToolbarProps) {
  const requiresConfirmation = pendingSelectedCount >= 10;

  const ApproveButton = () => (
    <Button
      size="sm"
      onClick={onApproveAll}
      className="bg-success hover:bg-success/90 text-success-foreground"
      disabled={pendingSelectedCount === 0}
    >
      <Check className="w-4 h-4 mr-1" />
      Approve ({pendingSelectedCount})
    </Button>
  );

  const RejectButton = () => (
    <Button
      size="sm"
      variant="destructive"
      onClick={onRejectAll}
      disabled={pendingSelectedCount === 0}
    >
      <X className="w-4 h-4 mr-1" />
      Reject ({pendingSelectedCount})
    </Button>
  );

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-foreground text-background rounded-xl shadow-2xl">
            <span className="text-sm font-medium px-2">
              {selectedCount} selected
            </span>

            <div className="w-px h-6 bg-background/20" />

            {requiresConfirmation ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      disabled={pendingSelectedCount === 0}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve ({pendingSelectedCount})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve {pendingSelectedCount} actions?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to approve {pendingSelectedCount} actions at once.
                        This action can be undone individually but not in bulk.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onApproveAll}
                        className="bg-success hover:bg-success/90"
                      >
                        Approve All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={pendingSelectedCount === 0}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject ({pendingSelectedCount})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject {pendingSelectedCount} actions?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to reject {pendingSelectedCount} actions at once.
                        This action can be undone individually but not in bulk.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onRejectAll}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Reject All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <ApproveButton />
                <RejectButton />
              </>
            )}

            <div className="w-px h-6 bg-background/20" />

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-background hover:text-background hover:bg-background/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
