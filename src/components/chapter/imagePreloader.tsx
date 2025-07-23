"use client";
import { useChapter } from "@/context/useChapter";
import { unscrambleImageUrl } from "@/provider/CuuTruyen/image";
import { useEffect } from "react";

interface ImagePreloaderProps {
  source: string;
}
export default function ImagePreloader({ source }: ImagePreloaderProps) {
  const { chapters, setLoadedImages, setPreloadedImages } = useChapter();

  useEffect(() => {
    if (!chapters || chapters.length === 0) return;

    const preloadImages = async () => {
      const newPreloadedImages = new Map<number, string>();
      const newLoadedImages = new Set<number>();

      const preloadPromises = chapters.map(async (chapter, index) => {
        try {
          let imageUrl = chapter.imageUrl || "";

          if (source === "source1" && chapter.drmData) {
            imageUrl = await unscrambleImageUrl(
              chapter.imageUrl || "",
              chapter.drmData || "",
            );
          } else if (source !== "source1") {
            // For TruyenQQ and orther sources, use proxy
            imageUrl = `/api/proxy?url=${chapter.imageUrl}&referer=${chapter.reference}`;
          }

          // Preload the image
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              newPreloadedImages.set(index, imageUrl);
              newLoadedImages.add(index);
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to preload image ${index + 1}`);
              reject();
            };
            img.src = imageUrl;
          });
        } catch (error) {
          console.error(`Error preloading image ${index + 1}:`, error);
        }
      });

      try {
        await Promise.allSettled(preloadPromises);
        setPreloadedImages(newPreloadedImages);
        setLoadedImages(newLoadedImages);
      } catch (error) {
        console.error("Error during image preloading:", error);
      }
    };

    preloadImages();
  }, [chapters, source, setLoadedImages, setPreloadedImages]);

  return null;
}
