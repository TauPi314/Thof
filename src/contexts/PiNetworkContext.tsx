
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PiNetwork, MIN_TOKEN_BALANCE_TO_VOTE } from '@/lib/piNetwork';
import { toast } from "@/hooks/use-toast";

interface PiUser {
  username: string;
  uid: string;
  accessToken: string;
}

interface PiPayment {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  uid: string;
  identifier: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
  created_at: string;
}

interface PiNetworkContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenBalance: number;
  hasEnoughTokensToVote: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshTokenBalance: () => Promise<number>;
  createPayment: (amount: number, memo: string, metadata?: Record<string, any>) => Promise<PiPayment | null>;
  openPayment: (paymentId: string) => Promise<PiPayment | null>;
  submitPayment: (paymentId: string) => Promise<PiPayment | null>;
  completePayment: (paymentId: string) => Promise<boolean>;
  cancelPayment: (paymentId: string) => Promise<boolean>;
}

// Create context with a default value that matches the shape
const defaultContext: PiNetworkContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  tokenBalance: 0,
  hasEnoughTokensToVote: false,
  login: async () => {},
  logout: () => {},
  refreshTokenBalance: async () => 0,
  createPayment: async () => null,
  openPayment: async () => null,
  submitPayment: async () => null,
  completePayment: async () => false,
  cancelPayment: async () => false,
};

const PiNetworkContext = createContext<PiNetworkContextType>(defaultContext);

export const PiNetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenBalance, setTokenBalance] = useState(0);

  const handleIncompletePayment = (payment: PiPayment) => {
    console.log('Incomplete payment found:', payment);
    toast({
      title: "Incomplete Payment Found",
      description: `We found an incomplete payment of ${payment.amount} Pi. Would you like to continue with this payment?`,
      variant: "default",
      action: (
        <button 
          className="rounded bg-primary text-white py-1 px-3 text-xs font-medium"
          onClick={() => openPayment(payment.identifier)}
        >
          Continue
        </button>
      )
    });
  };

  // Initialize Pi Network on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if we're in Pi Browser
        if (PiNetwork.isPiBrowser()) {
          // Try to authenticate silently on startup
          const user = await PiNetwork.authenticate(handleIncompletePayment);
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
            
            // Fetch and set token balance
            const balance = await PiNetwork.fetchTokenBalance();
            setTokenBalance(balance);
          }
        }
      } catch (error) {
        console.error('Error initializing Pi Network:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      const user = await PiNetwork.authenticate(handleIncompletePayment);
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        
        // Fetch and set token balance after login
        const balance = await PiNetwork.fetchTokenBalance();
        setTokenBalance(balance);

        toast({
          title: "Successfully Connected",
          description: `Welcome ${user.username}! Your Pi balance: ${balance} Pi`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Pi Network. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Pi SDK doesn't have a logout function, so we just clear our local state
    setUser(null);
    setIsAuthenticated(false);
    setTokenBalance(0);
    toast({
      title: "Disconnected",
      description: "You've been disconnected from Pi Network",
      variant: "default",
    });
  };
  
  const refreshTokenBalance = async () => {
    const balance = await PiNetwork.fetchTokenBalance();
    setTokenBalance(balance);
    return balance;
  };

  const createPayment = async (
    amount: number, 
    memo: string, 
    metadata: Record<string, any> = {}
  ) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect with Pi Network to make payments",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const payment = await PiNetwork.createPayment(amount, memo, metadata);
      if (payment) {
        toast({
          title: "Payment Created",
          description: `Payment of ${amount} Pi created successfully`,
          variant: "default",
        });
      }
      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const openPayment = async (paymentId: string) => {
    try {
      const payment = await PiNetwork.openPayment(paymentId);
      return payment;
    } catch (error) {
      console.error('Error opening payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to open payment dialog. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const submitPayment = async (paymentId: string) => {
    try {
      const payment = await PiNetwork.submitPayment(paymentId);
      if (payment) {
        toast({
          title: "Payment Submitted",
          description: "Your payment has been submitted to the blockchain",
          variant: "default",
        });
      }
      return payment;
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const completePayment = async (paymentId: string) => {
    try {
      const success = await PiNetwork.completePayment(paymentId);
      if (success) {
        toast({
          title: "Payment Completed",
          description: "Your payment has been completed successfully",
          variant: "default",
        });
        // Refresh token balance after successful payment
        await refreshTokenBalance();
      }
      return success;
    } catch (error) {
      console.error('Error completing payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to complete payment. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelPayment = async (paymentId: string) => {
    try {
      const success = await PiNetwork.cancelPayment(paymentId);
      if (success) {
        toast({
          title: "Payment Cancelled",
          description: "Your payment has been cancelled",
          variant: "default",
        });
      }
      return success;
    } catch (error) {
      console.error('Error cancelling payment:', error);
      return false;
    }
  };

  return (
    <PiNetworkContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        tokenBalance,
        hasEnoughTokensToVote: tokenBalance >= MIN_TOKEN_BALANCE_TO_VOTE,
        login,
        logout,
        refreshTokenBalance,
        createPayment,
        openPayment,
        submitPayment,
        completePayment,
        cancelPayment
      }}
    >
      {children}
    </PiNetworkContext.Provider>
  );
};

export const usePiNetwork = (): PiNetworkContextType => {
  const context = useContext(PiNetworkContext);
  if (!context) {
    throw new Error('usePiNetwork must be used within a PiNetworkProvider');
  }
  return context;
};
