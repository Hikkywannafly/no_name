"use client";

// 1. Import Swiper components
import Image from "@/components/shared/image";
import { Constants } from "@/constants";
import { useFeaturedManga } from "@/hooks/MangaDex";
import { getCoverArt } from "@/utils/mangadex";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AspectRatio } from "./ui";
export default function MangaCarousel() {
  const {
    mangaList: mangas,
    isLoading,
    // error,
    // mutate,
  } = useFeaturedManga({});
  console.log("mangas", mangas);
  return (
    <div className="-mx-[50vw] relative right-1/2 left-1/2 w-screen">
      {isLoading ? (
        <>
          <span>Is loading</span>
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
          className="my-swiper-container" // Add a custom class for styling
        >
          {mangas.map((manga) => (
            <SwiperSlide key={manga.id}>
              <div className="relative flex h-[350px] items-center overflow-hidden rounded-lg bg-gradient-to-r from-black/80 to-transparent p-8">
                <div className="absolute inset-0 h-full w-full">
                  <Image
                    fill
                    src={getCoverArt(manga)}
                    title="Cover Art"
                    className="h-full w-full object-cover opacity-80 blur-md"
                    style={{ zIndex: 0 }}
                    alt={
                      manga.attributes?.title?.vn ||
                      manga.attributes?.title?.en ||
                      "Unknown Title"
                    }
                  />
                </div>
                <Link className="relative z-10 mx-auto mt-[50px] flex w-full items-center gap-6 lg:max-w-[1200px]" href={Constants.router.manga(manga.id)}>

                  <div className="h-60 w-40 shrink-0 overflow-hidden rounded-lg shadow-lg">
                    <AspectRatio
                      ratio={2 / 3}
                      className="relative overflow-hidden rounded-lg shadow-lg"
                    >
                      <Image
                        src={getCoverArt(manga)}
                        alt="Manga Cover"
                        fill
                        className="h-full w-full rounded-lg object-cover shadow-lg"
                      />
                    </AspectRatio>

                  </div>
                  <div className="flex w-full flex-col justify-center">
                    <h2 className="mb-2 font-bold text-2xl text-white">
                      {manga.attributes?.title?.vn || manga.attributes?.title?.en || "Unknown Title"}
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
