import { sourceInfo } from "@/constants/sources";
import { CuuTruyenParser } from "@/provider/CuuTruyen/CuuTruyenPasrer";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mangaId = searchParams.get("name");
  if (!mangaId) {
    return NextResponse.json({ error: "Missing mangaId" }, { status: 400 });
  }

  const parser = new CuuTruyenParser({
    domain: [sourceInfo.cuutruyen.baseUrl],
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    pageSize: 20,
    source: sourceInfo.cuutruyen.name,
    locale: "vi",
  });

  try {
    const chapter = await parser.getPages(mangaId);
    return NextResponse.json({ data: chapter || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
