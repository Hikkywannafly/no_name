import { CuuTruyenParser } from "../../src/provider/CuuTruyenPasrer";
import { MangaState, SortOrder } from "../../src/provider/type";

// Integration tests - these make real API calls
// Only run these tests when you want to test against the actual API
describe("CuuTruyenParser Integration Tests", () => {
  let parser: CuuTruyenParser;

  beforeAll(() => {
    const config = {
      domain: ["cuutruyen.net"],
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      pageSize: 20,
      source: "cuutruyen",
      locale: "vi",
    };

    parser = new CuuTruyenParser(config);
  });

  describe("Real API Tests", () => {
    it("should fetch manga list from real API", async () => {
      const mangas = await parser.getListPage(1, SortOrder.UPDATED, {});

      expect(mangas).toBeInstanceOf(Array);
      expect(mangas.length).toBeGreaterThan(0);

      if (mangas.length > 0) {
        const manga = mangas[0];
        expect(manga).toHaveProperty("id");
        expect(manga).toHaveProperty("title");
        expect(manga).toHaveProperty("coverUrl");
        expect(manga.id).toMatch(/^cuutruyen_\d+$/);
      }
    }, 30000); // 30 second timeout

    it("should search for manga", async () => {
      const searchResults = await parser.getListPage(1, SortOrder.UPDATED, {
        query: "one piece",
      });

      expect(searchResults).toBeInstanceOf(Array);
      // Search might return empty results, so we just check it's an array
    }, 30000);

    it("should get manga details", async () => {
      // First get a manga from the list
      const mangas = await parser.getListPage(1, SortOrder.UPDATED, {});

      if (mangas.length > 0) {
        const manga = mangas[0];
        const details = await parser.getDetails(manga);

        expect(details).toHaveProperty("title");
        expect(details).toHaveProperty("description");
        expect(details).toHaveProperty("state");
        expect(details).toHaveProperty("chapters");
        expect(details.chapters).toBeInstanceOf(Array);

        // Test getting pages for first chapter if available
        if (details.chapters && details.chapters.length > 0) {
          const chapter = details.chapters[0];
          const pages = await parser.getPages(chapter);

          expect(pages).toBeInstanceOf(Array);
          if (pages.length > 0) {
            expect(pages[0]).toHaveProperty("id");
            expect(pages[0]).toHaveProperty("url");
          }
        }
      }
    }, 60000); // 60 second timeout

    it("should handle different sort orders", async () => {
      const sortOrders = [
        SortOrder.UPDATED,
        SortOrder.POPULARITY,
        SortOrder.NEWEST,
      ];

      for (const order of sortOrders) {
        const mangas = await parser.getListPage(1, order, {});
        expect(mangas).toBeInstanceOf(Array);
      }
    }, 90000); // 90 second timeout

    it("should handle filter by state", async () => {
      const states = [MangaState.ONGOING, MangaState.FINISHED];

      for (const state of states) {
        const mangas = await parser.getListPage(1, SortOrder.UPDATED, {
          states: new Set([state]),
        });
        expect(mangas).toBeInstanceOf(Array);
      }
    }, 60000);
  });

  describe("Error Handling", () => {
    it("should handle invalid search queries gracefully", async () => {
      const results = await parser.getListPage(1, SortOrder.UPDATED, {
        query: "very-long-search-query-that-probably-wont-exist-123456789",
      });

      expect(results).toBeInstanceOf(Array);
      // Should return empty array or handle gracefully
    }, 30000);

    it("should handle high page numbers", async () => {
      const results = await parser.getListPage(999, SortOrder.UPDATED, {});
      expect(results).toBeInstanceOf(Array);
      // Should return empty array for non-existent pages
    }, 30000);
  });
});
