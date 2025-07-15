import { MangadexApi } from "@/provider";
import type { ExtendChapter } from "@/types/mangadex";
import { extendRelationship } from "@/utils/mangadex";
import useSWR from "swr";

export const chaptersPerPage = 20;

export default function useChapterList(
  mangaId: string,
  options: MangadexApi.Manga.GetMangaIdFeedRequestOptions,
) {
  if (!options.translatedLanguage) options.translatedLanguage = ["vi"];
  options.includes = [
    MangadexApi.Static.Includes.SCANLATION_GROUP,
    MangadexApi.Static.Includes.USER,
  ];
  options.order = {
    volume: MangadexApi.Static.Order.DESC,
    chapter: MangadexApi.Static.Order.DESC,
  };
  if (!options.contentRating)
    options.contentRating = [
      MangadexApi.Static.MangaContentRating.EROTICA,
      MangadexApi.Static.MangaContentRating.PORNOGRAPHIC,
      MangadexApi.Static.MangaContentRating.SAFE,
      MangadexApi.Static.MangaContentRating.SUGGESTIVE,
    ];
  options.limit = chaptersPerPage;
  if (options.offset && options.offset > 10000) {
    options.offset = 10000 - options.limit;
  }
  const { data, isLoading, error } = useSWR([mangaId, options], () =>
    MangadexApi.Manga.getMangaIdFeed(mangaId, options),
  );
  if (data?.data.data) {
    for (const c of data.data.data) {
      extendRelationship(c);
    }
  }
  return {
    chapters: (data?.data.data || []) as ExtendChapter[],
    data,
    isLoading,
    error,
  };
}
