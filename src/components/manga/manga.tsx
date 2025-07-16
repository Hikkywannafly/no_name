"use client";
import { WideContainer } from "@/components/layout/wideLayout";
import HorizontalChapterPagination from "@/components/manga/chapterPagition";
import Image from "@/components/shared/image";
import Markdown from "@/components/shared/markDown";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnilist } from "@/context/useAnilist";
// import useMediaDetails from "@/hooks/Anilist/useMediaDetail";
// import { MediaType } from "@/types/anilist";
import useCuuTruyenData from "@/hooks/CuuTruyen/useCuuTruyenData";
import type { Media } from "@/types/anilist";
import { convertCuuTruyen1 } from "@/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useState } from "react";
interface MangaProps {
  mangaId: number;
  name?: string;
  prefetchManga?: Media;
}

interface DescriptionSource {
  label: string;
  value: string;
  description: string;
  language?: string;
}

export function Manga(props: MangaProps) {
  const { mangaId, prefetchManga } = props;
  const { mediaCache } = useAnilist();

  const manga = mediaCache[mangaId] || prefetchManga;
  // const { data: manga } = useMediaDetails({
  //   id: mangaId,
  //   type: MediaType.Manga,
  // },
  //   {
  //     fallbackData: prefetchManga,
  //     revalidateOnFocus: false,
  //   }
  // );
  console.log("Media Cache:", manga);
  // const { chapters: mangaDexData } = useChapterList(mangaId, {
  //   translatedLanguage: ["vi"],
  // });
  const { data: cuuTruyenData } = useCuuTruyenData(
    manga?.title?.userPreferred ||
      manga?.title?.english ||
      manga?.title?.native ||
      "",
  );
  console.log("Manga Data:", manga);

  // Description sources
  const descriptionSources: DescriptionSource[] = [
    {
      label: "Anilist (English)",
      value: "anilist-en",
      description: manga?.description || "",
      language: "en",
    },
    {
      label: "CuuTruyen (Tiếng Việt)",
      value: "cuutruyen",
      description: cuuTruyenData.description || "",
      language: "vi",
    },
    // {
    //   label: "MangaDex (Tiếng Việt)",
    //   value: "mangadx-vi",
    //   description: manga?.attributes?.description?.vi || "",
    //   language: "vi",
    // },
    // {
    //   label: "MangaDex (English)",
    //   value: "mangadx-en",
    //   description: manga?.attributes?.description?.en || "",
    //   language: "en",
    // },
  ].filter((source) => source.description.trim() !== "");

  const [selectedDescriptionSource, setSelectedDescriptionSource] = useState(
    descriptionSources.length > 0 ? descriptionSources[0].value : "",
  );

  const currentDescription =
    descriptionSources.find(
      (source) => source.value === selectedDescriptionSource,
    )?.description || "No description available.";

  const chapterSources = [
    {
      label: "CuuTruyen",
      value: "cuutruyen",
      chapters: cuuTruyenData.chapters || [],
    },
    // { label: "MangaDex", value: "mangadex", chapters: mangaDexData },
    // Add more sources here if needed
  ];

  // Find the source with the most chapters for default selection
  const defaultChapterSource = chapterSources.reduce(
    (max, src) => (src.chapters.length > max.chapters.length ? src : max),
    chapterSources[0],
  );

  // State for selected chapter source
  const [selectedChapterSource, setSelectedChapterSource] = useState(
    defaultChapterSource.value,
  );

  // Find the chapters for the selected source
  const selectedChapters =
    chapterSources.find((src) => src.value === selectedChapterSource)
      ?.chapters || [];

  const unified = convertCuuTruyen1(cuuTruyenData);

  console.log("Unified Manga:", unified);
  // console.log("Chapter Sources mangadex:", convertMangaDexChapters(mangaDexData));
  return (
    <div className="w-full">
      {/* Hero Background Section - Fixed Layout */}
      <div className="relative w-full">
        {/* Background Image - Fixed Height */}
        <div className="relative h-[350px] w-full">
          <Image
            fill
            src={manga?.bannerImage || "/placeholder-banner.svg"}
            alt="Manga Background"
            unoptimized
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content overlay - Now with flexible height */}
        <div className="-mt-48 sm:-mt-12 relative pb-8">
          <WideContainer classNames="lg:max-w-[1200px]">
            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
              {/* Manga Cover */}
              <div className="mx-auto flex-shrink-0 md:mx-0">
                <div className="w-48 overflow-hidden rounded-lg shadow-2xl sm:w-52 lg:w-52">
                  <AspectRatio ratio={2 / 3}>
                    <Image
                      src={manga?.coverImage?.large || "/placeholder.svg"}
                      alt="Manga Cover"
                      fill
                      priority
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>

              {/* Manga Info - Now with flexible height for long titles */}
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
                        <SelectItem value="reading" className="text-white">
                          Currently Reading
                        </SelectItem>
                        <SelectItem value="completed" className="text-white">
                          Completed
                        </SelectItem>
                        <SelectItem value="plan-to-read" className="text-white">
                          Plan to Read
                        </SelectItem>
                        <SelectItem
                          value="dropped"
                          className="text-white hover:bg-gray-700"
                        >
                          Dropped
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Title section with flexible height */}
                <div className="space-y-2">
                  <h1 className="font-bold text-2xl text-white leading-tight md:text-3xl lg:text-4xl">
                    {/* {getMangaTitle(manga)} */}
                    {manga?.title?.userPreferred}
                  </h1>
                  <p className="text-gray-300 text-sm leading-relaxed md:text-base">
                    {manga?.title?.english ||
                      manga?.title?.native ||
                      "No title available."}
                  </p>
                </div>
              </div>
            </div>
          </WideContainer>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="text-white">
        <WideContainer classNames="lg:max-w-[1200px] py-8 md:py-12">
          {/* Description with Source Selection */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-xl">Mô tả</h2>
              {descriptionSources.length > 1 && (
                <Select
                  value={selectedDescriptionSource}
                  onValueChange={setSelectedDescriptionSource}
                >
                  <SelectTrigger className="w-full border-gray-600 bg-gray-800 text-white sm:w-64">
                    <SelectValue placeholder="Chọn nguồn mô tả" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-600 bg-gray-800">
                    {descriptionSources.map((source) => (
                      <SelectItem
                        key={source.value}
                        value={source.value}
                        className="text-white hover:bg-gray-700"
                      >
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="text-gray-300 leading-relaxed">
              <Markdown content={currentDescription} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* All Tags */}
              <div className="space-y-3">
                <h2 className="font-semibold text-xl">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {/* {manga?.attributes?.tags?.map((tag) => (
                    <TagItem
                      key={tag.id}
                      href="/"
                      className="rounded-md bg-gray-800 px-3 py-1 text-gray-300 text-sm transition-colors hover:bg-gray-700"
                    >
                      {getTagName(tag)}
                    </TagItem>
                  ))} */}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="space-y-4 rounded-lg bg-gray-800 p-6">
                <h3 className="font-semibold text-lg">Information</h3>
                {/* <div className="space-y-3">
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
                </div> */}
                <div className="border-gray-700 border-t pt-4">
                  <Select>
                    <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white">
                      <SelectValue placeholder="Add to reading list" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-600 bg-gray-800">
                      <SelectItem
                        value="reading"
                        className="text-white hover:bg-gray-700"
                      >
                        Currently Reading
                      </SelectItem>
                      <SelectItem
                        value="completed"
                        className="text-white hover:bg-gray-700"
                      >
                        Completed
                      </SelectItem>
                      <SelectItem
                        value="plan-to-read"
                        className="text-white hover:bg-gray-700"
                      >
                        Plan to Read
                      </SelectItem>
                      <SelectItem
                        value="dropped"
                        className="text-white hover:bg-gray-700"
                      >
                        Dropped
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex w-full flex-row items-center justify-between">
            <h2 className="font-semibold text-xl">Chương truyện</h2>
            <div className="">
              <Select
                value={selectedChapterSource}
                onValueChange={setSelectedChapterSource}
              >
                <SelectTrigger className="w-full text-white">
                  <SelectValue placeholder="Select Source" />
                  <SelectContent className="">
                    {chapterSources
                      .sort((a, b) => b.chapters.length - a.chapters.length)
                      .map((src) => (
                        <SelectItem
                          key={src.value}
                          value={src.value}
                          className="text-white hover:bg-gray-700"
                        >
                          {src.label} ({src.chapters.length})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
          <HorizontalChapterPagination
            chapters={selectedChapters}
            rangeSize={10}
          />
        </WideContainer>
      </div>
    </div>
  );
}
