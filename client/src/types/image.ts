export interface ImageFile {
  file: File;
  name: string;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
  size: number;
  dataUrl: string;
}

export interface ProcessingSettings {
  outputFormat: string;
  quality: number;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  filters: ImageFilters;
  watermark?: WatermarkSettings;
}

export interface ImageFilters {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  blur: number; // 0 to 10
  sepia: number; // 0 to 100
  grayscale: number; // 0 to 100
  vintage: boolean;
  sharpen: number; // 0 to 100
}

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  opacity: number; // 0 to 100
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  fontSize: number;
  color: string;
}

export interface ProcessedImage {
  dataUrl: string;
  size: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'raw', 'cr2', 'nef', 'arw', 'dng'] as const;
export const OUTPUT_FORMATS = ['jpeg', 'png', 'webp', 'tiff'] as const;

export interface BatchProcessingJob {
  id: string;
  files: ImageFile[];
  settings: ProcessingSettings;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results: (ProcessedImage | null)[];
  errors: string[];
}
