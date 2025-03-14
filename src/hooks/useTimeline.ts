
import { useState, useCallback } from 'react';
import { VideoClip } from '@/components/editor/Timeline';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTimeline = (projectId?: string, isAuthenticated: boolean = false) => {
  // Clips state 
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [history, setHistory] = useState<VideoClip[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Update clips in Supabase
  const updateClipsInSupabase = async (updatedClips: VideoClip[]) => {
    if (!projectId || !isAuthenticated) return;
    
    try {
      // Update clips one by one to maintain position
      for (const clip of updatedClips) {
        const { error } = await supabase
          .from('video_clips')
          .update({
            position: clip.position,
            start_time: clip.startTime,
            duration: clip.duration
          })
          .eq('id', clip.id);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating clips:', error);
      toast({
        title: 'Error updating clips',
        description: 'Could not update the clip order on the server',
        variant: 'destructive'
      });
    }
  };

  // Handle clips change (reordering)
  const handleClipsChange = useCallback((updatedClips: VideoClip[]) => {
    setClips(updatedClips);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedClips);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Update in Supabase if project exists
    if (projectId && isAuthenticated) {
      updateClipsInSupabase(updatedClips);
    }
  }, [history, historyIndex, projectId, isAuthenticated]);

  // Handle trim clip
  const handleTrimClip = useCallback((clipId: string, startTime: number, endTime: number) => {
    const newClips = [...clips];
    const clipIndex = newClips.findIndex(clip => clip.id === clipId);
    
    if (clipIndex !== -1) {
      // Calculate new duration based on trim points
      const newDuration = endTime - startTime;
      
      // Update clip with new trim points
      newClips[clipIndex] = {
        ...newClips[clipIndex],
        startTime,
        duration: newDuration
      };
      
      // Update clips
      handleClipsChange(newClips);
    }
  }, [clips, handleClipsChange]);

  // Handle undo/redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setClips(history[historyIndex - 1]);
      
      // Update in Supabase if project exists
      if (projectId && isAuthenticated) {
        updateClipsInSupabase(history[historyIndex - 1]);
      }
    }
  }, [history, historyIndex, projectId, isAuthenticated]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setClips(history[historyIndex + 1]);
      
      // Update in Supabase if project exists
      if (projectId && isAuthenticated) {
        updateClipsInSupabase(history[historyIndex + 1]);
      }
    }
  }, [history, historyIndex, projectId, isAuthenticated]);

  return {
    clips,
    setClips,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    handleClipsChange,
    handleTrimClip,
    handleUndo,
    handleRedo,
    updateClipsInSupabase
  };
};
