
import { useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VideoClip } from '@/components/editor/Timeline';

export const useRealtimeSubscription = (
  projectId: string | undefined,
  setClips: (clips: VideoClip[]) => void
) => {
  const realtimeSubscription = useRef<{ subscription: any, cleanup: () => void } | null>(null);

  // Set up real-time subscription to video_clips
  const setupRealtimeSubscription = useCallback(() => {
    if (!projectId) return;
    
    const channel = supabase
      .channel('video-editor-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'video_clips',
          filter: `project_id=eq.${projectId}`
        }, 
        async (payload) => {
          console.log('Real-time update received:', payload);
          
          // Refresh clips when changes are detected
          const { data, error } = await supabase
            .from('video_clips')
            .select('*')
            .eq('project_id', projectId)
            .order('position', { ascending: true });
          
          if (!error && data) {
            const formattedClips: VideoClip[] = data.map(clip => ({
              id: clip.id,
              name: clip.name,
              startTime: clip.start_time,
              duration: clip.duration,
              src: clip.src,
              thumbnail: clip.thumbnail,
              position: clip.position
            }));
            
            setClips(formattedClips);
          }
        })
      .subscribe();
    
    realtimeSubscription.current = {
      subscription: channel,
      cleanup: () => supabase.removeChannel(channel)
    };
  }, [projectId, setClips]);

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (realtimeSubscription.current) {
        realtimeSubscription.current.cleanup();
      }
    };
  }, []);

  return { setupRealtimeSubscription };
};
