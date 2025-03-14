
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  contributors: number;
  clipCount: number;
  status: 'ongoing' | 'completed' | 'editing';
  timeRemaining?: string;
  className?: string;
}

const ProjectCard = ({
  id,
  title,
  thumbnailUrl,
  contributors,
  clipCount,
  status,
  timeRemaining,
  className,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const statusColors = {
    ongoing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    completed: 'bg-green-500/10 text-green-600 border-green-500/20',
    editing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-400 hover-lift border border-border/60",
        isHovered && "shadow-elevated",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <div className="relative aspect-video overflow-hidden">
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-500",
            isHovered && "scale-105"
          )}
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute bottom-3 left-3">
          <Badge className={cn("border", statusColors[status])}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4 pb-0">
        <h3 className="heading-md line-clamp-1 mb-2 text-balance">{title}</h3>
        
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{contributors} contributor{contributors !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Film className="h-4 w-4" />
            <span>{clipCount} clip{clipCount !== 1 ? 's' : ''}</span>
          </div>
          
          {timeRemaining && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{timeRemaining}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 pb-4">
        <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full",
              status === 'ongoing' ? 'bg-amber-500' : 
              status === 'editing' ? 'bg-purple-500' : 
              'bg-green-500'
            )}
            style={{ 
              width: status === 'completed' ? '100%' : 
                    status === 'editing' ? '75%' : 
                    '50%' 
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
