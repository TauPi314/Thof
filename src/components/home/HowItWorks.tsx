
import { Card, CardContent } from '@/components/ui/card';
import { Video, LayoutGrid, PieChart } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
      <h2 className="heading-lg mb-6">How It Works</h2>
      <p className="text-lg text-muted-foreground mb-10">
        Thof brings together AI-powered creativity and blockchain 
        technology to revolutionize collaborative filmmaking.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="hover-lift">
          <CardContent className="pt-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create</h3>
            <p className="text-muted-foreground">
              Use your favorite AI tools to generate unique video clips
              for ongoing projects.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="pt-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
            <p className="text-muted-foreground">
              Join projects, vote on clips, and help shape the 
              narrative direction.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="pt-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn</h3>
            <p className="text-muted-foreground">
              Receive Pi tokens when your clips are used in the 
              final production.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorks;
