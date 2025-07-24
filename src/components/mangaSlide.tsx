"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Constants } from "@/constants";
import useMedia from "@/hooks/Anilist/useMedia";
// import { useIsMobile } from "@/hooks/useIsMoblie"
import type { Media } from "@/types/anilist";
import { MediaSort, MediaType } from "@/types/anilist";
import { getTitle } from "@/utils";
// Import Embla plugins
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AspectRatio } from "./ui";

// Fallback images
const FALLBACK_BANNER = "/placeholder.svg?height=280&width=1600";


interface MangaSlideProps {
  manga: Media;
  nextManga?: Media;
  isFirst: boolean;
  isActive: boolean;
}

function MangaSlide({ manga, isFirst, isActive }: MangaSlideProps) {
  return (
    <div className="relative w-full">
      {/* Background Image Container */}
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[350px] md:h-[400px] lg:h-[450px]">
        <Image
          fill
          src={manga.bannerImage || FALLBACK_BANNER}
          alt={`${getTitle(manga)} banner`}
          className="object-cover object-center"
          priority={isFirst}
          sizes="100vw"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`${Constants.router.manga(manga.id, getTitle(manga, "vi"))}`}
              className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6 lg:gap-8"
            >
              {/* Manga Cover */}
              <div
                className={`w-32 shrink-0 transform transition-all duration-700 ease-out sm:w-40 md:w-48 lg:w-52 xl:w-56 ${isActive
                  ? "translate-y-0 opacity-100 sm:translate-x-0"
                  : "translate-y-4 opacity-0 sm:translate-x-[-20px]"
                  }`}
              >
                <div className="relative overflow-hidden rounded-lg shadow-2xl">
                  <AspectRatio ratio={2 / 3}>
                    <Image
                      src={manga?.coverImage?.large || "/placeholder.svg?height=300&width=200"}
                      alt={`${getTitle(manga, "vi")} cover`}
                      fill
                      priority={isFirst}
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>

              {/* Text Content */}
              <div
                className={`flex-1 transform text-center transition-all delay-200 duration-700 ease-out sm:text-left ${isActive ? "translate-y-0 opacity-100 sm:translate-x-0" : "translate-y-4 opacity-0 sm:translate-x-4"
                  }`}
              >
                <h2 className="mb-2 line-clamp-2 font-bold text-white text-xl leading-tight drop-shadow-lg sm:mb-4 lg:text-xl xl:text-2xl">
                  {getTitle(manga, "vi")}
                </h2>

                {manga.description && (
                  <p className="mb-3 line-clamp-2 max-w-2xl text-gray-100 text-sm drop-shadow-md sm:mb-4 sm:line-clamp-3 sm:text-base md:text-lg">
                    {manga.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
                  </p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-gray-200 text-xs sm:justify-start sm:gap-3 sm:text-sm">
                  {manga.averageScore && (
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm sm:gap-2 sm:px-3">
                      {manga.averageScore}%
                    </span>
                  )}
                  {manga.status && (
                    <span className="rounded-full bg-white/25 px-2 py-1 backdrop-blur-sm sm:px-3">{manga.status}</span>
                  )}
                  {manga.genres && manga.genres.length > 0 && (
                    <span className="rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm sm:px-3">
                      {manga.genres[0]}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
}

export function CarouselSkeleton() {
  return (
    <div className="h-[400px] overflow-hidden rounded-lg bg-gray-800">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default function MangaCarousel() {
  // const { isMobile } = useIsMobile()
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    data: mangas,
    isLoading,
    error,
  } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    // countryOfOrigin: "JP",
    perPage: 10,
  });

  // Autoplay plugin configuration
  const autoplayPlugin = Autoplay({
    delay: 6000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg bg-gray-900">
        <p className="text-gray-400">Failed to load manga data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
        <CarouselSkeleton />
      </div>
    );
  }

  if (!mangas || mangas.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg bg-gray-900">
        <p className="text-gray-400">No manga found</p>
      </div>
    );
  }

  return (
    <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplayPlugin]}
        className="w-full"
        setApi={(emblaApi) => {
          if (emblaApi) {
            emblaApi.on("select", () => {
              setCurrentSlide(emblaApi.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent className="-ml-0">
          {mangas.map((manga, index) => {
            const nextIndex = (index + 1) % mangas.length;
            const nextManga = mangas[nextIndex];

            return (
              <CarouselItem key={manga.id} className="pl-0">
                <MangaSlide
                  manga={manga}
                  nextManga={nextManga}
                  isFirst={index === 0}
                  isActive={index === currentSlide}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

    </div>
  );
}