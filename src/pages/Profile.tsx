
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Film, Clock, Settings } from 'lucide-react';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import PiLoginButton from '@/components/PiLoginButton';

const ProfilePlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <User className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">You're not logged in</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Sign in with Pi Network to access your profile, projects, and settings.
      </p>
      <PiLoginButton size="lg" />
    </div>
  );
};

const UserProjects = () => {
  // Mock data
  const projects = [
    {
      id: '1',
      title: 'My first video edit',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      date: '2 days ago'
    },
    {
      id: '2',
      title: 'Family vacation highlights',
      thumbnail: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
      date: '1 week ago'
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <Card key={project.id}>
          <div className="aspect-video relative">
            <img 
              src={project.thumbnail} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold truncate">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.date}</p>
          </CardContent>
        </Card>
      ))}
      
      <Card className="border-dashed border-2 flex items-center justify-center">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Film className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium mb-1">New Project</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start creating your next masterpiece
          </p>
          <Button>Create Project</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Profile = () => {
  const { user, isAuthenticated } = usePiNetwork();
  
  if (!isAuthenticated || !user) {
    return <ProfilePlaceholder />;
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <Avatar className="h-24 w-24">
          <AvatarImage src="" alt={user.username} />
          <AvatarFallback className="text-3xl">
            {user.username.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
          <p className="text-muted-foreground">
            Joined {new Date().toLocaleDateString()}
          </p>
          <div className="flex gap-2 mt-4 justify-center md:justify-start">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="projects">
            <Film className="h-4 w-4 mr-2" />
            My Projects
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <UserProjects />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>Recent Activity</CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-10">
                Your recent activity will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>Account Settings</CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-10">
                Account settings will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
