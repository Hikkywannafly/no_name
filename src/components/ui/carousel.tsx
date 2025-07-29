"use client"
import { cn } from "@/lib/utils"
import * as React from "react"

interface CarouselContextType {
  goToPrevious: () => void
  goToNext: () => void
  isTransitioning: boolean
}

const CarouselContext = React.createContext<CarouselContextType | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a FadeCarousel")
  }
  return context
}

interface FadeCarouselProps {
  children: React.ReactNode[]
  className?: string
  autoplay?: boolean
  autoplayDelay?: number
  onSlideChange?: (index: number) => void
}

export function FadeCarousel({
  children,
  className,
  autoplay,
  autoplayDelay = 5000,
  onSlideChange,
}: FadeCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const autoplayRef = React.useRef<NodeJS.Timeout>(null)

  const totalSlides = children.length

  const goToSlide = React.useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentIndex(index)
      onSlideChange?.(index)
      setTimeout(() => setIsTransitioning(false), 500)
    },
    [isTransitioning, onSlideChange],
  )

  const goToPrevious = React.useCallback(() => {
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1
    goToSlide(prevIndex)
  }, [currentIndex, totalSlides, goToSlide])

  const goToNext = React.useCallback(() => {
    const nextIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1
    goToSlide(nextIndex)
  }, [currentIndex, totalSlides, goToSlide])

  // Autoplay functionality
  React.useEffect(() => {
    if (!autoplay) return

    const startAutoplay = () => {
      autoplayRef.current = setInterval(goToNext, autoplayDelay)
    }

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }

    startAutoplay()
    return stopAutoplay
  }, [autoplay, autoplayDelay, goToNext])

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goToPrevious()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrevious, goToNext])

  // --- Swipe/Drag logic ---
  const dragState = React.useRef<{
    startX: number | null
    lastX: number | null
    dragging: boolean
    isTouch: boolean
  }>({ startX: null, lastX: null, dragging: false, isTouch: false })

  // Threshold (px) to trigger slide change
  const SWIPE_THRESHOLD = 50

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return
    dragState.current = {
      startX: e.touches[0].clientX,
      lastX: e.touches[0].clientX,
      dragging: true,
      isTouch: true,
    }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragState.current.dragging) return
    dragState.current.lastX = e.touches[0].clientX
  }
  const onTouchEnd = () => {
    if (!dragState.current.dragging || dragState.current.startX === null || dragState.current.lastX === null) return
    const deltaX = dragState.current.lastX - dragState.current.startX
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) goToNext()
      else goToPrevious()
    }
    dragState.current = { startX: null, lastX: null, dragging: false, isTouch: false }
  }

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    if (isTransitioning) return
    dragState.current = {
      startX: e.clientX,
      lastX: e.clientX,
      dragging: true,
      isTouch: false,
    }
    // Prevent image drag
    e.preventDefault()
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.dragging) return
    dragState.current.lastX = e.clientX
  }
  const onMouseUp = () => {
    if (!dragState.current.dragging || dragState.current.startX === null || dragState.current.lastX === null) return
    const deltaX = dragState.current.lastX - dragState.current.startX
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) goToNext()
      else goToPrevious()
    }
    dragState.current = { startX: null, lastX: null, dragging: false, isTouch: false }
  }
  const onMouseLeave = () => {
    // If mouse leaves while dragging, reset
    if (dragState.current.dragging) {
      dragState.current = { startX: null, lastX: null, dragging: false, isTouch: false }
    }
  }

  const contextValue = React.useMemo(
    () => ({
      goToPrevious,
      goToNext,
      isTransitioning,
    }),
    [goToPrevious, goToNext, isTransitioning],
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        className={cn("relative overflow-hidden", className)}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => {
          onMouseLeave();
          if (autoplay) {
            autoplayRef.current = setInterval(goToNext, autoplayDelay)
          }
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => {
          if (autoplayRef.current) {
            clearInterval(autoplayRef.current)
          }
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-in-out",
              index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0",
            )}
            aria-hidden={index !== currentIndex}
          >
            {child}
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="-bottom-5 -translate-x-1/2 absolute left-1/2 z-10 flex transform gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-out",
                index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </CarouselContext.Provider>
  )
}
