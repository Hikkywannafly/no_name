import BaseLayout from "@/app/baseLayout";
import { Manga } from "@/components/manga/manga";
import { getMediaDetails } from "@/provider/Anilist";
import { MediaType } from "@/types/anilist";
import type { Metadata } from "next";

// export async function getServerSideProps() {
interface MangaPageProps {
  params: Promise<{
    "manga-id": string;
    "manga-name": string;
  }>;
}

// }
export async function generateMetadata({
  params,
}: MangaPageProps): Promise<Metadata> {
  try {
    const { "manga-id": mangaIdParam, "manga-name": mangaName } = await params;
    const mangaId = Number(mangaIdParam);

    const anilistData = await getMediaDetails({
      id: mangaId,
      type: MediaType.Manga,
    });

    const title =
      anilistData?.title?.english || anilistData?.title?.romaji || mangaName;
    const description =
      anilistData?.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `Đọc ${title} online`;

    return {
      title: `${title} - Đọc truyện tranh online`,
      description,
      openGraph: {
        title,
        description,
        images: anilistData?.coverImage?.large
          ? [anilistData.coverImage.large]
          : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: anilistData?.coverImage?.large
          ? [anilistData.coverImage.large]
          : [],
      },
    };
  } catch (_error) {
    return {
      title: "Không tìm thấy truyện này :((",
      description: "Không tìm thấy thông tin truyện.",
    };
  }
}

export default async function MangaPage({ params }: MangaPageProps) {
  const { "manga-id": mangaIdParam, "manga-name": mangaName } = await params;

  const mangaId = Number(mangaIdParam);

  const mangaData = await getMediaDetails({
    id: mangaId,
    type: MediaType.Manga,
  });


  return (
    <BaseLayout showHeader={true} showFooter={true}>
      <Manga mangaId={mangaId} name={mangaName} prefetchManga={mangaData} />
    </BaseLayout>
  );
}
