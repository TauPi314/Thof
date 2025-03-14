
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import VideoEditor from '@/pages/VideoEditor';
import NotFound from '@/pages/NotFound';
import { PiNetworkProvider } from '@/contexts/PiNetworkContext';
import { initPiNetwork } from '@/lib/piNetwork';

// Import or create placeholder pages for new routes
import Upload from '@/pages/Upload';
import Vote from '@/pages/Vote';
import Profile from '@/pages/Profile';
import Legal from '@/pages/Legal';

import './App.css';

function App() {
  // Initialize Pi Network SDK
  useEffect(() => {
    initPiNetwork();
  }, []);

  return (
    <PiNetworkProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/editor" element={<VideoEditor />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </PiNetworkProvider>
  );
}

export default App;
