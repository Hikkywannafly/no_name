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
  width = 200,
  height = 300,
  onLoad,
}: ChapterImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | undefined;
    setSrc(null);
    setError(null);


    unscrambleImageUrl(imageUrl, drmData)
      .then((url) => {
        setSrc(url);
        objectUrl = url;

      })
      .catch((err) => {
        setError("Image decode failed");
        console.error("Image decode failed:", err);
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, drmData]);

  const handleImageLoad = () => {
    onLoad?.();
  };

  if (error) {
    return (
      <div className="flex h-[300px] w-[200px] items-center justify-center rounded bg-gray-800 text-red-400">
        <div className="text-center">
          <div className="mb-2 text-2xl">⚠️</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // if (isLoading || !src) {
  //   return <Skeleton className="h-[300px] w-[200px] rounded bg-gray-800" />;
  // }
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={title || "Chapter Image"}
      width={width}
      height={height}
      style={{ objectFit: "contain" }}
      onLoad={handleImageLoad}
      className="h-auto max-w-full"
    />
  );
}
