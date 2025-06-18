import { MERGE_STRATEGY, SOURCE_CONFIGS } from "@/config/sources";
import { SourceManager } from "@/services/SourceManager";
import type { MangaSource } from "@/types/manga";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mangaList } = body;

    if (!mangaList || !Array.isArray(mangaList)) {
      return NextResponse.json(
        { error: "mangaList array is required" },
        { status: 400 },
      );
    }

    const sourceManager = new SourceManager(SOURCE_CONFIGS, MERGE_STRATEGY);

    // Group manga by title similarity
    const groupedManga = groupMangaByTitle(mangaList);

    // Get merged manga for each group
    const mergedMangas = [];
    for (const group of groupedManga) {
      if (group.length > 1) {
        const merged = await sourceManager.getMergedManga(group);
        mergedMangas.push(merged);
      } else {
        mergedMangas.push(group[0]);
      }
    }

    return NextResponse.json({
      success: true,
      data: mergedMangas,
      total: mergedMangas.length,
      originalCount: mangaList.length,
    });
  } catch (error) {
    console.error("Error in manga merge API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Helper function to group manga by title similarity
function groupMangaByTitle(mangas: MangaSource[]): MangaSource[][] {
  const groups: MangaSource[][] = [];
  const processed = new Set<string>();

  for (const manga of mangas) {
    if (processed.has(manga.id)) continue;

    const group = [manga];
    processed.add(manga.id);

    // Find similar titles
    for (const other of mangas) {
      if (processed.has(other.id)) continue;

      if (isSimilarTitle(manga.title, other.title)) {
        group.push(other);
        processed.add(other.id);
      }
    }

    groups.push(group);
  }

  return groups;
}

function isSimilarTitle(title1: string, title2: string): boolean {
  const normalized1 = title1.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalized2 = title2.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Simple similarity check - can be improved with more sophisticated algorithms
  return normalized1.includes(normalized2) || normalized2.includes(normalized1);
}
