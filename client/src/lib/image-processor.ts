import { ImageFile, ProcessingSettings, ProcessedImage, ImageFilters, WatermarkSettings, BatchProcessingJob } from '@/types/image';

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

          // Apply filters and effects
          this.applyFilters(ctx, canvas, settings.filters);

          // Apply watermark if enabled
          if (settings.watermark?.enabled) {
            this.applyWatermark(ctx, canvas, settings.watermark);
          }

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
    const maxSize = 50 * 1024 * 1024; // 50MB for RAW files
    const supportedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 
      'image/tiff', 'image/x-canon-cr2', 'image/x-nikon-nef', 'image/x-sony-arw', 'image/x-adobe-dng'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 50MB' };
    }

    // Allow RAW formats based on file extension if MIME type isn't recognized
    const extension = file.name.split('.').pop()?.toLowerCase();
    const rawExtensions = ['raw', 'cr2', 'nef', 'arw', 'dng', 'tiff', 'tif'];
    
    if (!supportedTypes.includes(file.type) && !rawExtensions.includes(extension || '')) {
      return { valid: false, error: 'Unsupported file format. Please use JPEG, PNG, WebP, GIF, BMP, TIFF, or RAW formats.' };
    }

    return { valid: true };
  }

  static applyFilters(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, filters: ImageFilters) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply brightness, contrast, and saturation
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Brightness
      if (filters.brightness !== 0) {
        const brightness = filters.brightness * 2.55; // Convert to 0-255 range
        r = Math.max(0, Math.min(255, r + brightness));
        g = Math.max(0, Math.min(255, g + brightness));
        b = Math.max(0, Math.min(255, b + brightness));
      }

      // Contrast
      if (filters.contrast !== 0) {
        const contrast = (filters.contrast + 100) / 100;
        r = Math.max(0, Math.min(255, (r - 128) * contrast + 128));
        g = Math.max(0, Math.min(255, (g - 128) * contrast + 128));
        b = Math.max(0, Math.min(255, (b - 128) * contrast + 128));
      }

      // Saturation
      if (filters.saturation !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const saturation = (filters.saturation + 100) / 100;
        r = Math.max(0, Math.min(255, gray + (r - gray) * saturation));
        g = Math.max(0, Math.min(255, gray + (g - gray) * saturation));
        b = Math.max(0, Math.min(255, gray + (b - gray) * saturation));
      }

      // Sepia
      if (filters.sepia > 0) {
        const sepiaStrength = filters.sepia / 100;
        const sr = (r * 0.393 + g * 0.769 + b * 0.189) * sepiaStrength + r * (1 - sepiaStrength);
        const sg = (r * 0.349 + g * 0.686 + b * 0.168) * sepiaStrength + g * (1 - sepiaStrength);
        const sb = (r * 0.272 + g * 0.534 + b * 0.131) * sepiaStrength + b * (1 - sepiaStrength);
        r = Math.max(0, Math.min(255, sr));
        g = Math.max(0, Math.min(255, sg));
        b = Math.max(0, Math.min(255, sb));
      }

      // Grayscale
      if (filters.grayscale > 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const grayStrength = filters.grayscale / 100;
        r = r * (1 - grayStrength) + gray * grayStrength;
        g = g * (1 - grayStrength) + gray * grayStrength;
        b = b * (1 - grayStrength) + gray * grayStrength;
      }

      // Vintage effect
      if (filters.vintage) {
        r = Math.max(0, Math.min(255, r * 0.9 + 30));
        g = Math.max(0, Math.min(255, g * 0.85 + 20));
        b = Math.max(0, Math.min(255, b * 0.7 + 10));
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply blur using CSS filter (more efficient for blur)
    if (filters.blur > 0) {
      ctx.filter = `blur(${filters.blur}px)`;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      }
      ctx.filter = 'none';
    }

    // Apply sharpening
    if (filters.sharpen > 0) {
      this.applySharpen(ctx, canvas, filters.sharpen / 100);
    }
  }

  static applySharpen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const sharpenKernel = [
      0, -1 * strength, 0,
      -1 * strength, 1 + 4 * strength, -1 * strength,
      0, -1 * strength, 0
    ];

    const newData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[idx] * sharpenKernel[(ky + 1) * 3 + (kx + 1)];
            }
          }
          newData[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum));
        }
      }
    }

    const newImageData = new ImageData(newData, width, height);
    ctx.putImageData(newImageData, 0, 0);
  }

  static applyWatermark(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, watermark: WatermarkSettings) {
    ctx.save();
    
    const fontSize = Math.max(12, Math.min(200, watermark.fontSize));
    const fontFamily = watermark.fontFamily || 'Arial';
    ctx.font = `${fontSize}px ${fontFamily}, sans-serif`;
    ctx.fillStyle = watermark.color;
    ctx.globalAlpha = watermark.opacity / 100;

    const textMetrics = ctx.measureText(watermark.text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    let x = 0;
    let y = 0;

    switch (watermark.position) {
      case 'top-left':
        x = 20;
        y = textHeight + 20;
        break;
      case 'top-right':
        x = canvas.width - textWidth - 20;
        y = textHeight + 20;
        break;
      case 'bottom-left':
        x = 20;
        y = canvas.height - 20;
        break;
      case 'bottom-right':
        x = canvas.width - textWidth - 20;
        y = canvas.height - 20;
        break;
      case 'center':
        x = (canvas.width - textWidth) / 2;
        y = (canvas.height + textHeight) / 2;
        break;
    }

    // Apply rotation if angle is specified
    if (watermark.angle && watermark.angle !== 0) {
      ctx.translate(x + textWidth / 2, y - textHeight / 2);
      ctx.rotate((watermark.angle * Math.PI) / 180);
      ctx.fillText(watermark.text, -textWidth / 2, textHeight / 2);
    } else {
      ctx.fillText(watermark.text, x, y);
    }
    
    ctx.restore();
  }

  static async processBatch(
    job: BatchProcessingJob,
    onProgress?: (progress: number) => void,
    onFileComplete?: (index: number, result: ProcessedImage | null, error?: string) => void
  ): Promise<BatchProcessingJob> {
    const updatedJob: BatchProcessingJob = { 
      ...job, 
      status: 'processing', 
      results: [], 
      errors: [] 
    };
    
    for (let i = 0; i < job.files.length; i++) {
      try {
        onProgress?.((i / job.files.length) * 100);
        
        const result = await this.processImage(job.files[i], job.settings, (fileProgress) => {
          const overallProgress = ((i + fileProgress / 100) / job.files.length) * 100;
          onProgress?.(overallProgress);
        });
        
        updatedJob.results.push(result);
        onFileComplete?.(i, result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updatedJob.errors.push(`File ${i + 1}: ${errorMessage}`);
        updatedJob.results.push(null);
        onFileComplete?.(i, null, errorMessage);
      }
    }

    updatedJob.status = updatedJob.errors.length === 0 ? 'completed' : 'failed';
    updatedJob.progress = 100;
    
    return updatedJob;
  }

  static downloadBatch(results: ProcessedImage[], originalFiles: ImageFile[], settings: ProcessingSettings) {
    results.forEach((result, index) => {
      const originalFile = originalFiles[index];
      if (originalFile && result) {
        this.downloadImage(result.dataUrl, originalFile.name, settings.outputFormat);
      }
    });
  }
}
