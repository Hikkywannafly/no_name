import { MangadexApi } from "@/provider";
import useSearchManga from "./useSearchManga";
const useFeaturedManga = (
  options?: MangadexApi.Manga.GetSearchMangaRequestOptions,
) => {
  // 1 month ago
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return useSearchManga({
    includes: [
      MangadexApi.Static.Includes.COVER_ART,
      MangadexApi.Static.Includes.ARTIST,
      MangadexApi.Static.Includes.AUTHOR,
    ],
    order: {
      followedCount: MangadexApi.Static.Order.DESC,
    },
    createdAtSince: `${oneMonthAgo.toISOString().slice(0, -13)}00:00:00`,
    limit: 12,
    availableTranslatedLanguage: ["vi"],
    hasAvailableChapters: "true",
    ...options,
  });
};

export default useFeaturedManga;
