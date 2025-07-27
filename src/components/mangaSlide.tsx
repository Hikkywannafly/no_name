"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { FadeCarousel } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import useMedia from "@/hooks/Anilist/useMedia"
import type { Media } from "@/types/anilist"
import { MediaSort, MediaStatus, MediaType } from "@/types/anilist"
import { getTitle } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import WideContainer from "./layout/wideLayout"
import TagItem from "./shared/tag"

interface MangaSlideProps {
  manga: Media
  isFirst: boolean
  isActive: boolean
}

function MangaSlide({ manga, isFirst, isActive }: MangaSlideProps) {
  const status =
    manga.status === MediaStatus.Finished
      ? "Hoàn thành"
      : manga.status === MediaStatus.Releasing
        ? "Đang phát hành"
        : "Đã hủy"

  return (
    <div className="relative h-full w-full">
      {/* Background Image Container */}
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[350px]">
        {manga.bannerImage && (
          <Image
            fill
            src={manga.bannerImage || "/placeholder.svg"}
            alt="Fallback Banner"
            className="object-cover object-center"
            priority={isFirst}
            sizes="100vw"
          />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />

        {/* Content Container */}
        <WideContainer classNames="absolute inset-0 mt-20 flex items-center mx-auto">
          <div className="w-full">
            <Link
              href={`/manga/${manga.id}/${getTitle(manga, "vi")}`}
              className="mx-auto flex max-w-[1200px] flex-row items-start"
            >
              {/* Manga Cover */}
              <div
                className={`w-32 shrink-0 transform transition-all duration-700 ease-out sm:w-40 md:w-48 lg:w-52 ${isActive
                  ? "translate-y-0 opacity-100 sm:translate-x-0"
                  : "translate-y-4 opacity-0 sm:translate-x-[-20px]"
                  }`}
              >
                <div className="relative w-28 overflow-hidden rounded-md shadow-2xl sm:w-32 md:w-36 lg:w-40">
                  <AspectRatio ratio={2 / 3}>
                    <Image
                      src={manga?.coverImage?.large || "/placeholder.svg?height=300&width=200"}
                      alt="Manga Cover"
                      fill
                      priority={isFirst}
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>

              <div
                className={`ml-6 flex transform flex-col justify-between gap-4 text-center transition-all delay-200 duration-700 ease-out sm:text-left ${isActive ? "translate-y-0 opacity-100 sm:translate-x-0" : "translate-y-4 opacity-0 sm:translate-x-4"
                  }`}
              >
                <h2 className="line-clamp-2 font-bold text-white text-xl leading-tight drop-shadow-lg lg:text-xl xl:text-2xl">
                  {getTitle(manga, "vi")}
                </h2>

                {/* Native Title Display */}
                {manga.title?.userPreferred && (
                  <p className="font-medium text-sm text-white/90">{manga.title.userPreferred}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {manga.genres?.map((genre, index) => (
                    <TagItem key={index} className="rounded-sm bg-black/50 px-3 py-1 text-sm transition-colors">
                      {genre}
                    </TagItem>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                  {manga.status && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{status}</span>
                    </div>
                  )}
                  {manga.format && (
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-1 rounded-full bg-white/60" />
                      <span>{manga.format}</span>
                    </div>
                  )}
                  {manga.countryOfOrigin && (
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-white/60" />
                      <span>{manga.countryOfOrigin || "Unknown"}</span>
                    </div>
                  )}
                </div>
                <div >
                  <Button className="border-1 border-black bg-[#18000e] px-6 py-2 font-bold text-sm text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-[#18000e]/80 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                    <p className="tracking-wide">Xem thông tin</p>
                  </Button>
                </div>

              </div>
            </Link>
          </div>
        </WideContainer>
      </div >
    </div >
  )
}

export function CarouselSkeleton() {
  return (
    <div className="h-[400px] overflow-hidden rounded-lg bg-black/50">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export default function MangaCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const {
    data: mangas,
    isLoading,
    error,
  } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    countryOfOrigin: "JP",
    perPage: 10,
  })

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg bg-gray-900">
        <p className="text-gray-400">Failed to load manga data</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
        <CarouselSkeleton />
      </div>
    )
  }

  if (!mangas || mangas.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg bg-gray-900">
        <p className="text-gray-400">No manga found</p>
      </div>
    )
  }

  return (
    <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
      <FadeCarousel
        autoplay={true}
        autoplayDelay={6000}
        className="h-[300px] sm:h-[350px]"
        onSlideChange={setCurrentSlide}
      >
        {mangas.map((manga, index) => (
          <MangaSlide key={manga.id} manga={manga} isFirst={index === 0} isActive={index === currentSlide} />
        ))}
      </FadeCarousel>
    </div>
  )
}
