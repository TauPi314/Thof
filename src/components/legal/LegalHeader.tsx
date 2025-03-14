
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const LegalHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center gap-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      <h1 className="text-2xl font-bold">Legal Documents</h1>
    </div>
  );
};

export default LegalHeader;
