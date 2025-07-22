import { Chapter } from "@/components/chapter/chapter";
import { ChapterProvider } from "@/context/useChapter";

interface ChapterPageProps {
  params: Promise<{
    "anilist-id": string;
    "chapter-id": string;
    "source-id": string;
  }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const resolvedParams = await params;
  const chapterId = resolvedParams["chapter-id"];
  const source = resolvedParams["source-id"];
  const anilistId = resolvedParams["anilist-id"];
  const mangaId = anilistId.split("-")[1];
  console.log(
    `ChapterPage: anilistId=${anilistId}, mangaId=${mangaId}, chapterId=${chapterId}, source=${source}`
  );
  return (
    <ChapterProvider mangaId={mangaId} source={source} chapterId={chapterId}>
      <Chapter
        chapterId={chapterId}
        mangaId={mangaId}
        source={source}
        anilistId={mangaId[0]}
      />
    </ChapterProvider>
  );
}
