
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Like a clip
export const likeClip = async (clipId: string, userId?: string) => {
  // Check if user is authenticated
  if (!userId) {
    toast({
      title: 'Authentication required',
      description: 'Please log in to like clips',
      variant: 'destructive',
    });
    return false;
  }

  try {
    // Check if user already liked this clip
    const { data: existingLike, error: checkError } = await supabase
      .from('clip_likes')
      .select('*')
      .eq('clip_id', clipId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLike) {
      // User already liked this clip, so unlike it
      const { error: deleteError } = await supabase
        .from('clip_likes')
        .delete()
        .eq('clip_id', clipId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
      
      toast({
        title: 'Unliked',
        description: 'You have removed your like from this clip',
      });
      
      return false;
    } else {
      // User hasn't liked this clip yet, so like it
      const { error: insertError } = await supabase
        .from('clip_likes')
        .insert({
          clip_id: clipId,
          user_id: userId,
        });

      if (insertError) throw insertError;
      
      toast({
        title: 'Liked!',
        description: 'You have liked this clip',
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    toast({
      title: 'Error',
      description: 'Could not process your like. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

// Check if user has liked a clip
export const hasUserLikedClip = async (clipId: string, userId?: string) => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('clip_likes')
      .select('*')
      .eq('clip_id', clipId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return data ? true : false;
  } catch (error) {
    console.error('Error checking if user liked clip:', error);
    return false;
  }
};

// Get like count for a clip
export const getClipLikeCount = async (clipId: string) => {
  try {
    const { count, error } = await supabase
      .from('clip_likes')
      .select('*', { count: 'exact', head: true })
      .eq('clip_id', clipId);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};
