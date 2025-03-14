
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import { likeClip, hasUserLikedClip, getClipLikeCount } from '@/services/likeService';
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MIN_TOKEN_BALANCE_TO_VOTE } from '@/lib/piNetwork';

interface VoteCardProps {
  id: string;
  title: string; 
  creator: string; 
  votes: number; 
  thumbnail: string;
  hasVoted?: boolean;
}

const VoteCard = ({ 
  id,
  title, 
  creator, 
  votes: initialVotes, 
  thumbnail,
  hasVoted = false
}: VoteCardProps) => {
  const [voted, setVoted] = useState(hasVoted);
  const [voteCount, setVoteCount] = useState(initialVotes);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isAuthenticated, hasEnoughTokensToVote, createPayment, submitPayment, completePayment } = usePiNetwork();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      hasUserLikedClip(id, user.uid).then(liked => {
        setVoted(liked);
      });
      
      getClipLikeCount(id).then(count => {
        setVoteCount(count);
      });
    }
  }, [id, isAuthenticated, user]);
  
  const handleVote = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please connect with Pi to vote on projects",
        variant: "destructive"
      });
      return;
    }
    
    if (!hasEnoughTokensToVote) {
      toast({
        title: "Insufficient token balance",
        description: `You need at least ${MIN_TOKEN_BALANCE_TO_VOTE} Pi tokens to vote`,
        variant: "destructive"
      });
      return;
    }

    if (voted) {
      // If already voted, just remove the vote
      const result = await likeClip(id, user?.uid);
      
      if (result !== null) {
        setVoted(result);
        setVoteCount(prev => result ? prev + 1 : prev - 1);
      }
      return;
    }
    
    // If not voted, process a micro-payment to vote (0.01 Pi)
    setIsProcessing(true);
    
    try {
      // Create a small payment for voting (0.01 Pi)
      const payment = await createPayment(
        0.01, 
        `Vote for project: ${title}`,
        { type: "vote", projectId: id }
      );
      
      if (!payment) {
        setIsProcessing(false);
        return;
      }
      
      // Submit payment to blockchain
      const submittedPayment = await submitPayment(payment.identifier);
      
      if (!submittedPayment) {
        setIsProcessing(false);
        return;
      }
      
      // Complete payment
      const success = await completePayment(payment.identifier);
      
      if (success) {
        // Register the vote
        const result = await likeClip(id, user?.uid);
        
        if (result !== null) {
          setVoted(result);
          setVoteCount(prev => result ? prev + 1 : prev - 1);
        }
      }
    } catch (error) {
      console.error('Vote payment error:', error);
      toast({
        title: "Vote Error",
        description: "There was an error processing your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">by {creator}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <ThumbsUp className={cn("h-4 w-4 text-muted-foreground", voted && "fill-primary text-primary")} />
            <span className="text-sm">{voteCount}</span>
          </div>
          <Button 
            variant={voted ? "default" : "outline"}
            size="sm"
            onClick={handleVote}
            disabled={!isAuthenticated || !hasEnoughTokensToVote || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Processing
              </>
            ) : (
              voted ? 'Voted' : 'Vote'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoteCard;
