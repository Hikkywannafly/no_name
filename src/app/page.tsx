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

        </WideContainer>
      </BaseLayout>
    </>
  );
}
