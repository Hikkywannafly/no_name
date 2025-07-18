import { type NextRequest, NextResponse } from 'next/server';

export const ALLOWED_HOSTNAMES = [
    'truyenvua.com',
    'truyenqq.com',
    'truyenqqgo.com',
    'i125.truyenvua.com',
    'i.truyenvua.com',
    'i.truyenqq.com',
    "vercel.app",
    "localhost",
    'truyenvua.vercel.app',
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) {
        return new NextResponse('Missing url', { status: 400 });
    }
    // if (!ALLOWED_HOSTNAMES.includes(parsed.hostname)) {
    //     return new NextResponse('Domain not allowed', { status: 403 });
    // }
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Referer': 'https://truyenqqgo.com',
            },
        });
        if (!response.ok) {
            return new NextResponse('Failed to fetch image', { status: response.status });
        }
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();
        return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (_e) {
        return new NextResponse('Proxy error', { status: 500 });
    }
}