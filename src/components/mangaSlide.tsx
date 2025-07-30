"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { FadeCarousel, useCarousel } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import useMedia from "@/hooks/Anilist/useMedia"
import { cn } from "@/lib/utils"
import type { Media } from "@/types/anilist"
import { MediaSort, MediaStatus, MediaType } from "@/types/anilist"
import { getTitle } from "@/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
  const { goToPrevious, goToNext, isTransitioning } = useCarousel()
  const status =
    manga.status === MediaStatus.Finished
      ? "Hoàn thành"
      : manga.status === MediaStatus.Releasing
        ? "Đang phát hành"
        : "Đã hủy"

  return (
    <div className="relative h-full w-full">
      {/* Background Image Container */}
      <div
        className="relative h-[300px] w-full overflow-hidden sm:h-[350px]">
        {manga.bannerImage ? (
          <Image
            fill
            src={manga.bannerImage}
            alt="Banner"
            className="object-cover object-center"
            priority={isFirst}
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${manga.coverImage?.color || "#5a0035"} 0%, #5a0035 100%)`,
            }}
          />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />

        {/* Content Container */}
        <WideContainer classNames="mt-20 flex items-center mx-auto relative">
          <div className="container w-full ">
            <div

              className="item mx-auto flex max-w-[1400px] flex-row sm:items-start"
            >
              {/* Manga Cover */}
              <div
                className={`w-32 shrink-0 transform transition-all duration-700 ease-out sm:w-40 md:w-48 lg:w-52 ${isActive
                  ? "translate-y-0 opacity-100 sm:translate-x-0"
                  : "translate-y-4 opacity-0 sm:translate-x-[-20px]"
                  }`}
              >
                <div



                  className="relative w-28 overflow-hidden rounded-md shadow-2xl sm:w-32 md:w-36 lg:w-40">

                  <AspectRatio ratio={2 / 3}>
                    <Link
                      href={`/manga/${manga.id}/${getTitle(manga, "vi")}`}
                    >
                      <Image
                        src={manga?.coverImage?.large || "/placeholder.svg?height=300&width=200"}
                        alt="Manga Cover"
                        fill
                        priority={isFirst}
                        className="object-cover"
                      />
                    </Link>
                  </AspectRatio>
                </div>
              </div>

              <div
                className={`flex transform flex-col gap-4 transition-all delay-200 duration-700 ease-out sm:ml-6 sm:justify-between sm:text-left ${isActive ? "translate-y-0 opacity-100 sm:translate-x-0" : "translate-y-4 opacity-0 sm:translate-x-4"
                  }`}
              >
                <h2 className="line-clamp-4 font-bold text-white text-xl leading-tight drop-shadow-lg sm:line-clamp-2 lg:text-xl xl:text-2xl">
                  {getTitle(manga, "vi")}
                </h2>

                {/* Native Title Display */}
                {manga.title?.userPreferred && (
                  <p className="hidden font-medium text-sm text-white/90 sm:block">{manga.title.userPreferred}</p>
                )}

                <div className="hidden flex-wrap gap-2 sm:flex">
                  {manga.genres?.map((genre, index) => (
                    <TagItem key={index} className="rounded-sm bg-black/50 px-3 py-1 text-sm transition-colors">
                      {genre}
                    </TagItem>
                  ))}
                </div>

                <div className="hidden flex-wrap items-center gap-3 text-sm text-white/80 sm:flex">
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

                <div>
                  <Link
                    href={`/manga/${manga.id}/${getTitle(manga, "vi")}`}
                  >
                    <Button className="border-1 border-black bg-[#18000e] px-6 py-2 font-bold text-sm text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-[#18000e]/80 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                      <p className="tracking-wide">Xem thông tin</p>
                    </Button>

                  </Link>

                </div>
              </div>
            </div>
          </div>
          <div className="-bottom-9 absolute right-0 z-20 flex flex-row gap-2 px-2 sm:right-2 sm:bottom-2 sm:flex-col sm:px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="h-8 w-8 rounded-sm bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 sm:h-10 sm:w-10"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              disabled={isTransitioning}
              className="h-8 w-8 rounded-sm bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 sm:h-10 sm:w-10"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </WideContainer>
      </div>
    </div>
  )
}

export function CarouselSkeleton() {
  return (
    <div className="h-[400px] overflow-hidden rounded-lg bg-black/50">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

function SlideIndicators({
  total,
  current,
  onSelect,
}: {
  total: number
  current: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="-translate-x-1/2 -bottom-5 absolute left-1/2 z-10 flex transform gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          type="button"
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-out",
            index === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70",
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
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
    // countryOfOrigin: "JP",
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
        autoplay={false}
        autoplayDelay={6000}
        className="h-[300px] sm:h-[350px]"
        onSlideChange={setCurrentSlide}
      >
        {mangas.map((manga, index) => (
          <MangaSlide key={manga.id} manga={manga} isFirst={index === 0} isActive={index === currentSlide} />
        ))}
      </FadeCarousel>
      <SlideIndicators total={mangas.length} current={currentSlide} onSelect={setCurrentSlide} />
    </div>
  )
}
