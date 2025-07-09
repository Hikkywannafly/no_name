"use client";
import { WideContainer } from "@/components/layout/WideLayout";
import Image from "@/components/shared/image";
import Tag, { TagItem } from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { useMangadex } from "@/context/useManga";
import type { ExtendManga } from "@/types/mangadex";
import { getCoverArt, getMangaTitle, getTagName, } from "@/utils/mangadex";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
interface MangaProps {
  magaId: string;
  prefetchManga?: ExtendManga;
}

export function Manga(props: MangaProps) {
  const { magaId, prefetchManga } = props;
  const { mangas } = useMangadex();
  const manga = mangas[magaId] || prefetchManga;

  return (
    <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
      <div className="relative flex h-[550px] items-center overflow-hidden rounded-lg to-transparent p-8">
        <div className="absolute inset-0 h-[350px] ">
          <Image
            fill
            src={getCoverArt(manga)}
            title="Cover Art"
            className="h-full w-full object-cover"
            style={{ zIndex: 0 }}
            alt="Unknown Title"
          />
          <div className="absolute inset-0 z-10 bg-black/60" />
        </div>
        <div className="relative z-10 mx-auto mt-[120px] flex w-full gap-6 lg:max-w-[1200px]">
          <div className="h-60 w-40 shrink-0 overflow-hidden rounded-lg shadow-lg lg:h-80 lg:w-60">
            <AspectRatio
              ratio={2 / 3}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={getCoverArt(manga)}
                alt="Manga Cover"
                fill
                className="h-full w-full rounded-lg object-cover shadow-lg"
              />

            </AspectRatio>

          </div>
          <div className="flex flex-col justify-between gap-2 bg-red-400">
            <div className="">
              <p className="mb-2 font-bold text-sm text-white sm:text-lg md:text-2xl">
                {
                  getMangaTitle(manga)
                }
              </p>
              <p className="font-bold text-sm text-white sm:text-lg md:text-2xl">
                {
                  getMangaTitle(manga, { allTitle: true })
                }
              </p>
            </div>
            <div className="">
              <Button
                className="w-full bg-amber-300"
              >
                asd
              </Button>
            </div>
          </div>
        </div>
      </div>

      <WideContainer>
        <Tag className="flex flex-wrap items-center gap-2 ">
          {
            manga.attributes.tags.map((tag) => (
              <TagItem
                href="/"
                className="bg-black/60"
                key={tag.id}
              >
                {getTagName(tag)}
              </TagItem>
            ))
          }
        </Tag>
      </WideContainer>




    </div>
  );
}
