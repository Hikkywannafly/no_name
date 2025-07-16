import BaseLayout from "@/app/baseLayout";
import { Manga } from "@/components/manga/manga";
import { getMediaDetails } from "@/provider/Anilist";
import { MediaType } from "@/types/anilist";

type PageProps = {
  params: {
    "manga-id": string;
    "manga-name": string;
  };
};

export default async function MangaPage({ params }: PageProps) {
  const mangaId = Number(params["manga-id"]);
  const mangaName = params["manga-name"];

  const mangaData = await getMediaDetails({
    id: mangaId,
    type: MediaType.Manga,
  });

  return (
    <BaseLayout showHeader={true} showFooter={true}>
      <div className="">
        <Manga
          mangaId={mangaId}
          name={mangaName}
          prefetchManga={mangaData}
        />
      </div>
    </BaseLayout>
  );
}
