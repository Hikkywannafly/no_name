"use client";
import ChapterNavigation from "@/components/chapter/chapterNavigation";
import ImagePreloader from "@/components/chapter/imagePreloader";
import { OptimizedImage } from "@/components/chapter/optimizedImage";
// import ReaderControls from "@/components/chapter/readerControl";
import ReaderSettings from "@/components/chapter/readerSeting";
import Loading from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { useChapter } from "@/context/useChapter";
import { ChevronLeft, ChevronRight, Maximize, Settings } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useEffect, useRef } from "react";
interface ChapterProps {
  mangaId: string;
  chapterId: string;
  source: string;
  anilistId: string;
  prefetchManga?: any;
  nextChapter?: string;
  prevChapter?: string;
}

export const Chapter = memo(function Chapter(props: ChapterProps) {
  const { source, chapterId, anilistId, mangaId } = props;
  console.log("source test", source, chapterId, anilistId, mangaId);
  const {
    chapters,
    chapterList,
    isLoading,
    error,
    settings,
    currentPage,
    isFullscreen,
    showControls,
    setShowControls,
    showSettings,
    setShowSettings,
    readingProgress,
    setReadingProgress,
    goToNextPage,
    goToPrevPage,
    toggleFullscreen,
  } = useChapter();

  const readerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find current chapter info for navigation
  const currentChapterIndex = chapterList.findIndex(
    (ch) => ch.id === props.chapterId,
  );
  const currentChapterInfo = chapterList[currentChapterIndex] || null;

  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isFullscreen) setShowControls(false);
    }, 3000);
  }, [isFullscreen, setShowControls]);

  useEffect(() => {
    const handleMouseMove = () => resetControlsTimeout();
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          if (settings.readingMode === "single-page") {
            goToPrevPage();
          }
          break;
        case "ArrowRight":
        case "d":
          if (settings.readingMode === "single-page") {
            goToNextPage();
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
    settings.readingMode,
    goToNextPage,
    goToPrevPage,
    toggleFullscreen,
    resetControlsTimeout,
    setShowSettings,
  ]);

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
  }, [settings.readingMode, currentPage, chapters.length, setReadingProgress]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="text-center">
          <Loading className="h-12 w-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ga-4 flex min-h-screen flex-col items-center justify-center text-center text-white">
        <img src="/images/nazuna3.gif" className="mb-2 w-44 " alt="" />
        <h2 className="mb-2 font-semibold text-xl">
          {error ? "Không thể tải được chap" : "Chương này chưa có sẵn"}
        </h2>
        <p className="text-gray-400">
          {error
            ? "Vui lòng load lại trang :()."
            : "Có thể chương này chưa sẵn sàng vui lòng đợi nhé"}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Tải lại
        </Button>
      </div>
    );
  }

  const renderContent = () => {
    switch (settings.readingMode) {
      case "single-page":
        return (
          <div className="relative h-screen w-full overflow-hidden">
            <OptimizedImage
              chapter={chapters[currentPage]}
              index={currentPage}
              source={source}
            />

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
                <OptimizedImage
                  chapter={chapter}
                  index={index}
                  source={source}
                />
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
                  <OptimizedImage
                    chapter={chapter}
                    index={index}
                    source={source}
                  />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="lg"
              className="-translate-y-1/2 absolute top-1/2 left-4 bg-black/50 text-white hover:bg-black/70"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="-translate-y-1/2 absolute top-1/2 right-4 bg-black/50 text-white hover:bg-black/70"
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
            {chapters.map((chapter, index) => (
              <OptimizedImage
                key={chapter.id || index}
                chapter={chapter}
                index={index}
                source={source}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div
      ref={readerRef}
      className={`relative min-h-screen text-white ${settings.readingMode === "vertical"
        ? "overflow-y-auto"
        : "overflow-hidden"
        }`}
    >
      {/* Image Preloader */}
      <ImagePreloader source={source} />

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
                <Link href={`/manga/${anilistId}/${chapters[0].name ? chapters[0].name : chapters[0].title}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Quay về
                  </Button>
                </Link>

                <span className="text-gray-300 text-sm">
                  {chapters[0].name} • {currentChapterInfo?.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chapter Navigation */}
          <ChapterNavigation
            anilistId={anilistId}
            mangaId={mangaId}
            sourceId={source}
            currentChapterId={chapterId}
          // nextChapter={props.nextChapter}
          // prevChapter={props.prevChapter}
          />

          {/* Reader Controls for non-vertical modes */}
          {/* {settings.readingMode !== "vertical" && (
            <ReaderControls
              currentPage={currentPage}
              totalPages={chapters.length}
              onPageChange={setCurrentPage}
              readingMode={settings.readingMode}
              onNextChapter={
                nextChapterFromList ? handleNextChapter : undefined
              }
              onPrevChapter={
                prevChapterFromList ? handlePrevChapter : undefined
              }
            />
          )} */}
        </div>
      )}

      {/* Settings Dialog */}
      <ReaderSettings
        settings={settings}
        onSettingsChange={() => { }}
        onClose={() => setShowSettings(false)}
        isOpen={showSettings}
      />
    </div>
  );
});
