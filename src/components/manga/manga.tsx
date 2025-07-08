"use client";
import Image from "@/components/shared/image";
import { AspectRatio } from "@/components/ui";
import { useMangadex } from "@/context/useManga";
import type { ExtendManga } from "@/types/mangadex";
import { getCoverArt } from "@/utils/mangadex";
interface MangaProps {
  magaId: string;
  prefetchManga?: ExtendManga;
}

export function Manga(props: MangaProps) {
  const { magaId, prefetchManga } = props;
  const { mangas } = useMangadex();
  const manga = mangas[magaId] || prefetchManga;
  console.log("Manga Props:", getCoverArt(manga));
  console.log("Manga ID:", manga);

  return (
    <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
      <div className="relative flex h-[350px] items-center overflow-hidden rounded-lg bg-gradient-to-r from-black/80 to-transparent p-8">
        <div className="absolute inset-0 h-full w-full">
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
      </div>
      <div className="relative z-10 mx-auto mt-[50px] flex w-full items-center gap-6 lg:max-w-[1200px]">
        <div className="h-60 w-40 shrink-0 overflow-hidden rounded-lg shadow-lg">
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
      </div>

      {/* <WideContainer>

            </WideContainer> */}
    </div>
  );
}
