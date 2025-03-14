
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { ChangelogEntry, ChangelogEntryType } from './ChangelogEntry';

interface ChangelogPanelProps {
  isLoading: boolean;
  entries: ChangelogEntryType[];
}

const ChangelogPanel: React.FC<ChangelogPanelProps> = ({ isLoading, entries }) => {
  return (
    <ScrollArea className="flex-1 p-4">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center p-4">
          <div className="text-muted-foreground flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
            <p>No changes have been logged yet.</p>
            <p className="text-sm mt-1">Changes will appear here when contributors make edits.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <ChangelogEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default ChangelogPanel;
