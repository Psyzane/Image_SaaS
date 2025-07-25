import { ImageFile, ProcessingSettings, ProcessedImage } from '@/types/image';

export class ImageProcessor {
  static async loadImage(file: File): Promise<ImageFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const format = this.detectFormat(file.name);
          const imageFile: ImageFile = {
            file,
            name: file.name,
            format,
            dimensions: {
              width: img.width,
              height: img.height,
            },
            size: file.size,
            dataUrl: e.target?.result as string,
          };
          resolve(imageFile);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static detectFormat(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'JPEG';
      case 'png':
        return 'PNG';
      case 'webp':
        return 'WebP';
      case 'gif':
        return 'GIF';
      case 'bmp':
        return 'BMP';
      default:
        return 'Unknown';
    }
  }

  static async processImage(
    imageFile: ImageFile,
    settings: ProcessingSettings,
    onProgress?: (progress: number) => void
  ): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          onProgress?.(25);

          // Calculate new dimensions
          let { width, height } = settings;
          if (settings.maintainAspectRatio) {
            const aspectRatio = img.width / img.height;
            if (width / height > aspectRatio) {
              width = height * aspectRatio;
            } else {
              height = width / aspectRatio;
            }
          }

          canvas.width = width;
          canvas.height = height;

          onProgress?.(50);

          // Apply image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw the resized image
          ctx.drawImage(img, 0, 0, width, height);

          onProgress?.(75);

          // Convert to the desired format with proper compression
          const mimeType = this.getMimeType(settings.outputFormat);
          let dataUrl: string;
          
          // For lossy formats (JPEG, WebP), apply quality compression
          if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
            const quality = Math.max(0.1, Math.min(1.0, settings.quality / 100));
            dataUrl = canvas.toDataURL(mimeType, quality);
          } else if (mimeType === 'image/png') {
            // PNG compression strategy: reduce dimensions slightly if quality is low
            if (settings.quality < 90) {
              // Create a smaller canvas for compression
              const compressionFactor = Math.max(0.5, settings.quality / 100);
              const compressedCanvas = document.createElement('canvas');
              const compressedCtx = compressedCanvas.getContext('2d');
              
              if (compressedCtx) {
                const compressedWidth = Math.max(1, Math.floor(width * compressionFactor));
                const compressedHeight = Math.max(1, Math.floor(height * compressionFactor));
                
                compressedCanvas.width = compressedWidth;
                compressedCanvas.height = compressedHeight;
                
                compressedCtx.imageSmoothingEnabled = true;
                compressedCtx.imageSmoothingQuality = 'high';
                compressedCtx.drawImage(canvas, 0, 0, compressedWidth, compressedHeight);
                
                // Try both original size and compressed size, use whichever is smaller
                const originalPngUrl = canvas.toDataURL(mimeType);
                const compressedPngUrl = compressedCanvas.toDataURL(mimeType);
                
                const originalSize = this.calculateDataUrlSize(originalPngUrl);
                const compressedSize = this.calculateDataUrlSize(compressedPngUrl);
                
                if (compressedSize < originalSize && compressedSize < imageFile.size) {
                  dataUrl = compressedPngUrl;
                  // Update dimensions to match compressed version
                  width = compressedWidth;
                  height = compressedHeight;
                } else {
                  dataUrl = originalPngUrl;
                }
              } else {
                dataUrl = canvas.toDataURL(mimeType);
              }
            } else {
              dataUrl = canvas.toDataURL(mimeType);
            }
          } else {
            dataUrl = canvas.toDataURL(mimeType);
          }

          onProgress?.(100);

          // Calculate the size of the processed image
          const processedSize = this.calculateDataUrlSize(dataUrl);

          const processedImage: ProcessedImage = {
            dataUrl,
            size: processedSize,
            format: settings.outputFormat.toUpperCase(),
            dimensions: { width: Math.round(width), height: Math.round(height) },
          };

          resolve(processedImage);
        } catch (error) {
          reject(new Error(`Processing failed: ${error}`));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = imageFile.dataUrl;
    });
  }

  static getMimeType(format: string): string {
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  static calculateDataUrlSize(dataUrl: string): number {
    // Remove the data URL prefix to get just the base64 data
    const base64Data = dataUrl.split(',')[1];
    // Calculate size in bytes (base64 encoding adds ~33% overhead)
    return Math.round((base64Data.length * 3) / 4);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  static downloadImage(dataUrl: string, filename: string, format: string) {
    const link = document.createElement('a');
    link.download = `${filename.split('.')[0]}.${format.toLowerCase()}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!supportedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file format. Please use JPEG, PNG, WebP, GIF, or BMP.' };
    }

    return { valid: true };
  }
}
