import useBrowse from "@/hooks/useBrowseManga";
import type {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { useMemo } from "react";
import InView from "../shared/inView";
import List from "../shared/list";
import MediaCard from "../shared/mediaCard";

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
}

interface MangaBrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const MangaBrowseList: React.FC<MangaBrowseListProps> = ({ defaultQuery }) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isValidating } = useBrowse(
    defaultQuery as UseBrowseOptions,
  );

  const handleFetch = () => {
    if (!hasNextPage || isValidating) return;
    fetchNextPage();
  };

  // Flatten data from all pages - only manga data
  const allManga = useMemo(() => {
    return data?.flatMap((page: any) => page.media || []) || [];
  }, [data]);

  if (isLoading && !data?.length) {
    return (
      <div className="min-h-screen">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 rounded bg-black/50" />
              <div className="mt-2 h-4 rounded bg-black/50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mt-8">
        <List data={allManga}>
          {(manga) => <MediaCard data={manga} onHover={() => { }} isHovered={false} />}
        </List>

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
            No more manga to load...
          </p>
        )}

        {/* No results */}
        {allManga.length === 0 && !isLoading && (
          <p className="mt-8 text-center text-2xl text-gray-400">
            No manga found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MangaBrowseList;
