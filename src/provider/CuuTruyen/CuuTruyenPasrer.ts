import {
  type ApiResponse,
  type ChapterDetailResponse,
  type ChapterListResponse,
  ContentRating,
  type Manga,
  type MangaDetailResponse,
  type MangaListFilter,
  type MangaListFilterCapabilities,
  type MangaListFilterOptions,
  type MangaListResponse,
  MangaState,
  type MangaTag,
  type ParserConfig,
  SortOrder,
} from "@/provider/CuuTruyen/type";
import type { UChapter, UManga, UPage } from "@/types/manga";
import { formatUploadDate } from "@/utils";
import axios, { type AxiosInstance } from "axios";

export class CuuTruyenParser {
  private readonly config: ParserConfig;
  private readonly http: AxiosInstance;
  private readonly RATING_UNKNOWN = -1;
  private readonly DRM_DATA_KEY = "drm_data=";
  private readonly DECRYPTION_KEY = "3141592653589793";

  constructor(config: ParserConfig) {
    this.config = config;
    this.http = axios.create({
      headers: {
        "User-Agent": config.userAgent,
        referer: `https://${config.domain[0]}/`,
      },
    });
  }

  get availableSortOrders(): Set<SortOrder> {
    return new Set([
      SortOrder.UPDATED,
      SortOrder.POPULARITY,
      SortOrder.NEWEST,
      SortOrder.POPULARITY_WEEK,
      SortOrder.POPULARITY_MONTH,
    ]);
  }

  get filterCapabilities(): MangaListFilterCapabilities {
    return {
      isSearchSupported: true,
    };
  }

  private generateUid(id: number): string {
    // return `${this.config.source}_${id}`;
    return `${id}`;
  }

  private urlEncode(str: string): string {
    return encodeURIComponent(str);
  }

  async getFilterOptions(): Promise<MangaListFilterOptions> {
    return {
      availableTags: this.getAvailableTags(),
      availableStates: new Set([MangaState.ONGOING, MangaState.FINISHED]),
    };
  }

  // searchMangaID(name ) => Umanga

  async searchMangaID(name: string): Promise<UManga | null> {
    const url = `https://${this.config.domain[0]}/api/v2/mangas/quick_search?q=${this.urlEncode(name)}`;
    try {
      const response =
        await this.http.get<ApiResponse<MangaListResponse[]>>(url);
      const data = response.data.data[0];
      if (!data) return null;
      const urlNew = `/api/v2/mangas/${data.id}`;

      return this.getDetails(urlNew);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        return null;
      }
      throw error;
    }
  }

  async getDetails(url: string): Promise<UManga> {
    const [chaptersResponse, detailsResponse] = await Promise.all([
      this.http.get<ApiResponse<ChapterListResponse[]>>(
        `https://${this.config.domain[0]}${url}/chapters`,
      ),
      this.http.get<ApiResponse<MangaDetailResponse>>(
        `https://${this.config.domain[0]}${url}`,
      ),
    ]);
    const details = detailsResponse.data.data;
    const tags = new Set<MangaTag>(
      (details.tags || []).map((tag: { name: string; slug: string }) => ({
        title: this.toTitleCase(tag.name),
        key: tag.slug,
        source: this.config.source,
      })),
    );

    const state = tags.has({ key: "da-hoan-thanh", title: "", source: "" })
      ? MangaState.FINISHED
      : MangaState.ONGOING;

    const newTags: string[] = Array.from(tags)
      .filter(
        (tag) => tag.key !== "da-hoan-thanh" && tag.key !== "dang-tien-hanh",
      )
      .map((tag) => tag.key);

    const author = details.author?.name?.split(",")[0] || null;
    const title = details.name;
    const altTitles: string[] = Array.from(
      new Set(
        (details.titles || []).map((t) => t.name).filter((t) => t !== title),
      ),
    );
    const team = details.team?.name || null;
    const panorama_url = details.panorama_url;
    const panorama_mobile_url = details.panorama_mobile_url;
    const chapters: UChapter[] = chaptersResponse.data.data
      .map((chapter: ChapterListResponse): UChapter => {
        return {
          id: this.generateUid(chapter.id),
          title: chapter.name || null,
          number: chapter.number || 0,
          volume: 0,
          language: "vi",
          sourceName: this.config.source,
          sourceId: url.match(/\d+$/)?.[0],
          scanlator: team,
          createdAt: chapter.created_at
            ? formatUploadDate(chapter.created_at)
            : undefined,
          updatedAt: undefined,
          extraData: {},
        };
      })
      .reverse();

    return {
      id: this.generateUid(details.id),
      // anilistId: 0,
      title: title,
      altTitles: altTitles,
      description: details.full_description || "",
      authors: author ? new Set([author]) : new Set(),
      artists: [],
      tags: newTags,
      status: state,
      contentRating: details.is_nsfw ? "NSFW" : "SAFE",
      coverUrl: null,
      sources: [
        {
          sourceName: this.config.source,
          sourceId: details.id.toString(),
          sourceUrl: `https://${this.config.domain[0]}/manga/${details.id}`,
          title: details.name,
          extraData: {},
        },
      ],
      chapters: chapters,
      extraData: {
        panoramaUrl: panorama_url || null,
        panoramaMobileUrl: panorama_mobile_url || null,
      },
    };
  }

  async getChapterList(name: string): Promise<any[]> {
    const url = `https://${this.config.domain[0]}/api/v2/mangas/quick_search?q=${this.urlEncode(name)}`;
    try {
      const response =
        await this.http.get<ApiResponse<MangaListResponse[]>>(url);
      const data = response.data.data;
      return data.map((manga: MangaListResponse) => ({
        id: this.generateUid(manga.id),
        url: `/api/v2/mangas/${manga.id}`,
        publicUrl: `https://${this.config.domain[0]}/manga/${manga.id}`,
        title: manga.name,
        coverUrl: manga.cover_mobile_url,
        largeCoverUrl: manga.cover_url,
        source: this.config.source,
        rating: this.RATING_UNKNOWN,
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  }

  async getListPage(
    page: number,
    order: SortOrder,
    filter: MangaListFilter,
  ): Promise<Manga[]> {
    const url = this.buildListUrl(page, order, filter);

    try {
      const response =
        await this.http.get<ApiResponse<MangaListResponse[]>>(url);
      const data = response.data.data;
      return data.map((manga: MangaListResponse) => ({
        id: this.generateUid(manga.id),
        url: `/api/v2/mangas/${manga.id}`,
        publicUrl: `https://${this.config.domain[0]}/manga/${manga.id}`,
        title: manga.name,
        altTitles: new Set<string>(),
        coverUrl: manga.cover_mobile_url,
        largeCoverUrl: manga.cover_url,
        authors: new Set(manga.author_name ? [manga.author_name] : []),
        tags: new Set<MangaTag>(),
        state: null,
        description: null,
        contentRating: manga.is_nsfw ? ContentRating.ADULT : ContentRating.SAFE,
        source: this.config.source,
        rating: this.RATING_UNKNOWN,
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  }

  async getPages(chapter: any): Promise<UPage[]> {
    const res = await this.http.get<ApiResponse<ChapterDetailResponse>>(
      `https://${this.config.domain[0]}/api/v2/chapters/${chapter}`,
    );

    return res.data.data.pages.map(
      (page: { id: number; image_url: string; drm_data?: string }) => {
        return {
          id: this.generateUid(page.id),
          name: res.data.data?.manga?.name,
          title: res.data.data?.data?.name,
          chapterSourceId: chapter,
          pageNumber: page.id, // Assuming page.id is the page number
          imageUrl: page.image_url.toString(),
          drmData: page.drm_data || null,
          width: null, // Width not provided in the response
          height: null, // Height not provided in the response
          fileSize: null, // File size not provided in the response
          createdAt: new Date(), // Assuming current date as createdAt
          extraData: {},
        };
      },
    );
  }

  async getChapterListByMangaId(mangaUrl: string): Promise<UChapter[]> {
    const res = await this.http.get<ApiResponse<ChapterListResponse[]>>(
      `https://${this.config.domain[0]}/api/v2/mangas/${mangaUrl}/chapters`,
    );
    const chapters: UChapter[] = res.data.data
      .map((chapter: ChapterListResponse): UChapter => {
        return {
          id: this.generateUid(chapter.id),
          title: chapter.name || null,
          number: chapter.number || 0,
          sourceId: mangaUrl.match(/\d+$/)?.[0],
          volume: 0,
          language: "vi",
          sourceName: this.config.source,

          // sources: [source],
          createdAt: chapter.created_at
            ? formatUploadDate(chapter.created_at)
            : undefined,
          updatedAt: chapter.updated_at
            ? formatUploadDate(chapter.updated_at)
            : undefined,
          extraData: {},
        };
      })
      .reverse();

    return chapters;
  }

  private buildListUrl(
    page: number,
    order: SortOrder,
    filter: MangaListFilter,
  ): string {
    const baseUrl = `https://${this.config.domain[0]}`;
    let url = "";

    if (filter.query) {
      url = `${baseUrl}/api/v2/mangas/search?q=${this.urlEncode(filter.query)}&page=${page}`;
    } else {
      const tag = filter.tags?.size === 1 ? Array.from(filter.tags)[0] : null;
      if (tag) {
        url = `${baseUrl}/api/v2/tags/${tag.key}`;
      } else if (filter.states?.size === 1) {
        const state = Array.from(filter.states)[0];
        url = `${baseUrl}/api/v2/tags/${
          state === MangaState.ONGOING ? "dang-tien-hanh" : "da-hoan-thanh"
        }`;
      } else {
        url = `${baseUrl}/api/v2/mangas`;
        switch (order) {
          case SortOrder.UPDATED:
          case SortOrder.NEWEST:
            url += "/recently_updated";
            break;
          case SortOrder.POPULARITY:
            url += "/top?duration=all";
            break;
          case SortOrder.POPULARITY_WEEK:
            url += "/top?duration=week";
            break;
          case SortOrder.POPULARITY_MONTH:
            url += "/top?duration=month";
            break;
        }
      }

      if (
        [
          SortOrder.POPULARITY,
          SortOrder.POPULARITY_WEEK,
          SortOrder.POPULARITY_MONTH,
        ].includes(order)
      ) {
        url += `&page=${page}`;
      } else {
        url += `?page=${page}`;
      }
    }

    return `${url}&per_page=${this.config.pageSize}`;
  }

  private toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private getAvailableTags(): Set<MangaTag> {
    return new Set([
      { title: "School Life", key: "school-life", source: this.config.source },
      { title: "Action", key: "action", source: this.config.source },
      { title: "Adventure", key: "adventure", source: this.config.source },
      { title: "Comedy", key: "comedy", source: this.config.source },
      { title: "Drama", key: "drama", source: this.config.source },
      { title: "Fantasy", key: "fantasy", source: this.config.source },
      { title: "Horror", key: "horror", source: this.config.source },
      { title: "Romance", key: "romance", source: this.config.source },
      { title: "Sci-fi", key: "sci-fi", source: this.config.source },
      {
        title: "Slice of Life",
        key: "slice-of-life",
        source: this.config.source,
      },
    ]);
  }
}
