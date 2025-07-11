"use client";
import { WideContainer } from "@/components/layout/wideLayout";
import Image from "@/components/shared/image";
import Tag, { TagItem } from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { useMangadex } from "@/context/useManga";
import type { ExtendManga } from "@/types/mangadex";
import { getCoverArt, getMangaTitle, getTagName } from "@/utils/mangadex";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Markdown from "../shared/markDown";
interface MangaProps {
  magaId: string;
  prefetchManga?: ExtendManga;
}

export function Manga(props: MangaProps) {
  const { magaId, prefetchManga } = props;
  const { mangas } = useMangadex();
  const manga = mangas[magaId] || prefetchManga;

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-lg">
        <div className="relative h-[350px] w-full">
          <Image
            fill
            src={getCoverArt(manga)}
            alt="Manga Background"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>
      <div className="-top-[50px] relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:flex-row sm:items-center">
        <div className="mx-auto sm:mx-0">
          <div className="h-60 w-40 overflow-hidden rounded-lg shadow-lg lg:h-80 lg:w-60">
            <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-lg">
              <Image
                src={getCoverArt(manga)}
                alt="Manga Cover"
                fill
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
        <div className="text-center sm:mt-[50px] sm:text-left">
          <h1 className="font-bold text-white text-xl sm:text-2xl md:text-3xl">
            {getMangaTitle(manga)}
          </h1>
          <p className="text-gray-400 text-sm">
            {getMangaTitle(manga, { allTitle: true })}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button className="w-full bg-red-600 sm:w-auto">Đọc sau</Button>
            <Button className="w-full sm:w-auto">Đọc từ chương 1</Button>
          </div>
        </div>
      </div>
      <WideContainer>
        <Markdown
          content={
            manga?.attributes?.description?.vi ||
            manga?.attributes?.description?.en ||
            "Không có mô tả."
          }
        />
        <Tag className="mt-6 flex flex-wrap gap-2">
          {manga?.attributes?.tags?.map((tag) => (
            <TagItem key={tag.id} href="/" className="bg-black/60">
              {getTagName(tag)}
            </TagItem>
          ))}
        </Tag>
      </WideContainer>
    </div>
  );
}
