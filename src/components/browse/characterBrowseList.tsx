import useBrowseCharacters from "@/hooks/useBrowseCharacters";
import type { CharacterSort } from "@/types/anilist";
import { useMemo } from "react";

export interface UseCharacterBrowseOptions {
  keyword?: string;
  limit?: number;
  sort?: CharacterSort;
  isAdult?: boolean;
}

interface CharacterBrowseListProps {
  defaultQuery?: UseCharacterBrowseOptions;
}

const CharacterBrowseList: React.FC<CharacterBrowseListProps> = ({
  defaultQuery,
}) => {
  const { data, isLoading, hasNextPage, fetchNextPage } = useBrowseCharacters(
    defaultQuery as UseCharacterBrowseOptions,
  );

  // Flatten data from all pages - only character data
  const allCharacters = useMemo(() => {
    return data?.flatMap((page: any) => page.characters || []) || [];
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
          {allCharacters.map((character: any) => (
            <div key={character.id} className="rounded-lg bg-gray-800 p-4">
              <h3 className="font-semibold text-white">
                {character.name?.userPreferred ||
                  character.name?.full ||
                  "Unknown Character"}
              </h3>
              <p className="mt-2 text-gray-400 text-sm">
                {character.description?.substring(0, 100)}...
              </p>
              <div className="mt-2 text-gray-500 text-xs">
                <span>Favorites: {character.favourites || "0"}</span>
                {character.age && (
                  <span className="ml-2">Age: {character.age}</span>
                )}
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
              Load More Characters
            </button>
          </div>
        )}

        {!hasNextPage && allCharacters.length > 0 && (
          <p className="mt-8 text-center text-2xl">
            No more characters to load...
          </p>
        )}

        {allCharacters.length === 0 && !isLoading && (
          <p className="mt-8 text-center text-2xl">No characters found.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterBrowseList;
