import { ActionStatus } from '@/types/action';
import { cn } from '@/lib/utils';
import { Check, X, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ActionStatus;
  className?: string;
}

const statusConfig: Record<ActionStatus, { label: string; icon: typeof Check; className: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-pending/10 text-pending border-pending/20',
  },
  approved: {
    label: 'Approved',
    icon: Check,
    className: 'bg-success/10 text-success border-success/20',
  },
  rejected: {
    label: 'Rejected',
    icon: X,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
