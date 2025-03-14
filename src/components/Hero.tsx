
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Play, Film, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollValue = window.scrollY;
        const opacity = Math.max(1 - scrollValue / 700, 0);
        const translateY = scrollValue * 0.4;
        
        heroRef.current.style.opacity = opacity.toString();
        heroRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div 
        ref={heroRef}
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center px-4 transition-opacity duration-1000 ease-in-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary border border-border animate-fade-in">
            <span className="text-sm font-medium text-muted-foreground">
              Powered by Pi Network Blockchain
            </span>
          </div>
          
          <h1 className="heading-xl text-balance animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
            Thof: Collaborative AI-Powered Filmmaking
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
            Join a community of creators using AI to collaboratively produce 
            short films. Upload clips, curate content, and be part of the next 
            generation of filmmaking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
            <Button 
              size="lg" 
              className="button-glow"
              onClick={() => navigate('/projects')}
            >
              Browse Projects <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="group"
              onClick={handlePlayVideo}
            >
              <Play className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
              See how it works
            </Button>
          </div>
        </div>
      </div>
      
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full rounded-lg overflow-hidden shadow-elevated">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 hover:bg-black/70"
              onClick={() => setIsVideoPlaying(false)}
            >
              <X className="h-5 w-5 text-white" />
            </Button>
            <video 
              ref={videoRef} 
              controls 
              className="w-full aspect-video"
              poster="/placeholder.svg"
            >
              <source src="#" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <div className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full shadow-subtle border border-border">
          <Film className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">12 Projects · 234 Clips</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
