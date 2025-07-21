import { Chapter } from "@/components/chapter/chapter"
import { ChapterProvider } from "@/context/useChapter"

interface ChapterPageProps {
  params: {
    "anilist-id": string
    "chapter-id": string
    "source-id": string
  }
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const mangaId = params["chapter-id"]
  const source = params["source-id"]
  const anilistId = params["anilist-id"]

  return (
    <ChapterProvider mangaId={mangaId} source={source} nextChapter={undefined} prevChapter={undefined}>
      <Chapter mangaId={mangaId} source={source} anilistId={anilistId} />
    </ChapterProvider>
  )
}
