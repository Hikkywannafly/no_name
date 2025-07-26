import useBrowseCharacters from "@/hooks/useBrowseCharacters";
import type { CharacterSort } from "@/types/anilist";
import { useMemo } from "react";
import CharacterCard from "../shared/characterCard";
import List from "../shared/list";

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
  const { data, isLoading, hasNextPage } = useBrowseCharacters(
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
        <List data={allCharacters} >
          {(character) => <CharacterCard character={character} />}
        </List>
      </div>

      {!hasNextPage && allCharacters.length > 0 && (
        <p className="mt-8 text-center text-2xl">
          Không còn nhân vật nào nữa đâu
        </p>
      )}

      {allCharacters.length === 0 && !isLoading && (
        <p className="mt-8 text-center text-2xl">No characters found.</p>
      )}
    </div>

  );
};

export default CharacterBrowseList;
