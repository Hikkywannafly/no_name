"use client";
import { useChapter } from "@/context/useChapter";
import type { UPage } from "@/types/manga";
import ChapterImage from "./chapterImg";
import ReadImage from "./readerImage";
interface OptimizedImageProps {
  chapter: UPage;
  index: number;
  source: string;
}

export function OptimizedImage({
  chapter,
  index,
  source,
}: OptimizedImageProps) {
  const { settings, isLoading } = useChapter();

  // const isLoaded = loadedImages.has(index);
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
          isLoading={isLoading}
          title={`Đọc truyện tại nazuna ${index + 1}`}
          width={settings.readingMode === "horizontal" ? 800 : 1024}
          height={settings.readingMode === "horizontal" ? 600 : 1469}
          onLoad={() => {}}
        />
      ) : (
        <ReadImage
          src={`/api/proxy?url=${chapter.imageUrl}&referer=${chapter.reference}`}
          alt={`Đọc truyện tại nazuna ${index + 1}`}
          width={settings.readingMode === "horizontal" ? 800 : 1024}
          height={settings.readingMode === "horizontal" ? 600 : 1469}
          onLoad={() => {}}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "auto",
            maxHeight: settings.readingMode === "horizontal" ? 600 : 1469,
          }}
        />
      )}
      {/* {
        isLoaded && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100"
              onClick={() => reportError(index)}
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>

            <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
              {index + 1} / {chapters.length}
            </div>
          </>
        )
      } */}
    </div>
  );
}
