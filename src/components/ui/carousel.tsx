"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import WideContainer from "../layout/wideLayout"

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
  autoplay = false,
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

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current)
        }
      }}
      onMouseLeave={() => {
        if (autoplay) {
          autoplayRef.current = setInterval(goToNext, autoplayDelay)
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

      {/* Navigation Buttons */}
      <WideContainer>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="-translate-y-1/2 absolute top-1/2 right-12 z-20 h-10 w-10 rounded-sm bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          disabled={isTransitioning}
          className="-translate-y-1/2 absolute top-1/2 right-0 z-20 h-10 w-10 rounded-sm bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>

      </WideContainer>


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
  )
}
