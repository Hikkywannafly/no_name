"use client";
import { WideContainer } from "@/components/layout/WideLayout";
import { useFeaturedManga } from "@/hooks/MangaDex";

import BaseLayout from "./baseLayout";

export default function Home() {
  // const [mangaList, setMangaList] = useState<MangaSource[]>([]);

  // const { mangaList } = useSearchManga({
  //   limit: 10,
  //   availableTranslatedLanguage: ["vi"],
  // });
  const { mangaList } = useFeaturedManga();
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
