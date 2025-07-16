import { MangadexApi } from "@/provider";
import { useMemo } from "react";
import useSWR from "swr/immutable";

const useSearchMangaByName = (
  options: MangadexApi.Manga.GetSearchMangaRequestOptions,
  { enabled }: { enabled: boolean } = { enabled: true },
) => {
  if (options.title) {
    options.title = encodeURIComponent(options.title);
  }

  const { data, error, isLoading } = useSWR(
    enabled ? ["search-manga", options] : null,
    () => MangadexApi.Manga.getSearchManga(options),
  );

  const mangaList = useMemo(() => {
    if (data?.data?.result === "ok") {
      return data.data.data.map((item: any) => {
        const attr = item.attributes;
        return {
          name: attr.title?.vi || Object.values(attr.title)[0],
          description:
            attr.description?.vi || Object.values(attr.description)[0] || "",
        };
      });
    }
    return [];
  }, [data]);

  return { error, isLoading, mangaList };
};

export default useSearchMangaByName;
