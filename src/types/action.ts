export type ActionStatus = 'pending' | 'approved' | 'rejected';

export type ActionType = 'email' | 'api_call' | 'database' | 'notification' | 'file_operation' | 'integration';

export interface AIAction {
  id: string;
  description: string;
  entity: string;
  actionType: ActionType;
  timestamp: Date;
  status: ActionStatus;
  metadata?: {
    confidence?: number;
    source?: string;
    details?: string;
    relatedEntities?: string[];
  };
}

export interface ActionFilters {
  status: ActionStatus | 'all';
  actionType: ActionType | 'all';
  sortBy: 'newest' | 'oldest' | 'entity';
  searchQuery: string;
}
