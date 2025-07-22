import type { UChapter, UPage } from "@/types/manga";

// Helper fetcher
async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function fetchChapterPages(
  source: string,
  chapterId: string,
): Promise<UPage[]> {
  switch (source) {
    case "source1": // CuuTruyen
      return await fetchApi<UPage[]>(
        `/api/cuutruyen/chapter?name=${encodeURIComponent(chapterId)}`,
      );
    case "source2": // TruyenQQ
      return await fetchApi<UPage[]>(
        `/api/truyenqq/chapter?name=${encodeURIComponent(chapterId)}`,
      );

    default:
      return [];
  }
}

export async function fetchChapterList(
  source: string,
  mangaId: string,
): Promise<UChapter[]> {
  switch (source) {
    case "source1": // CuuTruyen
      return await fetchApi<UChapter[]>(
        `/api/cuutruyen/chapters?name=${encodeURIComponent(mangaId)}`,
      );
    case "source2": // TruyenQQ
      return await fetchApi<UChapter[]>(
        `/api/truyenqq/chapters?name=${encodeURIComponent(mangaId)}`,
      );

    default:
      return [];
  }
}
