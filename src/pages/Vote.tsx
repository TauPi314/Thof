
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThumbsUp, Clock } from 'lucide-react';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import VoteAlerts from '@/components/vote/VoteAlerts';
import ProjectGrid from '@/components/vote/ProjectGrid';
import { trendingProjects, newProjects } from '@/components/vote/voteData';

const Vote = () => {
  const { isAuthenticated, hasEnoughTokensToVote, tokenBalance } = usePiNetwork();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Vote on Projects</h1>
      
      <VoteAlerts 
        isAuthenticated={isAuthenticated}
        hasEnoughTokensToVote={hasEnoughTokensToVote}
        tokenBalance={tokenBalance}
      />
      
      <Tabs defaultValue="trending">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="trending">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new">
            <Clock className="h-4 w-4 mr-2" />
            New
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending">
          <ProjectGrid projects={trendingProjects} />
        </TabsContent>
        
        <TabsContent value="new">
          <ProjectGrid projects={newProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vote;
