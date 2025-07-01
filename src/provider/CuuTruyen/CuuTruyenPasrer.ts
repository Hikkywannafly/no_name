import axios, { type AxiosInstance } from "axios";

import {
  type ApiResponse,
  type ChapterDetailResponse,
  type ChapterListResponse,
  ContentRating,
  type Manga,
  type MangaChapter,
  type MangaDetailResponse,
  type MangaListFilter,
  type MangaListFilterCapabilities,
  type MangaListFilterOptions,
  type MangaListResponse,
  type MangaPage,
  MangaState,
  type MangaTag,
  type ParserConfig,
  SortOrder,
} from "@/provider/CuuTruyen/type";

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
    return `${this.config.source}_${id}`;
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

  async getDetails(manga: Manga): Promise<Manga> {
    const [chaptersResponse, detailsResponse] = await Promise.all([
      this.http.get<ApiResponse<ChapterListResponse[]>>(
        `https://${this.config.domain[0]}${manga.url}/chapters`,
      ),
      this.http.get<ApiResponse<MangaDetailResponse>>(
        `https://${this.config.domain[0]}${manga.url}`,
      ),
    ]);

    const details = detailsResponse.data.data;
    console.log(details);
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

    const newTags = new Set(
      Array.from(tags).filter(
        (tag) => tag.key !== "da-hoan-thanh" && tag.key !== "dang-tien-hanh",
      ),
    );

    const author = details.author?.name?.split(",")[0] || null;
    const title = details.name || manga.title;
    const team = details.team?.name || null;

    const chapters = chaptersResponse.data.data
      .map((chapter: ChapterListResponse) => ({
        id: this.generateUid(chapter.id),
        title: chapter.name || null,
        number: chapter.number || 0,
        volume: 0,
        url: `/api/v2/chapters/${chapter.id}`,
        scanlator: team,
        uploadDate: chapter.created_at ? new Date(chapter.created_at) : null,
        branch: null,
        source: this.config.source,
      }))
      .reverse();
    console.log(chapters);
    return {
      ...manga,
      title,
      altTitles: new Set(
        (details.titles || [])
          .map((t: { name: string }) => t.name)
          .filter((t: string) => t !== title),
      ),
      contentRating: details.is_nsfw ? ContentRating.ADULT : ContentRating.SAFE,
      authors: new Set(author ? [author] : []),
      description: details.full_description || null,
      tags: newTags,
      state,
      chapters,
    };
  }

  async getPages(chapter: MangaChapter): Promise<MangaPage[]> {
    const response = await this.http.get<ApiResponse<ChapterDetailResponse>>(
      `https://${this.config.domain[0]}${chapter.url}`,
    );

    return response.data.data.pages.map(
      (page: { id: number; image_url: string; drm_data?: string }) => {
        const imageUrl = new URL(page.image_url);
        console.log(imageUrl);
        if (page.drm_data) {
          imageUrl.hash = this.DRM_DATA_KEY + page.drm_data;
        }

        return {
          id: this.generateUid(page.id),
          url: imageUrl.toString(),
          preview: null,
          source: this.config.source,
        };
      },
    );
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
    // This is a simplified version of the tags list
    // You should expand this with all the tags from the original parser
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
