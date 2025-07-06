"use client";
import { MangaCarousel } from "@/components";
import { WideContainer } from "@/components/layout/WideLayout";
import BaseLayout from "./baseLayout";
export default function Home() {
  return (
    <>
      <MangaCarousel />
      <BaseLayout>
        <WideContainer>
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <h1 className="font-bold text-3xl">Welcome to MangaDex</h1>
            <p className="text-gray-600 text-lg">
              Explore your favorite manga and discover new ones!
            </p>
          </div>
        </WideContainer>
      </BaseLayout>
    </>
  );
}
