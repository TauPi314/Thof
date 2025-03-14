
import { ShieldAlert, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MIN_TOKEN_BALANCE_TO_VOTE } from '@/lib/piNetwork';

interface VoteAlertsProps {
  isAuthenticated: boolean;
  hasEnoughTokensToVote: boolean;
  tokenBalance: number;
}

const VoteAlerts = ({ isAuthenticated, hasEnoughTokensToVote, tokenBalance }: VoteAlertsProps) => {
  if (!isAuthenticated) {
    return (
      <Alert className="mb-8 max-w-lg mx-auto bg-purple-darker/60 border-purple-dark/40" variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please connect with Pi Network to vote on projects.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!hasEnoughTokensToVote) {
    return (
      <Alert className="mb-8 max-w-lg mx-auto bg-purple-darker/60 border-purple/40" variant="default">
        <Wallet className="h-4 w-4" />
        <AlertTitle>Insufficient Token Balance</AlertTitle>
        <AlertDescription>
          You need at least {MIN_TOKEN_BALANCE_TO_VOTE} Pi token to vote. Your current balance: {tokenBalance} Pi.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default VoteAlerts;
