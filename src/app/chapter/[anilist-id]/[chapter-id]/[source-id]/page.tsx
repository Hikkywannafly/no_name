import { Chapter } from "@/components/chapter/chapter";
import { ChapterProvider } from "@/context/useChapter";
import { getMediaDetails } from "@/provider/Anilist";
import { MediaType } from "@/types/anilist";
import type { Metadata } from "next";
import { SWRConfig } from "swr";
interface ChapterPageProps {
  params: Promise<{
    "anilist-id": string;
    "chapter-id": string;
    "source-id": string;
  }>;
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  try {
    const { "anilist-id": anilistIdParam } = await params;
    // const mangaIdParam = anilistIdParam.split("-")[1];
    const mangaName = anilistIdParam.split("-")[0];

    const mangaId = Number(mangaName);

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
      title: `${title} - Chúc bạn đọc vui vẻ :>`,
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
export default async function ChapterPage({ params }: ChapterPageProps) {
  const resolvedParams = await params;
  const chapterId = resolvedParams["chapter-id"];
  const source = resolvedParams["source-id"];
  const anilistId = resolvedParams["anilist-id"];
  const mangaId = anilistId.split("-")[1];
  return (
    <SWRConfig
      value={{
        dedupingInterval: 60000,
        revalidateOnFocus: false,
        keepPreviousData: true,
      }}
    >
      <ChapterProvider mangaId={mangaId} source={source} chapterId={chapterId}>
        <Chapter
          chapterId={chapterId}
          mangaId={mangaId}
          source={source}
          anilistId={mangaId[0]}
        />
      </ChapterProvider>
    </SWRConfig>
  );
}
