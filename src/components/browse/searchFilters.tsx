"use client";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// Genre options

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];
// Sort options
const SORT_OPTIONS = [
  { value: "popularity", label: "Phổ biến nhất" },
  { value: "latest", label: "Mới nhất" },
  { value: "name_asc", label: "Tên: A-Z" },
  { value: "name_desc", label: "Tên: Z-A" },
  { value: "score", label: "Điểm cao nhất" },
];

// Type options
// const TYPE_OPTIONS = [
//   { value: "movie", label: "Anime lẻ(Movie/OVA)" },
//   { value: "tv", label: "Anime bộ (TV-Series)" },
//   { value: "completed", label: "Anime trọn bộ" },
//   { value: "releasing", label: "Anime đang chiếu" },
//   { value: "not_yet_released", label: "Anime sắp chiếu" },
// ];
const STATUS_OPTIONS = [
  { value: "RELEASING", label: "Đang phát hành" },
  { value: "FINISHED", label: "Đã hoàn thành" },
  { value: "NOT_YET_RELEASED", label: "Chưa phát hành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "HIATUS", label: "Tạm ngưng" },
];

const FORMAT_OPTIONS = [
  { value: "MANGA", label: "Manga" },
  { value: "NOVEL", label: "Light Novel" },
  { value: "ONE_SHOT", label: "One Shot" },
];

// Season options
// const SEASON_OPTIONS = [
//   { value: "winter", label: "Đông(Winter)" },
//   { value: "spring", label: "Xuân(Spring)" },
//   { value: "summer", label: "Hạ(Summer)" },
//   { value: "fall", label: "Thu(Autumn)" },
// ];

const COUNTRY_OPTIONS = [
  // { value: "All", label: "Tất cả quốc gia" },
  { value: "JP", label: "Nhật Bản" },
  { value: "KR", label: "Hàn Quốc" },
  { value: "CN", label: "Trung Quốc" },
  { value: "TW", label: "Đài Loan" },
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
  // const [selectedType, setSelectedType] = useState<string>(
  //   currentFilters.type || "",
  // );
  const [selectedFormat, setSelectedFormat] = useState<string>(
    currentFilters.format || "",
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentFilters.status || "",
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    currentFilters.country || "",
  );
  // const [selectedSeason, setSelectedSeason] = useState<string>(
  //   currentFilters.season || "",
  // );
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

  // const handleTypeChange = (type: string) => {
  //   const newType = selectedType === type ? "" : type;
  //   setSelectedType(newType);
  //   updateFilters({ type: newType });
  // };
  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    updateFilters({ format: format || undefined });
  };

  // const handleSeasonChange = (season: string) => {
  //   const newSeason = selectedSeason === season ? "" : season;
  //   setSelectedSeason(newSeason);
  //   updateFilters({ season: newSeason });
  // };
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateFilters({ status: status || undefined });
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    updateFilters({ country: country || undefined });
  };

  // const handleYearChange = (year: number | null) => {
  //   const newYear = selectedYear === year ? null : year;
  //   setSelectedYear(newYear);
  //   updateFilters({ year: newYear });
  // };

  const handleYearChange = (year: string) => {
    const yearNum = year ? Number.parseInt(year) : null;
    setSelectedYear(yearNum);
    updateFilters({ year: yearNum });
  };

  const updateFilters = (newFilters: any) => {
    const allFilters = {
      genres: selectedGenres,
      sort: selectedSort,
      format: selectedFormat || undefined,
      status: selectedStatus || undefined,
      country: selectedCountry || undefined,
      year: selectedYear,
      ...newFilters,
    };
    onFiltersChange(allFilters);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedSort("popularity");
    setSelectedFormat("");
    setSelectedStatus("");
    setSelectedCountry("");
    setSelectedYear(null);
    onFiltersChange({
      genres: [],
      sort: "popularity",
    });
  };

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedSort !== "popularity" ||
    selectedFormat ||
    selectedStatus ||
    selectedCountry ||
    selectedYear;

  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="font-semibold text-lg text-white">Bộ lọc tìm kiếm</h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-black/60 text-white">
              {selectedGenres.length +
                (selectedSort !== "popularity" ? 1 : 0) +
                (selectedFormat ? 1 : 0) +
                (selectedStatus ? 1 : 0) +
                (selectedCountry ? 1 : 0) +
                (selectedYear ? 1 : 0)}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-white"
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
              className=" cursor-pointer bg-black/60 text-white"
              onClick={() => handleGenreToggle(genre)}
            >
              {genre}
              <span className="ml-1 text-red-400">x</span>
            </Badge>
          ))}
          {selectedFormat && (
            <Badge variant="secondary" className="bg-black/60 text-white">
              {FORMAT_OPTIONS.find((f) => f.value === selectedFormat)?.label}
            </Badge>
          )}
          {selectedStatus && (
            <Badge variant="secondary" className="bg-black/60 text-white">
              {STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label}
            </Badge>
          )}
          {selectedCountry && (
            <Badge variant="secondary" className="bg-black/60 text-white">
              {COUNTRY_OPTIONS.find((c) => c.value === selectedCountry)?.label}
            </Badge>
          )}
          {selectedYear && (
            <Badge variant="secondary" className="bg-black/60 text-white">
              {selectedYear}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
          >
            xóa tất cả
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
                  <div className="grid grid-cols-4 gap-2">
                    {GENRES.map((genre) => (
                      <Button
                        key={genre}
                        variant={
                          selectedGenres.includes(genre) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleGenreToggle(genre)}
                        className={`text-sm ${selectedGenres.includes(genre)
                          ? " bg-black/60 text-white hover:bg-red-600"
                          : " bg-transparent text-white "
                          }`}
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Sort */}

            </div>

            {/* Right Column */}
            <div className="grid grid-flow-col grid-cols-1 gap-4 lg:grid-rows-3">

              <div>
                <h3 className="mb-3 font-medium text-lg text-white">Sắp xếp</h3>
                <Select value={selectedSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn cách sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Format */}
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">Định dạng</h3>
                <Select value={selectedFormat} onValueChange={handleFormatChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn định dạng" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">
                  Trạng thái phát hành
                </h3>
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>

                <h3 className="mb-3 font-medium text-lg text-white">
                  Quốc gia
                </h3>
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn quốc gia" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="mb-3 font-medium text-lg text-white">Năm phát hành</h3>
                <Select
                  value={selectedYear?.toString() || ""}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
        </div>

      )
      }
    </div >
  );
};

export default SearchFilters;
