
import { useState, useCallback } from 'react';
import { VideoClip } from '@/components/editor/Timeline';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MediaItem } from '@/components/editor/MediaLibrary';

export const useVideoEditor = (projectId?: string, isAuthenticated: boolean = false, userId?: string) => {
  // Editor state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>('');
  const [projectName, setProjectName] = useState('Untitled Project');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Timeline handlers
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleClipSelect = useCallback((clipId: string) => {
    setSelectedClipId(clipId);
  }, []);

  return {
    // State
    currentTime,
    duration,
    isPlaying,
    selectedClipId,
    activeVideoSrc,
    projectName,
    projectDescription,
    isSaving,

    // Setters
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setSelectedClipId,
    setActiveVideoSrc,
    setProjectName,
    setProjectDescription,
    setIsSaving,

    // Handlers
    handlePlay,
    handlePause,
    handleTimeChange,
    handleClipSelect,
  };
};
