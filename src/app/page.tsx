"use client";
import { MangaCarousel } from "@/components";
import WideContainer from "@/components/layout/wideLayout";
import RecommendedManga from "@/components/recommendedManga";
import BaseLayout from "./baseLayout";
export default function Home() {
  return (
    <BaseLayout showHeader={true} showFooter={true}>
      <MangaCarousel />
      <WideContainer title="teadsd" classNames="mt-8">
        <RecommendedManga />
      </WideContainer>
    </BaseLayout>
  );
}
