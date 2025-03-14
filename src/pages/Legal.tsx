
import React from 'react';
import Navbar from '@/components/Navbar';
import LegalHeader from '@/components/legal/LegalHeader';
import LegalTabs from '@/components/legal/LegalTabs';

const Legal = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <LegalHeader />
        <LegalTabs />
      </div>
    </div>
  );
};

export default Legal;
