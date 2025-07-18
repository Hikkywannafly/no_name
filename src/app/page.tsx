"use client";
import { MangaCarousel } from "@/components";
import { WideContainer } from "@/components/layout/wideLayout";
import BaseLayout from "./baseLayout";
export default function Home() {
  return (
    <BaseLayout>
      <MangaCarousel />
      <WideContainer>
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <p className="text-gray-600 text-lg">sad</p>
        </div>
      </WideContainer>
    </BaseLayout>
  );
}
