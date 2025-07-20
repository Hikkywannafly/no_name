"use client";
import ChapterImage from "@/components/chapter/chapterImg";
import ReaderControls from "@/components/chapter/readerControl";
import ReaderSettingsComponent from "@/components/chapter/readerSeting";
import Image from "@/components/shared/image";
import { Button } from "@/components/ui/button";
import useCuuTruyenChapter from "@/hooks/CuuTruyen/useCuuTruyenChapter";
import useTruyenQQChapter from "@/hooks/TruyenQQ/useTruyenQQChapter";
import type { UPage } from "@/types/manga";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Settings,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface ChapterProps {
  mangaId: string;
  source?: string;
  prefetchManga?: any;
  nextChapter?: string;
  prevChapter?: string;
}

type ReadingMode = "vertical" | "horizontal" | "single-page" | "page-flip";

interface ReaderSettings {
  readingMode: ReadingMode;
  zoomLevel: number;
  autoFullscreen: boolean;
  showProgress: boolean;
  preloadPages: number;
}

export const Chapter = memo(function Chapter(props: ChapterProps) {
  const { mangaId, source } = props;

  // Chapter data
  const { data: cuuTruyenChapters } = useCuuTruyenChapter(mangaId.toString());
  const { data: truyenQQChapters } = useTruyenQQChapter(mangaId);
  const chapters: UPage[] =
    source === "source1" ? cuuTruyenChapters || [] : truyenQQChapters || [];
  console.log("Chapters:", chapters);
  // Reader state
  const [settings, setSettings] = useState<ReaderSettings>({
    readingMode: "vertical",
    zoomLevel: 100,
    autoFullscreen: false,
    showProgress: true,
    preloadPages: 3,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [, setLoadedImages] = useState<Set<number>>(new Set());

  const readerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load user preferences
  useEffect(() => {
    const savedSettings = localStorage.getItem("manga-reader-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save user preferences
  useEffect(() => {
    localStorage.setItem("manga-reader-settings", JSON.stringify(settings));
  }, [settings]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isFullscreen) setShowControls(false);
    }, 3000);
  }, [isFullscreen]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = () => resetControlsTimeout();
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          if (settings.readingMode === "single-page" && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
          }
          break;
        case "ArrowRight":
        case "d":
          if (
            settings.readingMode === "single-page" &&
            currentPage < chapters.length - 1
          ) {
            setCurrentPage((prev) => prev + 1);
          }
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          setShowSettings(false);
          break;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyPress);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [
    currentPage,
    chapters.length,
    settings.readingMode,
    toggleFullscreen,
    resetControlsTimeout,
  ]);

  // Calculate reading progress
  useEffect(() => {
    if (settings.readingMode === "single-page") {
      setReadingProgress(((currentPage + 1) / chapters.length) * 100);
    } else {
      // For scroll modes, calculate based on scroll position
      const handleScroll = () => {
        const element = readerRef.current;
        if (element) {
          const scrollTop = element.scrollTop;
          const scrollHeight = element.scrollHeight - element.clientHeight;
          const progress =
            scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
          setReadingProgress(progress);
        }
      };

      const element = readerRef.current;
      element?.addEventListener("scroll", handleScroll);
      return () => element?.removeEventListener("scroll", handleScroll);
    }
  }, [settings.readingMode, currentPage, chapters.length]);


  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev: Set<number>) => new Set([...prev, index]));
  }, []);

  // Navigation functions
  const goToNextPage = useCallback(() => {
    if (currentPage < chapters.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, chapters.length]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const reportError = useCallback((pageIndex: number) => {
    // Implement error reporting logic
    console.log(`Error reported for page ${pageIndex + 1}`);
    alert(
      `Error reported for page ${pageIndex + 1}. Thank you for your feedback!`,
    );
  }, []);

  if (!chapters || chapters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4 text-6xl">📖</div>
          <h2 className="mb-2 font-semibold text-xl">No chapters available</h2>
          <p className="text-gray-400">
            This chapter might not be available yet.
          </p>
        </div>
      </div>
    );
  }

  const renderImage = (chapter: UPage, index: number) => {
    const shouldLoad =
      index <= currentPage + settings.preloadPages && index >= currentPage - 1;

    if (!shouldLoad && settings.readingMode !== "vertical") {
      return (
        <div
          key={chapter.id || index}
          className="flex h-screen w-full items-center justify-center bg-gray-900"
        >
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    return (
      <div
        key={chapter.id || index}
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
            onLoad={() => handleImageLoad(index)}
          />
        ) : (
          <Image
            src={`/api/proxy?url=${chapter.imageUrl}&referer=https://truyenqqgo.com`}
            alt={`Page ${index + 1}`}
            width={settings.readingMode === "horizontal" ? 800 : 1024}
            height={settings.readingMode === "horizontal" ? 600 : 1469}
            onLoad={() => handleImageLoad(index)}
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
    );
  };

  const renderContent = () => {
    switch (settings.readingMode) {
      case "single-page":
        return (
          <div className="relative h-screen w-full overflow-hidden">
            {renderImage(chapters[currentPage], currentPage)}

            {/* Navigation areas */}
            <div
              className="absolute top-0 left-0 h-full w-1/3 cursor-pointer"
              onClick={goToPrevPage}
            />
            <div
              className="absolute top-0 right-0 h-full w-1/3 cursor-pointer"
              onClick={goToNextPage}
            />
          </div>
        );

      case "horizontal":
        return (
          <div className="flex h-screen overflow-x-auto overflow-y-hidden">
            {chapters.map((chapter, index) => (
              <div key={chapter.id || index} className="flex-shrink-0">
                {renderImage(chapter, index)}
              </div>
            ))}
          </div>
        );

      case "page-flip":
        return (
          <div className="relative h-screen w-full overflow-hidden">
            <div
              className="transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
                width: `${chapters.length * 100}%`,
                display: "flex",
              }}
            >
              {chapters.map((chapter, index) => (
                <div key={chapter.id || index} className="w-full flex-shrink-0">
                  {renderImage(chapter, index)}
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="lg"
              className="-translate-y-1/2 absolute top-1/2 left-4 bg-black/50 text-white"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="-translate-y-1/2 absolute top-1/2 right-4 bg-black/50 text-white"
              onClick={goToNextPage}
              disabled={currentPage === chapters.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        );

      default: // vertical
        return (
          <div className="flex flex-col items-center">
            {chapters.map((chapter, index) => renderImage(chapter, index))}
          </div>
        );
    }
  };

  return (
    <div
      ref={readerRef}
      className={`relative min-h-screen bg-black text-white ${
        settings.readingMode === "vertical"
          ? "overflow-y-auto"
          : "overflow-hidden"
      }`}
    >
      {/* Progress bar */}
      {settings.showProgress && (
        <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-800">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Main content */}
      {renderContent()}

      {/* Controls overlay */}
      {showControls && (
        <div className="pointer-events-none fixed inset-0 z-40">
          {/* Top controls */}
          <div className="pointer-events-auto absolute top-0 right-0 left-0 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
                <span className="text-gray-300 text-sm">
                  Chapter {mangaId} • {source}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                  onClick={toggleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom controls */}
          <ReaderControls
            currentPage={currentPage}
            totalPages={chapters.length}
            onPageChange={setCurrentPage}
            readingMode={settings.readingMode}
            nextChapter={props.nextChapter}
            prevChapter={props.prevChapter}
          />
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <ReaderSettingsComponent
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
});
