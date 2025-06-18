import { CuuTruyenParser } from "@/provider/CuuTruyenPasrer";
import type {
  MangaMergeStrategy,
  MangaSource,
  SourceConfig,
} from "@/types/manga";
import { MangaMerger } from "./MangaMerger";

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
    // Khởi tạo các parser cho từng nguồn
    for (const config of this.sourceConfigs) {
      if (!config.isActive) continue;

      switch (config.name) {
        case "cuutruyen":
          this.parsers.set(
            config.name,
            new CuuTruyenParser({
              domain: [config.baseUrl.replace("https://", "")],
              userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              pageSize: 20,
              source: config.name,
              locale: "vi",
            }),
          );
          break;
        // Thêm các parser khác ở đây
        // case 'nettruyen':
        //   this.parsers.set(config.name, new NetTruyenParser(config));
        //   break;
      }
    }
  }

  /**
   * Tìm manga từ tất cả các nguồn
   */
  async searchManga(query: string): Promise<MangaSource[]> {
    const results: MangaSource[] = [];

    for (const [sourceName, parser] of this.parsers) {
      try {
        const mangas = await parser.getListPage(1, "UPDATED", { query });

        for (const manga of mangas) {
          results.push({
            id: `${sourceName}_${manga.id}`,
            mangaId: "", // Sẽ được set sau khi merge
            sourceName,
            sourceId: manga.id,
            sourceUrl: manga.publicUrl,
            title: manga.title,
            description: manga.description || "",
            coverUrl: manga.coverUrl,
            bannerUrl: null, // Có thể có hoặc không
            largeCoverUrl: manga.largeCoverUrl,
            rating: manga.rating,
            viewCount: null,
            likeCount: null,
            isActive: true,
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Lỗi khi search từ ${sourceName}:`, error);
      }
    }

    return results;
  }

  /**
   * Lấy thông tin chi tiết manga từ tất cả nguồn
   */
  async getMangaDetails(mangaId: string): Promise<MangaSource[]> {
    const results: MangaSource[] = [];

    for (const [sourceName, parser] of this.parsers) {
      try {
        // Giả sử có method để lấy manga theo ID
        const manga = await parser.getDetails({
          id: mangaId,
          source: sourceName,
        });

        results.push({
          id: `${sourceName}_${manga.id}`,
          mangaId: "",
          sourceName,
          sourceId: manga.id,
          sourceUrl: manga.publicUrl,
          title: manga.title,
          description: manga.description || "",
          coverUrl: manga.coverUrl,
          bannerUrl: null,
          largeCoverUrl: manga.largeCoverUrl,
          rating: manga.rating,
          viewCount: null,
          likeCount: null,
          isActive: true,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Lỗi khi lấy details từ ${sourceName}:`, error);
      }
    }

    return results;
  }

  /**
   * Merge và trả về thông tin manga tổng hợp
   */
  async getMergedManga(sources: MangaSource[]) {
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

  /**
   * Lấy danh sách manga từ tất cả nguồn
   */
  async getMangaList(page = 1, sortOrder = "UPDATED"): Promise<MangaSource[]> {
    const results: MangaSource[] = [];

    for (const [sourceName, parser] of this.parsers) {
      try {
        const mangas = await parser.getListPage(page, sortOrder, {});

        for (const manga of mangas) {
          results.push({
            id: `${sourceName}_${manga.id}`,
            mangaId: "",
            sourceName,
            sourceId: manga.id,
            sourceUrl: manga.publicUrl,
            title: manga.title,
            description: manga.description || "",
            coverUrl: manga.coverUrl,
            bannerUrl: null,
            largeCoverUrl: manga.largeCoverUrl,
            rating: manga.rating,
            viewCount: null,
            likeCount: null,
            isActive: true,
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Lỗi khi lấy danh sách từ ${sourceName}:`, error);
      }
    }

    return results;
  }

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
