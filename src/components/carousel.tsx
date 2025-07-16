"use client";

// 1. Import Swiper components
import Image from "@/components/shared/image";
import Skeleton from "@/components/shared/sekeleton";
import { Constants } from "@/constants";
import useMedia from "@/hooks/Anilist/useMedia";
import { useIsMobile } from "@/hooks/useIsMoblie";
import type {} from "@/types/anilist";
import { MediaSort, MediaType } from "@/types/anilist";
import { getTitle } from "@/utils";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AspectRatio } from "./ui";
export default function MangaCarousel() {
  const { isMobile } = useIsMobile();

  const { data: mangas, isLoading } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: 10,
  });
  console.log("devices", isMobile);
  return (
    <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
      {isLoading ? (
        <>
          {/* skeleton */}
          <div className="flex h-[350px] items-center justify-center">
            <div className="flex h-full w-full animate-pulse items-center justify-center rounded-lg bg-gray-200">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 155000,
            disableOnInteraction: false,
          }}
          className="my-swiper-container"
        >
          {mangas?.map((manga) => (
            <SwiperSlide key={manga.id}>
              <div className="relative flex h-[350px] items-center overflow-hidden rounded-lg bg-gradient-to-r from-black/80 to-transparent p-8">
                <div className="absolute inset-0 h-full w-full">
                  <Image
                    fill
                    src={
                      manga.bannerImage ||
                      "https://via.placeholder.com/1920x1080?text=No+Banner"
                    }
                    title="Cover Art"
                    className="h-full w-full object-cover opacity-80 blur-sm"
                    style={{ zIndex: 0 }}
                    priority
                    alt={"Unknown Title"}
                  />
                  <div className="absolute inset-0 z-10 bg-black/60" />
                </div>
                <Link
                  className="relative z-10 mx-auto mt-[50px] flex w-full items-center gap-6 lg:max-w-[1200px]"
                  href={`${Constants.router.manga(manga.id, getTitle(manga))}`}
                >
                  `
                  <div className="h-60 w-40 shrink-0 overflow-hidden rounded-lg shadow-lg">
                    <AspectRatio
                      ratio={2 / 3}
                      className="overflow-hidden rounded-lg shadow-lg"
                    >
                      <Image
                        src={
                          manga.coverImage?.large ||
                          "https://via.placeholder.com/400x600?text=No+Cover"
                        }
                        alt="Manga Cover"
                        fill
                        className="h-full w-full rounded-lg object-cover shadow-lg"
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex w-full flex-col justify-center">
                    <h2 className="mb-2 font-bold text-2xl text-white">
                      {getTitle(manga, "vi")}
                    </h2>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
