import { getPageMedia } from "@/provider/Anilist/index";
import {
  type MediaFormat,
  type MediaSort,
  MediaSort as MediaSortEnum,
  type MediaStatus,
  MediaType,
} from "@/types/anilist";
import useSWRInfinite from "swr/infinite";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: string[];
  format?: MediaFormat;
  limit?: number;
  tags?: string[];
  sort?: MediaSort;
  country?: string;
  status?: MediaStatus;
  isAdult?: boolean;
}

const getKey = (
  options: UseBrowseOptions,
  pageIndex: number,
  previousPageData: any,
) => {
  if (previousPageData && !previousPageData.media?.length) return null;
  return ["browse-manga", options, pageIndex + 1];
};

const useBrowse = (options: UseBrowseOptions) => {
  const {
    format,
    genres = [],
    keyword,
    sort,
    limit = 20,
    tags = [],
    country,
    status,
    isAdult,
  } = options;

  const fetcher = async (
    _key: any,
    _options: UseBrowseOptions,
    page: number,
  ) => {
    try {
      console.log("Fetching manga with options:", {
        type: MediaType.Manga,
        format,
        perPage: limit,
        countryOfOrigin: country,
        sort: [sort || MediaSortEnum.Popularity],
        status,
        page,
        ...(tags.length && { tag_in: tags }),
        ...(genres.length && { genre_in: genres }),
        ...(keyword && { search: keyword }),
        isAdult:
          isAdult || genres.includes("Hentai") || genres.includes("Ecchi"),
      });

      const result = await getPageMedia({
        type: MediaType.Manga,
        format,
        perPage: limit,
        // countryOfOrigin: country,
        // sort: [sort || MediaSortEnum.Popularity],
        status,
        page,
        // ...(tags.length && { tag_in: tags }),
        // ...(genres.length && { genre_in: genres }),
        // ...(keyword && { search: keyword }),
        // isAdult: isAdult || genres.includes("Hentai") || genres.includes("Ecchi"),
      });

      console.log("AniList API response:", result);
      return result;
    } catch (error) {
      console.error("Error fetching manga from AniList:", error);
      throw error;
    }
  };

  const swr = useSWRInfinite(
    (pageIndex, previousPageData) =>
      getKey(options, pageIndex, previousPageData),
    fetcher,
    {
      revalidateFirstPage: false,
    },
  );

  return {
    ...swr,
    data: swr.data,
    fetchNextPage: () => swr.setSize(swr.size + 1),
    hasNextPage:
      swr.data?.[swr.data.length - 1]?.pageInfo?.hasNextPage ?? false,
    isLoading: swr.isLoading,
    isValidating: swr.isValidating,
  };
};

export default useBrowse;
