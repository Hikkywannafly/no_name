"use client"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ReaderControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  readingMode: string
  nextChapter?: string
  prevChapter?: string
}

export default function ReaderControls({
  currentPage,
  totalPages,
  onPageChange,
  readingMode,
  nextChapter,
  prevChapter,
}: ReaderControlsProps) {
  if (readingMode === "vertical") {
    return null // No controls needed for vertical mode
  }

  return (
    <div className="pointer-events-auto absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="text-white" disabled={!prevChapter}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Prev Chapter
        </Button>

        <div className="mx-4 flex max-w-md flex-1 items-center gap-4">
          <span className="whitespace-nowrap text-sm text-white">{currentPage + 1}</span>
          <Slider
            value={[currentPage]}
            onValueChange={(value) => onPageChange(value[0])}
            max={totalPages - 1}
            min={0}
            step={1}
            className="flex-1"
          />
          <span className="whitespace-nowrap text-sm text-white">{totalPages}</span>
        </div>

        <Button variant="ghost" size="sm" className="text-white" disabled={!nextChapter}>
          Next Chapter
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
