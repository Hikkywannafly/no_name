"use client";
import HorizontalChapterPagination from "@/components/manga/chapterPagition";
import useCuuTruyenChapterList from "@/hooks/CuuTruyen/useCuuTruyenData";
import useChapterList from "@/hooks/MangaDex/useChapterList";
// import { Separator } from "@/components/ui/separator"

interface ChapterProps {
  mangaId: string;
  name: string;
}
// const tags = Array.from({ length: 50 }).map((_, i, a) => `${a.length - i}`);

export function Chapter(props: ChapterProps) {
  const { mangaId, name } = props;
  const { chapters: data } = useCuuTruyenChapterList(name);
  const { chapters: data2 } = useChapterList(mangaId, {});
  console.log("test chapter manga", name, mangaId, data, data2);
  return (
    <HorizontalChapterPagination
      chapters={
        data
      }
    />
  );
}
