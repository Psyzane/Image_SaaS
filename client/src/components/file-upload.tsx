import { useCallback, useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageProcessor } from "@/lib/image-processor";
import { ImageFile } from "@/types/image";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUploaded: (imageFile: ImageFile) => void;
}

export function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    const validation = ImageProcessor.validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const imageFile = await ImageProcessor.loadImage(file);
      onFileUploaded(imageFile);
    } catch (error) {
      toast({
        title: "Failed to load image",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onFileUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileInput(e as any);
    input.click();
  }, [handleFileInput]);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer group transition-all ${
        isDragOver
          ? 'border-primary bg-blue-50'
          : 'border-slate-300 hover:border-primary hover:bg-blue-50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="max-w-sm mx-auto">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
          isDragOver ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-100'
        }`}>
          <CloudUpload className={`w-8 h-8 transition-colors ${
            isDragOver ? 'text-primary' : 'text-slate-400 group-hover:text-primary'
          }`} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {isLoading ? 'Loading image...' : 'Drop your image here'}
        </h3>
        <p className="text-slate-600 mb-4">or click to browse files</p>
        <p className="text-sm text-slate-400 mb-4">
          Supports JPEG, PNG, WebP, GIF, BMP up to 10MB
        </p>
        <Button 
          className="bg-primary text-white hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Choose File'}
        </Button>
      </div>
    </div>
  );
}
