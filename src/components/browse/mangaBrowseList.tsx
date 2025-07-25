import type {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";

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
interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const BrowseList: React.FC<BrowseListProps> = ({ defaultQuery }) => {
  // const [keyword, setKeyword] = useState(defaultQuery.keyword || "");
  // const { t } = useTranslation();

  // const {
  //     data: searchResult,
  //     isLoading: searchIsLoading,
  //     fetchNextPage,
  //     isFetchingNextPage,
  //     hasNextPage,
  //     isError: searchIsError,
  // } = useCharacterSearch(keyword);

  // const { data: birthdayCharacters, isLoading: birthdayIsLoading } =
  //     useBirthdayCharacters();
  // const { data: favouritesCharacters, isLoading: favouritesIsLoading } =
  //     useFavouriteCharacters();

  // const handleFetch = () => {
  //     if (isFetchingNextPage || !hasNextPage) return;

  //     fetchNextPage();
  // };

  // const handleInputChange = debounce(
  //     (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
  //     500
  // );

  // const totalData = useMemo(
  //     () => searchResult?.pages.flatMap((el) => el.characters),
  //     [searchResult?.pages]
  // );
  console.log(defaultQuery);

  return (
    <div className="min-h-screen">
      <form className="space-y-4">
        {/* <Input
                    containerInputClassName="border border-white/80"
                    LeftIcon={AiOutlineSearch}
                    onChange={handleInputChange}
                    defaultValue={keyword}
                    label={t("common:search")}
                    containerClassName="w-full md:w-96"
                    placeholder={t("common:character_name")}
                /> */}
      </form>

      <div className="mt-8">
        <p> test 2</p>
        {/* {keyword ? (
                    !searchIsLoading ? (
                        <React.Fragment>
                            <List data={totalData}>
                                {(character) => <CharacterCard character={character} />}
                            </List>

                            {isFetchingNextPage && !searchIsError && (
                                <div className="mt-4">
                                    <ListSkeleton />
                                </div>
                            )}

                            {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
                                <InView onInView={handleFetch} />
                            )}

                            {!hasNextPage && !!totalData.length && (
                                <p className="mt-8 text-center text-2xl">
                                    There is nothing left...
                                </p>
                            )}
                        </React.Fragment>
                    ) : (
                        <ListSkeleton />
                    )
                ) : (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="font-semibold text-3xl">{t("common:birthday")}</h2>

                            {birthdayIsLoading ? (
                                <ListSkeleton />
                            ) : (
                                <List data={birthdayCharacters}>
                                    {(character) => <CharacterCard character={character} />}
                                </List>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h2 className="font-semibold text-3xl">
                                {t("common:most_favourite")}
                            </h2>

                            {favouritesIsLoading ? (
                                <ListSkeleton />
                            ) : (
                                <List data={favouritesCharacters}>
                                    {(character) => <CharacterCard character={character} />}
                                </List>
                            )}
                        </div>
                    </div>
                )} */}
      </div>
    </div>
  );
};

export default BrowseList;
