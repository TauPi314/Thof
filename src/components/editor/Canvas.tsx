
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface CanvasProps {
  videoSrc: string;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  effects: VideoEffect[];
}

export interface VideoEffect {
  id: string;
  type: 'brightness' | 'contrast' | 'saturation' | 'blur' | 'sepia';
  value: number;
}

const Canvas: React.FC<CanvasProps> = ({
  videoSrc,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onDurationChange,
  effects
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize video and canvas
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      if (video.duration) {
        onDurationChange(video.duration);
        setIsLoading(false);
      }
    };

    const handleError = () => {
      setError('Error loading video');
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc, onDurationChange]);

  // Sync video current time with timeline
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only update if the difference is significant to prevent loops
    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((err) => {
        console.error('Error playing video:', err);
        // User might need to interact with the page first
        setError('Click to play (autoplay prevented)');
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Canvas rendering with effects
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (video.paused || video.ended) return;

      // Match canvas dimensions to video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Apply effects (simplified implementation)
      if (effects.length > 0) {
        // This is a simplified demo - actual WebGL effects would be more complex
        let filterString = '';
        
        effects.forEach(effect => {
          if (effect.type === 'brightness') {
            filterString += `brightness(${100 + effect.value}%) `;
          } else if (effect.type === 'contrast') {
            filterString += `contrast(${100 + effect.value}%) `;
          } else if (effect.type === 'saturation') {
            filterString += `saturate(${100 + effect.value}%) `;
          } else if (effect.type === 'blur') {
            filterString += `blur(${effect.value * 0.1}px) `;
          } else if (effect.type === 'sepia') {
            filterString += `sepia(${effect.value}%) `;
          }
        });
        
        if (filterString) {
          ctx.filter = filterString.trim();
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.filter = 'none';
        }
      }

      // Update timeline current time
      onTimeUpdate(video.currentTime);
      
      // Continue rendering
      requestIdRef.current = requestAnimationFrame(render);
    };

    // Start rendering if playing
    if (isPlaying) {
      requestIdRef.current = requestAnimationFrame(render);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, [isPlaying, effects, onTimeUpdate]);

  return (
    <Card className="overflow-hidden relative bg-black aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <video 
        ref={videoRef}
        src={videoSrc}
        className="hidden"
        playsInline
        muted
      />
      
      <canvas 
        ref={canvasRef}
        className="max-w-full max-h-full mx-auto"
        onClick={() => {
          // Allow user interaction to trigger play
          if (error) {
            setError(null);
            if (!isPlaying) {
              videoRef.current?.play();
            }
          }
        }}
      />
    </Card>
  );
};

export default Canvas;
