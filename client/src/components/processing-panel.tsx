import { useState, useEffect } from "react";
import { X, Wand2, Download, Settings, Palette, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageFile, ProcessingSettings, ProcessedImage } from "@/types/image";
import { ImageProcessor } from "@/lib/image-processor";
import { useToast } from "@/hooks/use-toast";
import { FiltersPanel } from "@/components/filters-panel";
import { WatermarkPanel } from "@/components/watermark-panel";

interface ProcessingPanelProps {
  imageFile: ImageFile;
  onRemove: () => void;
}

export function ProcessingPanel({ imageFile, onRemove }: ProcessingPanelProps) {
  const [settings, setSettings] = useState<ProcessingSettings>({
    outputFormat: imageFile.format.toLowerCase() === 'png' ? 'jpeg' : imageFile.format.toLowerCase(),
    quality: 75,
    width: imageFile.dimensions.width,
    height: imageFile.dimensions.height,
    maintainAspectRatio: true,
    filters: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      vintage: false,
      sharpen: 0,
    },
    watermark: {
      enabled: false,
      text: 'Watermark',
      opacity: 50,
      position: 'bottom-right',
      fontSize: 24,
      color: '#ffffff',
    },
  });
  
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const originalAspectRatio = imageFile.dimensions.width / imageFile.dimensions.height;

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      width: imageFile.dimensions.width,
      height: imageFile.dimensions.height,
    }));
  }, [imageFile]);

  const handleFormatChange = (format: string) => {
    setSettings(prev => ({ ...prev, outputFormat: format }));
    setProcessedImage(null);
  };

  const handleQualityChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, quality: value[0] }));
    setProcessedImage(null);
  };

  const handleWidthChange = (width: number) => {
    const newSettings = { ...settings, width };
    if (settings.maintainAspectRatio) {
      newSettings.height = Math.round(width / originalAspectRatio);
    }
    setSettings(newSettings);
    setProcessedImage(null);
  };

  const handleHeightChange = (height: number) => {
    const newSettings = { ...settings, height };
    if (settings.maintainAspectRatio) {
      newSettings.width = Math.round(height * originalAspectRatio);
    }
    setSettings(newSettings);
    setProcessedImage(null);
  };

  const handleMaintainAspectRatio = (checked: boolean) => {
    const newSettings = { ...settings, maintainAspectRatio: checked };
    if (checked) {
      newSettings.height = Math.round(settings.width / originalAspectRatio);
    }
    setSettings(newSettings);
    setProcessedImage(null);
  };

  const processImage = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const processed = await ImageProcessor.processImage(
        imageFile,
        settings,
        setProgress
      );
      setProcessedImage(processed);
      toast({
        title: "Image processed successfully",
        description: `Size reduced by ${Math.round((1 - processed.size / imageFile.size) * 100)}%`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      ImageProcessor.downloadImage(
        processedImage.dataUrl,
        imageFile.name,
        settings.outputFormat
      );
    }
  };

  const formatButtons = [
    { format: 'jpeg', label: 'JPEG' },
    { format: 'png', label: 'PNG' },
    { format: 'webp', label: 'WebP' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      {/* File Info Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <img
            src={imageFile.dataUrl}
            alt="Uploaded image thumbnail"
            className="w-16 h-16 object-cover rounded-lg border border-slate-200"
          />
          <div>
            <h3 className="font-semibold text-slate-900">{imageFile.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>{imageFile.format}</span>
              <span>{imageFile.dimensions.width} × {imageFile.dimensions.height}</span>
              <span>{ImageProcessor.formatFileSize(imageFile.size)}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Filters</span>
            </TabsTrigger>
            <TabsTrigger value="watermark" className="flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <span>Watermark</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Output Format 
                <span className="text-xs text-slate-500 font-normal ml-1">(JPEG for best compression)</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {formatButtons.map(({ format, label }) => (
                  <Button
                    key={format}
                    variant={settings.outputFormat === format ? "default" : "outline"}
                    onClick={() => handleFormatChange(format)}
                    className={settings.outputFormat === format 
                      ? "bg-primary text-white hover:bg-blue-600" 
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Compression Quality
                <span className="text-xs text-slate-500 font-normal ml-1">(Lower = smaller file)</span>
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-slate-500 min-w-0">Small</span>
                  <Slider
                    value={[settings.quality]}
                    onValueChange={handleQualityChange}
                    max={100}
                    min={10}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-slate-500 min-w-0">Large</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-semibold text-slate-900">{settings.quality}%</span>
                  <div className="text-xs text-slate-500">
                    {settings.quality < 50 ? 'High compression' : 
                     settings.quality < 80 ? 'Balanced' : 'High quality'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Width (px)</Label>
                <Input
                  type="number"
                  value={settings.width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="border-slate-200 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Height (px)</Label>
                <Input
                  type="number"
                  value={settings.height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="border-slate-200 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="maintain-ratio"
                checked={settings.maintainAspectRatio}
                onCheckedChange={handleMaintainAspectRatio}
              />
              <Label htmlFor="maintain-ratio" className="text-sm text-slate-700">
                Maintain aspect ratio
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="filters">
            <FiltersPanel
              filters={settings.filters}
              onFiltersChange={(filters) => setSettings(prev => ({ ...prev, filters }))}
            />
          </TabsContent>

          <TabsContent value="watermark">
            <WatermarkPanel
              watermark={settings.watermark!}
              onWatermarkChange={(watermark) => setSettings(prev => ({ ...prev, watermark }))}
            />
          </TabsContent>

          <Button
            onClick={processImage}
            disabled={isProcessing}
            className="w-full bg-primary text-white hover:bg-blue-600"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Convert & Compress'}
          </Button>
        </Tabs>

        {/* Right Panel - Preview */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900">Preview</h4>
          
          {/* Before/After Comparison */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Original</span>
                <span className="text-sm text-slate-600">
                  {ImageProcessor.formatFileSize(imageFile.size)}
                </span>
              </div>
              <img
                src={imageFile.dataUrl}
                alt="Original image preview"
                className="w-full h-48 object-cover rounded-lg border border-slate-200"
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Processed</span>
                <span className="text-sm text-emerald-600 font-medium">
                  {processedImage 
                    ? ImageProcessor.formatFileSize(processedImage.size)
                    : 'Not processed'
                  }
                </span>
              </div>
              {processedImage ? (
                <img
                  src={processedImage.dataUrl}
                  alt="Processed image preview"
                  className="w-full h-48 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                  <span className="text-slate-400">Click "Process Image" to see preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-primary font-medium">Processing image...</span>
              </div>
              <Progress value={progress} className="bg-blue-200" />
            </div>
          )}

          {/* Download Section */}
          {processedImage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium text-slate-900">Ready to Download</h5>
                  <p className="text-sm text-slate-600">
                    Size reduced by {Math.round((1 - processedImage.size / imageFile.size) * 100)}%
                  </p>
                </div>
                <Button
                  onClick={downloadImage}
                  className="bg-accent text-white hover:bg-emerald-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
