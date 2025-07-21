// export interface Manga {
//   id: string;
//   title: string;
//   altTitles: string[];
//   description: string;
//   authors: string[];
//   artists: string[];
//   tags: string[];
//   status: "ONGOING" | "COMPLETED" | "HIATUS" | "CANCELLED";
//   contentRating: "SAFE" | "SUGGESTIVE" | "NSFW";
//   createdAt: Date;
//   updatedAt: Date;
//   extraData?: Record<any, any>;
// }

// // Manga source (thông tin từ từng nguồn)
// export interface MangaSource {
//   id: string;
//   mangaId: string; // Reference to Manga
//   sourceName: string; // 'cuutruyen', 'nettruyen', etc.
//   sourceId: string; // ID từ nguồn gốc
//   sourceUrl: string; // URL gốc
//   title: string; // Có thể khác với manga chính
//   description: string;
//   coverUrl: string | null;
//   bannerUrl: string | null;
//   largeCoverUrl: string | null;
//   rating: number | null;
//   viewCount: number | null;
//   likeCount: number | null;
//   isActive: boolean; // Nguồn còn hoạt động không
//   lastUpdated: Date | string; // Có thể là Date object hoặc string
//   createdAt: Date | string;
//   extraData?: Record<any, any>;
// }

// // Chapter entity
// export interface Chapter {
//   id: string;
//   mangaId: string; // Reference to Manga
//   title: string | null;
//   number: number;
//   volume: number | null;
//   language: string; // 'vi', 'en', 'ja', etc.
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Chapter source (thông tin chapter từ từng nguồn)
// export interface ChapterSource {
//   id: string;
//   chapterId: string; // Reference to Chapter
//   sourceName: string;
//   sourceId: string;
//   sourceUrl: string;
//   title: string | null;
//   number: number;
//   volume: number | null;
//   scanlator: string | null;
//   uploadDate: Date | null;
//   pageCount: number;
//   isActive: boolean;
//   createdAt: Date;
// }

// // Page entity
export interface Page {
  id: string;
  chapterSourceId: string; // Reference to ChapterSource
  pageNumber?: number;
  imageUrl?: string;
  drmData?: string | null;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  createdAt?: Date;
}

export interface UPage {
  id: string;
  chapterSourceId?: string; // Reference to ChapterSource
  pageNumber?: number;
  imageUrl?: string;
  drmData?: string | null;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  chapterSource?: UChapterSource;
  createdAt?: Date;
  extraData?: Record<string, any>;
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

export interface UManga {
  id: string; // id của unified manga (ưu tiên Anilist)
  anilistId?: number; // id Anilist nếu có
  title: string;
  altTitles: string[];
  description: string;
  authors: any;
  artists: string[];
  tags: string[];
  status: MangaState; // Trạng thái của manga (ONGOING, COMPLETED, HIATUS, CANCELLED, PAUSED, UNKNOWN)
  contentRating: "SAFE" | "SUGGESTIVE" | "NSFW" | string;
  coverUrl: string | null;
  bannerUrl?: string | null;
  largeCoverUrl?: string | null;
  sources: UMangaSource[]; // Danh sách các nguồn (CuuTruyen, TruyenQQ, MangaDex, ...)
  chapters?: UChapter[]; // Danh sách chapter
  extraData?: Record<string, any>; // Dữ liệu đặc thù từng nguồn
}

export interface UMangaSource {
  sourceName: string; // 'anilist', 'cuutruyen', 'truyenqq', 'mangadex', ...
  sourceId: string; // id của manga ở source đó
  sourceUrl: string; // url gốc
  title?: string;
  description?: string;
  coverUrl?: string | null;
  bannerUrl?: string | null;
  largeCoverUrl?: string | null;
  rating?: number | null;
  viewCount?: number | null;
  likeCount?: number | null;
  isActive?: boolean;
  lastUpdated?: Date | string;
  createdAt?: Date | string;
  extraData?: Record<string, any>;
  mediaSource?: MediaSource;
}
// Each Chapter
export interface UChapter {
  id: string;
  title: string | null;
  number: number;
  volume: number | null;
  language: string;
  sourceName?: string;
  scanlator?: string | null;
  uploadDate?: Date | null;
  pageCount?: number;
  isActive?: boolean;
  updatedAt?: string | null;
  createdAt?: string | null;
  extraData?: Record<string, any>;
}

export interface UChapterSource {
  sourceName: string;
  sourceId: string;
  sourceUrl: string;
  anilist ?:string;
  title: string | null;
  number: number;
  volume?: number | null;
  chapter?: UChapter[];
  uploadDate?: Date | null;
  isActive?: boolean;
  createdAt?: Date;
  extraData?: Record<string, any>;
}

export enum ContentRating {
  SAFE = "SAFE",
  SUGGESTIVE = "SUGGESTIVE",
  NSFW = "NSFW",
}
export enum SortOrder {
  UPDATED = "UPDATED",
  POPULARITY = "POPULARITY",
  NEWEST = "NEWEST",
  POPULARITY_WEEK = "POPULARITY_WEEK",
  POPULARITY_MONTH = "POPULARITY_MONTH",
}
export interface MangaTag {
  title: string;
  key: string;
  source: string;
}

export enum MangaState {
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
  COMPLETED = "COMPLETED",
  HIATUS = "HIATUS",
  CANCELLED = "CANCELLED",
  PAUSED = "PAUSED",
  UNKNOWN = "UNKNOWN",
}
export enum MediaSource {
  Original = "ORIGINAL",
  Manga = "MANGA",
  Light_novel = "LIGHT_NOVEL",
  Visual_novel = "VISUAL_NOVEL",
  Video_game = "VIDEO_GAME",
  Other = "OTHER",
  Novel = "NOVEL",
  Doujinshi = "DOUJINSHI",
  Anime = "ANIME",
  Web_novel = "WEB_NOVEL",
  Live_action = "LIVE_ACTION",
  Game = "GAME",
  Comic = "COMIC",
  Multimedia_project = "MULTIMEDIA_PROJECT",
  Picture_book = "PICTURE_BOOK",
}
