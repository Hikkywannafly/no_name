"use client";
import { WideContainer } from "@/components/layout/wideLayout";
import Image from "@/components/shared/image";
import Markdown from "@/components/shared/markDown";
import Tag, { TagItem } from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMangadex } from "@/context/useManga";
import useCuuTruyenChapterList from "@/hooks/CuuTruyen/useChapterList";
import type { ExtendManga } from "@/types/mangadex";
import { getCoverArt, getMangaTitle, getTagName } from "@/utils/mangadex";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
interface MangaProps {
  mangaId: string;
  name?: string;
  prefetchManga?: ExtendManga;
}

export function Manga(props: MangaProps) {
  const { mangaId, prefetchManga } = props;
  const { mangas } = useMangadex();
  const manga = mangas[mangaId] || prefetchManga;

  const name = getMangaTitle(manga) || "Manga Name";
  const { chapters: data } = useCuuTruyenChapterList(name.toString());

  // console.log("Manga Cuutyrne Data:", data, getMangaTitle(manga));
  console.log("Manga Data:", manga, data);
  return (
    <div className="w-full ">
      <div className="relative w-full overflow-hidden rounded-lg ">
        <div className="relative h-[350px] w-full">
          <Image
            fill
            src={
              "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2235/panorama/processed-d548e9edf317eeb2b57a1a09bda0d9e3.jpg"
            }
            alt="Manga Background"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>

      <div className="-top-[150px] sm:-top-[50px] relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:gap-6 lg:max-w-[1200px]">
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
        <div className="flex w-full flex-col justify-between gap-2 text-center sm:mt-[50px] sm:text-left">
          <div className="">
            <Label className="font-bold text-white text-xl sm:text-2xl md:text-3xl">
              {getMangaTitle(manga)}
            </Label>
            <Label className="text-gray-400 text-sm">
              {getMangaTitle(manga, { allTitle: true })}
            </Label>
          </div>

          {/* <div className="">
            <Label> Năm phát hành </Label>
            <Tag className=" flex-row gap-2 px-1 py-2">
              {
                manga?.attributes.year
              }
            </Tag>
          </div> */}
          {/* <Label> Năm phát hành </Label> */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto">Đọc từ chương 1</Button>
            <Select>
              <SelectTrigger className="w-full text-white sm:w-auto">
                <SelectValue placeholder="Thêm vào danh sách" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Đọc sau </SelectItem>
                <SelectItem value="dark">Yêu thích </SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <WideContainer classNames="flex flex-col gap-4 ">
        <Label> Mô tả </Label>
        <Markdown
          content={
            manga?.attributes?.description?.vi ||
            manga?.attributes?.description?.en ||
            "Không có mô tả."
          }
        />
        <Label> Tag </Label>
        <ScrollArea className="w-full">
          <Tag className=" flex-row gap-2 px-1 py-2">
            {manga?.attributes?.tags?.map((tag) => (
              <TagItem
                key={tag.id}
                href="/"
                className="whitespace-nowrap bg-black/60"
              >
                {getTagName(tag)}
              </TagItem>
            ))}
          </Tag>
        </ScrollArea>
      </WideContainer>
    </div>
  );
}
