
import React from 'react';
import Canvas from '@/components/editor/Canvas';
import Timeline from '@/components/editor/Timeline';
import EffectsPanel from '@/components/editor/EffectsPanel';
import PlaybackControls from '@/components/editor/PlaybackControls';
import { Separator } from '@/components/ui/separator';
import { VideoEffect } from '@/components/editor/Canvas';
import { VideoClip } from '@/components/editor/Timeline';

interface EditorWorkspaceProps {
  activeVideoSrc: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedClipId: string | null;
  effects: VideoEffect[];
  clips: VideoClip[];
  projectId?: string;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  handlePlay: () => void;
  handlePause: () => void;
  handleTimeChange: (time: number) => void;
  handleClipSelect: (clipId: string) => void;
  handleClipsChange: (clips: VideoClip[]) => void;
  handleTrimClip: (clipId: string, startTime: number, endTime: number) => void;
  setEffects: (effects: VideoEffect[]) => void;
}

const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  activeVideoSrc,
  currentTime,
  duration,
  isPlaying,
  selectedClipId,
  effects,
  clips,
  projectId,
  setCurrentTime,
  setDuration,
  handlePlay,
  handlePause,
  handleTimeChange,
  handleClipSelect,
  handleClipsChange,
  handleTrimClip,
  setEffects,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-4">
      {/* Canvas and timeline */}
      <div className="space-y-4">
        <Canvas 
          videoSrc={activeVideoSrc}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onTimeUpdate={handleTimeChange}
          onDurationChange={setDuration}
          effects={effects}
        />
        
        <PlaybackControls
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTimeChange={handleTimeChange}
          onPlay={handlePlay}
          onPause={handlePause}
        />
        
        <Separator className="my-2" />
        
        <Timeline 
          duration={duration}
          currentTime={currentTime}
          onTimeChange={handleTimeChange}
          onPlay={handlePlay}
          onPause={handlePause}
          isPlaying={isPlaying}
          clips={clips}
          onClipSelect={handleClipSelect}
          selectedClipId={selectedClipId}
          onClipsChange={handleClipsChange}
          projectId={projectId}
          onTrimClip={handleTrimClip}
        />
      </div>
      
      {/* Effects panel */}
      <div className="space-y-4">
        <EffectsPanel 
          effects={effects}
          onEffectsChange={setEffects}
        />
      </div>
    </div>
  );
};

export default EditorWorkspace;
