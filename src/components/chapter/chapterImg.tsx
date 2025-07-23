"use client";
import Image from "@/components/shared/image";
import { unscrambleImageUrl } from "@/provider/CuuTruyen/image";
import { useEffect, useState } from "react";

interface ChapterImageProps {
  imageUrl: string;
  drmData: string;
  title?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
}

export default function ChapterImage({
  imageUrl,
  drmData,
  title,
  width,
  height,
  // onLoad,
}: ChapterImageProps) {
  const [src, setSrc] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | undefined;
    setSrc(null);

    setIsLoading(true);


    unscrambleImageUrl(imageUrl, drmData)
      .then((url) => {
        setSrc(url);
        objectUrl = url;
        setIsLoading(false);

      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Image decode failed:", err);
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, drmData]);

  if (isLoading || !src) {
    return (
      <div
        className=
        "flex h-60 w-full flex-col items-center justify-center gap-2 text-gray-500">
        <img className="w-12 animate-pulse" src="/images/nazuna1.gif" alt="nazuna1" />
        <p>Đợi chút nhé...</p>
      </div>
    )
  }
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={title || "Chapter Image"}
      width={width}
      height={height}
      style={{
        objectFit: "contain",
        width: "auto",
        height: height,
        maxWidth: "100%",
        maxHeight: "100%",
      }}
      // onLoad={handleImageLoad}
      className="h-auto max-w-full"
    />
  );
}