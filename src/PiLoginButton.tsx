
import { Button } from '@/components/ui/button';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import { LogIn, LogOut, User, Wallet } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface PiLoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const PiLoginButton = ({ 
  variant = 'default', 
  size = 'default', 
  className 
}: PiLoginButtonProps) => {
  const { user, isAuthenticated, isLoading, tokenBalance, login, logout } = usePiNetwork();

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <span className="animate-pulse">Connecting...</span>
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
                <Wallet className="h-3.5 w-3.5" />
                <span>{tokenBalance} Pi</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your Pi token balance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="outline" 
          size={size} 
          className={className}
          onClick={logout}
        >
          <User className="mr-2 h-4 w-4" />
          {user.username}
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={login}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Connect with Pi
    </Button>
  );
};

export default PiLoginButton;
