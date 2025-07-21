"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useChapter } from "@/context/useChapter"
import { X } from "lucide-react"

interface ReaderSettingsComponentProps {
  settings: any
  onSettingsChange: (settings: any) => void
  onClose: () => void
}

export default function ReaderSettingsComponent({ settings, onClose }: ReaderSettingsComponentProps) {
  const { setSettings } = useChapter()

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-white text-xl">Reader Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Reading Mode */}
          <div>
            <Label className="mb-2 block text-white">Reading Mode</Label>
            <Select value={settings.readingMode} onValueChange={(value) => handleSettingChange("readingMode", value)}>
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
          <div>
            <Label className="mb-2 block text-white">Zoom Level: {settings.zoomLevel}%</Label>
            <Slider
              value={[settings.zoomLevel]}
              onValueChange={(value) => handleSettingChange("zoomLevel", value[0])}
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
              onCheckedChange={(checked) => handleSettingChange("showProgress", checked)}
            />
          </div>

          {/* Auto Fullscreen */}
          <div className="flex items-center justify-between">
            <Label className="text-white">Auto Fullscreen</Label>
            <Switch
              checked={settings.autoFullscreen}
              onCheckedChange={(checked) => handleSettingChange("autoFullscreen", checked)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
