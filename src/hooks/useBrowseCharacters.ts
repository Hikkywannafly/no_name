import { getPageCharacters } from "@/provider/Anilist/index";
import {
  type CharacterSort,
  CharacterSort as CharacterSortEnum,
} from "@/types/anilist";
import useSWRInfinite from "swr/infinite";

export interface UseCharacterBrowseOptions {
  keyword?: string;
  limit?: number;
  sort?: CharacterSort;
  isAdult?: boolean;
}

const getKey = (
  options: UseCharacterBrowseOptions,
  pageIndex: number,
  previousPageData: any,
) => {
  if (previousPageData && !previousPageData.characters?.length) return null;
  return ["browse-characters", options, pageIndex + 1];
};

const useBrowseCharacters = (options: UseCharacterBrowseOptions) => {
  const { keyword, sort, limit = 30, isAdult } = options;

  const fetcher = async (
    _key: any,
    _options: UseCharacterBrowseOptions,
    page: number,
  ) => {
    try {
      console.log("Fetching characters with options:", {
        perPage: limit,
        sort: [sort || CharacterSortEnum.Favourites],
        page,
        ...(keyword && { search: keyword }),
        isAdult,
      });

      const result = await getPageCharacters({
        perPage: limit,
        sort: [sort || CharacterSortEnum.Favourites],
        page,
        ...(keyword && { search: keyword }),
        isAdult,
      });

      console.log("AniList Characters API response:", result);
      return result;
    } catch (error) {
      console.error("Error fetching characters from AniList:", error);
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

export default useBrowseCharacters;
