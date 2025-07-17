// Manga entity (truyện chính)
export interface Manga {
  id: string;
  title: string;
  altTitles: string[];
  description: string;
  authors: string[];
  artists: string[];
  tags: string[];
  status: "ONGOING" | "COMPLETED" | "HIATUS" | "CANCELLED";
  contentRating: "SAFE" | "SUGGESTIVE" | "NSFW";
  createdAt: Date;
  updatedAt: Date;
}

// Manga source (thông tin từ từng nguồn)
export interface MangaSource {
  id: string;
  mangaId: string; // Reference to Manga
  sourceName: string; // 'cuutruyen', 'nettruyen', etc.
  sourceId: string; // ID từ nguồn gốc
  sourceUrl: string; // URL gốc
  title: string; // Có thể khác với manga chính
  description: string;
  coverUrl: string | null;
  bannerUrl: string | null;
  largeCoverUrl: string | null;
  rating: number | null;
  viewCount: number | null;
  likeCount: number | null;
  isActive: boolean; // Nguồn còn hoạt động không
  lastUpdated: Date | string; // Có thể là Date object hoặc string
  createdAt: Date | string;
}

// Chapter entity
export interface Chapter {
  id: string;
  mangaId: string; // Reference to Manga
  title: string | null;
  number: number;
  volume: number | null;
  language: string; // 'vi', 'en', 'ja', etc.
  createdAt: Date;
  updatedAt: Date;
}

// Chapter source (thông tin chapter từ từng nguồn)
export interface ChapterSource {
  id: string;
  chapterId: string; // Reference to Chapter
  sourceName: string;
  sourceId: string;
  sourceUrl: string;
  title: string | null;
  number: number;
  volume: number | null;
  scanlator: string | null;
  uploadDate: Date | null;
  pageCount: number;
  isActive: boolean;
  createdAt: Date;
}

// Page entity
export interface Page {
  id: string;
  chapterSourceId: string; // Reference to ChapterSource
  pageNumber?: number;
  imageUrl?: string;
  drmData: string | null;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  createdAt?: Date;
}

// Source configuration
export interface SourceConfig {
  name: string;
  displayName: string;
  baseUrl: string;
  isActive: boolean;
  priority: number; // Độ ưu tiên khi merge data
  supportedLanguages: string[];
  features: {
    hasBanner: boolean;
    hasLargeCover: boolean;
    hasRating: boolean;
    hasViewCount: boolean;
    hasLikeCount: boolean;
    supportsDRM: boolean;
  };
}

// Manga merge strategy
export interface MangaMergeStrategy {
  title: "PRIORITY_SOURCE" | "MOST_COMPLETE" | "MANUAL";
  description: "PRIORITY_SOURCE" | "MOST_COMPLETE" | "MANUAL";
  cover: "PRIORITY_SOURCE" | "HIGHEST_QUALITY" | "MOST_RECENT";
  banner: "PRIORITY_SOURCE" | "HIGHEST_QUALITY" | "MOST_RECENT";
  rating: "AVERAGE" | "HIGHEST" | "MOST_VOTES";
  tags: "UNION" | "INTERSECTION" | "PRIORITY_SOURCE";
}
