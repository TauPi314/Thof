
import React, { useState, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Clock, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import TimelineClipList from './TimelineClipList';
import TrimDialog from './TrimDialog';

interface TimelineProps {
  duration: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  clips: VideoClip[];
  onClipSelect: (clipId: string) => void;
  selectedClipId: string | null;
  onClipsChange?: (clips: VideoClip[]) => void;
  projectId?: string;
  onTrimClip?: (clipId: string, startTime: number, endTime: number) => void;
}

export interface VideoClip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  endTime?: number; // Optional for backward compatibility
  src: string;
  thumbnail?: string;
  position?: number;
}

const Timeline: React.FC<TimelineProps> = ({
  duration,
  currentTime,
  onTimeChange,
  onPlay,
  onPause,
  isPlaying,
  clips,
  onClipSelect,
  selectedClipId,
  onClipsChange,
  projectId,
  onTrimClip
}) => {
  const [draggedClip, setDraggedClip] = useState<string | null>(null);
  const [dragOverClip, setDragOverClip] = useState<string | null>(null);
  const [showAddClipModal, setShowAddClipModal] = useState(false);
  const [showTrimDialog, setShowTrimDialog] = useState(false);
  const [trimStartTime, setTrimStartTime] = useState(0);
  const [trimEndTime, setTrimEndTime] = useState(0);
  const [clipToTrim, setClipToTrim] = useState<VideoClip | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value: number[]) => {
    onTimeChange(value[0]);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, clipId: string) => {
    setDraggedClip(clipId);
    e.dataTransfer.setData('text/plain', clipId);
    
    // Set a ghost image for drag preview
    if (e.dataTransfer.setDragImage && e.currentTarget) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    }
    
    e.currentTarget.style.opacity = '0.6';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, clipId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedClip !== clipId) {
      setDragOverClip(clipId);
    }
  };

  // Handle general drag over on the timeline
  const handleTimelineDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetClipId: string) => {
    e.preventDefault();
    
    if (!draggedClip || draggedClip === targetClipId) {
      setDraggedClip(null);
      setDragOverClip(null);
      return;
    }
    
    // Reorder clips
    const newClips = [...clips];
    const draggedIndex = newClips.findIndex(clip => clip.id === draggedClip);
    const targetIndex = newClips.findIndex(clip => clip.id === targetClipId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = newClips.splice(draggedIndex, 1);
      newClips.splice(targetIndex, 0, removed);
      
      // Update positions
      newClips.forEach((clip, index) => {
        clip.position = index;
      });
      
      if (onClipsChange) {
        onClipsChange(newClips);
        
        toast({
          title: "Timeline updated",
          description: "Clip order has been updated",
        });
      }
    }
    
    setDraggedClip(null);
    setDragOverClip(null);
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedClip(null);
    setDragOverClip(null);
  };

  // Delete clip
  const handleDeleteClip = (clipId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newClips = clips.filter(clip => clip.id !== clipId);
    
    // Update positions
    newClips.forEach((clip, index) => {
      clip.position = index;
    });
    
    if (onClipsChange) {
      onClipsChange(newClips);
      
      toast({
        title: "Clip removed",
        description: "The clip has been removed from the timeline",
      });
    }
    
    // If the deleted clip was selected, select the first available clip or null
    if (selectedClipId === clipId) {
      if (newClips.length > 0) {
        onClipSelect(newClips[0].id);
      } else {
        onClipSelect('');
      }
    }
  };

  // Open trim dialog
  const handleOpenTrimDialog = (clip: VideoClip, e: React.MouseEvent) => {
    e.stopPropagation();
    setClipToTrim(clip);
    setTrimStartTime(clip.startTime);
    setTrimEndTime(clip.startTime + clip.duration);
    setShowTrimDialog(true);
  };

  // Apply trim to clip
  const handleApplyTrim = () => {
    if (clipToTrim && onTrimClip) {
      onTrimClip(clipToTrim.id, trimStartTime, trimEndTime);
      setShowTrimDialog(false);
      
      toast({
        title: "Clip trimmed",
        description: "The clip has been trimmed successfully",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onTimeChange(Math.max(0, currentTime - 5))}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={isPlaying ? onPause : onPlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onTimeChange(Math.min(duration, currentTime + 5))}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Slider
        value={[currentTime]}
        max={duration}
        step={0.01}
        onValueChange={handleSliderChange}
        className="w-full"
      />

      <Separator className="my-2" />

      <TimelineClipList
        clips={clips}
        selectedClipId={selectedClipId}
        draggedClip={draggedClip}
        dragOverClip={dragOverClip}
        timelineRef={timelineRef}
        formatTime={formatTime}
        handleTimelineDragOver={handleTimelineDragOver}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        handleDeleteClip={handleDeleteClip}
        handleOpenTrimDialog={handleOpenTrimDialog}
        onClipSelect={onClipSelect}
      />

      <TrimDialog
        showDialog={showTrimDialog}
        setShowDialog={setShowTrimDialog}
        clipToTrim={clipToTrim}
        trimStartTime={trimStartTime}
        trimEndTime={trimEndTime}
        setTrimStartTime={setTrimStartTime}
        setTrimEndTime={setTrimEndTime}
        onApplyTrim={handleApplyTrim}
        formatTime={formatTime}
      />
    </div>
  );
};

export default Timeline;
