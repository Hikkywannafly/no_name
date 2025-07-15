import { MERGE_STRATEGY, SOURCE_CONFIGS } from "@/config/sources";
import { SourceManager } from "@/provider/SourceManager";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const sortOrder = searchParams.get("order") || "UPDATED";

    const sourceManager = new SourceManager(SOURCE_CONFIGS, MERGE_STRATEGY);
    const results = await sourceManager.getMangaList(page, sortOrder);

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      page,
      sortOrder,
    });
  } catch (error) {
    console.error("Error in manga list API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
