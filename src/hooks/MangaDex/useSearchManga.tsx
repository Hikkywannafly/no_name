import { MangadexApi } from "@/provider";
import type { ExtendManga, MangaList } from "@/types/mangadex";
import { extendRelationship } from "@/utils/mangadex";
import { useMemo } from "react";
import useSWR from "swr/immutable";

export const useSearchManga = (
  options: MangadexApi.Manga.GetSearchMangaRequestOptions,

  { enabled }: { enabled: boolean } = { enabled: true },
) => {
  if (options.title) {
    options.title = encodeURIComponent(options.title);
  }
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? ["search-manga", options] : null,
    () => MangadexApi.Manga.getSearchManga(options),
  );
  const success = data && data.data.result === "ok" && (data.data as MangaList);
  const mangaList = useMemo(() => {
    if (success) {
      return success.data.map(
        (data) => extendRelationship(data) as ExtendManga,
      );
    }
    return [];
  }, [success]);
  return { data, error, isLoading, mutate, mangaList };
};
