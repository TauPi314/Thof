
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ChevronDown } from 'lucide-react';
import UploadButton from '@/components/UploadButton';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const allProjects = [
  {
    id: '1',
    title: 'Neon Dreams: A Cyberpunk Tale',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42',
    contributors: 24,
    clipCount: 47,
    status: 'ongoing' as const,
    timeRemaining: '3 days left',
  },
  {
    id: '2',
    title: 'Nature\'s Whispers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    contributors: 18,
    clipCount: 32,
    status: 'editing' as const,
    timeRemaining: '5 days left',
  },
  {
    id: '3',
    title: 'Urban Legends',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    contributors: 36,
    clipCount: 64,
    status: 'completed' as const,
  },
  {
    id: '4',
    title: 'Memories of Tomorrow',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    contributors: 15,
    clipCount: 28,
    status: 'ongoing' as const,
    timeRemaining: '7 days left',
  },
  {
    id: '5',
    title: 'Digital Renaissance',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d',
    contributors: 21,
    clipCount: 39,
    status: 'editing' as const,
    timeRemaining: '2 days left',
  },
  {
    id: '6',
    title: 'Echoes of Silence',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7',
    contributors: 12,
    clipCount: 25,
    status: 'completed' as const,
  },
];

const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState(allProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Filter projects based on search and status
  useEffect(() => {
    let filtered = [...allProjects];
    
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }
    
    setProjects(filtered);
  }, [searchQuery, selectedStatus]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 container mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="heading-lg mb-2">Film Projects</h1>
            <p className="text-muted-foreground">
              Browse, join, and contribute to community film projects
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/upload')}
            className="button-glow whitespace-nowrap"
          >
            Start New Project
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select onValueChange={(value) => setSelectedStatus(value === 'all' ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="editing">Editing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="grid" className="mb-8">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <Select defaultValue="newest">
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="contributors">Most Contributors</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="grid" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-lg bg-card border border-border h-[300px] animate-pulse" />
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus(null);
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-lg bg-card border border-border h-24 animate-pulse" />
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex border border-border rounded-lg overflow-hidden hover-lift cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div 
                      className="w-[120px] lg:w-[200px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${project.thumbnailUrl})` }}
                    />
                    <div className="flex flex-col justify-between flex-1 p-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{project.contributors} contributors</span>
                          <span>{project.clipCount} clips</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          project.status === 'ongoing' ? 'bg-amber-100 text-amber-700' : 
                          project.status === 'editing' ? 'bg-purple-100 text-purple-700' : 
                          'bg-green-100 text-green-700'
                        )}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </div>
                        {project.timeRemaining && (
                          <span className="text-sm text-muted-foreground">{project.timeRemaining}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus(null);
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
          <Button variant="outline" className="mr-2">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
      
      <UploadButton fixed />
    </div>
  );
};

export default Projects;
