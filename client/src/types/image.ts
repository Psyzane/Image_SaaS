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

export type ProcessingMode = 'convert' | 'compress';

export const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp'] as const;
export const OUTPUT_FORMATS = ['jpeg', 'png', 'webp'] as const;
