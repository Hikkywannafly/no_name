"use client";
import WideContainer from "@/components/layout/wideLayout";
import { default as HorizontalChapterPagination } from "@/components/manga/chapterPagition";
import InfoItem from "@/components/manga/infoItem";
import Image from "@/components/shared/image";
import Markdown from "@/components/shared/markDown";
import { TagItem } from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLoading,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnilist } from "@/context/useAnilist";
// import useMediaDetails from "@/hooks/Anilist/useMediaDetail";
// import { MediaType } from "@/types/anilist";
import useCuuTruyenData from "@/hooks/CuuTruyen/useCuuTruyenData";
import useHangTruyenData from "@/hooks/HangTruyen/useHangTruyenData";
import useTruyenQQData from "@/hooks/TruyenQQ/useTruyenQQData";
import type { Media } from "@/types/anilist";
// import type { UPage } from "@/types/manga";
import { numberWithCommas } from "@/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// Source configuration for prefetching
// const SOURCE_CONFIG = {
//   cuutruyen: {
//     apiEndpoint: '/api/cuutruyen/chapter',
//     sourceKey: 'source1'
//   },
//   truyenqq: {
//     apiEndpoint: '/api/truyenqq/chapter',
//     sourceKey: 'source2'
//   }
// } as const;

interface MangaProps {
  mangaId: number;
  name?: string;
  prefetchManga?: Media;
}

export const Manga = memo(function Manga(props: MangaProps) {
  const { mangaId, prefetchManga } = props;
  const { mediaCache, setMedia } = useAnilist();

  const manga = mediaCache[mangaId] || prefetchManga;

  const viTitles =
    manga.translations?.filter((t: any) => t.vi).map((t: any) => t.vi) ?? [];

  const { data: cuuTruyenData, isLoading: cuuTruyenLoading } = useCuuTruyenData(
    `${manga?.title?.userPreferred}` || `${manga?.title?.english}` || "",
  );
  const { data: truyenQQData, isLoading: truyenQQLoading } = useTruyenQQData(
    manga?.title?.userPreferred || "",
    viTitles[1] ? viTitles[1] : viTitles[0],
  );
  const { data: hangTruyenData, isLoading: hangTruyenLoading } = useHangTruyenData(
    manga?.title?.userPreferred || ""
  );
  // const [prefetchedChapters, setPrefetchedChapters] = useState<Record<string, UPage[]>>({});

  // const prefetchChapters = useCallback(async () => {
  //   try {
  //     const promises = Object.entries(SOURCE_CONFIG).map(([key, config]) => {
  //       const chapters = key === 'cuutruyen' ? cuuTruyenData?.chapters : truyenQQData?.chapters;
  //       const firstChapter = chapters?.[0];

  //       if (!firstChapter?.id) return null;

  //       return fetch(`${config.apiEndpoint}?name=${firstChapter.id}`)
  //         .then(res => res.json())
  //         .then(data => ({ sourceKey: config.sourceKey, data: data.data || [] }))
  //         .catch(() => ({ sourceKey: config.sourceKey, data: [] }));
  //     }).filter(Boolean);

  //     const results = await Promise.allSettled(promises);
  //     const prefetched: Record<string, UPage[]> = {};

  //     for (const result of results) {
  //       if (result.status === 'fulfilled' && result.value) {
  //         prefetched[result.value.sourceKey] = result.value.data;
  //       }
  //     }

  //     setPrefetchedChapters(prefetched);
  //   } catch (error) {
  //     console.error('Error prefetching chapters:', error);
  //   }
  // }, [cuuTruyenData?.chapters, truyenQQData?.chapters]);

  // // Auto prefetch when data is available
  // useMemo(() => {
  //   const hasChapters = cuuTruyenData?.chapters?.length > 0 || (truyenQQData?.chapters && truyenQQData.chapters.length > 0);
  //   const notPrefetched = Object.keys(prefetchedChapters).length === 0;

  //   if (hasChapters && notPrefetched) {
  //     prefetchChapters();
  //   }
  // }, [cuuTruyenData?.chapters, truyenQQData?.chapters, prefetchedChapters, prefetchChapters]);

  useEffect(() => {
    if (prefetchManga && !mediaCache[mangaId]) {
      setMedia(mangaId, prefetchManga);
    }
  }, [mangaId, prefetchManga, mediaCache, setMedia]);

  const descriptionSources = useMemo(
    () =>
      [
        {
          label: "Hang Truyen",
          value: "hangtruyen",
          description: hangTruyenData?.description || "",
          loading: hangTruyenLoading,
          language: "vi",
        },
        {
          label: "Anilist (English)",
          value: "anilist-en",
          description: manga?.description || "",
          language: "en",
        },

        {
          label: "CuuTruyen",
          value: "cuutruyen",
          description: cuuTruyenData.description || "",
          loading: cuuTruyenLoading,
          language: "vi",
        },
        {
          label: "TruyenQQ ",
          value: "truyenqq",
          description: truyenQQData?.description || "",
          loading: truyenQQLoading,
          language: "vi",
        },
      ].filter((source) => source.description.trim() !== ""),
    [
      manga?.description,
      cuuTruyenData.description,
      cuuTruyenLoading,
      truyenQQData?.description,
      truyenQQLoading,
      hangTruyenData?.description,
      hangTruyenLoading,
    ],
  );
  // console.log("truyen test", truyenQQData.chapters, cuuTruyenData.chapters);
  const defaultDescriptionSource = useMemo(
    () => (descriptionSources.length > 0 ? descriptionSources[0].value : ""),
    [descriptionSources],
  );
  const [selectedDescriptionSource, setSelectedDescriptionSource] = useState(
    defaultDescriptionSource,
  );
  const currentDescription = useMemo(
    () =>
      descriptionSources.find(
        (source) => source.value === selectedDescriptionSource,
      )?.description || "No description available.",
    [descriptionSources, selectedDescriptionSource],
  );

  const chapterSources = useMemo(
    () => [
      {
        label: "Hang Truyen",
        value: "hangtruyen",
        chapters: hangTruyenData.chapters || [],
        loading: hangTruyenLoading,
      },
      {
        label: "CuuTruyen",
        value: "cuutruyen",
        chapters: cuuTruyenData.chapters || [],
        loading: cuuTruyenLoading,
      },
      {
        label: "TruyenQQ",
        value: "truyenqq",
        chapters: truyenQQData.chapters || [],
        loading: truyenQQLoading,
      },

    ],
    [
      cuuTruyenData.chapters,
      cuuTruyenLoading,
      truyenQQData.chapters,
      truyenQQLoading,
      hangTruyenData.chapters,
      hangTruyenLoading,
    ],
  );
  const defaultChapterSource = useMemo(
    () =>
      chapterSources.reduce(
        (max, src) => (src.chapters.length > max.chapters.length ? src : max),
        chapterSources[0],
      ).value,
    [chapterSources],
  );
  const [selectedChapterSource, setSelectedChapterSource] =
    useState(defaultChapterSource);

  const handleDescriptionChange = useCallback(
    (value: string) => setSelectedDescriptionSource(value),
    [],
  );
  const handleChapterSourceChange = useCallback(
    (value: string) => setSelectedChapterSource(value),
    [],
  );

  const isChapterSourcesLoading =
    chapterSources.length === 0 || chapterSources.every((src) => src.loading);

  const selectedSource = useMemo(
    () => chapterSources.find((src) => src.value === selectedChapterSource),
    [chapterSources, selectedChapterSource],
  );

  // const handleReadNow = useCallback(() => {
  //   // Navigate to first chapter with prefetched data
  //   const firstChapter = selectedSource?.chapters?.[0];
  //   if (firstChapter) {
  //     const sourceKey = selectedChapterSource === 'cuutruyen' ? 'source1' : 'source2';
  //     const prefetchedData = prefetchedChapters[sourceKey];

  //     // Navigate to chapter page with prefetched data
  //     window.location.href = `/chapter/${firstChapter.id}/${sourceKey}?prefetched=${encodeURIComponent(JSON.stringify(prefetchedData))}`;
  //   }
  // }, [selectedSource?.chapters, selectedChapterSource, prefetchedChapters]);

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="relative h-[350px] w-full">
          {manga.bannerImage ? (
            <Image
              fill
              src={manga?.bannerImage || "/placeholder-banner.svg"}
              alt="Manga Background"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 h-full w-full"
              style={{
                background: `linear-gradient(135deg, ${manga.coverImage?.color || "#5a0035"} 0%, #5a0035 100%)`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>
        <div className="-mt-48 sm:-mt-12 relative ">
          <WideContainer classNames="lg:max-w-[1200px]">
            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
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
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {!isChapterSourcesLoading && (
                    <Button
                      className="bg-red-600 px-8 font-semibold text-white hover:bg-red-700"
                      disabled={!selectedSource?.chapters?.length}
                    >
                      Đọc ngay
                    </Button>
                  )}
                  <div className="">
                    <Select
                      value={"reading"}
                      onValueChange={handleDescriptionChange}
                    >
                      <SelectTrigger className="w-full text-white">
                        <SelectValue placeholder="Add to reading list" />
                      </SelectTrigger>
                      {/* <SelectContent className="">
                        <SelectItem value="reading" className="text-white">
                          Currently Reading
                        </SelectItem>
                        <SelectItem value="reading" className="text-white">
                          Completed
                        </SelectItem>
                        <SelectItem value="reading" className="text-white">
                          Plan to Read
                        </SelectItem>
                        <SelectItem
                          value="dropped"
                          className="text-white hover:bg-gray-700"
                        >
                          Dropped
                        </SelectItem>
                      </SelectContent> */}
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="font-bold text-2xl text-white leading-tight md:text-3xl lg:text-4xl">
                    {viTitles[0] || manga?.title?.userPreferred}
                  </h1>
                  <p className="text-gray-300 text-sm leading-relaxed md:text-base">
                    {viTitles[0]
                      ? manga?.title?.userPreferred
                      : manga?.title?.english}
                  </p>
                  <div className="hidden gap-x-8 overflow-x-auto md:flex md:gap-x-16 [&>*]:shrink-0">
                    <InfoItem
                      title={"Quốc Gia"}
                      value={manga.countryOfOrigin}
                    />
                    <InfoItem
                      title={"Tình Trạng"}
                      value={manga.status || "Unknown"}
                    />
                    <InfoItem title={"Chaptter"} value={manga.chapters} />
                    <InfoItem
                      title={"Thể Loại"}
                      value={manga.isAdult ? "18+" : ""}
                    />
                    <InfoItem
                      title={"Năm Phát Hành"}
                      value={manga.startDate?.year || "Unknown"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </WideContainer>
        </div>
      </div>
      <div className="text-white">
        <WideContainer classNames="lg:max-w-[1200px] py-8 md:py-12">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-xl">Mô tả</h2>
              {isChapterSourcesLoading ? <SelectLoading /> : null}
              {descriptionSources.length > 1 && (
                <Select
                  value={selectedDescriptionSource}
                  onValueChange={handleDescriptionChange}
                >
                  <SelectTrigger className="w-full bg-black/50 text-white sm:w-42">
                    <SelectValue placeholder="Chọn nguồn mô tả" />
                  </SelectTrigger>
                  <SelectContent className=" bg-black">
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
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <h2 className="font-semibold text-xl">Thể loại</h2>
                <div className="flex flex-wrap gap-2">
                  {manga.genres?.map((genre) => (
                    <TagItem
                      key={genre}
                      href="/"
                      className="rounded-sm bg-black/50 px-3 py-1 text-sm transition-colors "
                    >
                      {genre}
                    </TagItem>
                  ))}
                </div>
              </div>
              <div className="flex gap-x-8 overflow-x-auto md:hidden md:gap-x-16 [&>*]:shrink-0">
                <InfoItem title={"Quốc Gia"} value={manga.countryOfOrigin} />
                <InfoItem
                  title={"Tình Trạng"}
                  value={manga.status || "Unknown"}
                />
                <InfoItem title={"Chaptter"} value={manga.chapters} />
                <InfoItem
                  title={"Thể Loại"}
                  value={manga.isAdult ? "18+" : ""}
                />
                <InfoItem
                  title={"Năm Phát Hành"}
                  value={manga.startDate?.year || "Unknown"}
                />
              </div>
              <div className="mt-8 flex w-full flex-row items-center justify-between">
                <h2 className="font-semibold text-xl">Chương truyện</h2>
                <div className="">
                  {isChapterSourcesLoading ? (
                    <SelectLoading />
                  ) : (
                    <Select
                      value={selectedChapterSource}
                      onValueChange={handleChapterSourceChange}
                    >
                      <SelectTrigger className="w-full bg-black/50 text-white">
                        <SelectValue placeholder="Chọn nguồn" />
                        <SelectContent className="bg-black">
                          {chapterSources
                            .sort(
                              (a, b) => b.chapters.length - a.chapters.length,
                            )
                            .map((src) => (
                              <SelectItem
                                key={src.value}
                                value={src.value}
                                className="text-white "
                              >
                                {src.label} ({src.chapters.length})
                                {src.loading && (
                                  <img
                                    src="/loading-spin-white.svg"
                                    alt="Loading"
                                    className="h-6 w-6"
                                  />
                                )}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  )}
                </div>
              </div>
              {selectedSource?.loading ? (
                <ChapterSkeleton />
              ) : (
                <HorizontalChapterPagination
                  anilist={manga.id}
                  chapters={selectedSource?.chapters || []}
                  rangeSize={10}
                />
              )}
            </div>
            <div className="space-y-6">
              <div className="space-y-4 rounded-lg bg-black/50 p-6">
                <h3 className="font-semibold text-lg">Thông tin thêm</h3>
                <div className="md:no-scrollbar flex flex-row gap-4 overflow-x-auto rounded-md bg-background-900 p-4 md:flex-col [&>*]:shrink-0">
                  <InfoItem title="Việt Nam" value={viTitles.join("; ")} />
                  <InfoItem title="English" value={manga.title?.english} />
                  <InfoItem title="Native" value={manga.title?.native} />
                  <InfoItem title="Romanji" value={manga.title?.romaji} />
                  <InfoItem
                    title={"Phổ Biến"}
                    value={numberWithCommas(manga.popularity)}
                  />
                  <InfoItem
                    title={"Yêu thích"}
                    value={numberWithCommas(manga.favourites)}
                  />
                  <InfoItem
                    title={"Trending"}
                    value={numberWithCommas(manga.trending)}
                  />

                  <InfoItem
                    title={"Synonyms"}
                    value={manga.synonyms?.join("\n")}
                  />
                </div>
              </div>
            </div>
          </div>
        </WideContainer>
      </div>
    </div>
  );
});

function ChapterSkeleton() {
  return (
    <Card className="cursor-pointer bg-black/50 p-4 transition-colors hover:bg-gray-700">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}
