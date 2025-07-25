"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Constants } from "@/constants";
import useMedia from "@/hooks/Anilist/useMedia";
import { cn } from "@/lib/utils";
import type { Media } from "@/types/anilist";
import { MediaSort, MediaType } from "@/types/anilist";
import { getTitle } from "@/utils";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WideContainer } from "./layout/wideLayout";
import { AspectRatio } from "./ui";

// Fallback images
const FALLBACK_BANNER = "/placeholder.svg?height=280&width=1600";

interface MangaSlideProps {
  manga: Media;
  isActive: boolean;
  isFirst: boolean;
}

function MangaSlide({
  manga,
  isActive,
  isFirst,
  // onPrev: handlePrev,
  // onNext: handleNext,
  // canScrollPrev,
  // canScrollNext,
}: MangaSlideProps) {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Background Image Container */}
      <div className="relative h-[250px] w-full overflow-hidden sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <Image
          fill
          src={manga.bannerImage || FALLBACK_BANNER}
          alt={`${getTitle(manga)} banner`}
          className="object-cover transition-all duration-1000 ease-in-out"
          priority={isFirst}
          sizes="100vw"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        <div className="absolute inset-0 flex items-center">
          <WideContainer classNames="w-full px-4 sm:px-6 lg:px-8">
            <Link
              href={`${Constants.router.manga(manga.id, getTitle(manga, "vi"))}`}
              className="flex max-w-none flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8"
            >
              <div
                className={cn(
                  "shrink-0 transform transition-all duration-1000 ease-out",
                  isActive
                    ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                    : "translate-x-[-30px] translate-y-4 scale-95 opacity-0",
                )}
              >
                <div className="relative w-28 overflow-hidden rounded-md shadow-2xl sm:w-32 md:w-36 lg:w-40">
                  <AspectRatio ratio={2 / 3}>
                    <Image
                      src={
                        manga?.coverImage?.large ||
                        "/placeholder.svg?height=300&width=200"
                      }
                      alt="Manga Cover"
                      fill
                      priority={isFirst}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </AspectRatio>
                </div>
              </div>

              <div
                className={cn(
                  "flex-1 transform transition-all delay-300 duration-1000 ease-out",
                  isActive
                    ? "translate-x-0 translate-y-0 opacity-100"
                    : "translate-x-4 translate-y-4 opacity-0",
                )}
              >
                <h2 className="mb-2 line-clamp-2 font-bold text-lg text-white leading-tight drop-shadow-lg sm:mb-3 sm:text-xl md:text-2xl lg:text-3xl">
                  {getTitle(manga, "vi")}
                </h2>

                {manga.description && (
                  <p className="mb-3 line-clamp-2 max-w-2xl text-gray-100 text-xs drop-shadow-md sm:mb-4 sm:line-clamp-3 sm:text-sm md:text-base">
                    {manga.description
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 180)}
                    ...
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
                  {manga.averageScore && (
                    <span className="rounded bg-orange-500 px-2 py-1 font-medium text-white">
                      {manga.averageScore}%
                    </span>
                  )}
                  {manga.genres &&
                    manga.genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="rounded bg-gray-700 px-2 py-1 text-gray-200 hover:bg-gray-600"
                      >
                        {genre}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          </WideContainer>
        </div>
      </div>
    </div>
  );
}

// Navigation Arrows Component
function NavigationArrows({
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
}: {
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}) {
  return (
    <div className="z-10 mx-auto ">
      <div className="absolute right-0 mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col justify-start gap-2">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={onPrev}
            disabled={!canScrollPrev}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md bg-black/50 text-white transition-all duration-200 hover:bg-black/70",
              !canScrollPrev && "cursor-not-allowed opacity-50",
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={onNext}
            disabled={!canScrollNext}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md bg-black/50 text-white transition-all duration-200 hover:bg-black/70",
              !canScrollNext && "cursor-not-allowed opacity-50",
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Slide Indicators Component (matching the reference design)
function SlideIndicators({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
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
            index === current
              ? "w-8 bg-white"
              : "w-2 bg-white/50 hover:bg-white/70",
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="h-[250px] overflow-hidden rounded-lg bg-gray-800 sm:h-[300px] md:h-[350px] lg:h-[400px]">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default function MangaCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>(null);

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
    delay: 6000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  // Handle slide selection
  const handleSlideSelect = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  // Navigation handlers
  const handlePrev = () => {
    if (api) {
      api.scrollPrev();
    }
  };

  const handleNext = () => {
    if (api) {
      api.scrollNext();
    }
  };

  // Update current slide when API changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial slide

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (error) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-lg bg-gray-900 sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <p className="text-gray-400">Failed to load manga data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 relative">
        <CarouselSkeleton />
      </div>
    );
  }

  if (!mangas || mangas.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-lg bg-gray-900 sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <p className="text-gray-400">No manga found</p>
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          duration: 30, // Smooth transition duration
          skipSnaps: false,
        }}
        plugins={[autoplayPlugin]}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent className="-ml-0">
          {mangas.map((manga, index) => (
            <CarouselItem key={manga.id} className="pl-0">
              <MangaSlide
                manga={manga}
                isFirst={index === 0}
                isActive={index === currentSlide}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <NavigationArrows
          onPrev={handlePrev}
          onNext={handleNext}
          canScrollPrev={api?.canScrollPrev() ?? false}
          canScrollNext={api?.canScrollNext() ?? false}
        />
        {/* Slide Indicators */}
        <SlideIndicators
          total={mangas.length}
          current={currentSlide}
          onSelect={handleSlideSelect}
        />
      </Carousel>
    </div>
  );
}
