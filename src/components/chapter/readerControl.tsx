"use client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";

interface ReaderControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  readingMode: string;
  nextChapter?: string;
  prevChapter?: string;
}

export default function ReaderControls({
  currentPage,
  totalPages,
  onPageChange,
  readingMode,
  nextChapter,
  prevChapter,
}: ReaderControlsProps) {
  const handleSliderChange = (value: number[]) => {
    onPageChange(value[0] - 1);
  };

  return (
    <div className="pointer-events-auto absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="mx-auto max-w-4xl">
        {/* Page navigation for single-page mode */}
        {readingMode === "single-page" && (
          <div className="mb-4 flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>

            <div className="flex items-center gap-2 text-sm text-white">
              <span>{currentPage + 1}</span>
              <span>/</span>
              <span>{totalPages}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() =>
                onPageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Page slider */}
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-white">1</span>
          <Slider
            value={[currentPage + 1]}
            onValueChange={handleSliderChange}
            max={totalPages}
            min={1}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-white">{totalPages}</span>
        </div>

        {/* Chapter navigation */}
        <div className="flex items-center justify-between">
          <div>
            {prevChapter && (
              <Link href={`/chapter/${prevChapter}`}>
                <Button variant="ghost" size="sm" className="text-white">
                  <SkipBack className="mr-1 h-4 w-4" />
                  Previous Chapter
                </Button>
              </Link>
            )}
          </div>

          <div className="text-center text-sm text-white">
            <div>
              Page {currentPage + 1} of {totalPages}
            </div>
            <div className="text-gray-400 text-xs">
              {Math.round(((currentPage + 1) / totalPages) * 100)}% complete
            </div>
          </div>

          <div>
            {nextChapter && (
              <Link href={`/chapter/${nextChapter}`}>
                <Button variant="ghost" size="sm" className="text-white">
                  Next Chapter
                  <SkipForward className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
