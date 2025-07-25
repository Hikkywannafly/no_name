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
// import { useIsMobile } from "@/hooks/useIsMoblie"
import type { Media } from "@/types/anilist";
import { MediaSort, MediaType } from "@/types/anilist";
import { getTitle } from "@/utils";
// Import Embla plugins
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import WideContainer from "./layout/wideLayout";
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
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[350px]">
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
        <WideContainer classNames="absolute inset-0 mt-20 flex items-center container mx-auto">
          <div className=" ">
            <Link
              href={`${Constants.router.manga(manga.id, getTitle(manga, "vi"))}`}
              className="mx-auto flex max-w-[1200px] flex-col items-center sm:flex-row sm:items-end "
            >
              {/* Manga Cover */}
              <div
                className={`w-32 shrink-0 transform transition-all duration-700 ease-out sm:w-40 md:w-48 lg:w-52 ${
                  isActive
                    ? "translate-y-0 opacity-100 sm:translate-x-0"
                    : "translate-y-4 opacity-0 sm:translate-x-[-20px]"
                }`}
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

              {/* Text Content */}
              <div
                className={`flex-1 transform text-center transition-all delay-200 duration-700 ease-out sm:text-left ${
                  isActive
                    ? "translate-y-0 opacity-100 sm:translate-x-0"
                    : "translate-y-4 opacity-0 sm:translate-x-4"
                }`}
              >
                <h2 className="mb-2 line-clamp-2 font-bold text-white text-xl leading-tight drop-shadow-lg sm:mb-4 lg:text-xl xl:text-2xl">
                  {getTitle(manga, "vi")}
                </h2>
              </div>
            </Link>
          </div>
        </WideContainer>
      </div>
    </div>
  );
}
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
    <div className="h-[400px] overflow-hidden rounded-lg bg-gray-800">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default function MangaCarousel() {
  // const { isMobile } = useIsMobile()
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
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
  // Handle slide selection
  const handleSlideSelect = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

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
        setApi={setApi}
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
        <SlideIndicators
          total={mangas.length}
          current={currentSlide}
          onSelect={handleSlideSelect}
        />
      </Carousel>
    </div>
  );
}
