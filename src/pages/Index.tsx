
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import RecentClips from '@/components/home/RecentClips';
import HowItWorks from '@/components/home/HowItWorks';
import PiNetworkSection from '@/components/home/PiNetworkSection';
import PiDonateSection from '@/components/home/PiDonateSection';
import { featuredProjects, recentClips } from '@/components/home/data';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4">
        <FeaturedProjects projects={featuredProjects} />
        <HowItWorks />
        <PiNetworkSection />
      </div>
      <div className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <PiDonateSection />
        </div>
      </div>
      <div className="container mx-auto px-4 mb-10">
        <RecentClips clips={recentClips} />
      </div>
      <div className="mt-auto">
        {/* The footer is now part of the Navbar component */}
      </div>
    </div>
  );
};

export default Index;
