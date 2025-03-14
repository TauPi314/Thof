
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Scissors } from 'lucide-react';
import { VideoClip } from './Timeline';

interface TimelineClipProps {
  clip: VideoClip;
  isSelected: boolean;
  isDraggedOver: boolean;
  onClipSelect: (clipId: string) => void;
  onDeleteClip: (clipId: string, e: React.MouseEvent) => void;
  onOpenTrimDialog: (clip: VideoClip, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, clipId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, clipId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, clipId: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  formatTime: (seconds: number) => string;
}

const TimelineClip: React.FC<TimelineClipProps> = ({
  clip,
  isSelected,
  isDraggedOver,
  onClipSelect,
  onDeleteClip,
  onOpenTrimDialog,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  formatTime
}) => {
  return (
    <Card 
      key={clip.id} 
      className={`clip-item cursor-pointer hover:bg-muted transition-colors ${isSelected ? 'border-primary' : ''} ${isDraggedOver ? 'border-dashed border-primary' : ''}`}
      onClick={() => onClipSelect(clip.id)}
      draggable
      onDragStart={(e) => onDragStart(e, clip.id)}
      onDragOver={(e) => onDragOver(e, clip.id)}
      onDrop={(e) => onDrop(e, clip.id)}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <div className="drag-handle cursor-grab text-muted-foreground hover:text-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="clip-thumbnail w-16 h-12 bg-muted-foreground/20 rounded flex-shrink-0 overflow-hidden">
          {clip.thumbnail && (
            <img 
              src={clip.thumbnail} 
              alt={clip.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="clip-info flex-1 text-left">
          <p className="font-medium text-sm truncate">{clip.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(clip.startTime)} - {formatTime(clip.startTime + clip.duration)}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={(e) => onOpenTrimDialog(clip, e)}
            title="Trim clip"
          >
            <Scissors className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => onDeleteClip(clip.id, e)}
            title="Delete clip"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineClip;
