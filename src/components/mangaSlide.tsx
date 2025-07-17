"use client";
import Image from "next/image";
import Link from "next/link";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

import { Constants } from "@/constants";
import useMedia from "@/hooks/Anilist/useMedia";
import { useIsMobile } from "@/hooks/useIsMoblie";
import type { Media } from "@/types/anilist";
import { MediaSort, MediaType } from "@/types/anilist";
import { getTitle } from "@/utils";

// Import Embla plugins
import Autoplay from "embla-carousel-autoplay";

// Fallback images
const FALLBACK_BANNER = "/placeholder.svg?height=350&width=1920";
const FALLBACK_COVER = "/placeholder.svg?height=600&width=400";

interface MangaSlideProps {
  manga: Media;
  isFirst: boolean;
}

function MangaSlide({ manga, isFirst }: MangaSlideProps) {
  return (
    <div className="relative h-[350px] overflow-hidden rounded-lg">
      {/* Background Banner Image */}
      <div className="absolute inset-0">
        <Image
          fill
          src={manga.bannerImage || FALLBACK_BANNER}
          alt={`${getTitle(manga)} banner`}
          className="object-cover opacity-80"
          priority={isFirst} // Add priority to first image for LCP optimization
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <Link
        href={`${Constants.router.manga(manga.id, getTitle(manga))}`}
        className="relative z-10 mx-auto flex h-full max-w-7xl items-center gap-6 p-8"
      >
        {/* Cover Image */}
        <Card className="h-60 w-40 shrink-0 overflow-hidden border-0 shadow-2xl">
          <AspectRatio ratio={2 / 3} className="relative">
            <Image
              src={manga.coverImage?.large || FALLBACK_COVER}
              alt={`${getTitle(manga)} cover`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 160px, 160px"
            />
          </AspectRatio>
        </Card>
        <div className="flex flex-col justify-center space-y-4 text-white">
          <h2 className="line-clamp-2 font-bold text-2xl leading-tight md:text-3xl lg:text-4xl">
            {getTitle(manga, "vi")}
          </h2>

          {manga.description && (
            <p className="line-clamp-3 max-w-2xl text-gray-200 text-sm md:text-base">
              {manga.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
            </p>
          )}
          <div className="flex items-center gap-4 text-gray-300 text-sm">
            {manga.averageScore && (
              <span className="flex items-center gap-1">
                ⭐ {manga.averageScore}%
              </span>
            )}
            {manga.status && (
              <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                {manga.status}
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
    <div className="h-[350px] overflow-hidden rounded-lg">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default function MangaCarousel() {
  const { isMobile } = useIsMobile();
  const {
    data: mangas,
    isLoading,
    error,
  } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: 10,
  });

  // Autoplay plugin configuration
  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  if (error) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <p className="text-muted-foreground">Failed to load manga data</p>
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
      <div className="flex h-[350px] items-center justify-center">
        <p className="text-muted-foreground">No manga found</p>
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
      >
        <CarouselContent className="-ml-0">
          {mangas.map((manga, index) => (
            <CarouselItem key={manga.id} className="pl-0">
              <MangaSlide manga={manga} isFirst={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons - Hidden on mobile */}
        <CarouselPrevious
          className={`left-4 border-white/20 bg-black/50 text-white hover:bg-black/70 hover:text-white ${isMobile ? "hidden" : "flex"}
          `}
        />
        <CarouselNext
          className={`right-4 border-white/20 bg-black/50 text-white hover:bg-black/70 hover:text-white ${isMobile ? "hidden" : "flex"}
          `}
        />
      </Carousel>
    </div>
  );
}
