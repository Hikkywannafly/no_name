"use client";
import { useChapter } from "@/context/useChapter";
import { unscrambleImageData } from "@/provider/CuuTruyen/image";
import { useEffect } from "react";

interface ImagePreloaderProps {
  source: string;
}
export default function ImagePreloader({ source }: ImagePreloaderProps) {
  const { chapters, setLoadedImages, setPreloadedImages } = useChapter();

  useEffect(() => {
    if (!chapters || chapters.length === 0) return;

    const preloadImages = async () => {
      const newPreloadedImages = new Map<
        number,
        ImageData | HTMLImageElement
      >();
      const newLoadedImages = new Set<number>();

      const preloadPromises = chapters.map(async (chapter, index) => {
        try {
          if (source === "source1" && chapter.drmData) {
            // Decode và preload ImageData
            const imageData = await unscrambleImageData(
              chapter.imageUrl || "",
              chapter.drmData || "",
            );
            newPreloadedImages.set(index, imageData);
            newLoadedImages.add(index);
          } else if (source !== "source1") {
            // For TruyenQQ and other sources, use proxy and preload as Image
            return new Promise<void>((resolve, reject) => {
              const img = new window.Image();
              img.crossOrigin = "anonymous";
              img.onload = () => {
                newPreloadedImages.set(index, img);
                newLoadedImages.add(index);
                resolve();
              };
              img.onerror = () => {
                console.error(`Failed to preload image ${index + 1}`);
                reject();
              };
              img.src = `/api/proxy?url=${chapter.imageUrl}&referer=${chapter.reference}`;
            });
          }
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
