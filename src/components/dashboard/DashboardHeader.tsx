import { Bot, Activity } from 'lucide-react';

interface DashboardHeaderProps {
  totalActions: number;
  pendingActions: number;
}

export function DashboardHeader({ totalActions, pendingActions }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                AI Agent Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Review and approve AI-generated actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total Actions:</span>
              <span className="font-semibold">{totalActions}</span>
            </div>
            
            {pendingActions > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 rounded-full">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                <span className="text-sm font-medium text-warning">
                  {pendingActions} pending review
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
