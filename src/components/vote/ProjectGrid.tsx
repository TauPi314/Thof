
import VoteCard from './VoteCard';

interface Project {
  id: string;
  title: string;
  creator: string;
  votes: number;
  thumbnail: string;
}

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {projects.map(project => (
        <VoteCard 
          key={project.id}
          id={project.id}
          title={project.title}
          creator={project.creator}
          votes={project.votes}
          thumbnail={project.thumbnail}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
