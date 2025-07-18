import {
  ContentRating,
  type Manga,
  type MangaChapter,
  type MangaListFilter,
  type MangaListFilterCapabilities,
  type MangaListFilterOptions,
  type MangaPage,
  MangaState,
  type MangaTag,
  type ParserConfig,
  SortOrder,
} from "@/provider/CuuTruyen/type";
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

  // async searchMangaID(
  //     name: string,
  // ): Promise<any> {

  //     const url = `https://${this.config.domain[0]}/tim-kiem/trang-1.html?q=${encodeURIComponent(name)}`;
  //     const res = await this.fetchWithSession(url);
  //     const $ = cheerio.load(res.data);
  //     const firstResult = $("#main_homepage li").first();
  //     const firstBookA = firstResult.find("a").first();
  //     const href = firstBookA.attr("href");
  //     return await this.getDetails(href?.toString() || "");
  // }

  async searchMangaID(name: string): Promise<any> {
    const trySearch = async (keyword: string): Promise<string | null> => {
      const url = `https://${this.config.domain[0]}/tim-kiem/trang-1.html?q=${encodeURIComponent(keyword)}`;
      const res = await this.fetchWithSession(url);
      const $ = cheerio.load(res.data);
      const firstResult = $("#main_homepage li").first();
      const firstBookA = firstResult.find("a").first();
      const href = firstBookA.attr("href");
      return href ? href.toString() : null;
    };
    console.log("Trying full name:", name);
    let href = await trySearch(name);
    if (href) {
      return await this.getDetails(href);
    }
    const nameParts = name.split(" ");

    // if (nameParts.length > 4) {
    //     const shortenedOnce = nameParts.slice(0, nameParts.length - 4).join(" ");
    //     console.log("Trying shortened once (-4 words):", shortenedOnce);
    //     href = await trySearch(shortenedOnce);
    //     if (href) {
    //         return await this.getDetails(href);
    //     }
    // }

    if (nameParts.length > 1) {
      const halfLength = Math.floor(nameParts.length / 2);
      const halfName = nameParts.slice(0, halfLength).join(" ");
      console.log("Trying half name:", halfName);
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

  // async getListPage(
  //     name: string,
  // ): Promise<any> {

  //     const url = `https://${this.config.domain[0]}/tim-kiem/trang-1.html?q=${encodeURIComponent(name)}`
  //     const res = await this.http.get(url);

  //     const $ = cheerio.load(res.data);
  //     const firstBookA = $('#main_homepage .list_grid.grid li .book_avatar a');
  //     const href = firstBookA.attr('href');

  //     console.log("Href ảnh bìa:", href, name);

  //     // const mangaList: Manga[] = [];
  //     // $("#main_homepage li").each((_, li) => {
  //     //     const $li = $(li);
  //     //     const a = $li.find("a").first();
  //     //     const href = a.attr("href") || "";
  //     //     const title = $li.find(".book_name").text().trim();
  //     //     const img = $li.find("img").attr("src") || "";
  //     //     if (href && title && img) {
  //     //         mangaList.push({
  //     //             id: this.generateUid(href),
  //     //             url: href,
  //     //             publicUrl: `https://${this.config.domain[0]}${href}`,
  //     //             title,
  //     //             altTitles: new Set(),
  //     //             coverUrl: img,
  //     //             largeCoverUrl: img,
  //     //             authors: new Set(),
  //     //             tags: new Set(),
  //     //             state: null,
  //     //             description: null,
  //     //             contentRating: ContentRating.SAFE,
  //     //             source: this.config.source,
  //     //             rating: this.RATING_UNKNOWN,
  //     //         });
  //     //     }
  //     // });
  //     // return mangaList;
  // }

  async getDetails(mangaUrl: string): Promise<Manga> {
    const url = `https://${this.config.domain[0]}${mangaUrl}`;
    const res = await this.http.get(url);
    const $ = cheerio.load(res.data);
    // altTitles
    const altTitles = new Set<string>();
    const alt = $("h2.other-name").text().trim();
    if (alt) {
      const titles = alt
        .split(/;|,|\n/)
        .map((title) => title.trim())
        .filter((title) => !!title);
      for (const title of titles) {
        altTitles.add(title);
      }
    }

    const tags = new Set<MangaTag>();
    $("ul.list01 li a").each((_, el) => {
      const key =
        $(el).attr("href")?.split("-").pop()?.replace(".html", "") || "";
      tags.add({
        key,
        title: $(el).text().trim(),
        source: this.config.source,
      });
    });

    // state
    let state: MangaState | null = null;
    const stateText = $(".status p.col-xs-9").text().trim();
    if (stateText === "Đang Cập Nhật") state = MangaState.ONGOING;
    else if (stateText === "Hoàn Thành") state = MangaState.FINISHED;

    // authors
    const authors = new Set<string>();
    const author = $("li.author a").first().text().trim();
    if (author) authors.add(author);

    // description
    const description = $(".story-detail-info").html() || null;

    const title = $("h1.title").text().trim();

    const chapters: MangaChapter[] = $(
      "div.list_chapter div.works-chapter-item",
    )
      .get()
      .reverse()
      .map((div) => {
        const $div = $(div);
        const a = $div.find("a").first();
        const href = a.attr("href") || "";
        const name = a.text().trim();
        const dateText = $div.find(".time-chap").text().trim();
        return {
          id: this.generateUid(href),
          title: "",
          number: Number(name.match(/(\\d+)(?!.*\\d)/)),
          volume: 0,
          url: href,
          scanlator: null,
          uploadDate: new Date(dateText),
          branch: null,
          source: this.config.source,
        };
      });

    return {
      id: this.generateUid(mangaUrl),
      url: mangaUrl,
      publicUrl: url,
      title: title,
      coverUrl: "",
      largeCoverUrl: "",
      contentRating: ContentRating.SAFE,
      source: this.config.source,
      rating: this.RATING_UNKNOWN,
      altTitles,
      tags,
      state,
      authors,
      description,
      chapters,
    };
  }

  async getPages(chapter: MangaChapter): Promise<MangaPage[]> {
    const url = `https://${this.config.domain[0]}${chapter.url}`;
    const res = await this.http.get(url);
    const $ = cheerio.load(res.data);
    const pages: MangaPage[] = [];
    $(".chapter_content .page-chapter img").each((_, img) => {
      const src = $(img).attr("src") || "";
      if (src) {
        pages.push({
          id: this.generateUid(src),
          url: src,
          preview: null,
          source: this.config.source,
        });
      }
    });
    return pages;
  }
}
