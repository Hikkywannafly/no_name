
import type { ExtendManga } from "@/types/mangadex";
export default function MangaPage({ params, manga }: { params: { "manga-id": string }, manga: ExtendManga }) {
    const mangaID = params["manga-id"];
    console.log("Manga Page", mangaID, manga);
    return (
        <>
            <h1>Manga ID: {mangaID}</h1>

        </>
    );
}