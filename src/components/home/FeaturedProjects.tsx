
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';

export interface FeaturedProject {
  id: string;
  title: string;
  thumbnailUrl: string;
  contributors: number;
  clipCount: number;
  status: 'ongoing' | 'completed' | 'editing';
  timeRemaining?: string;
}

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <h2 className="heading-lg">Featured Projects</h2>
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/projects')}
        >
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProjects;
