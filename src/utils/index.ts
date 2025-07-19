// import type { Chapter, ChapterRange } from "../types/chapter"
import type { Manga, MangaChapter } from "@/provider/CuuTruyen/type";
import type { Media } from "@/types/anilist";
import type { UChapter } from "@/types/manga";
import type { ExtendChapter, ExtendManga } from "@/types/mangadex";
import type { UnifiedChapter, UnifiedManga } from "@/types/unified";
import { getCoverArt, getMangaTitle } from "@/utils/mangadex";
// export function groupChaptersIntoRanges(
//   chapters: any | MangaChapter[],
//   rangeSize = 10,
// ): any[] | MangaChapter[] {
//   // Sort chapters by number
//   const sortedChapters = [...chapters].sort((a, b) => {
//     const numA = Number.parseFloat(a.number) || 0;
//     const numB = Number.parseFloat(b.number) || 0;
//     return numA - numB;
//   });

//   const ranges: any[] = [];

//   for (let i = 0; i < sortedChapters.length; i += rangeSize) {
//     const rangeChapters = sortedChapters.slice(i, i + rangeSize);
//     const startNum = Number.parseFloat(rangeChapters[0].number) || 1;
//     const endNum =
//       Number.parseFloat(rangeChapters[rangeChapters.length - 1].number) || 1;

//     ranges.push({
//       label: startNum === endNum ? `${startNum}` : `${startNum} - ${endNum}`,
//       startChapter: startNum,
//       endChapter: endNum,
//       chapters: rangeChapters,
//     });
//   }

//   return ranges;
// }
export function groupChaptersIntoRanges(
  chapters: UChapter[],
  rangeSize = 10,
): {
  label: string;
  startChapter: number;
  endChapter: number;
  chapters: UChapter[];
}[] {
  const sortedChapters = [...chapters].sort((a, b) => {
    const numA = Number.parseFloat(String(a.number)) || 0;
    const numB = Number.parseFloat(String(b.number)) || 0;
    return numA - numB;
  });

  const ranges = [];

  for (let i = 0; i < sortedChapters.length; i += rangeSize) {
    const rangeChapters = sortedChapters.slice(i, i + rangeSize);
    const startNum = Number.parseFloat(String(rangeChapters[0].number)) || 1;
    const endNum = Number.parseFloat(
      String(rangeChapters[rangeChapters.length - 1].number),
    ) || 1;

    ranges.push({
      label: startNum === endNum ? `${startNum}` : `${startNum} - ${endNum}`,
      startChapter: startNum,
      endChapter: endNum,
      chapters: rangeChapters,
    });
  }

  return ranges;
}
export function formatUploadDate(dateString: string): string | null {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function convertMangaDexChapters(
  chapters: ExtendChapter[],
): UnifiedChapter[] | any[] {
  return chapters.map((chap) => ({
    id: chap.id,
    title: chap.attributes.title || "",
    number: Number(chap.attributes.chapter) || 0,
    source: "mangadex",
    chapterId: chap.id,
  }));
}

// export function convertCuuTruyen(
//   manga: Manga & { chapters: UChapterSource[] },
// ): UnifiedManga {
//   return {
//     id: manga.id,
//     title: manga.title,
//     coverUrl: manga.coverUrl,
//     description: manga.description,
//     source: "cuutruyen",
//     chapters: (manga.chapters || []).map((chapterSource) => ({
//       id: chapterSource.id,
//       chapterId: chapterSource.id,
//       title: chapterSource.title || "",
//       number: chapterSource.number,
//       source: chapterSource.source,
//       extraData: {
//         sourceId: chapterSource.id,
//         sourceUrl: chapterSource.url,
//         scanlator: chapterSource.scanlator,
//         uploadDate: chapterSource.uploadDate,
//         pageCount: chapterSource.number,
//         isActive: true,
//         createdAt: chapterSource.uploadDate,
//       },
//     })),
//   };
// }

export function convertCuuTruyen1(manga: Manga): UnifiedManga {
  return {
    id: manga.id,
    title: manga.title,
    coverUrl: manga.coverUrl,
    description: manga.description,
    source: "cuutruyen",
    chapters: (manga.chapters || []).map((chapter: MangaChapter) => ({
      id: chapter.id,
      chapterId: chapter.id,
      title: chapter.title || "",
      number: chapter.number,
      source: "cuutruyen",
      extraData: {
        url: chapter.url,
        scanlator: chapter.scanlator,
        uploadDate: chapter.uploadDate,
        volume: chapter.volume,
        branch: chapter.branch,
      },
    })),
  };
}

export function convertMangaDex(
  manga: ExtendManga,
  chapters: ExtendChapter[] = [],
): UnifiedManga {
  return {
    id: manga.id,
    title: getMangaTitle(manga).toString(),
    coverUrl: getCoverArt(manga),
    description:
      manga.attributes.description.vi ||
      manga.attributes.description.en ||
      Object.values(manga.attributes.description)[0] ||
      null,
    source: "mangadex",
    chapters: convertMangaDexChapters(chapters),
  };
}

export const getTitle = (data: Media, locale?: string) => {
  const translations = data?.translations || [];

  const translation = translations.find((trans) => trans.locale === locale);

  if (!translation) {
    return data?.title?.userPreferred;
  }

  return translation.title || data?.title?.userPreferred;
};

export function numberWithCommas(x: any): any {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
