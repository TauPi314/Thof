
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Clock, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface PlaybackControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  onTimeChange,
  onPlay,
  onPause,
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value: number[]) => {
    onTimeChange(value[0]);
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
    </div>
  );
};

export default PlaybackControls;
