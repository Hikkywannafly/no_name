import { CuuTruyenParser } from "@/provider/CuuTruyen/CuuTruyenPasrer";
import { TruyenQQParser } from "@/provider/TruyenQQ/TruyenQQPasrer";
import type {
  MangaMergeStrategy,
  SourceConfig,
  UMangaSource,
} from "@/types/manga";
import { MangaMerger } from "../provider/MangaMerger";

export class SourceManager {
  private parsers: Map<string, any> = new Map();
  private merger: MangaMerger;
  private sourceConfigs: SourceConfig[];

  constructor(
    sourceConfigs: SourceConfig[],
    mergeStrategy: MangaMergeStrategy,
  ) {
    this.sourceConfigs = sourceConfigs;
    this.merger = new MangaMerger(sourceConfigs, mergeStrategy);
    this.initializeParsers();
  }

  private initializeParsers() {
    for (const config of this.sourceConfigs) {
      switch (config.name) {
        case "source1":
          this.parsers.set(
            config.name,
            new CuuTruyenParser({
              domain: ["cuutruyen.net"],
              userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              pageSize: 20,
              source: config.name,
              locale: "vi",
            }),
          );
          break;
        case "source2":
          this.parsers.set(
            config.name,
            new TruyenQQParser({
              domain: ["truyenqqgo.com"],
              userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              pageSize: 20,
              source: config.name,
              locale: "vi",
            }),
          );
          break;
      }
    }
  }
  async searchMangaID(name: string): Promise<UMangaSource | UMangaSource[]> {
    console.error("searchMangaID is not implemented in SourceManager", name);
    if (!name.trim()) return [];

    const searchPromises = Array.from(this.parsers.entries()).map(
      async ([sourceName, parser]) => {
        try {
          console.log(`Searching in ${sourceName}...`);

          const searchResult = await parser.searchMangaID(name);
          if (!searchResult) return [];

          const mangaDetails = await parser.getDetails(searchResult);

          return mangaDetails;
        } catch (error) {
          console.error(`Search error from ${sourceName}:`, error);
          return [];
        }
      },
    );

    const results = (await Promise.allSettled(searchPromises))
      .filter(
        (result): result is PromiseFulfilledResult<UMangaSource[]> =>
          result.status === "fulfilled",
      )
      .flatMap((result) => result.value);

    console.log(`Found ${results.length} results for: ${name}`);

    return results;
  }

  //   async searchManga(query: string): Promise<UMangaSource[]> {
  //     const results: UMangaSource[] = [];

  //     for (const [sourceName, parser] of this.parsers) {
  //       try {
  //         const mangas = await parser.getListPage(1, "UPDATED", { query });

  //         for (const manga of mangas) {
  //           results.push({
  //             id: `${sourceName}_${manga.id}`.toString(),
  //             mangaId: "",
  //             sourceName,
  //             sourceId: manga.id,
  //             sourceUrl: manga.publicUrl,
  //             title: manga.title,
  //             description: manga.description || "",
  //             coverUrl: manga.coverUrl,
  //             bannerUrl: null,
  //             largeCoverUrl: manga.largeCoverUrl,
  //             rating: manga.rating,
  //             viewCount: null,
  //             likeCount: null,
  //             isActive: true,
  //             lastUpdated: new Date().toISOString(),
  //             createdAt: new Date().toISOString(),
  //           });
  //         }
  //       } catch (error) {
  //         console.error(`Lỗi khi search từ ${sourceName}:`, error);
  //       }
  //     }

  //     return results;
  //   }

  //   async getMangaDetails(mangaId: string): Promise<UMangaSource[]> {
  //     const results: UMangaSource[] = [];

  //     for (const [sourceName, parser] of this.parsers) {
  //       try {
  //         const manga = await parser.getDetails({
  //           id: mangaId,
  //           source: sourceName,
  //         });

  //         results.push({
  //           id: `${sourceName}_${manga.id}`,
  //           mangaId: "",
  //           sourceName,
  //           sourceId: manga.id,
  //           sourceUrl: manga.publicUrl,
  //           title: manga.title,
  //           description: manga.description || "",
  //           coverUrl: manga.coverUrl,
  //           bannerUrl: null,
  //           largeCoverUrl: manga.largeCoverUrl,
  //           rating: manga.rating,
  //           viewCount: null,
  //           likeCount: null,
  //           isActive: true,
  //           lastUpdated: new Date().toISOString(),
  //           createdAt: new Date().toISOString(),
  //         });
  //       } catch (error) {
  //         console.error(`Lỗi khi lấy details từ ${sourceName}:`, error);
  //       }
  //     }

  //     return results;
  //   }

  async getMergedManga(sources: UMangaSource[]) {
    const mergedManga = this.merger.mergeManga(sources);

    return {
      ...mergedManga,
      coverUrl: this.merger.getBestCoverUrl(sources),
      bannerUrl: this.merger.getBestBannerUrl(sources),
      rating: this.merger.getAggregatedRating(sources),
      viewCount: this.merger.getAggregatedViewCount(sources),
      sources: sources.map((source) => ({
        name: source.sourceName,
        url: source.sourceUrl,
        isActive: source.isActive,
      })),
    };
  }
  //   async getMangaList(page = 1, sortOrder = "UPDATED"): Promise<UMangaSource[]> {
  //     const results: UMangaSource[] = [];

  //     for (const [sourceName, parser] of this.parsers) {
  //       try {
  //         const mangas = await parser.getListPage(page, sortOrder, {});

  //         for (const manga of mangas) {
  //           results.push({
  //             id: `${sourceName}_${manga.id}`,
  //             mangaId: "",
  //             sourceName,
  //             sourceId: manga.id,
  //             sourceUrl: manga.publicUrl,
  //             title: manga.title,
  //             description: manga.description || "",
  //             coverUrl: manga.coverUrl,
  //             bannerUrl: null,
  //             largeCoverUrl: manga.largeCoverUrl,
  //             rating: manga.rating,
  //             viewCount: null,
  //             likeCount: null,
  //             isActive: true,
  //             lastUpdated: new Date().toISOString(),
  //             createdAt: new Date().toISOString(),
  //           });
  //         }
  //       } catch (error) {
  //         console.error(`Lỗi khi lấy danh sách từ ${sourceName}:`, error);
  //       }
  //     }

  //     return results;
  //   }

  /**
   * Lấy chapters từ nguồn cụ thể
   */
  async getChapters(mangaId: string, sourceName: string) {
    const parser = this.parsers.get(sourceName);
    if (!parser) {
      throw new Error(`Không tìm thấy parser cho nguồn ${sourceName}`);
    }

    try {
      const manga = await parser.getDetails({
        id: mangaId,
        source: sourceName,
      });
      return manga.chapters || [];
    } catch (error) {
      console.error(`Lỗi khi lấy chapters từ ${sourceName}:`, error);
      return [];
    }
  }

  /**
   * Lấy pages từ chapter
   */
  async getPages(chapterId: string, sourceName: string) {
    const parser = this.parsers.get(sourceName);
    if (!parser) {
      throw new Error(`Không tìm thấy parser cho nguồn ${sourceName}`);
    }

    try {
      const chapter = {
        id: chapterId,
        source: sourceName,
      };
      return await parser.getPages(chapter);
    } catch (error) {
      console.error(`Lỗi khi lấy pages từ ${sourceName}:`, error);
      return [];
    }
  }

  /**
   * Lấy thông tin cấu hình nguồn
   */
  getSourceConfig(sourceName: string): SourceConfig | undefined {
    return this.sourceConfigs.find((config) => config.name === sourceName);
  }

  /**
   * Kiểm tra nguồn có hỗ trợ tính năng nào không
   */
  hasFeature(
    sourceName: string,
    feature: keyof SourceConfig["features"],
  ): boolean {
    const config = this.getSourceConfig(sourceName);
    return config?.features[feature] || false;
  }
}
