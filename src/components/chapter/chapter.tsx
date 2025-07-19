"use client";
import ChapterImage from "@/components/chapter/chapterImg";
import Image from "@/components/shared/image";
import useCuuTruyenChapter from "@/hooks/CuuTruyen/useCuuTruyenChapter";
import useTruyenQQChapter from "@/hooks/TruyenQQ/useTruyenQQChapter";
import type { UPage } from "@/types/manga";
import { memo } from "react";

interface ChapterProps {
  mangaId: string;
  source?: string;
  prefetchManga?: any;
  nextChapter?: string;
  prevChapter?: string;
}

export const Chapter = memo(function Manga(props: ChapterProps) {
  const { mangaId, source } = props;

  let chapters: UPage[] = [];
  if (source === "source1") {
    const { data: cuuTruyenChapters } = useCuuTruyenChapter(mangaId.toString());
    chapters = cuuTruyenChapters;
  } else if (source === "source2") {
    const { data: truyenQQChapters } = useTruyenQQChapter(mangaId);
    chapters = truyenQQChapters;
    console.log("TruyenQQ Chapters:", truyenQQChapters);
  }
  return (
    <div className="container flex flex-col items-center justify-center p-4">
      <h1>Chapter</h1>
      <p>Manga ID: {mangaId}</p>
      <p>Source: {source}</p>
      <p>Next Chapter: {props.nextChapter}</p>
      {chapters && chapters.length > 0 ? (
        <ul
          className={source === "source1" ? "flex w-full flex-wrap gap-4" : ""}
        >
          {chapters.map((chapter: any) => (
            <li key={chapter.id}>
              {source === "source1" ? (
                <ChapterImage
                  imageUrl={chapter.url}
                  drmData={chapter.drmData}
                  title={chapter.title || "Chapter Image"}
                  width={1024}
                  height={1469}
                />
              ) : (
                <Image
                  src={`/api/proxy?url=${chapter.url}&referer=https://truyenqqgo.com`}
                  alt={chapter.title || "Chapter Image"}
                  width={1024}
                  height={1469}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No chapters available.</p>
      )}
    </div>
  );
});
