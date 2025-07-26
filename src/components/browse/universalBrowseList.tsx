import useBrowseCharacters from "@/hooks/useBrowseCharacters";
import useBrowse from "@/hooks/useBrowseManga";
import type {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { useMemo } from "react";

export interface UseBrowseOptions {
  keyword?: string;
  genres?: string[];
  seasonYear?: number;
  season?: MediaSeason;
  format?: MediaFormat;
  select?: string;
  limit?: number;
  tags?: string[];
  sort?: MediaSort;
  country?: string;
  status?: MediaStatus;
  isAdult?: boolean;
  type?: string;
}

interface UniversalBrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const UniversalBrowseList: React.FC<UniversalBrowseListProps> = ({
  defaultQuery,
}) => {
  const { type = "manga", ...queryOptions } = defaultQuery || {};

  // Use different hooks based on type
  const mangaData = useBrowse(queryOptions);
  const characterData = useBrowseCharacters({
    keyword: queryOptions.keyword,
    limit: queryOptions.limit,
    sort: queryOptions.sort as any,
    isAdult: queryOptions.isAdult,
  });

  // Select data based on type
  const { data, isLoading, hasNextPage, fetchNextPage } = useMemo(() => {
    switch (type) {
      case "manga":
      case "light_novel":
      case "manhua":
      case "anime":
        return mangaData;
      case "characters":
        return characterData;
      default:
        return mangaData;
    }
  }, [type, mangaData, characterData]);

  // Flatten data from all pages
  const allItems = useMemo(() => {
    if (type === "characters") {
      return data?.flatMap((page: any) => page.characters || []) || [];
    }
    return data?.flatMap((page: any) => page.media || []) || [];
  }, [data, type]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 rounded bg-gray-700" />
              <div className="mt-2 h-4 rounded bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {allItems.map((item: any) => (
            <div key={item.id} className="rounded-lg bg-gray-800 p-4">
              {type === "characters" ? (
                <div>
                  <h3 className="font-semibold text-white">
                    {item.name?.userPreferred ||
                      item.name?.full ||
                      "Unknown Character"}
                  </h3>
                  <p className="mt-2 text-gray-400 text-sm">
                    {item.description?.substring(0, 100)}...
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-white">
                    {item.title?.userPreferred ||
                      item.title?.romaji ||
                      "Unknown Title"}
                  </h3>
                  <p className="mt-2 text-gray-400 text-sm">
                    {item.description?.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {hasNextPage && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}

        {!hasNextPage && allItems.length > 0 && (
          <p className="mt-8 text-center text-2xl">There is nothing left...</p>
        )}

        {allItems.length === 0 && !isLoading && (
          <p className="mt-8 text-center text-2xl">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default UniversalBrowseList;
