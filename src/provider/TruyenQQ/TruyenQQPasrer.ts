import {
  ContentRating,
  type Manga,
  type MangaListFilter,
  type MangaListFilterCapabilities,
  type MangaListFilterOptions,
  MangaState,
  type MangaTag,
  type ParserConfig,
  SortOrder,
} from "@/provider/CuuTruyen/type";
import type { UChapter, UManga, UPage } from "@/types/manga";
import axios, { type AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";

export class TruyenQQParser {
  private readonly config: ParserConfig;
  private readonly http: AxiosInstance;
  private readonly RATING_UNKNOWN = -1;

  constructor(config: ParserConfig) {
    this.config = config;
    this.http = axios.create({
      headers: {
        "User-Agent": config.userAgent,
        referrer: `https://${config.domain[0]}/`,
      },
    });
    const jar = new CookieJar();
    this.http = wrapper(axios.create({ jar }));
  }

  get availableSortOrders(): Set<SortOrder> {
    return new Set([SortOrder.UPDATED, SortOrder.NEWEST, SortOrder.POPULARITY]);
  }
  get filterCapabilities(): MangaListFilterCapabilities {
    return {
      isSearchSupported: true,
    };
  }
  async fetchWithSession(url: string): Promise<any> {
    await this.http.get(`https://${this.config.domain[0]}/`);

    return await this.http.get(url);
  }
  // searchMangaID
  async searchMangaID(name: string, viName?: string): Promise<any> {

    const trySearch = async (keyword: string): Promise<string | null> => {
      const url = `https://${this.config.domain[0]}/tim-kiem/trang-1.html?q=${encodeURIComponent(keyword)}`;
      const res = await this.fetchWithSession(url);
      const $ = cheerio.load(res.data);
      const firstResult = $("#main_homepage li").first();
      const firstBookA = firstResult.find("a").first();
      const href = firstBookA.attr("href");
      return href ? href.toString() : null;
    };

    if (viName) {
      const href = await trySearch(viName);
      if (href) {
        return await this.getDetails(href);
      }
    }

    let href = await trySearch(name);
    if (href) {
      return await this.getDetails(href);
    }
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      const halfLength = Math.floor(nameParts.length / 2);
      const halfName = nameParts.slice(0, halfLength).join(" ");
      href = await trySearch(halfName);
      if (href) {
        return await this.getDetails(href);
      }
    }
    return null;
  }

  async getFilterOptions(): Promise<MangaListFilterOptions> {
    const url = `https://${this.config.domain[0]}/tim-kiem-nang-cao.html`;
    const res = await this.http.get(url);
    const $ = cheerio.load(res.data);
    const tags = new Set<MangaTag>();
    $(".advsearch-form div.genre-item span[data-id]").each((_, el) => {
      tags.add({
        key: $(el).attr("data-id") || "",
        title: $(el).text().trim(),
        source: this.config.source,
      });
    });
    return {
      availableTags: tags,
      availableStates: new Set([MangaState.ONGOING, MangaState.FINISHED]),
    };
  }

  private generateUid(url: string): string {
    return `${this.config.source}_${Buffer.from(url).toString("base64")}`;
  }

  async getListPage(
    page: number,
    // order: SortOrder,
    filter: MangaListFilter,
  ): Promise<Manga[]> {
    let url = "";
    if (filter.query) {
      url = `https://${this.config.domain[0]}/tim-kiem/trang-${page}.html?q=${encodeURIComponent(filter.query)}`;
    } else {
      url = `https://${this.config.domain[0]}/tim-kiem-nang-cao/trang-${page}.html?country=0&sort=2&status=-1&category=&notcategory=&minchapter=0`;
      // TODO: Xử lý filter.tags, filter.states nếu cần
    }

    const res = await this.http.get(url);
    const $ = cheerio.load(res.data);
    const mangaList: Manga[] = [];
    $("#main_homepage li").each((_, li) => {
      const $li = $(li);
      const a = $li.find("a").first();
      const href = a.attr("href") || "";
      const title = $li.find(".book_name").text().trim();
      const img = $li.find("img").attr("src") || "";
      if (href && title && img) {
        mangaList.push({
          id: this.generateUid(href),
          url: href,
          publicUrl: `https://${this.config.domain[0]}${href}`,
          title,
          altTitles: new Set(),
          coverUrl: img,
          largeCoverUrl: img,
          authors: new Set(),
          tags: new Set(),
          state: null,
          description: null,
          contentRating: ContentRating.SAFE,
          source: this.config.source,
          rating: this.RATING_UNKNOWN,
        });
      }
    });
    return mangaList;
  }

  async getDetails(mangaUrl: string): Promise<UManga> {
    const url = `https://${this.config.domain[0]}${mangaUrl}`;
    const res = await this.http.get(url);
    const $ = cheerio.load(res.data);
    // altTitles
    const altTitles: string[] = [];
    const alt = $("h2.other-name").text().trim();
    if (alt) {
      const titles = alt
        .split(/;|,|\n/)
        .map((title) => title.trim())
        .filter((title) => !!title);
      altTitles.push(...titles);
    }

    const tags: string[] = [];
    $("ul.list01 li a").each((_, el) => {
      const key =
        $(el).attr("href")?.split("-").pop()?.replace(".html", "") || "";
      tags.push(key);
    });

    // state
    let status: MangaState = MangaState.UNKNOWN;
    const stateText = $(".status p.col-xs-9").text().trim();
    if (stateText === "Đang Cập Nhật") status = MangaState.ONGOING;
    else if (stateText === "Hoàn Thành") status = MangaState.FINISHED;

    // authors
    const authors: string[] = [];
    const author = $("li.author a").first().text().trim();
    if (author) authors.push(author);

    // description
    const description = $(".story-detail-info").html() || "";

    const title = $("h1.title").text().trim();
    const coverUrl = $(".story-info-left img").attr("src") || null;

    const chapters: UChapter[] = $("div.list_chapter div.works-chapter-item")
      .get()
      .reverse()
      .map((div) => {
        const $div = $(div);
        const a = $div.find("a").first();
        const href = a.attr("href") || "";
        const name = a.text().trim();
        const dateText = $div.find(".time-chap").text().trim();
        const match = name.match(/(Chương|Chapter|Chuong)\s*(\d+(?:\.\d+)?)/i);
        return {
          id: href.split("/").pop()?.replace(".html", "") || "",
          title: name,
          number: match ? Number.parseFloat(match[2]) : 0,
          volume: 0,
          language: "vi",
          sourceName: this.config.source,
          scanlator: null,
          createdAt: dateText || undefined,
          updatedAt: undefined,
          extraData: {},
        };
      });

    return {
      id: this.generateUid(mangaUrl),
      title,
      altTitles,
      description,
      authors,
      artists: [],
      tags,
      status,
      contentRating: "SAFE",
      coverUrl,
      bannerUrl: null,
      largeCoverUrl: null,
      sources: [
        {
          sourceName: this.config.source,
          sourceId: mangaUrl,
          sourceUrl: url,
          title,
          coverUrl,
          extraData: {},
        },
      ],
      chapters,
      extraData: {},
    };
  }

  async getPages(chapterUrl: string): Promise<UPage[]> {
    const url = `https://${this.config.domain[0]}/truyen-tranh/${chapterUrl}.html`;
    const res = await this.http.get(url);
    const $ = cheerio.load(res.data);
    const pages: UPage[] = [];
    $(".chapter_content .page-chapter img").each((_, img) => {
      const src = $(img).attr("src") || "";
      if (src) {
        pages.push({
          id: this.generateUid(src),
          imageUrl: src,
          chapterSourceId: chapterUrl,
          pageNumber: undefined,
          drmData: null,
          width: null,
          height: null,
          fileSize: null,
          createdAt: new Date(),
          extraData: {},
        });
      }
    });
    return pages;
  }
}
