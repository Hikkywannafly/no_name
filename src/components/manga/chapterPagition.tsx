"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {} from "@/components/ui/select";
import { Constants } from "@/constants";

import type { UChapter } from "@/types/manga";
import { groupChaptersIntoRanges } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
interface HorizontalChapterPaginationProps {
  chapters: UChapter[];
  onChapterSelect?: (chapter: UChapter) => void;
  rangeSize?: number;
}

export default function HorizontalChapterPagination({
  chapters,
  onChapterSelect,
  rangeSize = 10,
}: HorizontalChapterPaginationProps) {
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);
  const [chapterRanges, setChapterRanges] = useState<
    {
      label: string;
      startChapter: number;
      endChapter: number;
      chapters: UChapter[];
    }[]
  >([]);

  useEffect(() => {
    const ranges = groupChaptersIntoRanges(chapters, rangeSize);
    setChapterRanges(ranges);
  }, [chapters, rangeSize]);

  const handleRangeSelect = (index: number) => {
    setSelectedRangeIndex(index);
  };

  const handleChapterClick = (chapter: any) => {
    onChapterSelect?.(chapter);
  };

  if (chapterRanges.length === 0) {
    return <div className="text-white">Không có chương nào :( </div>;
  }

  const currentRange = chapterRanges[selectedRangeIndex];
  return (
    <div className="w-full text-white">
      <div className="mb-6">
        <ScrollArea className="w-full whitespace-nowrap pb-3">
          <div className="flex space-x-2 p-2">
            {chapterRanges.map((range, index) => (
              <Button
                key={`${range.startChapter}-${range.endChapter}-${index}`}
                variant={selectedRangeIndex === index ? "default" : "secondary"}
                className={`flex-shrink-0 rounded px-4 py-2 font-medium text-sm transition-colors ${
                  selectedRangeIndex === index
                    ? "bg-red-600 text-white "
                    : "bg-black/50 text-white "
                }`}
                onClick={() => handleRangeSelect(index)}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-gray-800" />
        </ScrollArea>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {currentRange?.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              className="no-underline"
              href={Constants.router.chapter(
                chapter.id,
                chapter.sourceName || "undefined",
              )}
            >
              <Card
                key={chapter.id}
                className="cursor-pointer bg-black/50 p-4 transition-colors hover:bg-gray-700"
                onClick={() => handleChapterClick(chapter)}
              >
                <div className="group flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      Chương {chapter.number}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {chapter.createdAt || "Unknown"}
                    </span>
                  </div>
                  {chapter.title && (
                    <div className=" relative overflow-hidden">
                      <div className="group-hover:-translate-x-full transform whitespace-nowrap text-gray-300 text-sm transition-transform duration-[4000ms] ease-linear ">
                        {chapter.title}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <span>{chapter.scanlator}</span>
                    {/* <span className="capitalize">{chapter.sourceName}</span> */}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
