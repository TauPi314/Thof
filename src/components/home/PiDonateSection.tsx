
import { useState } from 'react';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowRight, Loader2 } from 'lucide-react';
import PiLoginButton from '@/components/PiLoginButton';

const PiDonateSection = () => {
  const { isAuthenticated, createPayment, submitPayment, completePayment } = usePiNetwork();
  const [amount, setAmount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentPaymentId, setCurrentPaymentId] = useState<string>('');
  
  const handleDonate = async () => {
    if (!isAuthenticated) return;
    
    setIsProcessing(true);
    setCurrentStep(1);
    
    try {
      // 1. Create payment
      const payment = await createPayment(
        amount, 
        "Donation to Thof platform",
        { type: "donation", projectId: "platform" }
      );
      
      if (!payment) {
        setIsProcessing(false);
        return;
      }
      
      setCurrentPaymentId(payment.identifier);
      setCurrentStep(2);
      
      // 2. Submit payment to blockchain
      const submittedPayment = await submitPayment(payment.identifier);
      
      if (!submittedPayment) {
        setIsProcessing(false);
        return;
      }
      
      setCurrentStep(3);
      
      // 3. Complete payment
      await completePayment(payment.identifier);
      
      setCurrentStep(4);
    } catch (error) {
      console.error('Donation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const renderDonationSteps = () => {
    const steps = [
      { id: 1, label: "Create Payment" },
      { id: 2, label: "Submit to Blockchain" },
      { id: 3, label: "Complete Payment" },
      { id: 4, label: "Done!" }
    ];
    
    return (
      <div className="flex items-center justify-between mt-4 mb-6 max-w-md mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              currentStep >= step.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {currentStep === step.id && isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                step.id
              )}
            </div>
            
            <span className={`text-xs ml-1 hidden sm:inline ${
              currentStep >= step.id ? "text-primary" : "text-muted-foreground"
            }`}>
              {step.label}
            </span>
            
            {index < steps.length - 1 && (
              <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Support Thof with Pi</CardTitle>
          <CardDescription>
            Connect with Pi Network to donate Pi tokens and support our platform
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PiLoginButton variant="default" size="lg" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Support Thof with Pi</CardTitle>
        <CardDescription>
          Donate Pi tokens to help us grow and develop new features
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isProcessing && renderDonationSteps()}
        
        <div className="flex items-center gap-4 mt-4">
          <Wallet className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <label htmlFor="amount" className="text-sm font-medium">
              Donation Amount (Pi)
            </label>
            <Input
              id="amount"
              type="number"
              min="0.1"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              disabled={isProcessing}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleDonate}
          disabled={isProcessing || amount <= 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Donate {amount} Pi
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PiDonateSection;
