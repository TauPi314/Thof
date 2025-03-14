
import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Undo2, 
  Redo2, 
  Save, 
  Download,
  MessageCircle,
  X,
  History
} from 'lucide-react';
import { usePiNetwork } from '@/contexts/PiNetworkContext';
import { Badge } from '@/components/ui/badge';

interface EditorHeaderProps {
  projectName: string;
  isSaving: boolean;
  historyIndex: number;
  historyLength: number;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  projectName, 
  isSaving,
  historyIndex,
  historyLength,
  onSave,
  onUndo,
  onRedo,
  onExport,
  onToggleChat,
  isChatOpen = false
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const { isAuthenticated } = usePiNetwork();
  const versionNumber = `v${(historyIndex + 1).toString().padStart(2, '0')}`;

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">ClipCollective Editor</h1>
          <div className="w-48 h-10">
            <Input
              value={projectName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIsEdited(true)}
              placeholder="Enter project name"
            />
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <History className="h-3 w-3" />
            {versionNumber}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="border rounded-md flex">
            <Button 
              variant="ghost" 
              size="icon"
              disabled={historyIndex <= 0}
              onClick={onUndo}
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              disabled={historyIndex >= historyLength - 1}
              onClick={onRedo}
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant={isEdited ? "default" : "outline"}
            size="sm"
            onClick={onSave}
            disabled={isSaving || !isAuthenticated || !isEdited}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          {onToggleChat && (
            <Button 
              variant={isChatOpen ? "default" : "outline"}
              size="sm"
              onClick={onToggleChat}
              title={isChatOpen ? "Close chat" : "Open chat"}
            >
              {isChatOpen ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Close Chat
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Project Chat
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
