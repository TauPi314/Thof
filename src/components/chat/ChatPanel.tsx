
import React, { useState, useEffect } from 'react';
import { MessageSquare, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ChatMessage, ChangelogEntry } from './types';
import ChatMessagesPanel from './ChatMessagesPanel';
import ChangelogPanel from './ChangelogPanel';
import ChatInputPanel from './ChatInputPanel';

interface ChatPanelProps {
  projectId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangelogLoading, setIsChangelogLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user, isAuthenticated } = usePiNetwork();
  
  // Fetch initial messages and set up realtime subscriptions
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('project_messages')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setMessages((data || []) as unknown as ChatMessage[]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };
    
    const fetchChangelog = async () => {
      try {
        // We'll try to fetch from the project_changelog table but handle the case
        // where it might not exist yet gracefully
        const { data, error } = await supabase
          .from('project_changelog')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching changelog:', error);
          // If table doesn't exist yet, we'll just show empty state
          setChangelogEntries([]);
        } else {
          setChangelogEntries(data as unknown as ChangelogEntry[]);
        }
        setIsChangelogLoading(false);
      } catch (error) {
        console.error('Error fetching changelog:', error);
        setIsChangelogLoading(false);
      }
    };
    
    fetchMessages();
    fetchChangelog();
    
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('project_messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_messages',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          const newMessage = payload.new as unknown as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();
    
    // Subscribe to changelog changes
    const changelogChannel = supabase
      .channel('project_changelog_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_changelog',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          const newEntry = payload.new as unknown as ChangelogEntry;
          setChangelogEntries(prev => [newEntry, ...prev]);
          
          // Show a toast notification for new changelog entries
          toast({
            title: `${newEntry.user_name} ${newEntry.action}`,
            description: newEntry.description,
            duration: 5000,
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(changelogChannel);
    };
  }, [projectId]);
  
  const handleSendMessage = async (content: string) => {
    if (!isAuthenticated || !user) return;
    
    try {
      setIsSending(true);
      
      const { error } = await supabase
        .from('project_messages')
        .insert({
          project_id: projectId,
          user_id: user.uid,
          user_name: user.username || 'Anonymous User',
          user_avatar: user.accessToken ? `https://avatar.example.com/${user.uid}` : undefined,
          content
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg bg-background shadow-sm">
      <Tabs defaultValue="chat" className="h-full flex flex-col">
        <div className="px-4 py-3 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="changelog" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Changelog</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <ChatMessagesPanel 
            messages={messages} 
            isLoading={isLoading} 
            currentUserId={user?.uid}
          />
          <ChatInputPanel 
            isAuthenticated={isAuthenticated} 
            isSending={isSending} 
            onSendMessage={handleSendMessage}
          />
        </TabsContent>
        
        <TabsContent value="changelog" className="flex-1 flex flex-col">
          <ChangelogPanel 
            isLoading={isChangelogLoading} 
            entries={changelogEntries}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatPanel;
