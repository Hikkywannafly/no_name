"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Constants } from "@/constants";
import { useChapter } from "@/context/useChapter";
import { ChevronDown, ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChapterNavigationProps {
  anilistId: string;
  mangaId: string;
  sourceId: string;
  currentChapterId: string;
  nextChapter?: string;
  prevChapter?: string;
}

// Scrolling text component for long titles
const ScrollingText = ({
  text,
  className,
}: { text: string; className?: string }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <span className="block whitespace-nowrap transition-transform duration-1000 ease-linear hover:animate-scroll">
        {text}
      </span>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% + 100px)); }
        }
        .hover\\:animate-scroll:hover {
          animation: scroll 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default function ChapterNavigation({
  anilistId,
  currentChapterId,
  mangaId,
  sourceId,
}: ChapterNavigationProps) {
  const { chapterList } = useChapter();
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);
  const router = useRouter();

  const currentChapterInfo = chapterList.find(
    (ch) => ch.id === currentChapterId,
  );
  const currentChapterIndex = chapterList.findIndex(
    (ch) => ch.id === currentChapterId,
  );

  const prevChapterFromList =
    currentChapterIndex > 0 ? chapterList[currentChapterIndex - 1] : null;
  const nextChapterFromList =
    currentChapterIndex < chapterList.length - 1
      ? chapterList[currentChapterIndex + 1]
      : null;

  const handleChapterSelect = (chapterId: string) => {
    router.push(
      Constants.router.chapter(anilistId, mangaId, chapterId, sourceId),
    );
    setIsChapterListOpen(false);
  };

  return (
    <div className="pointer-events-auto absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Chapter */}
          <div className="flex items-center gap-2">
            {prevChapterFromList ? (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="bg-black text-white"
              >
                <Link
                  href={Constants.router.chapter(
                    anilistId,
                    mangaId,
                    prevChapterFromList.id,
                    sourceId,
                  )}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Trước
                </Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="bg-black text-gray-500"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Trước
              </Button>
            )}
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            {/* Chapter Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black text-white"
                >
                  Chương {currentChapterInfo?.number}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 border-gray-700 bg-black text-white"
                style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                {chapterList.map((chapter, index) => (
                  <DropdownMenuItem
                    key={chapter.id + index}
                    className={`cursor-pointer ${
                      chapter.id === currentChapterId
                        ? "bg-[#31042b] text-white hover:bg-[#693c63]"
                        : "text-white hover:bg-gray-700"
                    }`}
                    onClick={() => handleChapterSelect(chapter.id)}
                  >
                    <div className="flex w-full flex-col items-start">
                      <div className="flex w-full flex-row justify-between">
                        <span className="font-medium">
                          Chương {chapter.number}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {chapter.createdAt}
                        </span>
                      </div>

                      {chapter.title && (
                        <ScrollingText
                          text={chapter.title}
                          className="w-full text-gray-400 text-sm"
                        />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Chapter List Dialog */}
            <Dialog
              open={isChapterListOpen}
              onOpenChange={setIsChapterListOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black text-white"
                >
                  <List className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-1 text-white">
                <DialogHeader className="py-2">
                  <DialogTitle className="text-center font-bold text-xl">
                    Danh sách chương
                  </DialogTitle>
                </DialogHeader>
                <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-1 p-2">
                    {chapterList.map((chapter, index) => (
                      <div
                        key={chapter.id + index}
                        className={`group relative rounded-sm transition-all duration-200 hover:shadow-lg ${
                          chapter.id === currentChapterId
                            ? " bg-[#31042b] shadow-purple-500/20"
                            : " hover:bg-gray-700/50"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          className="h-auto w-full justify-start p-4 text-left hover:bg-transparent"
                          onClick={() => handleChapterSelect(chapter.id)}
                        >
                          <div className="flex w-full flex-col items-start space-y-1">
                            <div className="flex w-full items-center justify-between">
                              <span className="font-semibold text-white">
                                Chương {chapter.number}
                              </span>
                              <span className="ml-2 text-gray-400 text-xs">
                                {chapter.createdAt}
                              </span>
                            </div>
                            {chapter.title && (
                              <div className="w-full overflow-hidden">
                                <div className="relative">
                                  <span
                                    className="block whitespace-nowrap text-gray-300 text-sm transition-transform duration-3000 ease-linear group-hover:animate-marquee"
                                    style={{
                                      animation: "none",
                                    }}
                                    onMouseEnter={(e) => {
                                      const element = e.currentTarget;
                                      const containerWidth =
                                        element.parentElement?.offsetWidth || 0;
                                      const textWidth = element.scrollWidth;
                                      if (textWidth > containerWidth) {
                                        element.style.animation =
                                          "marquee 4s linear infinite";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.animation = "none";
                                    }}
                                  >
                                    {chapter.title}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Next Chapter */}
          <div className="flex items-center gap-2">
            {nextChapterFromList ? (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="bg-black text-white"
              >
                <Link
                  href={Constants.router.chapter(
                    anilistId,
                    mangaId,
                    nextChapterFromList.id,
                    sourceId,
                  )}
                >
                  Tiếp
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="bg-black text-gray-500"
              >
                Tiếp
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
