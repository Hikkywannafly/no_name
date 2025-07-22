import { fetchChapterList, fetchChapterPages } from "@/provider/SourceManager";
import type { } from "@/types/manga";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";

export default function useChapterData(
  source: string,
  mangaId: string,
  chapterId: string,
) {
  // Fetch chapter list (cache theo mangaId)
  const { data: chapterList = [], isLoading: isChapterListLoading, error: chapterListError } = useSWR(
    mangaId ? [source, "chapterList", mangaId] : null,
    () => fetchChapterList(source, mangaId)
  );

  // Fetch chapter pages (cache theo chapterId)
  const { data: chapters = [], isLoading: isChaptersLoading, error: chaptersError } = useSWR(
    chapterId ? [source, "chapterPages", chapterId] : null,
    () => fetchChapterPages(source, chapterId)
  );

  // Prefetch 3 chương tiếp theo
  useEffect(() => {
    if (!chapterList.length) return;
    const currentIndex = chapterList.findIndex(ch => ch.id === chapterId);
    for (let i = 1; i <= 3; i++) {
      const nextChapter = chapterList[currentIndex + i];
      if (nextChapter) {
        mutate(
          [source, "chapterPages", nextChapter.id],
          fetchChapterPages(source, nextChapter.id),
          false
        );
      }
    }
  }, [chapterList, chapterId, source]);

  return {
    chapters,
    chapterList,
    isLoading: isChapterListLoading || isChaptersLoading,
    error: chapterListError || chaptersError,
  };
}
