
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Check, X, Award, Timer } from 'lucide-react';
import { PendingClip } from '@/components/chat/types';
import VoteCard from '@/components/vote/VoteCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, addHours, isPast, formatDistanceToNow } from 'date-fns';

// Configuration for voting thresholds
const VOTING_CONFIG = {
  BATCH_DURATION_HOURS: 24, // Duration of a voting batch in hours
  MIN_VOTES_THRESHOLD: 3, // Minimum votes required for auto-approval
  PERCENTAGE_THRESHOLD: 0.6, // Clip must have at least 60% of the top clip's votes
  BATCH_SIZE: 10, // Maximum clips to auto-evaluate per batch
};

interface PendingClipsProps {
  projectId: string;
  onApproveClip: (clip: PendingClip) => void;
  onRejectClip: (clip: PendingClip) => void;
}

const PendingClips: React.FC<PendingClipsProps> = ({
  projectId,
  onApproveClip,
  onRejectClip
}) => {
  const [pendingClips, setPendingClips] = useState<PendingClip[]>([]);
  const [votingBatches, setVotingBatches] = useState<{[key: string]: PendingClip[]}>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  // Fetch pending clips from Supabase
  const fetchPendingClips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pending_clips')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format clips data for the component
      if (data) {
        const formattedClips: PendingClip[] = data.map(clip => ({
          id: clip.id,
          project_id: clip.project_id,
          name: clip.name,
          thumbnail: clip.thumbnail || 'https://images.unsplash.com/photo-1605384535161-db5d11c11d86',
          duration: clip.duration,
          src: clip.src,
          user_id: clip.user_id,
          user_name: clip.user_name,
          user_avatar: clip.user_avatar,
          votes: clip.votes || 0,
          created_at: clip.created_at,
          status: clip.status as 'pending' | 'approved' | 'rejected',
          voting_batch: clip.voting_batch,
          voting_rank: clip.voting_rank,
          voting_ends_at: clip.voting_ends_at
        }));
        
        setPendingClips(formattedClips);
        organizeBatches(formattedClips);
      }
    } catch (error) {
      console.error('Error fetching pending clips:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending clips',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Organize clips into voting batches
  const organizeBatches = (clips: PendingClip[]) => {
    const batches: {[key: string]: PendingClip[]} = {};
    
    // Group clips by their voting batch
    clips.forEach(clip => {
      if (clip.status !== 'pending') return;
      
      const batchId = clip.voting_batch || 'unbatched';
      if (!batches[batchId]) {
        batches[batchId] = [];
      }
      batches[batchId].push(clip);
    });
    
    setVotingBatches(batches);
    
    // Set active batch to the most recent one
    const batchIds = Object.keys(batches).filter(id => id !== 'unbatched');
    if (batchIds.length > 0 && !activeBatchId) {
      setActiveBatchId(batchIds[0]);
    }
  };

  // Assign new clips to a voting batch
  const assignClipsToBatch = async () => {
    try {
      // Get unbatched pending clips
      const unbatchedClips = pendingClips.filter(
        clip => clip.status === 'pending' && (!clip.voting_batch || clip.voting_batch === 'unbatched')
      );
      
      if (unbatchedClips.length === 0) return;
      
      // Create a new batch ID based on current time
      const batchId = `batch_${Date.now()}`;
      const endTime = addHours(new Date(), VOTING_CONFIG.BATCH_DURATION_HOURS).toISOString();
      
      // Prepare updates for each clip
      const updates = unbatchedClips.map(clip => ({
        id: clip.id,
        voting_batch: batchId,
        voting_ends_at: endTime
      }));
      
      // Update each clip individually to avoid the type error
      for (const update of updates) {
        const { error } = await supabase
          .from('pending_clips')
          .update({ 
            voting_batch: update.voting_batch,
            voting_ends_at: update.voting_ends_at
          })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      toast({
        title: 'New voting batch created',
        description: `${unbatchedClips.length} clips are now open for voting`
      });
      
      // Refresh clips
      fetchPendingClips();
    } catch (error) {
      console.error('Error creating voting batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to create voting batch',
        variant: 'destructive'
      });
    }
  };

  // Evaluate a completed voting batch
  const evaluateBatch = async (batchId: string) => {
    try {
      const batchClips = votingBatches[batchId] || [];
      if (batchClips.length === 0) return;
      
      // Sort clips by votes (highest first)
      const sortedClips = [...batchClips].sort((a, b) => b.votes - a.votes);
      
      // Get highest vote count in batch
      const highestVotes = sortedClips[0]?.votes || 0;
      
      // Process top clips for auto-approval
      const approvedClips: PendingClip[] = [];
      
      for (let i = 0; i < Math.min(VOTING_CONFIG.BATCH_SIZE, sortedClips.length); i++) {
        const clip = sortedClips[i];
        
        // Clips must meet minimum vote threshold
        if (clip.votes < VOTING_CONFIG.MIN_VOTES_THRESHOLD) continue;
        
        // Clips must have at least the percentage threshold of highest votes
        if (clip.votes < highestVotes * VOTING_CONFIG.PERCENTAGE_THRESHOLD) continue;
        
        // Update clip with rank individually
        const { error } = await supabase
          .from('pending_clips')
          .update({ 
            voting_rank: i + 1 
          })
          .eq('id', clip.id);
          
        if (error) throw error;
        
        // Add to approved clips array
        approvedClips.push(clip);
        
        // Auto-approve top clip (highest votes)
        if (i === 0) {
          onApproveClip(clip);
          
          // Create community announcement about the winning clip
          const { error: announcementError } = await supabase
            .from('project_messages')
            .insert({
              project_id: projectId,
              user_id: 'system',
              user_name: 'System',
              content: `🏆 Community vote winner: "${clip.name}" has been added to the project timeline!`
            });
            
          if (announcementError) console.error('Error creating announcement:', announcementError);
        }
      }
      
      // Move remaining clips to a new batch for the next voting round
      const remainingClips = batchClips.filter(clip => 
        !approvedClips.some(approved => approved.id === clip.id) && 
        clip.status === 'pending'
      );
      
      if (remainingClips.length > 0) {
        // Create a new batch for remaining clips
        const newBatchId = `batch_${Date.now()}`;
        const newEndTime = addHours(new Date(), VOTING_CONFIG.BATCH_DURATION_HOURS).toISOString();
        
        for (const clip of remainingClips) {
          // Reset voting rank and assign to new batch
          const { error } = await supabase
            .from('pending_clips')
            .update({
              voting_batch: newBatchId,
              voting_ends_at: newEndTime,
              voting_rank: null,
              votes: 0 // Reset votes for fair re-voting
            })
            .eq('id', clip.id);
            
          if (error) console.error('Error moving clip to new batch:', error);
        }
        
        toast({
          title: 'New voting round started',
          description: `${remainingClips.length} clips have been moved to the next voting round`
        });
      }
      
      // Archive the completed batch
      const { error: archiveError } = await supabase
        .from('project_changelog')
        .insert({
          project_id: projectId,
          user_id: 'system',
          user_name: 'System',
          action: 'batch completed',
          description: `Voting batch completed, ${approvedClips.length} clips approved`
        });
        
      if (archiveError) console.error('Error archiving batch:', archiveError);
      
      toast({
        title: 'Voting batch evaluated',
        description: approvedClips.length > 0 
          ? 'Top clips have been automatically approved' 
          : 'No clips met the voting threshold'
      });
      
      // Refresh clips
      fetchPendingClips();
    } catch (error) {
      console.error('Error evaluating batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to evaluate voting batch',
        variant: 'destructive'
      });
    }
  };

  // Check for batches with completed voting periods
  const checkCompletedBatches = () => {
    Object.entries(votingBatches).forEach(([batchId, clips]) => {
      if (batchId === 'unbatched') return;
      
      const endTime = clips[0]?.voting_ends_at;
      if (endTime && isPast(new Date(endTime))) {
        evaluateBatch(batchId);
      }
    });
  };

  // Set up real-time subscription for pending clips
  useEffect(() => {
    if (!projectId) return;

    fetchPendingClips();

    // Set up real-time updates
    const channel = supabase
      .channel('pending-clips-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'pending_clips',
          filter: `project_id=eq.${projectId}`
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchPendingClips();
        })
      .subscribe();

    // Check for unbatched clips periodically
    const batchInterval = setInterval(() => {
      assignClipsToBatch();
    }, 60000); // Check every minute

    // Check for completed voting batches periodically
    const evaluationInterval = setInterval(() => {
      checkCompletedBatches();
    }, 60000); // Check every minute

    return () => {
      supabase.removeChannel(channel);
      clearInterval(batchInterval);
      clearInterval(evaluationInterval);
    };
  }, [projectId]);

  // Filter clips based on active tab
  const filteredClips = pendingClips.filter(clip => {
    if (activeTab === 'pending') return clip.status === 'pending';
    if (activeTab === 'approved') return clip.status === 'approved';
    if (activeTab === 'rejected') return clip.status === 'rejected';
    return true;
  });

  // Get active batch clips
  const activeBatchClips = activeBatchId 
    ? votingBatches[activeBatchId] || []
    : votingBatches['unbatched'] || [];

  // Time remaining in active batch
  const getTimeRemaining = () => {
    if (!activeBatchId || activeBatchClips.length === 0) return 'No active batch';
    
    const endTime = activeBatchClips[0]?.voting_ends_at;
    if (!endTime) return 'No end time set';
    
    if (isPast(new Date(endTime))) {
      return 'Voting period ended';
    }
    
    return `Voting ends in ${formatDistanceToNow(new Date(endTime))}`;
  };

  // Get available batches for selection
  const availableBatches = Object.entries(votingBatches)
    .filter(([id]) => id !== 'unbatched')
    .map(([id, clips]) => ({
      id,
      count: clips.length,
      endTime: clips[0]?.voting_ends_at
    }));

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <h2 className="text-lg font-semibold mb-4">Pending Submissions</h2>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Active Voting Batch</span>
            <span className="text-sm text-muted-foreground">{getTimeRemaining()}</span>
          </div>
          
          {availableBatches.length > 0 && (
            <select
              className="w-full p-2 border rounded"
              value={activeBatchId || ''}
              onChange={(e) => setActiveBatchId(e.target.value)}
            >
              {availableBatches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  Batch {format(new Date(batch.id.split('_')[1]), 'MMM d, HH:mm')} 
                  ({batch.count} clips)
                </option>
              ))}
            </select>
          )}
        </div>
        
        <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Rejected
            </TabsTrigger>
          </TabsList>
          
          {['pending', 'approved', 'rejected'].map((tab) => (
            <TabsContent key={tab} value={tab} className="h-full">
              <div className="grid grid-cols-1 gap-4 h-full overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredClips.length > 0 ? (
                  filteredClips.map(clip => (
                    <div key={clip.id} className="relative">
                      <VoteCard
                        id={clip.id}
                        title={clip.name}
                        creator={clip.user_name}
                        votes={clip.votes}
                        thumbnail={clip.thumbnail}
                      />
                      
                      {clip.voting_rank && (
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          Rank #{clip.voting_rank}
                        </div>
                      )}
                      
                      {clip.voting_ends_at && (
                        <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          <Timer className="h-4 w-4" />
                          {isPast(new Date(clip.voting_ends_at)) ? 'Voting ended' : 'Voting open'}
                        </div>
                      )}
                      
                      {activeTab === 'pending' && (
                        <div className="flex justify-between mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 mr-1"
                            onClick={() => onRejectClip(clip)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="flex-1 ml-1"
                            onClick={() => onApproveClip(clip)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <p>No {activeTab} clips</p>
                    {activeTab === 'pending' && <p className="text-sm">Waiting for new submissions</p>}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PendingClips;
