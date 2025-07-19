import { sourceInfo } from "@/constants/sources";
import { TruyenQQParser } from "@/provider/TruyenQQ/TruyenQQPasrer";
import { type NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }
  const parser = new TruyenQQParser({
    domain: ["truyenqqgo.com"],
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    pageSize: 20,
    source: sourceInfo.truyenqq.name,
    locale: "vi",
  });
  try {
    const manga = await parser.searchMangaID(name);
    return NextResponse.json({ data: manga || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
