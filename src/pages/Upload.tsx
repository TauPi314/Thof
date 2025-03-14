
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon } from 'lucide-react';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { toast } from '@/hooks/use-toast';

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  
  // Initialize with empty callbacks since we're just displaying the UI
  const { handleUpload } = useMediaLibrary(
    () => {}, // handleClipsChange
    [], // clips
    () => {}, // setSelectedClipId
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
      
      // Navigate to editor after upload
      setTimeout(() => {
        navigate('/editor');
      }, 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
      
      // Navigate to editor after upload
      setTimeout(() => {
        navigate('/editor');
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Media</h1>
      
      <div 
        className={`
          border-2 border-dashed rounded-lg p-12 
          flex flex-col items-center justify-center
          transition-colors
          ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Drag and drop files here</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Upload videos, images, or audio files to create your project. 
          Supported formats: MP4, MOV, JPG, PNG, MP3.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <Button onClick={() => document.getElementById('file-upload')?.click()}>
            <UploadIcon className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
          <input 
            id="file-upload" 
            type="file" 
            multiple 
            accept="video/*,image/*,audio/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <span className="text-sm text-muted-foreground">
            Maximum file size: 100MB
          </span>
        </div>
      </div>
    </div>
  );
};

export default Upload;
