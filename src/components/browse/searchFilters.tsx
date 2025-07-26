"use client";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

// Genre options
const GENRES = [
  "Action",
  "Adventure",
  "Cartoon",
  "Comedy",
  "Dementia",
  "Demons",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Game",
  "Harem",
  "Historical",
  "Horror",
  "Josei",
  "Kids",
  "Live Action",
  "Magic",
  "Martial Arts",
  "Mecha",
  "Military",
  "Music",
  "Mystery",
  "Parody",
  "Police",
  "Psychological",
  "Romance",
  "Samurai",
  "School",
  "Sci-Fi",
  "Seinen",
  "Shoujo",
  "Shoujo Ai",
  "Shounen",
  "Shounen Ai",
  "Slice of Life",
  "Space",
  "Sports",
  "Super Power",
  "Supernatural",
  "Suspense",
  "Thriller",
  "Tokusatsu",
  "Vampire",
  "Yaoi",
  "Yuri",
];

// Sort options
const SORT_OPTIONS = [
  { value: "latest", label: "Mới nhất" },
  { value: "name_asc", label: "Tên: A-Z" },
  { value: "name_desc", label: "Tên: Z-A" },
  { value: "popularity", label: "Xem nhiều nhất" },
  { value: "score", label: "Nhiều lượt bình chọn" },
];

// Type options
const TYPE_OPTIONS = [
  { value: "movie", label: "Anime lẻ(Movie/OVA)" },
  { value: "tv", label: "Anime bộ (TV-Series)" },
  { value: "completed", label: "Anime trọn bộ" },
  { value: "releasing", label: "Anime đang chiếu" },
  { value: "not_yet_released", label: "Anime sắp chiếu" },
];

// Season options
const SEASON_OPTIONS = [
  { value: "winter", label: "Đông(Winter)" },
  { value: "spring", label: "Xuân(Spring)" },
  { value: "summer", label: "Hạ(Summer)" },
  { value: "fall", label: "Thu(Autumn)" },
];

// Year options
const YEAR_OPTIONS = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
];

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
  currentFilters?: any;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFiltersChange,
  currentFilters = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    currentFilters.genres || [],
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    currentFilters.sort || "popularity",
  );
  const [selectedType, setSelectedType] = useState<string>(
    currentFilters.type || "",
  );
  const [selectedSeason, setSelectedSeason] = useState<string>(
    currentFilters.season || "",
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(
    currentFilters.year || null,
  );

  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(newGenres);
    updateFilters({ genres: newGenres });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    updateFilters({ sort });
  };

  const handleTypeChange = (type: string) => {
    const newType = selectedType === type ? "" : type;
    setSelectedType(newType);
    updateFilters({ type: newType });
  };

  const handleSeasonChange = (season: string) => {
    const newSeason = selectedSeason === season ? "" : season;
    setSelectedSeason(newSeason);
    updateFilters({ season: newSeason });
  };

  const handleYearChange = (year: number | null) => {
    const newYear = selectedYear === year ? null : year;
    setSelectedYear(newYear);
    updateFilters({ year: newYear });
  };

  const updateFilters = (newFilters: any) => {
    const allFilters = {
      genres: selectedGenres,
      sort: selectedSort,
      type: selectedType,
      season: selectedSeason,
      year: selectedYear,
      ...newFilters,
    };
    onFiltersChange(allFilters);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedSort("popularity");
    setSelectedType("");
    setSelectedSeason("");
    setSelectedYear(null);
    onFiltersChange({});
  };

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedSort !== "popularity" ||
    selectedType ||
    selectedSeason ||
    selectedYear;

  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="font-semibold text-lg text-white">Bộ lọc tìm kiếm</h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              {selectedGenres.length +
                (selectedSort !== "popularity" ? 1 : 0) +
                (selectedType ? 1 : 0) +
                (selectedSeason ? 1 : 0) +
                (selectedYear ? 1 : 0)}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-white "
        >
          {isExpanded ? (
            <>
              <span>Ẩn bộ lọc</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Hiện bộ lọc</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {genre}
            </Badge>
          ))}
          {selectedSeason && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              {SEASON_OPTIONS.find((s) => s.value === selectedSeason)?.label}
            </Badge>
          )}
          {selectedYear && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              {selectedYear}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Expandable Filter Content */}
      {isExpanded && (
        <div className="rounded-lg bg-input/50 p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Genres */}
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">
                  Thể loại
                </h3>
                <ScrollArea className="h-48 w-full">
                  <div className="grid grid-cols-2 gap-2">
                    {GENRES.map((genre) => (
                      <Button
                        key={genre}
                        variant={
                          selectedGenres.includes(genre) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleGenreToggle(genre)}
                        className={`text-sm ${
                          selectedGenres.includes(genre)
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Sort */}
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">Sắp xếp</h3>
                <div className="space-y-2">
                  {SORT_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        selectedSort === option.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full justify-start ${
                        selectedSort === option.value
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Type */}
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">Loại</h3>
                <div className="space-y-2">
                  {TYPE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        selectedType === option.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeChange(option.value)}
                      className={`w-full justify-start ${
                        selectedType === option.value
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">Mùa</h3>
                <div className="grid grid-cols-2 gap-2">
                  {SEASON_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        selectedSeason === option.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleSeasonChange(option.value)}
                      className={`${
                        selectedSeason === option.value
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">Năm</h3>
                <ScrollArea className="h-32 w-full">
                  <div className="grid grid-cols-3 gap-2">
                    {YEAR_OPTIONS.map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleYearChange(year)}
                        className={`${
                          selectedYear === year
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        {year}
                      </Button>
                    ))}
                    <Button
                      variant={selectedYear === 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleYearChange(0)}
                      className={`${
                        selectedYear === 0
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      Cũ hơn
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
