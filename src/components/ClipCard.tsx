
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Pause, ThumbsUp, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import { likeClip, hasUserLikedClip, getClipLikeCount } from '@/services/likeService';

export interface ClipCardProps {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  creator: {
    name: string;
    avatarUrl?: string;
  };
  likes: number;
  comments: number;
  className?: string;
  compact?: boolean;
}

const ClipCard = ({
  id,
  thumbnailUrl,
  videoUrl,
  duration,
  creator,
  likes: initialLikes,
  comments,
  className,
  compact = false,
}: ClipCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user, isAuthenticated } = usePiNetwork();
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Check if user has liked this clip
  useEffect(() => {
    if (isAuthenticated && user) {
      hasUserLikedClip(id, user.uid).then(liked => {
        setIsLiked(liked);
      });
      
      // Get updated like count
      getClipLikeCount(id).then(count => {
        setLikeCount(count);
      });
    }
  }, [id, isAuthenticated, user]);
  
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      return;
    }
    
    // Toggle like status
    const result = await likeClip(id, user?.uid);
    
    // If result is not null (no error occurred)
    if (result !== null) {
      setIsLiked(result);
      setLikeCount(prev => result ? prev + 1 : prev - 1);
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-400 hover-lift border border-border/60 group",
        isHovered && "shadow-elevated",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        {isPlaying ? (
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-transform duration-500",
              isHovered && "scale-105"
            )}
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white w-12 h-12 opacity-90 transition-opacity"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
          {formatDuration(duration)}
        </div>
        
        {!compact && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {!compact && (
        <div className="p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm line-clamp-1">{creator.name}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "flex items-center gap-1 px-2 h-8", 
                  isLiked && "text-primary"
                )}
                onClick={handleLike}
                disabled={!isAuthenticated}
              >
                <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-primary")} />
                <span>{likeCount}</span>
              </Button>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{comments}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ClipCard;
