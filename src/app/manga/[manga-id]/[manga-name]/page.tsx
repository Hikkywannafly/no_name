import BaseLayout from "@/app/baseLayout"
import { Manga } from "@/components/manga/manga"
import { getMediaDetails } from "@/provider/Anilist"
import { MediaType } from "@/types/anilist"

export default async function MangaPage({
  params,
}: {
  params: Promise<{ "manga-id": string; "manga-name": string }>
}) {

  const { "manga-id": mangaIdParam, "manga-name": mangaName } = await params

  const mangaId = Number(mangaIdParam)

  const mangaData = await getMediaDetails({
    id: mangaId,
    type: MediaType.Manga,
  })

  return (
    <BaseLayout showHeader={true} showFooter={true}>
      <Manga mangaId={mangaId} name={mangaName} prefetchManga={mangaData} />
    </BaseLayout>
  )
}
