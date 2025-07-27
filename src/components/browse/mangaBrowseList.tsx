import useBrowse from "@/hooks/useBrowseManga";
import type {
  Media,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import InView from "../shared/inView";
import List from "../shared/list";
import MediaCard from "../shared/mediaCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SearchFilters from "./searchFilters";

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
  isAdult?: true;
}

interface MangaBrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const MangaBrowseList: React.FC<MangaBrowseListProps> = ({ defaultQuery }) => {
  const [searchKeyword, setSearchKeyword] = useState(
    defaultQuery?.keyword || "",
  );
  const [debouncedKeyword, setDebouncedKeyword] = useState(
    defaultQuery?.keyword || "",
  );
  const [filters, setFilters] = useState<any>({
    genres: defaultQuery?.genres || [],
    sort: defaultQuery?.sort || "popularity",
    type: defaultQuery?.format || "",
    season: defaultQuery?.season || "",
    year: defaultQuery?.seasonYear || null,
  });

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const queryOptions = useMemo(
    () => ({
      ...defaultQuery,
      keyword: debouncedKeyword, // Use debounced keyword instead
      genres: filters.genres,
      sort: filters.sort,
      format: filters.type,
      season: filters.season,
      seasonYear: filters.year,
    }),
    [defaultQuery, debouncedKeyword, filters],
  );

  const { data, isLoading, hasNextPage, fetchNextPage, isValidating } =
    useBrowse(queryOptions as UseBrowseOptions);

  const handleFetch = useCallback(() => {
    if (!hasNextPage || isValidating) return;
    fetchNextPage();
  }, [hasNextPage, isValidating, fetchNextPage]);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback(() => {
    // Trigger search with current keyword
    // The useBrowse hook will automatically re-fetch when queryOptions change
  }, []);

  // Flatten data from all pages - only manga data
  const allManga = useMemo(() => {
    return data?.flatMap((page: any) => (page.media as Media) || []) || [];
  }, [data]);

  return (
    <div className="min-h-screen">
      <div className="mt-8 flex flex-col gap-6">
        {/* Search Bar - Always visible */}
        <div className="flex items-center gap-2">
          <Input
            className="border-none bg-black text-white"
            placeholder="Tìm truyện manga"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            className="text-white dark:bg-input/30"
            onClick={handleSearch}
          >
            <Search />
          </Button>
        </div>

        {/* Filters - Always visible */}
        <SearchFilters
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />

        {/* Results Section */}
        <div className="mt-4">
          {/* Loading skeleton for initial load */}
          {isLoading && !data?.length && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 rounded bg-black/50" />
                  <div className="mt-2 h-4 rounded bg-black/50" />
                </div>
              ))}
            </div>
          )}

          {/* Results when data exists */}
          {!isLoading && (
            <List data={allManga}>
              {(manga) => (
                <MediaCard data={manga} onHover={() => { }} isHovered={false} />
              )}
            </List>
          )}

          {/* Loading indicator for next page */}
          {isValidating && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 rounded bg-black/50" />
                  <div className="mt-2 h-4 rounded bg-black/50" />
                </div>
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasNextPage && !isValidating && (
            <InView onInView={handleFetch}>
              <div className="h-4" />
            </InView>
          )}

          {/* End of results */}
          {!hasNextPage && allManga.length > 0 && (
            <p className="mt-8 text-center text-2xl text-gray-400">
              Đã hiển thị tất cả manga.
            </p>
          )}

          {allManga.length === 0 && !isLoading && (
            <p className="mt-8 text-center text-2xl text-gray-400">
              Không tìm thấy manga nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaBrowseList;
