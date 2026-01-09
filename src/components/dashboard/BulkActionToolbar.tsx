import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionToolbarProps {
  selectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onClearSelection: () => void;
}

export function BulkActionToolbar({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onClearSelection,
}: BulkActionToolbarProps) {
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
            
            <Button
              size="sm"
              onClick={onApproveAll}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve All
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={onRejectAll}
            >
              <X className="w-4 h-4 mr-1" />
              Reject All
            </Button>
            
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
