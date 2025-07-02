"use client";
import { WideContainer } from "@/components/layout/WideLayout";
import { useSearchManga } from "@/hooks/MangaDex/useSearchManga";

import BaseLayout from "./baseLayout";

export default function Home() {
  // const [mangaList, setMangaList] = useState<MangaSource[]>([]);

  const { mangaList } = useSearchManga({
    limit: 10,
    availableTranslatedLanguage: ["vi"],
  });
  console.log(mangaList);
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
