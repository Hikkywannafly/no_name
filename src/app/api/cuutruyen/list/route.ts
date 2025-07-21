import { sourceInfo } from "@/constants/sources";
import { CuuTruyenParser } from "@/provider/CuuTruyen/CuuTruyenPasrer";
import { type NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const parser = new CuuTruyenParser({
    domain: [sourceInfo.cuutruyen.baseUrl],
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    pageSize: 20,
    source: sourceInfo.cuutruyen.name,
    locale: "vi",
  });

  try {
    const manga = await parser.searchMangaID(name);
    return NextResponse.json({ data: manga || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
