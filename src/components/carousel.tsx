"use client";

import type { MangaSource } from "@/types/manga";
import Image from "next/image";

// 1. Import Swiper components
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// 2. Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MangaCarousel({ mangas }: { mangas: MangaSource[] }) {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <Swiper
        // 3. Add Swiper modules
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
          // 4. Use SwiperSlide for each item
          <SwiperSlide key={manga.id}>
            <div className="relative flex min-h-[350px] items-center overflow-hidden rounded-lg bg-gradient-to-r from-black/80 to-transparent p-8">
              {/* Background image (blurred, opacity) */}
              <div className="-z-10 absolute inset-0">
                <Image
                  src={manga.largeCoverUrl || ""}
                  alt={manga.title}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>

              {/* Cover */}
              <div className="flex-shrink-0">
                <Image
                  src={manga.largeCoverUrl || ""}
                  alt={manga.title}
                  width={180}
                  height={260}
                  className="rounded-lg shadow-lg"
                />
              </div>
              {/* Info */}
              <div className="ml-8 flex-1 text-white">
                <h2 className="mb-2 font-bold text-3xl">{manga.title}</h2>
                {/* <div className="mb-2 flex gap-2">
                  {manga.tags?.map((tag: string) => (
                    <span key={tag} className="rounded bg-yellow-500/80 px-2 py-1 font-semibold text-xs">{tag}</span>
                  ))}
                </div> */}
                <p className="mb-2 line-clamp-3">{manga.description}</p>
                {/* <div className="font-semibold italic">{manga.authors?.join(', ')}</div>
                <div className="mt-4 font-bold text-sm">NO. {manga.number}</div> */}
                {/*           
                {manga.country === "jp" && (
                  <span className="ml-2 inline-block align-middle">
                    <Image src="/flags/jp.png" alt="JP" width={20} height={14} />
                  </span>
                )} */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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
