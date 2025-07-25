import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WatermarkSettings } from "@/types/image";

interface WatermarkPanelProps {
  watermark: WatermarkSettings;
  onWatermarkChange: (watermark: WatermarkSettings) => void;
}

const FONT_OPTIONS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Palatino', label: 'Palatino' },
];

export function WatermarkPanel({ watermark, onWatermarkChange }: WatermarkPanelProps) {
  const updateWatermark = (key: keyof WatermarkSettings, value: any) => {
    onWatermarkChange({
      ...watermark,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h4 className="text-lg font-semibold text-slate-900">Watermark</h4>
        <Checkbox
          id="watermark-enabled"
          checked={watermark.enabled}
          onCheckedChange={(checked) => updateWatermark('enabled', checked === true)}
        />
      </div>

      {watermark.enabled && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Watermark Text
            </Label>
            <Input
              value={watermark.text}
              onChange={(e) => updateWatermark('text', e.target.value)}
              placeholder="Enter watermark text"
              className="border-slate-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Position
            </Label>
            <Select
              value={watermark.position}
              onValueChange={(value) => updateWatermark('position', value)}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="center">Center</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Opacity ({watermark.opacity}%)
            </Label>
            <Slider
              value={[watermark.opacity]}
              onValueChange={(value) => updateWatermark('opacity', value[0])}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Font Family
            </Label>
            <Select
              value={watermark.fontFamily}
              onValueChange={(value) => updateWatermark('fontFamily', value)}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Font Size ({watermark.fontSize}px)
            </Label>
            <Slider
              value={[watermark.fontSize]}
              onValueChange={(value) => updateWatermark('fontSize', value[0])}
              min={12}
              max={200}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Angle ({watermark.angle}°)
            </Label>
            <Slider
              value={[watermark.angle]}
              onValueChange={(value) => updateWatermark('angle', value[0])}
              min={-45}
              max={45}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Text Color
            </Label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={watermark.color}
                onChange={(e) => updateWatermark('color', e.target.value)}
                className="w-12 h-8 rounded border border-slate-200 cursor-pointer"
              />
              <Input
                value={watermark.color}
                onChange={(e) => updateWatermark('color', e.target.value)}
                placeholder="#ffffff"
                className="flex-1 border-slate-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-600">
              Preview: The watermark will appear on your processed images with the settings above.
              Adjust opacity and position for best results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}