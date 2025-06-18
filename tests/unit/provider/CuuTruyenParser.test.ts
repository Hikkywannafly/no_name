import { CuuTruyenParser } from "../../../src/provider/CuuTruyenPasrer";
import {
  ContentRating,
  MangaState,
  type ParserConfig,
  SortOrder,
} from "../../../src/provider/type";

// Mock axios
const mockGet = jest.fn();
const mockAxiosInstance = {
  get: mockGet,
};

jest.mock("axios", () => ({
  create: jest.fn(() => mockAxiosInstance),
  isAxiosError: jest.fn(),
}));

const axios = require("axios");

describe("CuuTruyenParser", () => {
  let parser: CuuTruyenParser;
  let mockConfig: ParserConfig;

  beforeEach(() => {
    mockConfig = {
      domain: ["cuutruyen.net"],
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      pageSize: 20,
      source: "cuutruyen",
      locale: "vi",
    };

    parser = new CuuTruyenParser(mockConfig);
    mockGet.mockClear();
  });

  describe("Constructor", () => {
    it("should create parser with correct config", () => {
      expect(parser).toBeInstanceOf(CuuTruyenParser);
      expect(axios.create).toHaveBeenCalledWith({
        headers: {
          "User-Agent": mockConfig.userAgent,
        },
      });
    });
  });

  describe("availableSortOrders", () => {
    it("should return correct sort orders", () => {
      const sortOrders = parser.availableSortOrders;
      expect(sortOrders).toContain(SortOrder.UPDATED);
      expect(sortOrders).toContain(SortOrder.POPULARITY);
      expect(sortOrders).toContain(SortOrder.NEWEST);
      expect(sortOrders).toContain(SortOrder.POPULARITY_WEEK);
      expect(sortOrders).toContain(SortOrder.POPULARITY_MONTH);
    });
  });

  describe("filterCapabilities", () => {
    it("should return correct filter capabilities", () => {
      const capabilities = parser.filterCapabilities;
      expect(capabilities.isSearchSupported).toBe(true);
    });
  });

  describe("getFilterOptions", () => {
    it("should return filter options with tags and states", async () => {
      const options = await parser.getFilterOptions();

      expect(options.availableTags).toBeInstanceOf(Set);
      expect(options.availableStates).toBeInstanceOf(Set);
      expect(options.availableStates).toContain(MangaState.ONGOING);
      expect(options.availableStates).toContain(MangaState.FINISHED);
    });
  });

  describe("getListPage", () => {
    it("should fetch manga list successfully", async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 2230,
              name: "Phù Thuỷ Ichi",
              author_name: "Test Author",
              cover_mobile_url: "https://example.com/cover.jpg",
              cover_url:
                "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2230/cover/processed-80d307c09616e379ee82c1c32568ab83.jpg",
              is_nsfw: false,
            },
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await parser.getListPage(1, SortOrder.UPDATED, {});

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "cuutruyen_1",
        title: "Test Manga",
        coverUrl: "https://example.com/cover.jpg",
        contentRating: ContentRating.SAFE,
      });
    });

    it("should handle 500 error gracefully", async () => {
      const mockError = {
        response: { status: 500 },
      };
      axios.isAxiosError.mockReturnValue(true);
      mockGet.mockRejectedValue(mockError);

      const result = await parser.getListPage(1, SortOrder.UPDATED, {});

      expect(result).toEqual([]);
    });

    it("should throw error for non-500 errors", async () => {
      const mockError = {
        response: { status: 404 },
      };
      axios.isAxiosError.mockReturnValue(true);
      mockGet.mockRejectedValue(mockError);

      await expect(
        parser.getListPage(1, SortOrder.UPDATED, {}),
      ).rejects.toThrow();
    });
  });

  describe("getDetails", () => {
    it("should fetch manga details successfully", async () => {
      const mockManga = {
        id: "cuutruyen_1",
        url: "/api/v2/mangas/1",
        title: "Test Manga",
      };

      const mockChaptersResponse = {
        data: {
          data: [
            {
              id: 1,
              name: "Chapter 1",
              number: 1,
              created_at: "2023-01-01T00:00:00Z",
            },
          ],
        },
      };

      const mockDetailsResponse = {
        data: {
          data: {
            id: 1,
            name: "Test Manga",
            full_description: "Test description",
            is_nsfw: false,
            author: { name: "Test Author" },
            team: { name: "Test Team" },
            tags: [
              { name: "action", slug: "action" },
              { name: "adventure", slug: "adventure" },
            ],
          },
        },
      };

      mockGet
        .mockResolvedValueOnce(mockChaptersResponse)
        .mockResolvedValueOnce(mockDetailsResponse);

      const result = await parser.getDetails(mockManga as any);

      expect(result.title).toBe("Test Manga");
      expect(result.description).toBe("Test description");
      expect(result.state).toBe(MangaState.ONGOING);
      expect(result.chapters).toHaveLength(1);
      if (result.chapters && result.chapters.length > 0) {
        expect(result.chapters[0].title).toBe("Chapter 1");
      }
    });
  });

  describe("getPages", () => {
    it("should fetch chapter pages successfully", async () => {
      const mockChapter = {
        id: "cuutruyen_1",
        url: "/api/v2/chapters/1",
        title: "Chapter 1",
        number: 1,
        volume: 0,
        scanlator: null,
        uploadDate: null,
        branch: null,
        source: "cuutruyen",
      };

      const mockResponse = {
        data: {
          data: {
            pages: [
              {
                id: 1,
                image_url: "https://example.com/page1.jpg",
                drm_data: "test-drm-data",
              },
            ],
          },
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await parser.getPages(mockChapter);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "cuutruyen_1",
        url: expect.stringContaining("test-drm-data"),
      });
    });
  });

  describe("buildListUrl", () => {
    it("should build search URL correctly", () => {
      const url = (parser as any).buildListUrl(1, SortOrder.UPDATED, {
        query: "test",
      });
      expect(url).toContain("/api/v2/mangas/search");
      expect(url).toContain("q=test");
    });

    it("should build tag filter URL correctly", () => {
      const url = (parser as any).buildListUrl(1, SortOrder.UPDATED, {
        tags: new Set([
          { key: "action", title: "Action", source: "cuutruyen" },
        ]),
      });
      expect(url).toContain("/api/v2/tags/action");
    });

    it("should build state filter URL correctly", () => {
      const url = (parser as any).buildListUrl(1, SortOrder.UPDATED, {
        states: new Set([MangaState.ONGOING]),
      });
      expect(url).toContain("/api/v2/tags/dang-tien-hanh");
    });

    it("should build popularity URL correctly", () => {
      const url = (parser as any).buildListUrl(1, SortOrder.POPULARITY, {});
      expect(url).toContain("/api/v2/mangas/top?duration=all");
    });
  });

  describe("toTitleCase", () => {
    it("should convert string to title case", () => {
      const result = (parser as any).toTitleCase("hello world");
      expect(result).toBe("Hello World");
    });
  });

  describe("generateUid", () => {
    it("should generate correct UID", () => {
      const result = (parser as any).generateUid(123);
      expect(result).toBe("cuutruyen_123");
    });
  });
});
