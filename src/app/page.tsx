"use client";
import { MangaCarousel } from "@/components";
import RecommendedManga from "@/components/recommendedManga";
import BaseLayout from "./baseLayout";
export default function Home() {
  return (
    <BaseLayout>
      <MangaCarousel />

      <RecommendedManga />

      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-gray-600 text-lg">sad</p>
      </div>

    </BaseLayout>
  );
}
