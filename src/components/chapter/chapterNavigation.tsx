"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Constants } from "@/constants"
import { useChapter } from "@/context/useChapter"
import { ChevronLeft, ChevronRight, List, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ChapterNavigationProps {
    anilistId?: string
    currentChapterId: string
    nextChapter?: string
    prevChapter?: string
}

export default function ChapterNavigation({
    anilistId,
    currentChapterId,
    // nextChapter,
    // prevChapter,
}: ChapterNavigationProps) {
    const { chapterList, currentPage, setCurrentPage, chapters } = useChapter()
    const [showChapterList, setShowChapterList] = useState(false)

    // Find current chapter info
    const currentChapterInfo = chapterList.find((ch) => ch.id === currentChapterId)
    const currentChapterIndex = chapterList.findIndex((ch) => ch.id === currentChapterId)

    // Get next and previous chapters from the list
    const nextChapterFromList = currentChapterIndex > 0 ? chapterList[currentChapterIndex - 1] : null
    const prevChapterFromList = currentChapterIndex < chapterList.length - 1 ? chapterList[currentChapterIndex + 1] : null

    const handlePageSelect = (pageNumber: string) => {
        const page = Number.parseInt(pageNumber) - 1
        setCurrentPage(page)
    }

    const handleChapterSelect = (chapterId: string) => {
        if (anilistId) {
            // Navigate to selected chapter
            window.location.href = Constants.router.chapter(anilistId, chapterId, "source1")
        }
    }

    return (
        <>
            {/* Chapter Navigation Bar */}
            <div className="pointer-events-auto absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <div className="mx-auto max-w-4xl">
                    {/* Chapter Info */}
                    <div className="mb-4 text-center">
                        <h2 className="font-semibold text-lg text-white">
                            {currentChapterInfo?.title || `Chapter ${currentChapterInfo?.number || currentChapterId}`}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Page {currentPage + 1} of {chapters.length}
                        </p>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Previous Chapter */}
                        <div className="flex items-center gap-2">
                            {prevChapterFromList ? (
                                <Link
                                    href={Constants.router.chapter(anilistId || "", prevChapterFromList.id, "source1")}
                                    className="no-underline"
                                >
                                    <Button variant="secondary" size="sm" className="bg-gray-800 text-white hover:bg-gray-700">
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Prev
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="secondary" size="sm" disabled className="bg-gray-800 text-gray-500">
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Prev
                                </Button>
                            )}
                        </div>

                        {/* Page Selector */}
                        <div className="flex items-center gap-2">
                            <Select value={(currentPage + 1).toString()} onValueChange={handlePageSelect}>
                                <SelectTrigger className="w-20 border-gray-600 bg-gray-800 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-gray-600 bg-gray-800 text-white">
                                    {chapters.map((_, index) => (
                                        <SelectItem key={index} value={(index + 1).toString()}>
                                            {index + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Chapter List Button */}
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-gray-800 text-white hover:bg-gray-700"
                                onClick={() => setShowChapterList(true)}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Next Chapter */}
                        <div className="flex items-center gap-2">
                            {nextChapterFromList ? (
                                <Link
                                    href={Constants.router.chapter(anilistId || "", nextChapterFromList.id, "source1")}
                                    className="no-underline"
                                >
                                    <Button variant="secondary" size="sm" className="bg-gray-800 text-white hover:bg-gray-700">
                                        Next
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="secondary" size="sm" disabled className="bg-gray-800 text-gray-500">
                                    Next
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapter List Modal */}
            {showChapterList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <Card className="max-h-[80vh] w-full max-w-2xl border-gray-700 bg-gray-900 text-white">
                        <div className="flex items-center justify-between border-gray-700 border-b p-4">
                            <h3 className="font-semibold text-lg">Select Chapter</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowChapterList(false)}
                                className="text-white hover:bg-gray-800"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <ScrollArea className="max-h-96 p-4">
                            <div className="space-y-2">
                                {chapterList.map((chapter, index) => (
                                    <Button
                                        key={chapter.id + index}
                                        variant={chapter.id === currentChapterId ? "default" : "ghost"}
                                        className={`w-full justify-start text-left ${chapter.id === currentChapterId ? "bg-red-600 text-white" : "text-white hover:bg-gray-800"
                                            }`}
                                        onClick={() => {
                                            handleChapterSelect(chapter.id)
                                            setShowChapterList(false)
                                        }}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">Chapter {chapter.number}</span>
                                            {chapter.title && <span className="text-gray-400 text-sm">{chapter.title}</span>}
                                            <span className="text-gray-500 text-xs">{chapter.createdAt}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>
            )}
        </>
    )
}
