import { sourceInfo } from "@/constants/sources";
import { HangTruyenParser } from "@/provider/HangTruyen/HangTruyenParser";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json({ error: "Missing MangaID" }, { status: 400 });
    }

    const parser = new HangTruyenParser({
        domain: ["hangtruyen.org"],
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        pageSize: 20,
        source: sourceInfo.hangtruyen.name,
        locale: "vi",
    });

    try {
        const manga = await parser.getPages(name);
        return NextResponse.json({ data: manga || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 