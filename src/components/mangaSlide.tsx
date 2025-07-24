"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CustomCarouselNext,
  CustomCarouselPrevious,
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

// Fallback images
const FALLBACK_BANNER = "/placeholder.svg?height=280&width=1600";
const FALLBACK_COVER = "/placeholder.svg?height=600&width=400";

interface MangaSlideProps {
  manga: Media;
  nextManga?: Media;
  isFirst: boolean;
  isActive: boolean;
}

function MangaSlide({ manga, nextManga, isFirst, isActive }: MangaSlideProps) {
  const currentColor = manga.coverImage?.color || "#1a1a1a";
  const nextColor = nextManga?.coverImage?.color || "#1a1a1a";

  console.log(`MangaSlide: ${getTitle(manga)}`, manga);

  return (
    <div className="relative h-[400px] overflow-hidden transition-colors duration-700 ease-in-out">
      <div
        className="absolute inset-0 h-[300px] overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          background: `linear-gradient(135deg, ${currentColor} 0%, ${nextColor} 100%)`,
        }}
      />

      {/* Background Banner Image - Smaller and positioned lower */}
      <div className="-translate-x-1/2 absolute top-16 left-1/2 h-[280px] w-[70%] overflow-hidden rounded-lg shadow-2xl">
        <Image
          fill
          src={manga.bannerImage || FALLBACK_BANNER}
          alt={`${getTitle(manga)} banner`}
          className="object-cover opacity-90"
          priority={isFirst}
          sizes="70vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        {/* Custom Navigation Buttons - Positioned inside the banner */}
        <div className="-translate-y-1/2 absolute top-1/2 right-4 z-30 flex flex-col gap-2">
          <CustomCarouselPrevious className="relative top-0 left-0 size-8 translate-y-0 border-white/30 bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80 hover:text-white" />
          <CustomCarouselNext className="relative top-0 right-0 size-8 translate-y-0 border-white/30 bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80 hover:text-white" />
        </div>
      </div>
      {/* Content */}
      <Link
        href={`${Constants.router.manga(manga.id, getTitle(manga))}`}
        className="relative z-20 mx-auto flex h-full max-w-6xl items-center gap-8 p-8"
      >
        {/* Cover Image with slide-in animation */}
        <Card
          className={`h-72 w-48 shrink-0 transform overflow-hidden shadow-2xl transition-all duration-700 ease-out ${
            isActive ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
        >
          <div className="relative h-full w-full">
            <AspectRatio ratio={2 / 3} className="h-full w-full">
              <Image
                src={manga.coverImage?.large || FALLBACK_COVER}
                alt={`${getTitle(manga)} cover`}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="192px"
              />
            </AspectRatio>
          </div>
        </Card>
        {/* Text Content */}
        <div
          className={`flex transform flex-col justify-center space-y-4 text-white transition-all delay-200 duration-700 ease-out ${
            isActive ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          }`}
        >
          <h2 className="line-clamp-2 font-bold text-3xl leading-tight drop-shadow-lg md:text-4xl lg:text-5xl">
            {getTitle(manga, "vi")}
          </h2>
          {manga.description && (
            <p className="line-clamp-3 max-w-2xl text-base text-gray-100 drop-shadow-md md:text-lg">
              {manga.description.replace(/<[^>]*>/g, "").substring(0, 250)}...
            </p>
          )}
          <div className="flex items-center gap-6 text-gray-200 text-sm">
            {manga.averageScore && (
              <span className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                ⭐ {manga.averageScore}%
              </span>
            )}
            {manga.status && (
              <span className="rounded-full bg-white/25 px-3 py-1 text-sm backdrop-blur-sm">
                {manga.status}
              </span>
            )}
            {manga.genres && manga.genres.length > 0 && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                {manga.genres[0]}
              </span>
            )}
          </div>
        </div>
      </Link>
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
    countryOfOrigin: "JP",
    perPage: 20,
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
      <style jsx global>{`
        .embla__slide {
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }
        
        .embla__slide.is-selected {
          opacity: 1;
        }
        
        .embla__container {
          transition: none !important;
        }
        /* Custom scrollbar for better UX */
        .embla__viewport::-webkit-scrollbar {
          display: none;
        }
        
        .embla__viewport {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
