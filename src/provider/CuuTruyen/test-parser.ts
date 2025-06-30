import { CuuTruyenParser } from "./CuuTruyenPasrer";
import { MangaState, SortOrder } from "./type";

// Mock config for testing
const testConfig = {
  domain: ["cuutruyen.net"],
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  pageSize: 20,
  source: "cuutruyen",
  locale: "vi",
};

// Create parser instance
const parser = new CuuTruyenParser(testConfig);

// Test functions
async function testParserBasics() {
  console.log("=== Testing Parser Basics ===");

  // Test available sort orders
  console.log("Available sort orders:", Array.from(parser.availableSortOrders));

  // Test filter capabilities
  console.log("Filter capabilities:", parser.filterCapabilities);

  // Test filter options
  try {
    const filterOptions = await parser.getFilterOptions();
    console.log("Filter options:", {
      availableTags: Array.from(filterOptions.availableTags).slice(0, 5), // Show first 5 tags
      availableStates: Array.from(filterOptions.availableStates),
    });
  } catch (error) {
    console.error("Error getting filter options:", error);
  }
}

async function testGetListPage() {
  console.log("\n=== Testing Get List Page ===");

  try {
    // Test getting first page with different sort orders
    const sortOrders = [
      SortOrder.UPDATED,
      SortOrder.POPULARITY,
      SortOrder.NEWEST,
    ];

    for (const order of sortOrders) {
      console.log(`\nTesting sort order: ${order}`);
      const mangas = await parser.getListPage(1, order, {});

      if (mangas.length > 0) {
        console.log(`Found ${mangas.length} mangas`);
        console.log("First manga:", {
          id: mangas[0].id,
          title: mangas[0].title,
          coverUrl: mangas[0].coverUrl,
          contentRating: mangas[0].contentRating,
        });
      } else {
        console.log("No mangas found");
      }
    }
  } catch (error) {
    console.error("Error getting list page:", error);
  }
}

async function testSearch() {
  console.log("\n=== Testing Search ===");

  try {
    const searchResults = await parser.getListPage(1, SortOrder.UPDATED, {
      query: "one piece",
    });

    console.log(
      `Search results for "one piece": ${searchResults.length} mangas`,
    );
    if (searchResults.length > 0) {
      console.log("First search result:", {
        title: searchResults[0].title,
        id: searchResults[0].id,
      });
    }
  } catch (error) {
    console.error("Error searching:", error);
  }
}

async function testGetDetails() {
  console.log("\n=== Testing Get Details ===");

  try {
    // First get a manga from the list
    const mangas = await parser.getListPage(1, SortOrder.UPDATED, {});

    if (mangas.length > 0) {
      const manga = mangas[0];
      console.log(`Getting details for: ${manga.title}`);

      const detailedManga = await parser.getDetails(manga);

      console.log("Detailed manga info:", {
        title: detailedManga.title,
        description: `${detailedManga.description?.substring(0, 100)}...`,
        state: detailedManga.state,
        authors: Array.from(detailedManga.authors),
        tags: Array.from(detailedManga.tags).slice(0, 5),
        chaptersCount: detailedManga.chapters?.length || 0,
      });

      // Test getting pages for first chapter if available
      if (detailedManga.chapters && detailedManga.chapters.length > 0) {
        await testGetPages(detailedManga.chapters[0]);
      }
    }
  } catch (error) {
    console.error("Error getting details:", error);
  }
}

async function testGetPages(chapter: any) {
  console.log("\n=== Testing Get Pages ===");

  try {
    console.log(`Getting pages for chapter: ${chapter.title}`);
    const pages = await parser.getPages(chapter);

    console.log(`Found ${pages.length} pages`);
    if (pages.length > 0) {
      console.log("First page:", {
        id: pages[0].id,
        url: `${pages[0].url.substring(0, 100)}...`,
      });
    }
  } catch (error) {
    console.error("Error getting pages:", error);
  }
}

async function testFilterByTags() {
  console.log("\n=== Testing Filter by Tags ===");

  try {
    const filterOptions = await parser.getFilterOptions();
    const availableTags = Array.from(filterOptions.availableTags);

    if (availableTags.length > 0) {
      const testTag = availableTags[0];
      console.log(`Testing filter with tag: ${testTag.title}`);

      const filteredResults = await parser.getListPage(1, SortOrder.UPDATED, {
        tags: new Set([testTag]),
      });

      console.log(
        `Found ${filteredResults.length} mangas with tag "${testTag.title}"`,
      );
    }
  } catch (error) {
    console.error("Error filtering by tags:", error);
  }
}

async function testFilterByState() {
  console.log("\n=== Testing Filter by State ===");

  try {
    const states = [MangaState.ONGOING, MangaState.FINISHED];

    for (const state of states) {
      console.log(`\nTesting filter with state: ${state}`);
      const filteredResults = await parser.getListPage(1, SortOrder.UPDATED, {
        states: new Set([state]),
      });

      console.log(
        `Found ${filteredResults.length} mangas with state "${state}"`,
      );
    }
  } catch (error) {
    console.error("Error filtering by state:", error);
  }
}

async function runAllTests() {
  console.log("🚀 Starting CuuTruyenParser Tests...\n");

  try {
    await testParserBasics();
    await testGetListPage();
    await testSearch();
    await testGetDetails();
    await testFilterByTags();
    await testFilterByState();

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
  }
}

// Export for use in other files
export { parser, runAllTests, testConfig };

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}
