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
import * as cheerio from "cheerio";

export class HangTruyenParser {
    private readonly config: ParserConfig;
    private readonly http: AxiosInstance;
    private readonly RATING_UNKNOWN = -1;
    private readonly ADULT_TAG_IDS = new Set(["29", "31", "210", "211", "175", "41", "212"]);

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
            SortOrder.NEWEST,
            SortOrder.POPULARITY,
        ]);
    }

    get filterCapabilities(): MangaListFilterCapabilities {
        return {
            isSearchSupported: true,
            isMultipleTagsSupported: true,
            isSearchWithFiltersSupported: true,
        };
    }

    private generateUid(url: string): string {
        return `${this.config.source}_${Buffer.from(url).toString("base64")}`;
    }

    private urlEncode(str: string): string {
        return encodeURIComponent(str);
    }

    async getFilterOptions(): Promise<MangaListFilterOptions> {
        const url = `https://${this.config.domain[0]}/tim-kiem`;
        const res = await this.http.get(url);
        const $ = cheerio.load(res.data);
        const tags = new Set<MangaTag>();

        $("div.list-genres span").each((_, el) => {
            const $el = $(el);
            const key = $el.attr("data-value");
            const title = $el.text().replace("#", "").trim();
            if (key && title) {
                tags.add({
                    key,
                    title: this.toTitleCase(title),
                    source: this.config.source,
                });
            }
        });

        return {
            availableTags: tags,
            availableStates: new Set([MangaState.ONGOING, MangaState.FINISHED]),
        };
    }

    async searchMangaID(name: string, viName?: string): Promise<UManga | null> {
        const trySearch = async (keyword: string): Promise<string | null> => {
            const url = `https://${this.config.domain[0]}/tim-kiem?keyword=${this.urlEncode(keyword)}&page=1`;
            const res = await this.http.get(url);
            const $ = cheerio.load(res.data);
            const firstResult = $("div.m-post.col-md-6").first();
            const href = firstResult.find("h3.m-name a").attr("href");
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

    async getListPage(
        page: number,
        order: SortOrder,
        filter: MangaListFilter,
    ): Promise<Manga[]> {
        const url = this.buildListUrl(page, order, filter);
        const res = await this.http.get(url);
        const $ = cheerio.load(res.data);
        const mangaList: Manga[] = [];

        $("div.m-post.col-md-6").each((_, div) => {
            const $div = $(div);
            const href = $div.find("h3.m-name a").attr("href") || "";
            const title = $div.find("h3.m-name a").text().trim();
            const ratingText = $div.find("span").text().trim();
            const rating = ratingText ? (Number.parseFloat(ratingText) / 5) * 5 : this.RATING_UNKNOWN;
            const img = $div.find("img.lzl").attr("data-src") ||
                $div.find("img.lzl").attr("data-original") ||
                $div.find("img.lzl").attr("src") || "";

            if (href && title) {
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
                    rating,
                });
            }
        });

        return mangaList;
    }

    async getDetails(mangaUrl: string): Promise<UManga> {
        const url = `https://${this.config.domain[0]}${mangaUrl}`;
        const res = await this.http.get(url);
        const $ = cheerio.load(res.data);

        // Extract manga detail from script tag
        const script = $("script:contains('const mangaDetail')").html();
        let mangaDetail: any = null;

        if (script) {
            const match = script.match(/const mangaDetail = ({.*?});/);
            if (match) {
                try {
                    mangaDetail = JSON.parse(match[1]);
                } catch (e) {
                    console.error("Failed to parse manga detail JSON:", e);
                }
            }
        }

        if (!mangaDetail) {
            throw new Error("Failed to extract manga details");
        }

        const title = mangaDetail.title || "";
        const description = mangaDetail.overview || "";
        const author = mangaDetail.author || null;
        const status = mangaDetail.status;
        const mangaSlug = mangaDetail.slug || "";
        const genres = mangaDetail.genres || [];

        // Process tags
        const tags: string[] = genres.map((genre: any) => genre.id?.toString() || "");
        const isAdult = tags.some(tag => this.ADULT_TAG_IDS.has(tag));

        // Process chapters
        const chapters: UChapter[] = (mangaDetail.chapters || [])
            .map((chapter: any): UChapter => {
                const chapterSlug = chapter.slug || "";
                const chapterUrl = `${mangaSlug}/${chapterSlug}`;
                return {
                    id: encodeURIComponent(chapterUrl),
                    title: chapter.name || null,
                    number: chapter.index || 0,
                    volume: 0,
                    language: "vi",
                    sourceName: this.config.source,
                    sourceId: encodeURIComponent(mangaSlug.trim()),
                    scanlator: null,
                    createdAt: chapter.releasedAt,
                    updatedAt: undefined,
                    extraData: {},
                };
            })
            .reverse();
        console.log("chapters test", chapters);
        return {
            id: this.generateUid(mangaUrl),
            title,
            altTitles: [],
            description,
            authors: author ? new Set([author]) : new Set(),
            artists: [],
            tags,
            status: status === 0 ? MangaState.ONGOING : status === 1 ? MangaState.FINISHED : MangaState.UNKNOWN,
            contentRating: isAdult ? "NSFW" : "SAFE",
            coverUrl: null,
            sources: [
                {
                    sourceName: this.config.source,
                    sourceId: mangaSlug,
                    sourceUrl: url,
                    title,
                    extraData: {},
                },
            ],
            chapters,
            extraData: {},
        };
    }

    async getPages(chapterUrl: string): Promise<UPage[]> {
        const url = `https://${this.config.domain[0]}${chapterUrl}`;
        const res = await this.http.get(url);
        const $ = cheerio.load(res.data);
        const script = $("script:contains('const chapterDetail')").html();
        let chapterDetail: any = null;

        if (script) {
            const match = script.match(/const chapterDetail = ({.*?});/);
            if (match) {
                try {
                    chapterDetail = JSON.parse(match[1]);
                } catch (e) {
                    console.error("Failed to parse chapter detail JSON:", e);
                }
            }
        }

        if (!chapterDetail || !chapterDetail.images) {
            throw new Error("Failed to extract chapter pages");
        }

        const mangaName = chapterDetail.manga?.name || "";
        const chapterName = chapterDetail.name || "";

        return chapterDetail.images
            .sort((a: any, b: any) => (a.index || 0) - (b.index || 0))
            .map((image: any, index: number): UPage => ({
                id: this.generateUid(image.path),
                name: mangaName,
                title: chapterName,
                chapterSourceId: chapterUrl,
                pageNumber: index + 1,
                imageUrl: image.path,
                drmData: null,
                width: null,
                height: null,
                fileSize: null,
                createdAt: new Date(),
                extraData: {},
            }));
    }

    async getChapterListByMangaId(mangaSlug: string): Promise<UChapter[]> {
        const url = `https://${this.config.domain[0]}${decodeURIComponent(mangaSlug).trim()}`;
        const res = await this.http.get(url);
        const $ = cheerio.load(res.data);
        console.log("mangaDetail test", url);
        // Extract manga detail from script tag
        const script = $("script:contains('const mangaDetail')").html();
        let mangaDetail: any = null;

        if (script) {
            const match = script.match(/const mangaDetail = ({.*?});/);
            if (match) {
                try {
                    mangaDetail = JSON.parse(match[1]);
                } catch (e) {
                    console.error("Failed to parse manga detail JSON:", e);
                }
            }
        }

        if (!mangaDetail || !mangaDetail.chapters) {
            return [];
        }

        return mangaDetail.chapters
            .map((chapter: any): UChapter => {
                const chapterSlug = chapter.slug || "";
                const chapterUrl = `${mangaSlug}/${chapterSlug}`;
                return {
                    id: chapterUrl,
                    title: chapter.name || null,
                    name: mangaDetail.title || "",
                    number: chapter.index || 0,
                    volume: 0,
                    language: "vi",
                    sourceName: this.config.source,
                    sourceId: mangaSlug,
                    scanlator: null,
                    createdAt: chapter.releasedAt,
                    updatedAt: undefined,
                    extraData: {},
                };
            })
            .reverse();
    }

    private buildListUrl(
        page: number,
        order: SortOrder,
        filter: MangaListFilter,
    ): string {
        const baseUrl = `https://${this.config.domain[0]}/tim-kiem`;
        const params = new URLSearchParams();

        params.append("page", page.toString());

        // Handle content types
        if (filter.types && filter.types.size > 0) {
            const categoryIds = Array.from(filter.types).map(type => {
                switch (type) {
                    case "MANGA": return "1";
                    case "MANHUA": return "2";
                    case "MANHWA": return "3";
                    case "COMICS": return "4,5";
                    default: return "1,2,3,4,5";
                }
            }).join(",");
            params.append("categoryIds", categoryIds);
        }

        // Handle tags
        if (filter.tags && filter.tags.size > 0) {
            const tagIds = Array.from(filter.tags).map(tag => tag.key).join(",");
            params.append("genreIds", tagIds);
        }

        // Handle sort order
        let orderBy = "view_desc";
        switch (order) {
            case SortOrder.POPULARITY:
                orderBy = "view_desc";
                break;
            case SortOrder.UPDATED:
                orderBy = "udpated_at_date_desc";
                break;
            case SortOrder.NEWEST:
                orderBy = "created_at_date_desc";
                break;
        }
        params.append("orderBy", orderBy);

        // Handle search query
        if (filter.query) {
            const encodedQuery = filter.query.split(/\s+/).join("+");
            params.append("keyword", encodedQuery);
        }

        return `${baseUrl}?${params.toString()}`;
    }

    private toTitleCase(str: string): string {
        return str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
} 