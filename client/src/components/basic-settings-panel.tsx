import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProcessingSettings } from "@/types/image";

interface BasicSettingsPanelProps {
  settings: ProcessingSettings;
  onSettingsChange: (settings: ProcessingSettings) => void;
}

export function BasicSettingsPanel({ settings, onSettingsChange }: BasicSettingsPanelProps) {
  const formatButtons = [
    { format: 'jpeg', label: 'JPEG' },
    { format: 'png', label: 'PNG' },
    { format: 'webp', label: 'WebP' },
  ];

  const handleFormatChange = (format: string) => {
    onSettingsChange({ ...settings, outputFormat: format });
  };

  const handleQualityChange = (value: number[]) => {
    onSettingsChange({ ...settings, quality: value[0] });
  };

  const handleWidthChange = (width: number) => {
    if (settings.maintainAspectRatio && settings.height > 0) {
      const aspectRatio = settings.height / settings.width;
      const newHeight = Math.round(width * aspectRatio);
      onSettingsChange({ ...settings, width, height: newHeight });
    } else {
      onSettingsChange({ ...settings, width });
    }
  };

  const handleHeightChange = (height: number) => {
    if (settings.maintainAspectRatio && settings.width > 0) {
      const aspectRatio = settings.width / settings.height;
      const newWidth = Math.round(height * aspectRatio);
      onSettingsChange({ ...settings, height, width: newWidth });
    } else {
      onSettingsChange({ ...settings, height });
    }
  };

  const handleMaintainAspectRatio = (checked: boolean) => {
    onSettingsChange({ ...settings, maintainAspectRatio: checked });
  };

  return (
    <div className="space-y-6">
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 mb-2">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              ...settings,
              outputFormat: 'jpeg',
              quality: 85,
              width: 1920,
              height: 1080
            })}
            className="text-xs"
          >
            HD Quality
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              ...settings,
              outputFormat: 'jpeg',
              quality: 60,
              width: 1280,
              height: 720
            })}
            className="text-xs"
          >
            Balanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              ...settings,
              outputFormat: 'jpeg',
              quality: 40,
              width: 800,
              height: 600
            })}
            className="text-xs"
          >
            Small Size
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              ...settings,
              outputFormat: 'webp',
              quality: 80,
              width: settings.width,
              height: settings.height
            })}
            className="text-xs"
          >
            Web Optimized
          </Button>
        </div>
      </div>
    </div>
  );
}