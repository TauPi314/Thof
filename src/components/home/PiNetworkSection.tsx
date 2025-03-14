
import { Button } from '@/components/ui/button';
import { Zap, Palette, Shield } from 'lucide-react';

const PiNetworkSection = () => {
  return (
    <section className="bg-secondary/50 py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-lg mb-6">Powered by Pi Network</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thof leverages the Pi Network blockchain to create a 
              secure, transparent, and rewarding environment for collaborative 
              film creation.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Fast & Energy-Efficient</h3>
                  <p className="text-sm text-muted-foreground">
                    Environmentally conscious blockchain technology
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Creative Ownership</h3>
                  <p className="text-sm text-muted-foreground">
                    Fair attribution and rewards for creators
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Voting</h3>
                  <p className="text-sm text-muted-foreground">
                    Transparent community curation process
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="button-glow">
              Learn More
            </Button>
          </div>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-elevated">
            <video 
              className="w-full aspect-video object-cover"
              poster="/placeholder.svg"
              loop
              muted
              autoPlay
            >
              <source src="#" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PiNetworkSection;
