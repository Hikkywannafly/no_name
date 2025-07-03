"use client";
// import Image from "next/image";

// // 1. Import Swiper components
// import { Autoplay, Navigation, Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// 2. Import Swiper styles
import { useFeaturedManga } from "@/hooks/MangaDex";
import { getCoverArt } from "@/utils/mangadex";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AspectRatio } from "./ui";
export default function MangaCarousel() {
  const {
    mangaList: mangas,
    // isLoading,
    // error,
    // mutate,
  } = useFeaturedManga({});
  console.log("mangas", mangas);
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {mangas.map((manga) => (
        <div key={manga.id} className="mb-4 text-center">
          <h2 className="font-bold text-2xl text-white">
            {manga.attributes?.title?.en ||
              manga.attributes?.title?.vn ||
              "Unknown Title"}
          </h2>
          <AspectRatio
            ratio={16 / 9}
            className="relative w-full overflow-hidden rounded-lg"
          >
            <img
              src={getCoverArt(manga)}
              title="Cover Art"
              alt={
                manga.attributes?.title?.vn ||
                manga.attributes?.title?.en ||
                "Unknown Title"
              }
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </div>
      ))}

      {/* <Swiper
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
                <Image
                  src={typeof manga.cover_art === "string" ? manga.cover_art : ""}
                  alt={manga.attributes?.title?.vn || manga.attributes?.title?.en || ""}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <div className="flex-shrink-0">
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
 */}
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
