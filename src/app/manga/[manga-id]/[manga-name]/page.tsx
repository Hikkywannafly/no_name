import BaseLayout from "@/app/baseLayout";
import { Manga } from "@/components/manga/manga";
import { getMediaDetails } from "@/provider/Anilist";
import { MediaType } from "@/types/anilist";
type MangaPageProps = {
  params: { "manga-id": string; "manga-name": string };
};

export default async function MangaPage({ params }: MangaPageProps) {
  const { "manga-id": mangaId, "manga-name": mangaName } = await params;
  // manga name bi the nay muhanui-mabeopsa toi muon ko con dang slug nua
  // const mangaName = params["manga-name"].split("-").join(" ");

  // const {
  //   data: { data: manga },
  // } = await MangadexApi.Manga.getMangaId(mangaID, {
  //   includes: [MangadexApi.Static.Includes.COVER_ART],
  // });
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
