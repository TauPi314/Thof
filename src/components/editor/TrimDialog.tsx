
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { VideoClip } from './Timeline';

interface TrimDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  clipToTrim: VideoClip | null;
  trimStartTime: number;
  trimEndTime: number;
  setTrimStartTime: (time: number) => void;
  setTrimEndTime: (time: number) => void;
  onApplyTrim: () => void;
  formatTime: (seconds: number) => string;
}

const TrimDialog: React.FC<TrimDialogProps> = ({
  showDialog,
  setShowDialog,
  clipToTrim,
  trimStartTime,
  trimEndTime,
  setTrimStartTime,
  setTrimEndTime,
  onApplyTrim,
  formatTime
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trim Clip: {clipToTrim?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Time: {formatTime(trimStartTime)}</label>
            <Slider
              value={[trimStartTime]}
              max={trimEndTime - 0.5} // Ensure at least 0.5 seconds of content
              step={0.01}
              onValueChange={(value) => setTrimStartTime(value[0])}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Time: {formatTime(trimEndTime)}</label>
            <Slider
              value={[trimEndTime]}
              min={trimStartTime + 0.5} // Ensure at least 0.5 seconds of content
              max={clipToTrim ? clipToTrim.startTime + clipToTrim.duration : 0}
              step={0.01}
              onValueChange={(value) => setTrimEndTime(value[0])}
            />
          </div>
          <div className="bg-muted p-2 rounded text-sm">
            <p>Clip Duration: {formatTime(trimEndTime - trimStartTime)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={onApplyTrim}>Apply Trim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrimDialog;
