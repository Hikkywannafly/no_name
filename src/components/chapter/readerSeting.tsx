"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeftRight,
  ArrowUpDown,
  BookOpen,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";

interface ReaderSettingsProps {
  settings: {
    readingMode: "vertical" | "horizontal" | "single-page" | "page-flip";
    zoomLevel: number;
    autoFullscreen: boolean;
    showProgress: boolean;
    preloadPages: number;
  };
  onSettingsChange: (settings: any) => void;
  onClose: () => void;
}

export default function ReaderSettings({
  settings,
  onSettingsChange,
  onClose,
}: ReaderSettingsProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const resetSettings = () => {
    onSettingsChange({
      readingMode: "vertical",
      zoomLevel: 100,
      autoFullscreen: false,
      showProgress: true,
      preloadPages: 3,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-md border-gray-700 bg-gray-900 text-white">
        <div className="flex items-center justify-between border-gray-700 border-b p-4">
          <h2 className="font-semibold text-lg">Reader Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-4">
          {/* Reading Mode */}
          <div className="space-y-2">
            <Label className="font-medium text-sm">Reading Mode</Label>
            <Select
              value={settings.readingMode}
              onValueChange={(value) => updateSetting("readingMode", value)}
            >
              <SelectTrigger className="border-gray-600 bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-600 bg-gray-800">
                <SelectItem value="vertical">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Vertical Scroll
                  </div>
                </SelectItem>
                <SelectItem value="horizontal">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    Horizontal Scroll
                  </div>
                </SelectItem>
                <SelectItem value="single-page">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Single Page
                  </div>
                </SelectItem>
                <SelectItem value="page-flip">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Page Flip
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Zoom Level */}
          <div className="space-y-2">
            <Label className="font-medium text-sm">
              Zoom Level: {settings.zoomLevel}%
            </Label>
            <Slider
              value={[settings.zoomLevel]}
              onValueChange={(value) => updateSetting("zoomLevel", value[0])}
              min={50}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-gray-400 text-xs">
              <span>50%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>

          {/* Preload Pages */}
          <div className="space-y-2">
            <Label className="font-medium text-sm">
              Preload Pages: {settings.preloadPages}
            </Label>
            <Slider
              value={[settings.preloadPages]}
              onValueChange={(value) => updateSetting("preloadPages", value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Toggle Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-sm">Show Progress Bar</Label>
              <Switch
                checked={settings.showProgress}
                onCheckedChange={(checked) =>
                  updateSetting("showProgress", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="font-medium text-sm">Auto Fullscreen</Label>
              <Switch
                checked={settings.autoFullscreen}
                onCheckedChange={(checked) =>
                  updateSetting("autoFullscreen", checked)
                }
              />
            </div>
          </div>

          {/* Device Presets */}
          <div className="space-y-2">
            <Label className="font-medium text-sm">Quick Presets</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-1 border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    readingMode: "vertical",
                    zoomLevel: 100,
                  })
                }
              >
                <Monitor className="h-4 w-4" />
                <span className="text-xs">Desktop</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-1 border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    readingMode: "single-page",
                    zoomLevel: 120,
                  })
                }
              >
                <Tablet className="h-4 w-4" />
                <span className="text-xs">Tablet</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-1 border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    readingMode: "vertical",
                    zoomLevel: 150,
                  })
                }
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-xs">Mobile</span>
              </Button>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
            onClick={resetSettings}
          >
            Reset to Default
          </Button>
        </div>
      </Card>
    </div>
  );
}
