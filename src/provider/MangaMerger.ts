// import type {
//   Manga,
//   MangaMergeStrategy,
//   MangaSource,
//   SourceConfig,
// } from "@/types/manga";

// export class MangaMerger {
//   private sourceConfigs: Map<string, SourceConfig>;
//   private mergeStrategy: MangaMergeStrategy;

//   constructor(
//     sourceConfigs: SourceConfig[],
//     mergeStrategy: MangaMergeStrategy,
//   ) {
//     this.sourceConfigs = new Map(
//       sourceConfigs.map((config) => [config.name, config]),
//     );
//     this.mergeStrategy = mergeStrategy;
//   }

//   mergeManga(sources: MangaSource[]): Manga {
//     if (sources.length === 0) {
//       throw new Error("Không có nguồn dữ liệu để merge");
//     }

//     // Sắp xếp theo priority
//     const sortedSources = this.sortByPriority(sources);

//     return {
//       id: this.generateMangaId(sources),
//       title: this.mergeTitle(sortedSources),
//       altTitles: this.mergeAltTitles(sortedSources),
//       description: this.mergeDescription(sortedSources),
//       authors: this.mergeAuthors(sortedSources),
//       artists: this.mergeArtists(sortedSources),
//       tags: this.mergeTags(sortedSources),
//       status: this.mergeStatus(sortedSources),
//       contentRating: this.mergeContentRating(sortedSources),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//   }

//   /**
//    * Lấy cover URL tốt nhất
//    */
//   getBestCoverUrl(sources: MangaSource[]): string | null {
//     const sortedSources = this.sortByPriority(sources);

//     for (const source of sortedSources) {
//       if (source.coverUrl) {
//         return source.coverUrl;
//       }
//     }

//     return null;
//   }

//   /**
//    * Lấy banner URL tốt nhất
//    */
//   getBestBannerUrl(sources: MangaSource[]): string | null {
//     const sortedSources = this.sortByPriority(sources);

//     for (const source of sortedSources) {
//       if (source.bannerUrl) {
//         return source.bannerUrl;
//       }
//     }

//     return null;
//   }

//   /**
//    * Lấy rating tổng hợp
//    */
//   getAggregatedRating(sources: MangaSource[]): number | null {
//     const validRatings = sources
//       .filter((source) => source.rating !== null && source.rating > 0)
//       .map((source) => source.rating as number);

//     if (validRatings.length === 0) return null;

//     switch (this.mergeStrategy.rating) {
//       case "AVERAGE":
//         return (
//           validRatings.reduce((sum, rating) => sum + rating, 0) /
//           validRatings.length
//         );
//       case "HIGHEST":
//         return Math.max(...validRatings);
//       case "MOST_VOTES":
//         // Giả sử có thêm field voteCount, ở đây dùng rating cao nhất
//         return Math.max(...validRatings);
//       default:
//         return validRatings[0];
//     }
//   }

//   /**
//    * Lấy view count tổng hợp
//    */
//   getAggregatedViewCount(sources: MangaSource[]): number | null {
//     const validViewCounts = sources
//       .filter((source) => source.viewCount !== null && source.viewCount > 0)
//       .map((source) => source.viewCount as number);

//     if (validViewCounts.length === 0) return null;

//     return validViewCounts.reduce((sum, count) => sum + count, 0);
//   }

//   private sortByPriority(sources: MangaSource[]): MangaSource[] {
//     return sources.sort((a, b) => {
//       const configA = this.sourceConfigs.get(a.sourceName);
//       const configB = this.sourceConfigs.get(b.sourceName);

//       const priorityA = configA?.priority || 0;
//       const priorityB = configB?.priority || 0;

//       return priorityB - priorityA; // Cao hơn = ưu tiên hơn
//     });
//   }

//   private generateMangaId(sources: MangaSource[]): string {
//     // Tạo ID duy nhất dựa trên title và authors
//     const firstSource = sources[0];
//     const title = firstSource.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
//     const authors = firstSource.description.split(" ").slice(0, 2).join("-");
//     return `${title}-${authors}-${Date.now()}`;
//   }

//   private mergeTitle(sources: MangaSource[]): string {
//     switch (this.mergeStrategy.title) {
//       case "PRIORITY_SOURCE":
//         return sources[0].title;
//       case "MOST_COMPLETE":
//         return sources.reduce((best, current) =>
//           current.title.length > best.title.length ? current : best,
//         ).title;
//       case "MANUAL":
//         // Có thể implement logic manual selection
//         return sources[0].title;
//       default:
//         return sources[0].title;
//     }
//   }

//   private mergeAltTitles(sources: MangaSource[]): string[] {
//     const allTitles = new Set<string>();

//     for (const source of sources) {
//       // Giả sử altTitles được lưu trong description hoặc title
//       // Có thể parse từ description để lấy các title khác
//       if (source.title) {
//         allTitles.add(source.title);
//       }
//     }

//     return Array.from(allTitles);
//   }

//   private mergeDescription(sources: MangaSource[]): string {
//     switch (this.mergeStrategy.description) {
//       case "PRIORITY_SOURCE":
//         return sources[0].description;
//       case "MOST_COMPLETE":
//         return sources.reduce((best, current) =>
//           current.description.length > best.description.length ? current : best,
//         ).description;
//       case "MANUAL":
//         return sources[0].description;
//       default:
//         return sources[0].description;
//     }
//   }

//   private mergeAuthors(sources: MangaSource[]): string[] {
//     const allAuthors = new Set<string>();

//     for (const source of sources) {
//       // Parse authors từ description hoặc có field riêng
//       // Giả sử authors được lưu trong description
//       const authorMatch = source.description.match(/Tác giả[:\s]+([^\n]+)/i);
//       if (authorMatch) {
//         allAuthors.add(authorMatch[1].trim());
//       }
//     }

//     return Array.from(allAuthors);
//   }

//   private mergeArtists(_sources: MangaSource[]): string[] {
//     // Tương tự như authors
//     return [];
//   }

//   private mergeTags(sources: MangaSource[]): string[] {
//     switch (this.mergeStrategy.tags) {
//       case "UNION": {
//         const allTags = new Set<string>();
//         for (const source of sources) {
//           // Parse tags từ description hoặc có field riêng
//           // Giả sử tags được lưu trong description
//           const tagMatches = source.description.match(/#(\w+)/g);
//           if (tagMatches) {
//             for (const tag of tagMatches) {
//               allTags.add(tag.slice(1));
//             }
//           }
//         }
//         return Array.from(allTags);
//       }
//       case "INTERSECTION":
//         // Chỉ lấy tags xuất hiện ở tất cả sources
//         return [];
//       case "PRIORITY_SOURCE": {
//         const firstSource = sources[0];
//         const tagMatches = firstSource.description.match(/#(\w+)/g);
//         return tagMatches ? tagMatches.map((tag) => tag.slice(1)) : [];
//       }
//       default:
//         return [];
//     }
//   }

//   private mergeStatus(_sources: MangaSource[]): Manga["status"] {
//     // Logic để merge status từ nhiều nguồn
//     // Có thể dựa vào priority hoặc most recent
//     return "ONGOING"; // Default
//   }

//   private mergeContentRating(sources: MangaSource[]): Manga["contentRating"] {
//     // Logic để merge content rating
//     // Nếu có bất kỳ nguồn nào là NSFW thì return NSFW
//     const hasNSFW = sources.some(
//       (source) =>
//         source.description.toLowerCase().includes("nsfw") ||
//         source.description.toLowerCase().includes("18+"),
//     );

//     if (hasNSFW) return "NSFW";

//     const hasSuggestive = sources.some(
//       (source) =>
//         source.description.toLowerCase().includes("suggestive") ||
//         source.description.toLowerCase().includes("ecchi"),
//     );

//     if (hasSuggestive) return "SUGGESTIVE";

//     return "SAFE";
//   }
// }

() => {};
