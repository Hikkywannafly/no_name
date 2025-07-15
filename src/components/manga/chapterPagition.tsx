"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { } from "@/components/ui/select"
// import type { Chapter, ChapterRange } from "../types/chapter"
import { formatUploadDate, groupChaptersIntoRanges } from "@/utils"
import { useEffect, useState } from "react"

interface HorizontalChapterPaginationProps {
    chapters: any
    onChapterSelect?: (chapter: any) => void
    rangeSize?: number
}

export default function HorizontalChapterPagination({
    chapters,
    onChapterSelect,
    rangeSize = 10,
}: HorizontalChapterPaginationProps) {
    const [selectedRangeIndex, setSelectedRangeIndex] = useState(0)
    const [chapterRanges, setChapterRanges] = useState<any[]>([])

    useEffect(() => {
        const ranges = groupChaptersIntoRanges(chapters, rangeSize)
        setChapterRanges(ranges)
    }, [chapters, rangeSize])

    const handleRangeSelect = (index: number) => {
        setSelectedRangeIndex(index)
    }

    const handleChapterClick = (chapter: any) => {
        onChapterSelect?.(chapter)
    }

    if (chapterRanges.length === 0) {
        return <div className="text-white">Loading chapters...</div>
    }


    return (
        <div className="w-full text-white">

            {/* Horizontal Scrollable Range Pagination */}
            <div className="mb-6">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-2 p-2">
                        {chapterRanges.map((range, index) => (
                            <Button
                                key={`${range.startChapter}-${range.endChapter}`}
                                variant={selectedRangeIndex === index ? "default" : "secondary"}
                                className={`flex-shrink-0 rounded px-4 py-2 font-medium text-sm transition-colors ${selectedRangeIndex === index
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-gray-700 text-white hover:bg-gray-600"
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
                {/* <h3 className="mb-4 font-semibold text-lg">Chapters {chapterRanges[selectedRangeIndex]?.label}</h3> */}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {chapterRanges[selectedRangeIndex]?.chapters.map((chapter: any) => (
                        <Card
                            key={chapter.id}
                            className="cursor-pointer border-gray-700 bg-gray-800 p-4 transition-colors hover:bg-gray-700"
                            onClick={() => handleChapterClick(chapter)}
                        >
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-white">Chapter {chapter.number}</span>
                                    <span className="text-gray-400 text-xs">{formatUploadDate(chapter.uploadDate)}</span>
                                </div>

                                {chapter.title && <div className="text-gray-300 text-sm">{chapter.title}</div>}

                                <div className="flex items-center justify-between text-gray-500 text-xs">
                                    <span>{chapter.scanlator}</span>
                                    <span className="capitalize">{chapter.source}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
