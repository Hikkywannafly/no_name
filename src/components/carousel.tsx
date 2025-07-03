"use client";

// 1. Import Swiper components
import Image from "@/components/shared/image";
import { AspectRatio } from "@/components/ui";
import { useFeaturedManga } from "@/hooks/MangaDex";
import { getCoverArt } from "@/utils/mangadex";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
export default function MangaCarousel() {
  const {
    mangaList: mangas,
    isLoading,
    // error,
    // mutate,
  } = useFeaturedManga({});
  console.log("mangas", mangas);
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {isLoading ? (
        <>
          <span>Is loading</span>
        </>
      ) : (
        <>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="my-swiper-container" // Add a custom class for styling
          >
            {mangas.map((manga) => (
              <SwiperSlide key={manga.id}>
                <div className="relative flex min-h-[350px] items-center overflow-hidden rounded-lg bg-gradient-to-r from-black/80 to-transparent p-8">
                  <div className="-z-10 absolute inset-0">
                    <AspectRatio
                      ratio={16 / 9}
                      className="relative w-full overflow-hidden rounded-lg"
                    >
                      <Image
                        fill
                        unoptimized
                        src={getCoverArt(manga)}
                        title="Cover Art"
                        alt={
                          manga.attributes?.title?.vn ||
                          manga.attributes?.title?.en ||
                          "Unknown Title"
                        }
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex-shrink-0"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
}

// You can add custom styles for Swiper navigation/pagination in your global CSS
/*
.my-swiper-container .swiper-button-next,
.my-swiper-container .swiper-button-prev {
  color: #fff;
}

.my-swiper-container .swiper-pagination-bullet-active {
  background-color: #fff;
}
*/
