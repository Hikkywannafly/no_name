import { MERGE_STRATEGY, SOURCE_CONFIGS } from "@/constants/sources";
import { SourceManager } from "@/provider/SourceManager";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const _sortOrder = searchParams.get("order") || "UPDATED";

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 },
      );
    }

    const sourceManager = new SourceManager(SOURCE_CONFIGS, MERGE_STRATEGY);
    const results = await sourceManager.searchMangaID(query);

    return NextResponse.json({
      success: true,
      data: results,
      total: results,
      page,
      query,
    });
  } catch (error) {
    console.error("Error in manga search API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
