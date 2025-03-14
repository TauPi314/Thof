
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { File, Shield } from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

const LegalTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("privacy");
  
  // Extract tab from URL if provided
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'terms' || tab === 'privacy') {
      setActiveTab(tab);
    }
  }, [location]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/legal?tab=${value}`, { replace: true });
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="mb-6 w-full md:w-auto">
        <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Shield size={16} />
          Privacy Policy
        </TabsTrigger>
        <TabsTrigger value="terms" className="flex items-center gap-2">
          <File size={16} />
          Terms of Service
        </TabsTrigger>
      </TabsList>

      <TabsContent value="privacy" className="animate-fade-in">
        <PrivacyPolicy />
      </TabsContent>

      <TabsContent value="terms" className="animate-fade-in">
        <TermsOfService />
      </TabsContent>
    </Tabs>
  );
};

export default LegalTabs;
