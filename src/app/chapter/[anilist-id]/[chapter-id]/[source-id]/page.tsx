import { Chapter } from "@/components/chapter/chapter";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ "anilist-id": string, "chapter-id": string; "source-id": string }>;
}) {
  const { "anilist-id": anilistID, "chapter-id": chapterId, "source-id": sourceId } = await params;

  return <Chapter mangaId={chapterId} source={sourceId} anilistId={anilistID} />;
}
