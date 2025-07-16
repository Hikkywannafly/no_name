import BaseLayout from "@/app/baseLayout";
import { Manga } from "@/components/manga/manga";
import { getMediaDetails } from "@/provider/Anilist";
import { MediaType } from "@/types/anilist";
type MangaPageProps = {
  params: { "manga-id": number; "manga-name": string };
};

export default async function MangaPage({ params }: MangaPageProps) {
  const { "manga-id": mangaId, "manga-name": mangaName } = params;
  const mangaData = await getMediaDetails({
    id: Number(mangaId),
    type: MediaType.Manga,
  });

  return (
    <BaseLayout showHeader={true} showFooter={true}>
      <div className="">
        <Manga
          mangaId={Number(mangaId)}
          name={mangaName}
          prefetchManga={mangaData}
        />
      </div>
    </BaseLayout>
  );
}
