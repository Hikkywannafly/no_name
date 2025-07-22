import { fetchChapterList, fetchChapterPages } from "@/provider/SourceManager";
import type { UChapter, UPage } from "@/types/manga";
import { useEffect, useState } from "react";

export default function useChapterData(
  source: string,
  mangaId: string,
  chapterId: string,
) {
  const [data, setData] = useState<{
    chapters: UPage[];
    chapterList: UChapter[];
    isLoading: boolean;
    error: any;
  }>({
    chapters: [],
    chapterList: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setData({ chapters: [], chapterList: [], isLoading: true, error: null });
      try {
        const [chapters, chapterList] = await Promise.all([
          fetchChapterPages(source, chapterId),
          fetchChapterList(source, mangaId),
        ]);
        if (!cancelled)
          setData({ chapters, chapterList, isLoading: false, error: null });
      } catch (error) {
        if (!cancelled)
          setData({ chapters: [], chapterList: [], isLoading: false, error });
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [source, mangaId, chapterId]);

  return data;
}
