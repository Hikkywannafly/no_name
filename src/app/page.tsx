"use client";
import { WideContainer } from "@/components/layout/WideLayout";
import { Manga } from "mangadex-full-api";
import { useEffect } from "react";
import BaseLayout from "./baseLayout";

export default function Home() {
  // const [mangaList, setMangaList] = useState<MangaSource[]>([]);

  useEffect(() => {
    async function fetchMangaDex() {
      const mangas = await Manga.search({
        limit: 10,
        order: { followedCount: "desc" },
        hasAvailableChapters: true,
        includes: ["cover_art", "author", "artist", "tag"],

        availableTranslatedLanguage: ["en"],
      });
      console.log(mangas);
    }
    fetchMangaDex();
  }, []);

  return (
    <div>
      <BaseLayout>
        <WideContainer>
          {/* <MangaCarousel mangas={mangaList} /> */}
        </WideContainer>
      </BaseLayout>
    </div>
  );
}
