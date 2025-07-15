"use client"

import { WideContainer } from "@/components/layout/wideLayout";
import HorizontalChapterPagination from "@/components/manga/chapterPagition";
import Image from "@/components/shared/image";
import Markdown from "@/components/shared/markDown";
import { TagItem } from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMangadex } from "@/context/useManga";
import useCuuTruyenData from "@/hooks/CuuTruyen/useCuuTruyenData";
import useChapterList from "@/hooks/MangaDex/useChapterList";
import type { ExtendManga } from "@/types/mangadex";
import { getCoverArt, getMangaTitle, getTagName } from "@/utils/mangadex";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
interface MangaProps {
  mangaId: string
  name?: string
  prefetchManga?: ExtendManga
}

export function Manga(props: MangaProps) {
  const { mangaId, prefetchManga } = props
  const { mangas } = useMangadex()
  const manga = mangas[mangaId] || prefetchManga
  const { chapters: mangaDexData } = useChapterList(mangaId, { translatedLanguage: ["vi"] });
  const { data: cuuTruyenData } = useCuuTruyenData(getMangaTitle(manga, { local: "en" }).toString());
  const sources = [
    { label: "CuuTruyen", value: "cuutruyen", chapters: cuuTruyenData.chapters || [] },
    { label: "MangaDex", value: "mangadex", chapters: mangaDexData },
  ];
  // const [selectedSource] = useState(
  //   sources.reduce((max, s) => (s.chapters.length > max.chapters.length ? s : max), sources[0]).value
  // );
  console.log("Manga Data:", mangaDexData, manga);
  console.log("CuuTruyen Data:", cuuTruyenData);
  return (
    <div className="w-full">
      {/* Hero Background Section */}
      <div className="relative h-[620px] w-full overflow-hidden">
        <div className="relative h-[350px] w-full ">
          <Image
            fill
            src={cuuTruyenData.largeCoverUrl || getCoverArt(manga)}
            alt="Manga Background"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content overlay */}
        <div className="absolute right-0 bottom-0 left-0 ">
          <WideContainer classNames="lg:max-w-[1200px]">
            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
              {/* Manga Cover */}
              <div className="mx-auto flex-shrink-0 md:mx-0">
                <div className="w-48 overflow-hidden rounded-lg shadow-2xl sm:w-52 lg:w-52">
                  <AspectRatio ratio={2 / 3}>
                    <Image
                      src={getCoverArt(manga) || "/placeholder.svg"}
                      alt="Manga Cover"
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>

              {/* Manga Info */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="bg-red-600 px-8 font-semibold text-white hover:bg-red-700">
                    Đọc ngay
                  </Button>
                  <div className="">
                    <Select>
                      <SelectTrigger className="w-full text-white">
                        <SelectValue placeholder="Add to reading list" />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectItem value="reading" className="text-white ">
                          Currently Reading
                        </SelectItem>
                        <SelectItem value="completed" className="text-white ">
                          Completed
                        </SelectItem>
                        <SelectItem value="plan-to-read" className="text-white">
                          Plan to Read
                        </SelectItem>
                        <SelectItem value="dropped" className="text-white hover:bg-gray-700">
                          Dropped
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="font-bold text-2xl text-white md:text-3xl lg:text-4xl">{getMangaTitle(manga)}</h1>
                  <p className="text-gray-300 text-sm md:text-base">{getMangaTitle(manga, { allTitle: true })}</p>
                </div>

                {/* Genre Tags */}
                {/* <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  {manga?.attributes?.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm"
                    >
                      {getTagName(tag)}
                    </span>
                  ))}
                </div> */}

                {/* Action Buttons */}

              </div>
            </div>
          </WideContainer>
        </div>
      </div >
      <div className=" text-white">
        <WideContainer classNames="lg:max-w-[1200px] py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              <div className="space-y-3">
                <h2 className="font-semibold text-xl">Mô tả</h2>
                <div className="text-gray-300 leading-relaxed">
                  <Markdown
                    content={
                      manga?.attributes?.description?.vi ||
                      manga?.attributes?.description?.en ||
                      "No description available."
                    }
                  />
                </div>
              </div>

              {/* All Tags */}
              <div className="space-y-3">
                <h2 className="font-semibold text-xl">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {manga?.attributes?.tags?.map((tag) => (
                    <TagItem
                      key={tag.id}
                      href="/"
                      className="rounded-md bg-gray-800 px-3 py-1 text-gray-300 text-sm transition-colors hover:bg-gray-700"
                    >
                      {getTagName(tag)}
                    </TagItem>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="space-y-4 rounded-lg bg-gray-800 p-6">
                <h3 className="font-semibold text-lg">Information</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400">{manga?.attributes?.status || "Unknown"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Year</span>
                    <span>{manga?.attributes?.year || "Unknown"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Country</span>
                    <span className="uppercase">{manga?.attributes?.originalLanguage || "JP"}</span>
                  </div>
                </div>

                <div className="border-gray-700 border-t pt-4">
                  <Select>
                    <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white">
                      <SelectValue placeholder="Add to reading list" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-600 bg-gray-800">
                      <SelectItem value="reading" className="text-white hover:bg-gray-700">
                        Currently Reading
                      </SelectItem>
                      <SelectItem value="completed" className="text-white hover:bg-gray-700">
                        Completed
                      </SelectItem>
                      <SelectItem value="plan-to-read" className="text-white hover:bg-gray-700">
                        Plan to Read
                      </SelectItem>
                      <SelectItem value="dropped" className="text-white hover:bg-gray-700">
                        Dropped
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full flex-row items-center justify-between">
            <h2 className="font-semibold text-xl">Chương truyện</h2>
            <div className="">

              {/* <Select value={selectedSource} onValueChange={setSelectedSource}>
                {sources.map((src) => (
                  <SelectItem key={src.value} value={src.value}>
                    {src.label} ({src.chapters.length})
                  </SelectItem>
                ))}
              </Select> */}

              <Select>
                <SelectTrigger className="w-full bg-gray-800 text-white">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800">
                  {sources.map((src) => (
                    <SelectItem key={src.value} value={src.value} className="text-white hover:bg-gray-700">
                      {src.label} ({src.chapters.length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <HorizontalChapterPagination
            chapters={cuuTruyenData?.chapters || []}
            rangeSize={10}
          // onChapterSelect={(chapter) => {
          //   console.log("Selected chapter:", chapter);
          // }}
          />
        </WideContainer>
      </div>
    </div >
  )
}
