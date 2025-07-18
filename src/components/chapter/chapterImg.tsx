"use client";
import Image from "@/components/shared/image";
import { Skeleton } from "@/components/ui/skeleton";
import { unscrambleImageUrl } from "@/provider/CuuTruyen/image";
import { useEffect, useState } from "react";

interface ChapterImageProps {
  imageUrl: string;
  drmData: string;
  title?: string;
  width?: number;
  height?: number;
}

export default function ChapterImage({
  imageUrl,
  drmData,
  title,
  width = 200,
  height = 300,
}: ChapterImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) return <div className="text-red-500">{error}</div>;
  if (!src) return <Skeleton className="h-[300px] w-[200px] rounded" />;

  return (
    <Image
      src={src}
      alt={title || "Chapter Image"}
      width={width}
      height={height}
      style={{ objectFit: "contain" }}
    />
  );
}
