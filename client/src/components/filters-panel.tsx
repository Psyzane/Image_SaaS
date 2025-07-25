import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageFilters } from "@/types/image";

interface FiltersPanelProps {
  filters: ImageFilters;
  onFiltersChange: (filters: ImageFilters) => void;
}

export function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  const updateFilter = (key: keyof ImageFilters, value: number | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
        Filters & Effects
      </h4>

      {/* Basic Adjustments */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Brightness ({filters.brightness > 0 ? '+' : ''}{filters.brightness})
          </Label>
          <Slider
            value={[filters.brightness]}
            onValueChange={(value) => updateFilter('brightness', value[0])}
            min={-100}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Contrast ({filters.contrast > 0 ? '+' : ''}{filters.contrast})
          </Label>
          <Slider
            value={[filters.contrast]}
            onValueChange={(value) => updateFilter('contrast', value[0])}
            min={-100}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Saturation ({filters.saturation > 0 ? '+' : ''}{filters.saturation})
          </Label>
          <Slider
            value={[filters.saturation]}
            onValueChange={(value) => updateFilter('saturation', value[0])}
            min={-100}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Effects */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Blur ({filters.blur}px)
          </Label>
          <Slider
            value={[filters.blur]}
            onValueChange={(value) => updateFilter('blur', value[0])}
            min={0}
            max={10}
            step={0.5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Sharpen ({filters.sharpen}%)
          </Label>
          <Slider
            value={[filters.sharpen]}
            onValueChange={(value) => updateFilter('sharpen', value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Sepia ({filters.sepia}%)
          </Label>
          <Slider
            value={[filters.sepia]}
            onValueChange={(value) => updateFilter('sepia', value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Grayscale ({filters.grayscale}%)
          </Label>
          <Slider
            value={[filters.grayscale]}
            onValueChange={(value) => updateFilter('grayscale', value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="vintage-effect"
            checked={filters.vintage}
            onCheckedChange={(checked) => updateFilter('vintage', checked === true)}
          />
          <Label htmlFor="vintage-effect" className="text-sm text-slate-700">
            Vintage Effect
          </Label>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="border-t border-slate-200 pt-4">
        <Label className="text-sm font-medium text-slate-700 mb-3 block">
          Quick Presets
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onFiltersChange({
              brightness: 0, contrast: 0, saturation: 0, blur: 0,
              sepia: 0, grayscale: 0, vintage: false, sharpen: 0
            })}
            className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={() => onFiltersChange({
              ...filters, brightness: 20, contrast: 15, saturation: 10
            })}
            className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Vivid
          </button>
          <button
            onClick={() => onFiltersChange({
              ...filters, grayscale: 100, contrast: 20
            })}
            className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            B&W
          </button>
          <button
            onClick={() => onFiltersChange({
              ...filters, sepia: 80, brightness: 10, vintage: true
            })}
            className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Vintage
          </button>
        </div>
      </div>
    </div>
  );
}