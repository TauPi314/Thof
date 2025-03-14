
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { format } from 'date-fns';

export interface ChangelogEntryType {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  action: string;
  description: string;
  created_at: string;
}

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
}

export const ChangelogEntry: React.FC<ChangelogEntryProps> = ({ entry }) => {
  return (
    <div className="flex gap-3 border-b pb-3 last:border-0">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{getInitials(entry.user_name)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1 flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">
            {entry.user_name} <span className="font-normal text-muted-foreground">{entry.action}</span>
          </p>
          <p className="text-xs text-muted-foreground">{format(new Date(entry.created_at), 'MMM d, h:mm a')}</p>
        </div>
        <p className="text-sm">{entry.description}</p>
      </div>
    </div>
  );
};
