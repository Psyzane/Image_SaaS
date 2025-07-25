import { useCallback, useState } from "react";
import { CloudUpload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageProcessor } from "@/lib/image-processor";
import { ImageFile } from "@/types/image";
import { useToast } from "@/hooks/use-toast";

interface BatchUploadProps {
  onFilesUploaded: (imageFiles: ImageFile[]) => void;
}

export function BatchUpload({ onFilesUploaded }: BatchUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ImageFile[]>([]);
  const { toast } = useToast();

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate all files first
    Array.from(files).forEach((file, index) => {
      const validation = ImageProcessor.validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Some files were invalid",
        description: errors.join(', '),
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    setIsLoading(true);
    const loadedFiles: ImageFile[] = [];

    try {
      for (const file of validFiles) {
        const imageFile = await ImageProcessor.loadImage(file);
        loadedFiles.push(imageFile);
      }
      
      setUploadedFiles(loadedFiles);
      onFilesUploaded(loadedFiles);
      
      toast({
        title: "Files uploaded successfully",
        description: `${loadedFiles.length} images ready for processing`,
      });
    } catch (error) {
      toast({
        title: "Failed to load images",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onFilesUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => handleFileInput(e as any);
    input.click();
  }, [handleFileInput]);

  const removeFile = useCallback((index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  }, [uploadedFiles, onFilesUploaded]);

  if (uploadedFiles.length > 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {uploadedFiles.length} Images Selected
          </h3>
          <Button
            onClick={handleClick}
            variant="outline"
            className="border-slate-200"
          >
            Add More Images
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-60 overflow-y-auto">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={file.dataUrl}
                alt={file.name}
                className="w-full h-20 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="mt-1 text-xs text-slate-600 truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          {isLoading ? 'Loading images...' : 'Drop multiple images here'}
        </h3>
        <p className="text-slate-600 mb-4">or click to browse files</p>
        <p className="text-sm text-slate-400 mb-4">
          Supports JPEG, PNG, WebP, GIF, BMP, TIFF, RAW up to 50MB each
        </p>
        <Button 
          className="bg-primary text-white hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Choose Multiple Files'}
        </Button>
      </div>
    </div>
  );
}