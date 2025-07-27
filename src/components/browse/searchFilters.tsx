"use client";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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

// ];
const STATUS_OPTIONS = [
  { value: "releasing", label: "Đang phát hành" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "not_yet_released", label: "Chưa phát hành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "hiatus", label: "Tạm ngưng" },
];

const FORMAT_OPTIONS = [
  { value: "manga", label: "Manga" },
  { value: "novel", label: "Light Novel" },
  { value: "one_shot", label: "One Shot" },
];

const COUNTRY_OPTIONS = [
  // { value: "All", label: "Tất cả quốc gia" },
  { value: "jp", label: "Nhật Bản" },
  { value: "kr", label: "Hàn Quốc" },
  { value: "cn", label: "Trung Quốc" },
  { value: "tw", label: "Đài Loan" },
];

const YEAR_OPTIONS = Array.from({ length: 2025 - 1950 + 1 }, (_, i) =>
  (1950 + i).toString(),
).reverse();

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
  const [isAdult, setIsAdult] = useState<boolean>(
    currentFilters.isAdult || false,
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

  const handleYearChange = (year: string) => {
    const yearNum = year ? Number.parseInt(year) : null;
    setSelectedYear(yearNum);
    updateFilters({ year: yearNum });
  };

  const handleIsAdultChange = () => {
    const newIsAdult = !isAdult;
    setIsAdult(newIsAdult);
    updateFilters({ isAdult: newIsAdult });
  };

  const updateFilters = (newFilters: any) => {
    const allFilters = {
      genres: selectedGenres,
      sort: selectedSort,
      format: selectedFormat || undefined,
      status: selectedStatus || undefined,
      country: selectedCountry || undefined,
      year: selectedYear,
      isAdult: isAdult,
      ...newFilters,
    };

    // clean undefined values
    for (const key in allFilters) {
      if (allFilters[key] === undefined || allFilters[key] === "") {
        delete allFilters[key];
      }
    }
    onFiltersChange(allFilters);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedSort("popularity");
    setSelectedFormat("");
    setSelectedStatus("");
    setSelectedCountry("");
    setSelectedYear(null);
    setIsAdult(false);
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
    selectedYear ||
    isAdult;

  const [open, setOpen] = useState(false);

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
                (selectedYear ? 1 : 0) +
                (isAdult ? 1 : 0)}
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
              <X className="ml-1 h-4 w-4" />
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
          {isAdult && (
            <Badge
              variant="secondary"
              className="cursor-pointer bg-red-600/80 text-white"
              onClick={handleIsAdultChange}
            >
              18+
              <X className="ml-1 h-4 w-4" />
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
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden "
          >
            <div className="rounded-sm bg-input/50 p-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Genres */}
                  <div>
                    <h3 className="mb-3 font-medium text-lg text-white">
                      Thể loại
                    </h3>
                    <ScrollArea className="h-48 w-full sm:h-auto">
                      <div className="flex flex-wrap gap-2">
                        {GENRES.map((genre) => (
                          <Button
                            key={genre}
                            variant={
                              selectedGenres.includes(genre)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleGenreToggle(genre)}
                            className={`text-sm ${
                              selectedGenres.includes(genre)
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
                </div>

                {/* Right Column */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-medium text-lg text-white">
                      Sắp xếp
                    </h3>
                    <Select
                      value={selectedSort}
                      onValueChange={handleSortChange}
                    >
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
                    <h3 className="mb-3 font-medium text-lg text-white">
                      Định dạng
                    </h3>
                    <Select
                      value={selectedFormat}
                      onValueChange={handleFormatChange}
                    >
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
                    <Select
                      value={selectedStatus}
                      onValueChange={handleStatusChange}
                    >
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
                    <Select
                      value={selectedCountry}
                      onValueChange={handleCountryChange}
                    >
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
                    <h3 className="mb-3 font-medium text-lg text-white">
                      Năm phát hành
                    </h3>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-input/30 px-3 py-2 font-light text-white/50"
                        >
                          {selectedYear || "Chọn năm"}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full border border-white/10 bg-input/50 p-0">
                        <Command>
                          <CommandInput
                            placeholder="Nhập năm..."
                            className="px-3 py-2 text-white placeholder-white/50 [&_svg]:hidden"
                          />
                          <CommandList className="max-h-[200px] overflow-y-auto text-white">
                            {YEAR_OPTIONS.map((year) => (
                              <CommandItem
                                key={year}
                                value={year}
                                onSelect={() => {
                                  handleYearChange(year);
                                  setOpen(false);
                                }}
                                className="cursor-pointer px-3 py-2"
                              >
                                {year}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* 18+ Toggle */}
                  <div>
                    <h3 className="mb-3 font-medium text-lg text-white">
                      Nội dung 18+
                    </h3>
                    <Button
                      variant={isAdult ? "default" : "outline"}
                      onClick={handleIsAdultChange}
                      className={`w-full text-sm ${
                        isAdult
                          ? "bg-red-600/20 text-white hover:bg-red-600/40"
                          : " bg-transparent text-white hover:bg-red-600/20"
                      }`}
                    >
                      {isAdult ? "Có" : "Không "}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;
