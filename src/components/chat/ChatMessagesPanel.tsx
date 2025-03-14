
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Message } from './ChatMessage';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessagesPanelProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  currentUserId?: string;
}

const ChatMessagesPanel: React.FC<ChatMessagesPanelProps> = ({ 
  messages, 
  isLoading, 
  currentUserId 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <ScrollArea className="flex-1 p-4">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-16 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center p-4">
          <div className="text-muted-foreground">
            <p>No messages yet.</p>
            <p className="text-sm mt-1">Be the first to send a message!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Message 
              key={message.id} 
              message={message} 
              isCurrentUser={message.user_id === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatMessagesPanel;
