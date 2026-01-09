import { ActionType } from '@/types/action';
import { cn } from '@/lib/utils';
import { Mail, Globe, Database, Bell, FileText, Link } from 'lucide-react';

interface ActionTypeBadgeProps {
  type: ActionType;
  className?: string;
}

const typeConfig: Record<ActionType, { label: string; icon: typeof Mail; className: string }> = {
  email: {
    label: 'Email',
    icon: Mail,
    className: 'bg-blue-500/10 text-blue-600',
  },
  api_call: {
    label: 'API Call',
    icon: Globe,
    className: 'bg-purple-500/10 text-purple-600',
  },
  database: {
    label: 'Database',
    icon: Database,
    className: 'bg-emerald-500/10 text-emerald-600',
  },
  notification: {
    label: 'Notification',
    icon: Bell,
    className: 'bg-amber-500/10 text-amber-600',
  },
  file_operation: {
    label: 'File Op',
    icon: FileText,
    className: 'bg-rose-500/10 text-rose-600',
  },
  integration: {
    label: 'Integration',
    icon: Link,
    className: 'bg-cyan-500/10 text-cyan-600',
  },
};

export function ActionTypeBadge({ type, className }: ActionTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
