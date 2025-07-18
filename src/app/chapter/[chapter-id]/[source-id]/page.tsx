import { Chapter } from "@/components/chapter/chapter";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ "chapter-id": string; "source-id": string }>;
}) {
  const { "chapter-id": chapterId, "source-id": sourceId } = await params;

  return <Chapter mangaId={chapterId} source={sourceId} />;
}
