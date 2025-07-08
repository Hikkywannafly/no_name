import BaseLayout from "@/app/baseLayout";
import { Manga } from "@/components/manga/manga";
import { MangadexApi } from "@/provider";
import type { ExtendManga } from "@/types/mangadex";
import { extendRelationship } from "@/utils/mangadex";
type MangaPageProps = {
  params: { "manga-id": string };
};

export default async function MangaPage({ params }: MangaPageProps) {
  const mangaID = await params["manga-id"];

  const {
    data: { data: manga },
  } = await MangadexApi.Manga.getMangaId(mangaID, {
    includes: [MangadexApi.Static.Includes.COVER_ART],
  });

  console.log("Manga Data:", extendRelationship(manga));
  return (
    <BaseLayout showHeader={true} showFooter={true}>
      <Manga
        magaId={mangaID}
        prefetchManga={extendRelationship(manga) as ExtendManga}
      />
    </BaseLayout>
  );
}
