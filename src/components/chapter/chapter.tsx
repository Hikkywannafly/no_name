"use client";
import ChapterImage from "@/components/chapter/chapterImg";
// import Image from "@/components/shared/image";
import useCuuTruyenChapter from "@/hooks/CuuTruyen/useCuuTruyenChapter";
import { memo } from "react";
interface ChapterProps {
  mangaId: number;
  source?: string;
  prefetchManga?: any;
  nextChapter?: string;
  prevChapter?: string;
}

export const Chapter = memo(function Manga(props: ChapterProps) {
  const { mangaId } = props;
  const { data: chapters } = useCuuTruyenChapter(mangaId.toString());

  console.log("Chapters Data:", chapters);

  return (
    <div>
      <h1>Chapter</h1>
      <p>Manga ID: {props.mangaId}</p>
      <p>Source: {props.source}</p>
      <p>Next Chapter: {props.nextChapter}</p>
      {/* {
                chapters && chapters.length > 0 ? (
                    <ul>
                        {chapters.map((chapter: any) => (
                            <li key={chapter.id}>

                                <Image
                                    src={chapter.imageUrl}
                                    alt={chapter.title || "Chapter Image"}
                                    width={200}
                                    height={300}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No chapters available.</p>
                )
            } */}
      {chapters && chapters.length > 0 ? (
        <ul className="flex flex-wrap gap-4">
          {chapters.map((chapter: any) => (
            <li key={chapter.id}>
              <ChapterImage
                imageUrl={chapter.imageUrl}
                drmData={chapter.drmData}
                title={chapter.title || "Chapter Image"}
                width={1024}
                height={1469}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No chapters available.</p>
      )}
    </div>
  );
});
