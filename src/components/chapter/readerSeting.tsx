"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useChapter } from "@/context/useChapter";

interface ReaderSettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ReaderSettings({
  settings,
  onClose,
  isOpen,
}: ReaderSettingsProps) {
  const { setSettings } = useChapter();

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-gray-700 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Cài đặt chế độ đọc</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Reading Mode */}
          <div className="space-y-2">
            <Label className="text-white">Reading Mode</Label>
            <Select
              value={settings.readingMode}
              onValueChange={(value) =>
                handleSettingChange("readingMode", value)
              }
            >
              <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="single-page">Single Page</SelectItem>
                <SelectItem value="page-flip">Page Flip</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Zoom Level */}
          <div className="space-y-2">
            <Label className="text-white">
              Zoom Level: {settings.zoomLevel}%
            </Label>
            <Slider
              value={[settings.zoomLevel]}
              onValueChange={(value) =>
                handleSettingChange("zoomLevel", value[0])
              }
              min={50}
              max={200}
              step={10}
              className="w-full"
            />
          </div>

          {/* Show Progress */}
          <div className="flex items-center justify-between">
            <Label className="text-white">Show Progress Bar</Label>
            <Switch
              checked={settings.showProgress}
              onCheckedChange={(checked) =>
                handleSettingChange("showProgress", checked)
              }
            />
          </div>

          {/* Auto Fullscreen */}
          <div className="flex items-center justify-between">
            <Label className="text-white">Auto Fullscreen</Label>
            <Switch
              checked={settings.autoFullscreen}
              onCheckedChange={(checked) =>
                handleSettingChange("autoFullscreen", checked)
              }
            />
          </div>
        </div>

        <div className="flex justify-end p-4">
          <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
