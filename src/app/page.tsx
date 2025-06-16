"use client"
import * as FadeIn from "@/components/motion/fade";
import BaseLayout from "./baseLayout";
export default function Home() {
  return (
    <FadeIn.Container className="flex flex-col gap-6">
      <BaseLayout>
        <p>he</p>
      </BaseLayout>
    </FadeIn.Container>
  );
}
