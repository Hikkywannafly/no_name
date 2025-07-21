"use client"
import Image from "@/components/shared/image"
import { Button } from "@/components/ui/button"
import { useChapter } from "@/context/useChapter"
import type { UPage } from "@/types/manga"
import { AlertTriangle } from "lucide-react"
import ChapterImage from "./chapterImg"

interface OptimizedImageProps {
    chapter: UPage
    index: number
    source: string
}

export function OptimizedImage({ chapter, index, source }: OptimizedImageProps) {
    const { settings, loadedImages, reportError, chapters } = useChapter()

    const isLoaded = loadedImages.has(index)

    if (!isLoaded) {
        return (
            <div
                className={`relative flex items-center justify-center bg-gray-900 ${settings.readingMode === "single-page" ? "h-screen w-full" : "mb-2 h-96 w-full"
                    }`}
            >
                <div className="text-center">
                    <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent">

                    </div>
                    <div className="text-gray-500 text-sm">Loading page {index + 1}...</div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`relative ${settings.readingMode === "single-page" ? "h-screen w-full" : "mb-2"}`}
            style={{
                transform: `scale(${settings.zoomLevel / 100})`,
                transformOrigin: "center top",
            }}
        >
            {source === "source1" ? (
                <ChapterImage
                    imageUrl={chapter.imageUrl || ""}
                    drmData={chapter.drmData || ""}
                    title={`Page ${index + 1}`}
                    width={settings.readingMode === "horizontal" ? 800 : 1024}
                    height={settings.readingMode === "horizontal" ? 600 : 1469}
                    onLoad={() => { }}
                />
            ) : (
                <Image
                    src={`/api/proxy?url=${chapter.imageUrl}&referer=https://truyenqqgo.com`}
                    alt={`Page ${index + 1}`}
                    width={settings.readingMode === "horizontal" ? 800 : 1024}
                    height={settings.readingMode === "horizontal" ? 600 : 1469}
                    onLoad={() => { }}
                    style={{ objectFit: "contain" }}
                />
            )}

            {/* Error report button */}
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100"
                onClick={() => reportError(index)}
            >
                <AlertTriangle className="h-4 w-4" />
            </Button>

            {/* Page number */}
            <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
                {index + 1} / {chapters.length}
            </div>
        </div>
    )
}
