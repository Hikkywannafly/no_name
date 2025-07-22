"use client"
import ChapterNavigation from "@/components/chapter/chapterNavigation"
import ImagePreloader from "@/components/chapter/imagePreloader"
import { OptimizedImage } from "@/components/chapter/optimizedImage"
import ReaderSettingsComponent from "@/components/chapter/readerSeting"
import { Button } from "@/components/ui/button"
import { useChapter } from "@/context/useChapter"
import { ChevronLeft, ChevronRight, Maximize, Settings } from "lucide-react"
import { memo, useCallback, useEffect, useRef } from "react"

interface ChapterProps {
  mangaId: string
  source?: string
  anilistId?: string
  prefetchManga?: any
  nextChapter?: string
  prevChapter?: string
}

export const Chapter = memo(function Chapter(props: ChapterProps) {
  const { source = "source1" } = props

  const {
    chapters,
    isLoading,
    error,
    settings,
    currentPage,
    // setCurrentPage,
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
  } = useChapter()

  const readerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)


  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    setShowControls(true)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isFullscreen) setShowControls(false)
    }, 3000)
  }, [isFullscreen, setShowControls])

  useEffect(() => {
    const handleMouseMove = () => resetControlsTimeout()
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          if (settings.readingMode === "single-page") {
            goToPrevPage()
          }
          break
        case "ArrowRight":
        case "d":
          if (settings.readingMode === "single-page") {
            goToNextPage()
          }
          break
        case "f":
          toggleFullscreen()
          break
        case "Escape":
          setShowSettings(false)
          break
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keydown", handleKeyPress)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [settings.readingMode, goToNextPage, goToPrevPage, toggleFullscreen, resetControlsTimeout, setShowSettings])

  // Calculate reading progress
  useEffect(() => {
    if (settings.readingMode === "single-page") {
      setReadingProgress(((currentPage + 1) / chapters.length) * 100)
    } else {
      // For scroll modes, calculate based on scroll position
      const handleScroll = () => {
        const element = readerRef.current
        if (element) {
          const scrollTop = element.scrollTop
          const scrollHeight = element.scrollHeight - element.clientHeight
          const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
          setReadingProgress(progress)
        }
      }

      const element = readerRef.current
      element?.addEventListener("scroll", handleScroll)
      return () => element?.removeEventListener("scroll", handleScroll)
    }
  }, [settings.readingMode, currentPage, chapters.length, setReadingProgress])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4 text-6xl">⏳</div>
          <h2 className="mb-2 font-semibold text-xl">Loading chapter...</h2>
          <p className="text-gray-400">Vui lòng đợi một tý ạ</p>
        </div>
      </div>
    )
  }

  if (error || !chapters || chapters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4 text-6xl">📖</div>
          <h2 className="mb-2 font-semibold text-xl">{error ? "Error loading chapter" : "No chapters available"}</h2>
          <p className="text-gray-400">
            {error ? "Please try again later." : "This chapter might not be available yet."}
          </p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (settings.readingMode) {
      case "single-page":
        return (
          <div className="relative h-screen w-full overflow-hidden">
            <OptimizedImage chapter={chapters[currentPage]} index={currentPage} source={source} />

            {/* Navigation areas */}
            <div className="absolute top-0 left-0 h-full w-1/3 cursor-pointer" onClick={goToPrevPage} />
            <div className="absolute top-0 right-0 h-full w-1/3 cursor-pointer" onClick={goToNextPage} />
          </div>
        )

      case "horizontal":
        return (
          <div className="flex h-screen overflow-x-auto overflow-y-hidden">
            {chapters.map((chapter, index) => (
              <div key={chapter.id || index} className="flex-shrink-0">
                <OptimizedImage chapter={chapter} index={index} source={source} />
              </div>
            ))}
          </div>
        )

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
                  <OptimizedImage chapter={chapter} index={index} source={source} />
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
        )

      default: // vertical
        return (
          <div className="flex flex-col items-center">
            {chapters.map((chapter, index) => (
              <OptimizedImage key={chapter.id || index} chapter={chapter} index={index} source={source} />
            ))}
          </div>
        )
    }
  }

  return (
    <div
      ref={readerRef}
      className={`relative min-h-screen bg-black text-white ${settings.readingMode === "vertical" ? "overflow-y-auto" : "overflow-hidden"
        }`}
    >
      {/* Image Preloader */}
      <ImagePreloader source={source} />

      {/* Progress bar */}
      {settings.showProgress && (
        <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-800">
          <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${readingProgress}%` }} />
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
                  Chapter {props.source} • {source}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white" onClick={() => setShowSettings(!showSettings)}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white" onClick={toggleFullscreen}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <ChapterNavigation
            anilistId={props.anilistId}
            currentChapterId={props.mangaId}
            nextChapter={props.nextChapter}
            prevChapter={props.prevChapter}
          />
        </div>
      )}

      {showSettings && (
        <ReaderSettingsComponent
          settings={settings}
          onSettingsChange={() => { }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
})
