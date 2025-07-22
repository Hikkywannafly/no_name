"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReaderControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  readingMode: string;
  nextChapter?: string;
  prevChapter?: string;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export default function ReaderControls({
  currentPage,
  totalPages,
  onPageChange,
  readingMode,
  onNextChapter,
  onPrevChapter,
}: ReaderControlsProps) {
  if (readingMode === "vertical") {
    return null;
  }

  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="pointer-events-auto absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-4">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2 bg-gray-700" />
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Page {currentPage + 1}</span>
            <span>{totalPages} pages</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={onPrevChapter}
            disabled={!onPrevChapter}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev Chapter
          </Button>

          <div className="mx-4 flex max-w-md flex-1 items-center gap-4">
            <span className="whitespace-nowrap text-sm text-white">
              {currentPage + 1}
            </span>
            <Slider
              value={[currentPage]}
              onValueChange={(value) => onPageChange(value[0])}
              max={totalPages - 1}
              min={0}
              step={1}
              className="flex-1"
            />
            <span className="whitespace-nowrap text-sm text-white">
              {totalPages}
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={onNextChapter}
            disabled={!onNextChapter}
          >
            Next Chapter
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
