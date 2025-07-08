import { MangadexApi } from "@/provider";

type MangaPageProps = {
  params: { "manga-id": string };
};

export default async function MangaPage({ params }: MangaPageProps) {
  const mangaID = await params["manga-id"];

  const {
    data: { data: manga },
  } = await MangadexApi.Manga.getMangaId(mangaID);

  console.log("Manga Data:", manga);
  return (
    <>
      <h1>Manga ID: {mangaID}</h1>
    </>
  );
}
