import { useState } from "react";
import { Download, Wand2, CheckCircle, XCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ImageFile, ProcessingSettings, BatchProcessingJob, ProcessedImage } from "@/types/image";
import { ImageProcessor } from "@/lib/image-processor";
import { useToast } from "@/hooks/use-toast";
import { GlobalSettingsPanel } from "@/components/global-settings-panel";
import { nanoid } from "nanoid";

interface BatchProcessorProps {
  files: ImageFile[];
  settings: ProcessingSettings;
  onRemove: () => void;
}

export function BatchProcessor({ files, settings: initialSettings, onRemove }: BatchProcessorProps) {
  const [job, setJob] = useState<BatchProcessingJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<ProcessingSettings>(initialSettings);
  const [showSettings, setShowSettings] = useState(true);
  const { toast } = useToast();

  const startBatchProcessing = async () => {
    if (files.length === 0) return;

    const newJob: BatchProcessingJob = {
      id: nanoid(),
      files,
      settings, // Use current settings state
      status: 'pending',
      progress: 0,
      results: [],
      errors: [],
    };

    setJob(newJob);
    setIsProcessing(true);

    try {
      const completedJob = await ImageProcessor.processBatch(
        newJob,
        (progress) => {
          setJob(prev => prev ? { ...prev, progress } : prev);
        },
        (index, result, error) => {
          setJob(prev => {
            if (!prev) return prev;
            const newResults = [...prev.results];
            const newErrors = [...prev.errors];
            
            if (result) {
              newResults[index] = result;
            } else if (error) {
              newErrors.push(`File ${index + 1}: ${error}`);
            }
            
            return {
              ...prev,
              results: newResults,
              errors: newErrors,
            };
          });
        }
      );

      setJob(completedJob);
      
      const successCount = completedJob.results.filter(r => r !== null).length;
      toast({
        title: "Batch processing completed",
        description: `${successCount} of ${files.length} images processed successfully`,
        variant: completedJob.errors.length === 0 ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Batch processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    if (job && job.results.length > 0) {
      const validResults = job.results.filter((r): r is ProcessedImage => r !== null);
      ImageProcessor.downloadBatch(validResults, files, settings);
      toast({
        title: "Downloads started",
        description: `${validResults.length} images will be downloaded`,
      });
    }
  };

  const downloadSingle = (index: number) => {
    if (job && job.results[index]) {
      const result = job.results[index];
      const originalFile = files[index];
      if (result && originalFile) {
        ImageProcessor.downloadImage(result.dataUrl, originalFile.name, settings.outputFormat);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Batch Processing</h3>
          <p className="text-sm text-slate-600">{files.length} images selected</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500"
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Global Settings Panel */}
      <div className="mb-8">
        <Collapsible open={showSettings} onOpenChange={setShowSettings}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Settings className="w-4 h-4 mr-2" />
              {showSettings ? 'Hide' : 'Show'} Batch Processing Settings
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <GlobalSettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
              showApplyButton={false}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Processing Controls */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={startBatchProcessing}
            disabled={isProcessing}
            className="bg-primary text-white hover:bg-blue-600"
            size="lg"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Process All Images with Current Settings'}
          </Button>
          
          {job && job.status === 'completed' && job.results.some(r => r !== null) && (
            <Button
              onClick={downloadAll}
              className="bg-accent text-white hover:bg-emerald-600"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          )}
        </div>

        {/* Settings Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-slate-900 mb-2">Current Batch Settings:</h4>
          <div className="text-sm text-slate-600 grid grid-cols-2 md:grid-cols-4 gap-2">
            <span>Format: <strong>{settings.outputFormat.toUpperCase()}</strong></span>
            <span>Quality: <strong>{settings.quality}%</strong></span>
            <span>Size: <strong>{settings.width}×{settings.height}</strong></span>
            <span>Watermark: <strong>{settings.watermark?.enabled ? 'Yes' : 'No'}</strong></span>
          </div>
          {(settings.filters.brightness !== 0 || settings.filters.contrast !== 0 || 
            settings.filters.saturation !== 0 || settings.filters.blur > 0 || 
            settings.filters.sepia > 0 || settings.filters.grayscale > 0 || 
            settings.filters.vintage || settings.filters.sharpen > 0) && (
            <div className="mt-2 text-sm text-slate-600">
              <span>Filters: <strong>Applied</strong> ({
                [
                  settings.filters.brightness !== 0 && 'Brightness',
                  settings.filters.contrast !== 0 && 'Contrast', 
                  settings.filters.saturation !== 0 && 'Saturation',
                  settings.filters.blur > 0 && 'Blur',
                  settings.filters.sepia > 0 && 'Sepia',
                  settings.filters.grayscale > 0 && 'Grayscale',
                  settings.filters.vintage && 'Vintage',
                  settings.filters.sharpen > 0 && 'Sharpen'
                ].filter(Boolean).join(', ')
              })</span>
            </div>
          )}
        </div>

        {/* Progress */}
        {job && isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-primary font-medium">
                Processing {Math.ceil((job.progress / 100) * files.length)} of {files.length} images...
              </span>
            </div>
            <Progress value={job.progress} className="bg-blue-200" />
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => {
          const result = job?.results[index];
          const hasError = job?.errors.some(error => error.includes(`File ${index + 1}`));
          
          return (
            <div key={index} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={file.dataUrl}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {ImageProcessor.formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {result ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : hasError ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : job?.status === 'processing' ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                  )}
                </div>
              </div>

              {result && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Size: {ImageProcessor.formatFileSize(result.size)}</span>
                    <span className="text-emerald-600">
                      -{Math.round((1 - result.size / file.size) * 100)}%
                    </span>
                  </div>
                  <Button
                    onClick={() => downloadSingle(index)}
                    size="sm"
                    className="w-full bg-accent text-white hover:bg-emerald-600"
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                </div>
              )}

              {hasError && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  Processing failed
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {job && job.status === 'completed' && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Processing Summary</h4>
            <div className="text-sm text-slate-600 space-y-1">
              <p>✓ {job.results.filter(r => r !== null).length} images processed successfully</p>
              {job.errors.length > 0 && (
                <p>✗ {job.errors.length} images failed to process</p>
              )}
              <p>Total size reduction: {Math.round(
                job.results.reduce((acc, result, index) => {
                  if (result) {
                    return acc + (1 - result.size / files[index].size);
                  }
                  return acc;
                }, 0) / job.results.filter(r => r !== null).length * 100
              )}% average</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}