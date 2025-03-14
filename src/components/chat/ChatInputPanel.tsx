
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputPanelProps {
  isAuthenticated: boolean;
  isSending: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

const ChatInputPanel: React.FC<ChatInputPanelProps> = ({ 
  isAuthenticated, 
  isSending, 
  onSendMessage 
}) => {
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    await onSendMessage(newMessage.trim());
    setNewMessage('');
  };
  
  return (
    <div className="p-4 border-t">
      {isAuthenticated ? (
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="resize-none min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            className="self-end" 
            size="icon" 
            disabled={!newMessage.trim() || isSending}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center p-4 text-muted-foreground">
          <p>Please log in to send messages.</p>
        </div>
      )}
    </div>
  );
};

export default ChatInputPanel;
