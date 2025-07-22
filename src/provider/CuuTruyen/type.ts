export enum MangaState {
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
  PAUSED = "PAUSED",
  UNKNOWN = "UNKNOWN",
  COMPLETED = "COMPLETED",
  HIATUS = "HIATUS",
  CANCELLED = "CANCELLED",
}

export enum ContentRating {
  SAFE = "SAFE",
  ADULT = "ADULT",
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

export interface MangaChapter {
  id: string;
  title: string | null;
  number: number;
  volume: number;
  url: string;
  scanlator: string | null;
  uploadDate: Date | null | string;
  branch: string | null;
  source: string;
}

export interface MangaPage {
  id: string;
  url: string;
  preview: string | null;
  source: string;
}

export interface Manga {
  id: string;
  url: string;
  publicUrl: string;
  title: string;
  altTitles: Set<string>;
  coverUrl: string;
  largeCoverUrl: string;
  authors: Set<string>;
  tags: Set<MangaTag>;
  state: MangaState | null;
  description: string | null;
  contentRating: ContentRating | null;
  source: string;
  rating: number;
  chapters?: MangaChapter[];
}

export interface MangaListFilter {
  query?: string | null;
  tags?: Set<MangaTag>;
  states?: Set<MangaState>;
}

export interface MangaListFilterOptions {
  availableTags: Set<MangaTag>;
  availableStates: Set<MangaState>;
}

export interface MangaListFilterCapabilities {
  isSearchSupported: boolean;
}

export interface ParserConfig {
  domain: string[];
  userAgent: string;
  pageSize: number;
  source: string;
  locale: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface MangaListResponse {
  id: number;
  name: string;
  author_name?: string;
  cover_mobile_url: string;
  cover_url: string;
  is_nsfw?: boolean;
}

export interface MangaDetailResponse {
  id: number;
  name: string;
  titles?: { name: string }[];
  full_description?: string;
  is_nsfw: boolean;
  author?: { name: string };
  team?: { name: string };
  tags?: { name: string; slug: string }[];
  panorama_url?: string;
  panorama_mobile_url?: string;
}

export interface ChapterListResponse {
  id: number;
  name?: string;
  order?: number;
  number: number;
  status?: string;
  created_at: string;
  updated_at?: string;
}

export interface ChapterDetailResponse {
  manga?: any;
  team?: any;
  data?: any;
  pages: {
    id: number;
    image_url: string;
    drm_data?: string;
  }[];
}
