import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import MediaLibrary from '@/components/editor/MediaLibrary';
import EditorHeader from '@/components/editor/EditorHeader';
import EditorWorkspace from '@/components/editor/EditorWorkspace';
import ChatPanel from '@/components/chat/ChatPanel';
import PendingClips from '@/components/editor/PendingClips';

// Custom hooks
import { useVideoEditor } from '@/hooks/useVideoEditor';
import { useTimeline } from '@/hooks/useTimeline';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { useEffects } from '@/hooks/useEffects';

// Services
import { loadProject, saveProject, createProject } from '@/services/projectService';
import { getClipLikeCount, hasUserLikedClip } from '@/services/likeService';
import { toast } from '@/hooks/use-toast';
import { PendingClip } from '@/components/chat/types';
import { supabase } from '@/integrations/supabase/client';

const VideoEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams<{ id: string }>();
  const { user, isAuthenticated } = usePiNetwork();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPendingClips, setShowPendingClips] = useState(false);
  
  // Initialize custom hooks
  const {
    currentTime, duration, isPlaying, selectedClipId, activeVideoSrc,
    projectName, projectDescription, isSaving,
    setCurrentTime, setDuration, setIsPlaying, setSelectedClipId, 
    setActiveVideoSrc, setProjectName, setProjectDescription, setIsSaving,
    handlePlay, handlePause, handleTimeChange, handleClipSelect
  } = useVideoEditor(projectId, isAuthenticated, user?.uid);
  
  const {
    clips, setClips, history, setHistory, historyIndex, setHistoryIndex,
    handleClipsChange, handleTrimClip, handleUndo, handleRedo
  } = useTimeline(projectId, isAuthenticated);
  
  const { effects, setEffects } = useEffects();
  
  const { mediaItems, handleAddToTimeline, handleUpload } = useMediaLibrary(
    handleClipsChange, 
    clips, 
    setSelectedClipId, 
    projectId, 
    isAuthenticated
  );
  
  const { setupRealtimeSubscription } = useRealtimeSubscription(projectId, setClips);

  // Load project data from Supabase if projectId is provided
  useEffect(() => {
    if (projectId && isAuthenticated) {
      loadProject(
        projectId,
        setProjectName,
        setProjectDescription,
        setClips,
        setHistory,
        setHistoryIndex,
        setSelectedClipId,
        setActiveVideoSrc
      );
      
      // Set up real-time subscription for changes
      setupRealtimeSubscription();
    }
  }, [projectId, isAuthenticated]);

  // Initialize the editor with the first clip if available
  useEffect(() => {
    if (mediaItems.length > 0 && clips.length === 0 && !projectId) {
      const firstVideoItem = mediaItems.find(item => item.type === 'video');
      if (firstVideoItem) {
        handleAddToTimeline(firstVideoItem);
      }
    }
  }, [mediaItems, projectId, clips.length, handleAddToTimeline]);

  // Update active video source when selected clip changes
  useEffect(() => {
    if (selectedClipId) {
      const clip = clips.find(c => c.id === selectedClipId);
      if (clip) {
        setActiveVideoSrc(clip.src);
      }
    } else if (clips.length > 0) {
      // Select first clip if none selected
      setSelectedClipId(clips[0].id);
      setActiveVideoSrc(clips[0].src);
    }
  }, [selectedClipId, clips, setSelectedClipId, setActiveVideoSrc]);

  // Handle project operations
  const handleSaveProject = async () => {
    if (!projectId || !isAuthenticated) {
      // If no project id, create a new project
      createProject(
        projectName, 
        projectDescription, 
        clips, 
        user?.uid, 
        navigate, 
        setIsSaving
      );
      return;
    }
    
    // Save existing project
    saveProject(
      projectId,
      projectName,
      projectDescription,
      setIsSaving
    );
  };

  // For displaying clip likes in editor UI
  const [selectedClipLikes, setSelectedClipLikes] = useState(0);
  const [userLikedSelectedClip, setUserLikedSelectedClip] = useState(false);

  // Fetch like information for selected clip
  useEffect(() => {
    if (selectedClipId && isAuthenticated) {
      // Get like count for selected clip
      getClipLikeCount(selectedClipId).then(count => {
        setSelectedClipLikes(count);
      });
      
      // Check if user has liked this clip
      if (user) {
        hasUserLikedClip(selectedClipId, user.uid).then(liked => {
          setUserLikedSelectedClip(liked);
        });
      }
    }
  }, [selectedClipId, isAuthenticated, user]);

  // Functions to handle pending clips
  const handleApproveClip = async (clip: PendingClip) => {
    if (!projectId || !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to approve clips",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update status in the pending_clips table
      const { error: updateError } = await supabase
        .from('pending_clips')
        .update({ status: 'approved' })
        .eq('id', clip.id);

      if (updateError) throw updateError;

      // Add to the timeline
      const newClip = {
        id: clip.id,
        name: clip.name,
        startTime: 0,
        duration: clip.duration,
        src: clip.src,
        thumbnail: clip.thumbnail,
        position: clips.length
      };

      // Add to project's video_clips
      const { error: clipError } = await supabase
        .from('video_clips')
        .insert({
          id: clip.id,
          project_id: projectId,
          name: clip.name,
          src: clip.src,
          thumbnail: clip.thumbnail,
          duration: clip.duration,
          position: clips.length
        });

      if (clipError) throw clipError;

      // Add to local clips state
      handleClipsChange([...clips, newClip]);

      // Add a changelog entry
      const { error: changelogError } = await supabase
        .from('project_changelog')
        .insert({
          project_id: projectId,
          user_id: user?.uid || '',
          user_name: user?.username || 'Anonymous',
          action: 'approved clip',
          description: `Approved community clip: ${clip.name}`
        });

      if (changelogError) throw changelogError;

      toast({
        title: "Clip approved",
        description: "The clip has been added to your project"
      });
    } catch (error) {
      console.error('Error approving clip:', error);
      toast({
        title: "Error",
        description: "Failed to approve clip",
        variant: "destructive"
      });
    }
  };

  const handleRejectClip = async (clip: PendingClip) => {
    if (!projectId || !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to reject clips",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update status in the pending_clips table
      const { error } = await supabase
        .from('pending_clips')
        .update({ status: 'rejected' })
        .eq('id', clip.id);

      if (error) throw error;

      // Add a changelog entry
      const { error: changelogError } = await supabase
        .from('project_changelog')
        .insert({
          project_id: projectId,
          user_id: user?.uid || '',
          user_name: user?.username || 'Anonymous',
          action: 'rejected clip',
          description: `Rejected community clip: ${clip.name}`
        });

      if (changelogError) throw changelogError;

      toast({
        title: "Clip rejected",
        description: "The clip has been rejected"
      });
    } catch (error) {
      console.error('Error rejecting clip:', error);
      toast({
        title: "Error",
        description: "Failed to reject clip",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <EditorHeader 
        projectName={projectName}
        isSaving={isSaving}
        historyIndex={historyIndex}
        historyLength={history.length}
        onSave={handleSaveProject}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={() => {}}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />
      
      {/* Main editor area */}
      <main className="flex-1 container mx-auto p-4 grid grid-rows-[1fr_auto] gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          {/* Editor workspace with canvas, timeline and effects panel */}
          <EditorWorkspace 
            activeVideoSrc={activeVideoSrc}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            selectedClipId={selectedClipId}
            effects={effects}
            clips={clips}
            projectId={projectId}
            setCurrentTime={setCurrentTime}
            setDuration={setDuration}
            handlePlay={handlePlay}
            handlePause={handlePause}
            handleTimeChange={handleTimeChange}
            handleClipSelect={handleClipSelect}
            handleClipsChange={handleClipsChange}
            handleTrimClip={handleTrimClip}
            setEffects={setEffects}
          />
          
          {/* Sidebar panels */}
          <div className="w-[350px] flex flex-col gap-4">
            {/* Chat panel */}
            {isChatOpen && projectId && (
              <ChatPanel projectId={projectId} />
            )}
            
            {/* Toggle for pending clips */}
            {projectId && (
              <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-medium">Community Submissions</h3>
                <button 
                  onClick={() => setShowPendingClips(!showPendingClips)}
                  className="text-sm text-primary hover:underline"
                >
                  {showPendingClips ? 'Hide' : 'Show'}
                </button>
              </div>
            )}
            
            {/* Pending clips panel */}
            {showPendingClips && projectId && (
              <PendingClips 
                projectId={projectId}
                onApproveClip={handleApproveClip}
                onRejectClip={handleRejectClip}
              />
            )}
          </div>
        </div>
        
        {/* Media library */}
        <div className="h-[250px]">
          <MediaLibrary 
            mediaItems={mediaItems}
            onAddToTimeline={handleAddToTimeline}
            onUpload={handleUpload}
          />
        </div>
      </main>
    </div>
  );
};

export default VideoEditor;
