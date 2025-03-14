
import { supabase } from '@/integrations/supabase/client';
import { VideoClip } from '@/components/editor/Timeline';
import { toast } from '@/hooks/use-toast';

// Save clip to Supabase
export const saveClipToSupabase = async (clip: VideoClip, projectId: string) => {
  try {
    const { error } = await supabase
      .from('video_clips')
      .insert({
        id: clip.id,
        project_id: projectId,
        name: clip.name,
        src: clip.src,
        thumbnail: clip.thumbnail,
        start_time: clip.startTime,
        duration: clip.duration,
        position: clip.position || 0
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving clip:', error);
    toast({
      title: 'Error saving clip',
      description: 'Could not save the clip to the server',
      variant: 'destructive'
    });
  }
};

// Create a new project in Supabase
export const createProject = async (
  projectName: string,
  projectDescription: string,
  clips: VideoClip[],
  userId?: string,
  navigate?: (path: string) => void,
  setIsSaving?: (state: boolean) => void
) => {
  if (!userId) {
    toast({
      title: 'Login required',
      description: 'Please log in to save your project',
      variant: 'destructive'
    });
    return;
  }
  
  try {
    if (setIsSaving) setIsSaving(true);
    
    // Create project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: projectName,
        description: projectDescription,
        user_id: userId
      })
      .select()
      .single();
    
    if (projectError) throw projectError;
    
    if (projectData) {
      // Save all clips
      for (let i = 0; i < clips.length; i++) {
        const clip = clips[i];
        
        const { error: clipError } = await supabase
          .from('video_clips')
          .insert({
            project_id: projectData.id,
            name: clip.name,
            src: clip.src,
            thumbnail: clip.thumbnail,
            start_time: clip.startTime,
            duration: clip.duration,
            position: i
          });
        
        if (clipError) throw clipError;
      }
      
      toast({
        title: 'Project saved',
        description: 'Your project has been saved successfully',
      });
      
      // Navigate to the project detail page
      if (navigate) navigate(`/projects/${projectData.id}`);
    }
  } catch (error) {
    console.error('Error creating project:', error);
    toast({
      title: 'Error saving project',
      description: 'Could not save your project. Please try again.',
      variant: 'destructive'
    });
  } finally {
    if (setIsSaving) setIsSaving(false);
  }
};

// Save existing project
export const saveProject = async (
  projectId: string,
  projectName: string,
  projectDescription: string,
  setIsSaving?: (state: boolean) => void
) => {
  try {
    if (setIsSaving) setIsSaving(true);
    
    // Update project details
    const { error: projectError } = await supabase
      .from('projects')
      .update({
        name: projectName,
        description: projectDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);
    
    if (projectError) throw projectError;
    
    toast({
      title: 'Project saved',
      description: 'Your project has been saved successfully',
    });
  } catch (error) {
    console.error('Error saving project:', error);
    toast({
      title: 'Error saving project',
      description: 'Could not save your project. Please try again.',
      variant: 'destructive'
    });
  } finally {
    if (setIsSaving) setIsSaving(false);
  }
};

// Load project from Supabase
export const loadProject = async (
  projectId: string,
  setProjectName: (name: string) => void,
  setProjectDescription: (desc: string) => void,
  setClips: (clips: VideoClip[]) => void,
  setHistory: (history: VideoClip[][]) => void,
  setHistoryIndex: (index: number) => void,
  setSelectedClipId: (id: string | null) => void,
  setActiveVideoSrc: (src: string) => void
) => {
  try {
    // Fetch project details
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) throw projectError;
    
    if (projectData) {
      setProjectName(projectData.name);
      setProjectDescription(projectData.description || '');
      
      // Fetch clips for this project
      const { data: clipsData, error: clipsError } = await supabase
        .from('video_clips')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });
      
      if (clipsError) throw clipsError;
      
      if (clipsData && clipsData.length > 0) {
        const formattedClips: VideoClip[] = clipsData.map(clip => ({
          id: clip.id,
          name: clip.name,
          startTime: clip.start_time,
          duration: clip.duration,
          src: clip.src,
          thumbnail: clip.thumbnail,
          position: clip.position
        }));
        
        setClips(formattedClips);
        setHistory([formattedClips]);
        setHistoryIndex(0);
        
        // Select the first clip
        if (formattedClips.length > 0) {
          setSelectedClipId(formattedClips[0].id);
          setActiveVideoSrc(formattedClips[0].src);
        }
      }
    }
  } catch (error) {
    console.error('Error loading project:', error);
    toast({
      title: 'Error loading project',
      description: 'Could not load the project. Please try again.',
      variant: 'destructive'
    });
  }
};
