import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ClipCard from '@/components/ClipCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Film, 
  Clock, 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  User, 
  ChevronRight, 
  Heart, 
  Share2, 
  Play,
  MessageCircle
} from 'lucide-react';
import UploadButton from '@/components/UploadButton';
import { cn } from '@/lib/utils';
import ChatPanel from '@/components/chat/ChatPanel';

// Mock data for demonstration
const projectData = {
  id: '1',
  title: 'Neon Dreams: A Cyberpunk Tale',
  description: 'A community-created film exploring life in a near-future cyberpunk society. We\'re looking for clips that showcase neon-lit urban environments, futuristic technology, and the human condition in a digital age.',
  thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42',
  bannerUrl: 'https://images.unsplash.com/photo-1605384535161-db5d11c11d86',
  contributors: 24,
  clipCount: 47,
  likesCount: 312,
  views: 1845,
  status: 'ongoing' as const,
  dueDate: '2023-12-15',
  timeRemaining: '3 days left',
  progress: 65,
  theme: 'Cyberpunk, Futuristic, Neon',
  creator: {
    name: 'Maya Rodriguez',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  topContributors: [
    { name: 'Alex Chen', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
    { name: 'Sophia Kim', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    { name: 'Jordan Taylor', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
  ],
};

const clipData = [
  {
    id: '1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605384535161-db5d11c11d86',
    videoUrl: '#',
    duration: 24,
    creator: {
      name: 'Elena Sharma',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    likes: 128,
    comments: 24,
  },
  {
    id: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d',
    videoUrl: '#',
    duration: 18,
    creator: {
      name: 'Marcus Johnson',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
    },
    likes: 96,
    comments: 17,
  },
  {
    id: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a',
    videoUrl: '#',
    duration: 32,
    creator: {
      name: 'Olivia Chen',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    likes: 152,
    comments: 31,
  },
  {
    id: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    videoUrl: '#',
    duration: 15,
    creator: {
      name: 'Jamal Wilson',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
    },
    likes: 87,
    comments: 12,
  },
  {
    id: '5',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    videoUrl: '#',
    duration: 28,
    creator: {
      name: 'Sofia Martinez',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    likes: 64,
    comments: 8,
  },
  {
    id: '6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241',
    videoUrl: '#',
    duration: 42,
    creator: {
      name: 'David Park',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
    },
    likes: 112,
    comments: 19,
  },
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<typeof projectData | null>(null);
  const [clips, setClips] = useState<typeof clipData>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Simulate loading data
  useEffect(() => {
    // In a real app, we'd fetch the specific project by ID
    setTimeout(() => {
      setProject(projectData);
      setClips(clipData);
      setLikeCount(projectData.likesCount);
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto animate-pulse">
          <div className="h-64 bg-secondary rounded-lg mb-6"></div>
          <div className="h-10 w-3/4 bg-secondary rounded-lg mb-4"></div>
          <div className="h-6 w-1/2 bg-secondary rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-secondary rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto text-center">
          <h1 className="heading-lg mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/projects')}>
            Browse Projects
          </Button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const statusColor = {
    ongoing: 'bg-amber-100 text-amber-700 border-amber-200',
    editing: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <Badge className={cn("mb-3 border", statusColor[project.status])}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            
            <h1 className="heading-lg text-white mb-2 drop-shadow-md max-w-3xl">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>Created by {project.creator.name}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Due {formatDate(project.dueDate)}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{project.timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Tabs defaultValue="clips" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="clips">Clips</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="clips" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="heading-md">Latest Submissions</h2>
                  <Button variant="outline" className="button-glow" onClick={() => navigate('/upload')}>
                    Upload New Clip
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                  {clips.map((clip) => (
                    <ClipCard key={clip.id} {...clip} />
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">Load More</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="heading-md mb-4">Project Description</h2>
                    <p className="text-muted-foreground mb-6">{project.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold mb-2">Theme</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.theme.split(',').map((theme, index) => (
                            <Badge key={index} variant="secondary">
                              {theme.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>15-45 seconds in length</li>
                          <li>HD quality (1080p minimum)</li>
                          <li>Original content only</li>
                          <li>Should match the project theme</li>
                        </ul>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2">Final Release Schedule</h3>
                    <ol className="relative border-l border-muted ml-3 space-y-6 mb-6">
                      <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 bg-primary text-white text-xs">
                          1
                        </span>
                        <h4 className="font-medium">Clip Submission</h4>
                        <p className="text-sm text-muted-foreground">
                          Deadline: {formatDate(project.dueDate)}
                        </p>
                      </li>
                      <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 bg-secondary text-primary text-xs">
                          2
                        </span>
                        <h4 className="font-medium">Community Voting</h4>
                        <p className="text-sm text-muted-foreground">
                          Dec 16 - Dec 20, 2023
                        </p>
                      </li>
                      <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 bg-secondary text-primary text-xs">
                          3
                        </span>
                        <h4 className="font-medium">Final Editing</h4>
                        <p className="text-sm text-muted-foreground">
                          Dec 21 - Dec 28, 2023
                        </p>
                      </li>
                      <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 bg-secondary text-primary text-xs">
                          4
                        </span>
                        <h4 className="font-medium">Film Release</h4>
                        <p className="text-sm text-muted-foreground">
                          December 31, 2023
                        </p>
                      </li>
                    </ol>
                    
                    <Button className="w-full button-glow">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Teaser Trailer
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contributors" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="heading-md mb-6">Project Contributors</h2>
                    
                    <div className="mb-8">
                      <h3 className="font-semibold mb-4">Project Creator</h3>
                      <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                        <Avatar className="h-16 w-16 border-2 border-white">
                          <AvatarImage src={project.creator.avatarUrl} alt={project.creator.name} />
                          <AvatarFallback>{project.creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-lg">{project.creator.name}</h4>
                          <p className="text-muted-foreground">Project Director</p>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            View Profile <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="font-semibold mb-4">Top Contributors</h3>
                      <div className="space-y-4">
                        {project.topContributors.map((contributor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-medium">
                                {index + 1}
                              </div>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={contributor.avatarUrl} alt={contributor.name} />
                                <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{contributor.name}</span>
                            </div>
                            <Badge variant="outline">12 clips</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">All Contributors</h3>
                      <div className="flex flex-wrap gap-3">
                        {Array.from({ length: 15 }, (_, i) => (
                          <Avatar key={i} className="h-12 w-12 border border-border">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                          +9
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-6">
                <div className="h-[600px]">
                  <ChatPanel projectId={id || ''} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="order-1 lg:order-2">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Project Progress</h3>
                  <Progress value={project.progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{project.progress}% Complete</span>
                    <span>{project.timeRemaining}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold">{project.contributors}</div>
                    <div className="text-sm text-muted-foreground">Contributors</div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold">{project.clipCount}</div>
                    <div className="text-sm text-muted-foreground">Clips</div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold">{likeCount}</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold">{project.views}</div>
                    <div className="text-sm text-muted-foreground">Views</div>
                  </div>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <Button className="flex-1 button-glow" onClick={() => navigate('/upload')}>
                    Submit Clip
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Join Project
                  </Button>
                </div>
                
                <div className="flex justify-around mb-6">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-full flex flex-col gap-1 h-auto py-2",
                      isLiked && "text-primary"
                    )}
                    onClick={handleLike}
                  >
                    <Heart className={cn("h-5 w-5", isLiked && "fill-primary")} />
                    <span className="text-xs">Like</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full flex flex-col gap-1 h-auto py-2"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="text-xs">Share</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full flex flex-col gap-1 h-auto py-2"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="text-xs">Vote</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full flex flex-col gap-1 h-auto py-2"
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span className="text-xs">Skip</span>
                  </Button>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Reward Pool</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">π</span>
                    </div>
                    <span className="text-lg font-semibold">500 Pi</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To be distributed to contributors based on clip usage and community votes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <UploadButton fixed />
    </div>
  );
};

export default ProjectDetail;
