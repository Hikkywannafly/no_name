import { type NextRequest, NextResponse } from "next/server";
import { CuuTruyenParser } from "@/provider/CuuTruyen/CuuTruyenPasrer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const parser = new CuuTruyenParser({
    domain: ["cuutruyen.net"],
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    pageSize: 20,
    source: "cuutruyen",
    locale: "vi",
  });

  try {
    const manga = await parser.searchMangaID(name);
    const mangaWithChapters = await parser.getDetails(manga);
    return NextResponse.json({ chapters: mangaWithChapters.chapters || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
