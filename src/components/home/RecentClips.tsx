
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClipCard from '@/components/ClipCard';
import { useEffect, useState } from 'react';
import { getClipLikeCount } from '@/services/likeService';

export interface ClipCreator {
  name: string;
  avatarUrl: string;
}

export interface RecentClip {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  creator: ClipCreator;
  likes: number;
  comments: number;
}

interface RecentClipsProps {
  clips: RecentClip[];
}

const RecentClips = ({ clips: initialClips }: RecentClipsProps) => {
  const [clips, setClips] = useState<RecentClip[]>(initialClips);
  
  // Fetch updated like counts for all clips
  useEffect(() => {
    const updateLikeCounts = async () => {
      const updatedClips = await Promise.all(
        initialClips.map(async (clip) => {
          const likeCount = await getClipLikeCount(clip.id);
          return {
            ...clip,
            likes: likeCount
          };
        })
      );
      
      setClips(updatedClips);
    };
    
    updateLikeCounts();
  }, [initialClips]);
  
  return (
    <div className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <h2 className="heading-lg">Recent Clips</h2>
        <Tabs defaultValue="trending" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {clips.map((clip) => (
          <ClipCard key={clip.id} {...clip} />
        ))}
      </div>
    </div>
  );
};

export default RecentClips;
