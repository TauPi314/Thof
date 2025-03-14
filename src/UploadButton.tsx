
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadButtonProps {
  fixed?: boolean;
  className?: string;
}

const UploadButton = ({ fixed = false, className }: UploadButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  if (fixed) {
    return (
      <div className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center transition-all duration-350",
        isExpanded ? "bg-card shadow-elevated p-3 rounded-full border border-border" : "",
        className
      )}>
        {isExpanded && (
          <div className="flex items-center mr-2 animate-slide-in-right">
            <Button 
              variant="outline" 
              className="mr-2 rounded-full"
              onClick={() => navigate('/upload')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Clip
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {!isExpanded && (
          <Button 
            className="rounded-full shadow-elevated button-glow h-14 w-14"
            onClick={() => setIsExpanded(true)}
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <Button 
      className={cn("button-glow", className)}
      onClick={() => navigate('/upload')}
    >
      <Upload className="h-4 w-4 mr-2" />
      Upload Clip
    </Button>
  );
};

export default UploadButton;
