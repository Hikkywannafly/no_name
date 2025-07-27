import { getPageMedia } from "@/provider/Anilist/index";
import {
  type MediaFormat,
  MediaFormat as MediaFormatEnum,
  // type MediaSeason,
  // MediaSeason as MediaSeasonEnum,
  type MediaSort,
  MediaSort as MediaSortEnum,
  type MediaStatus,
  MediaStatus as MediaStatusEnum,
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
  year?: number;
  seasonYear?: number;
  type?: string;
}

const getKey = (
  options: UseBrowseOptions,
  pageIndex: number,
  previousPageData: any,
) => {
  if (previousPageData && !previousPageData.media?.length) return null;
  return ["browse-manga", options, pageIndex + 1];
};

// Map frontend sort values to Anilist MediaSort
const mapSortToMediaSort = (sort: string): MediaSort => {
  switch (sort) {
    case "latest":
      return MediaSortEnum.Updated_at_desc;
    case "name_asc":
      return MediaSortEnum.Title_romaji;
    case "name_desc":
      return MediaSortEnum.Title_romaji_desc;
    case "score":
      return MediaSortEnum.Score_desc;
    case "popularity":
      return MediaSortEnum.Popularity_desc;
    default:
      return MediaSortEnum.Popularity;
  }
};

// Map frontend type values to Anilist MediaFormat
const mapTypeToMediaFormat = (type: string): MediaFormat | undefined => {
  switch (type) {
    case "manga":
      return MediaFormatEnum.Manga;
    case "novel":
      return MediaFormatEnum.Novel;
    case "one_shot":
      return MediaFormatEnum.One_shot;
    default:
      return undefined;
  }
};

const mapStatusToMediaStatus = (status: string): MediaStatus | undefined => {
  switch (status) {
    case "completed":
      return MediaStatusEnum.Finished;
    case "releasing":
      return MediaStatusEnum.Releasing;
    case "cancelled":
      return MediaStatusEnum.Cancelled;
    case "hiatus":
      return MediaStatusEnum.Hiatus;
    case "not_yet_released":
      return MediaStatusEnum.Not_yet_released;
  }
  return undefined;
};

const mapCountryToMediaCountry = (country: string): string | undefined => {
  switch (country) {
    case "jp":
      return "JP";
    case "kr":
      return "KR";
    case "cn":
      return "CN";
    case "tw":
      return "TW";
  }
  return undefined;
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
    isAdult = true,
    year,
    // season,
    // seasonYear,
    type,
  } = options;

  const fetcher = async (
    _key: any,
    _options: UseBrowseOptions,
    page: number,
  ) => {
    try {
      const mappedSort = sort
        ? mapSortToMediaSort(sort)
        : MediaSortEnum.Popularity;
      const mappedFormat = type ? mapTypeToMediaFormat(type) : format;
      // const mappedStatus = status ? mapStatusToMediaStatus(status) : undefined;
      const mappedCountry = country ? mapCountryToMediaCountry(country) : undefined;
      const mappedStatus = status ? mapStatusToMediaStatus(status) : undefined;

      // Map type to status
      // let mappedStatus = status;
      // if (type === "completed") {
      //   mappedStatus = MediaStatusEnum.Finished;
      // } else if (type === "releasing") {
      //   mappedStatus = MediaStatusEnum.Releasing;
      // } else if (type === "not_yet_released") {
      //   mappedStatus = MediaStatusEnum.Not_yet_released; 
      // }

      // console.log("Fetching manga with options:", {
      //   type: MediaType.Manga,
      //   format: mappedFormat,
      //   perPage: limit,
      //   countryOfOrigin: country,
      //   sort: [mappedSort],
      //   status: mappedStatus,
      //   // season: mappedSeason,
      //   seasonYear: seasonYear,
      //   page,
      //   ...(tags.length && { tag_in: tags }),
      //   ...(genres.length && { genre_in: genres }),
      //   ...(keyword && { search: keyword }),
      //   // isAdult:
      //   //   isAdult || genres.includes("Hentai") || genres.includes("Ecchi"),
      // });

      const result = await getPageMedia({
        type: MediaType.Manga,
        format: mappedFormat,
        perPage: limit,
        countryOfOrigin: mappedCountry,
        sort: [mappedSort],
        status: mappedStatus,
        year: year,
        page,
        ...(tags.length && { tag_in: tags }),
        ...(genres.length && { genre_in: genres }),
        ...(keyword && { search: keyword }),
        isAdult:
          isAdult || genres.includes("Hentai") || genres.includes("Ecchi"),
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
