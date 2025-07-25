import { useState } from "react";
import { Settings, Palette, Type, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessingSettings } from "@/types/image";
import { FiltersPanel } from "@/components/filters-panel";
import { WatermarkPanel } from "@/components/watermark-panel";
import { BasicSettingsPanel } from "@/components/basic-settings-panel";

interface GlobalSettingsPanelProps {
  settings: ProcessingSettings;
  onSettingsChange: (settings: ProcessingSettings) => void;
  showApplyButton?: boolean;
  onApply?: () => void;
  isProcessing?: boolean;
}

export function GlobalSettingsPanel({ 
  settings, 
  onSettingsChange, 
  showApplyButton = false,
  onApply,
  isProcessing = false
}: GlobalSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
            <Sliders className="w-5 h-5" />
            <span>Image Editing Settings</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600"
          >
            {isExpanded ? 'Minimize' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Basic</span>
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Filters & Effects</span>
              </TabsTrigger>
              <TabsTrigger value="watermark" className="flex items-center space-x-2">
                <Type className="w-4 h-4" />
                <span>Watermark</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <BasicSettingsPanel 
                settings={settings} 
                onSettingsChange={onSettingsChange}
              />
            </TabsContent>

            <TabsContent value="filters" className="space-y-6">
              <FiltersPanel
                filters={settings.filters}
                onFiltersChange={(filters) => onSettingsChange({ ...settings, filters })}
              />
            </TabsContent>

            <TabsContent value="watermark" className="space-y-6">
              <WatermarkPanel
                watermark={settings.watermark!}
                onWatermarkChange={(watermark) => onSettingsChange({ ...settings, watermark })}
              />
            </TabsContent>
          </Tabs>

          {showApplyButton && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <Button
                onClick={onApply}
                disabled={isProcessing}
                className="w-full bg-primary text-white hover:bg-blue-600"
                size="lg"
              >
                {isProcessing ? 'Processing...' : 'Apply Settings to All Images'}
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}