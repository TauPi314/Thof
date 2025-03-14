
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Upload, Film, MoreVertical } from 'lucide-react';
import { VideoClip } from './Timeline';

interface MediaLibraryProps {
  mediaItems: MediaItem[];
  onAddToTimeline: (item: MediaItem) => void;
  onUpload: (files: FileList) => void;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  duration?: number;
  src: string;
  thumbnail?: string;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  mediaItems,
  onAddToTimeline,
  onUpload
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, item: MediaItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    setDraggingId(item.id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      // Reset the input value to allow uploading the same file again
      e.target.value = '';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Media Library</span>
          <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
            <label>
              <Upload className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:ml-1">Upload</span>
              <Input 
                type="file" 
                className="hidden" 
                accept="video/*,image/*,audio/*"
                onChange={handleFileInputChange}
                multiple
              />
            </label>
          </Button>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-1 p-3">
        <div className="grid grid-cols-2 gap-2">
          {filteredItems.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onClick={() => onAddToTimeline(item)}
              className={`
                media-item cursor-pointer rounded-md overflow-hidden border border-border
                hover:border-primary/50 transition-all
                ${draggingId === item.id ? 'opacity-50 border-primary' : ''}
              `}
            >
              <div className="aspect-video bg-muted-foreground/10 relative">
                {item.thumbnail ? (
                  <img 
                    src={item.thumbnail} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                {item.type === 'video' && item.duration && (
                  <div className="absolute bottom-1 right-1 bg-background/80 text-xs px-1 rounded">
                    {Math.floor(item.duration / 60)}:{(Math.floor(item.duration) % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaLibrary;
