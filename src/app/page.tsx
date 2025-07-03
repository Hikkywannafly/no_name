"use client";
import { MangaCarousel } from "@/components";
import { WideContainer } from "@/components/layout/WideLayout";
import BaseLayout from "./baseLayout";
export default function Home() {
  // const [mangaList, setMangaList] = useState<MangaSource[]>([]);

  // const { mangaList } = useSearchManga({
  //   limit: 10,
  //   availableTranslatedLanguage: ["vi"],
  // });
  return (
    <div>
      <BaseLayout>
        <WideContainer>
          <MangaCarousel />
        </WideContainer>
      </BaseLayout>
    </div>
  );
}
