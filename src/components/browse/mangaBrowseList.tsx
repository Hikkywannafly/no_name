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
}

interface MangaBrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const MangaBrowseList: React.FC<MangaBrowseListProps> = ({ defaultQuery }) => {
  const { data, isLoading, hasNextPage, fetchNextPage } = useBrowse(
    defaultQuery as UseBrowseOptions,
  );

  // Flatten data from all pages - only manga data
  const allManga = useMemo(() => {
    return data?.flatMap((page: any) => page.media || []) || [];
  }, [data]);

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
          {allManga.map((manga: any) => (
            <div key={manga.id} className="rounded-lg bg-gray-800 p-4">
              <h3 className="font-semibold text-white">
                {manga.title?.userPreferred ||
                  manga.title?.romaji ||
                  "Unknown Manga"}
              </h3>
              <p className="mt-2 text-gray-400 text-sm">
                {manga.description?.substring(0, 100)}...
              </p>
              <div className="mt-2 text-gray-500 text-xs">
                <span>Chapters: {manga.chapters || "?"}</span>
                <span className="ml-2">Volumes: {manga.volumes || "?"}</span>
              </div>
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
              Load More Manga
            </button>
          </div>
        )}

        {!hasNextPage && allManga.length > 0 && (
          <p className="mt-8 text-center text-2xl">No more manga to load...</p>
        )}

        {allManga.length === 0 && !isLoading && (
          <p className="mt-8 text-center text-2xl">No manga found.</p>
        )}
      </div>
    </div>
  );
};

export default MangaBrowseList;
