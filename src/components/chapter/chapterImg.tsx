"use client";
import { unscrambleImageUrl } from "@/provider/CuuTruyen/image";
import { useEffect, useState } from "react";
import ReaderImage from "./readerImage";
interface ChapterImageProps {
  imageUrl: string;
  drmData: string;
  title?: string;
  width?: number;
  height?: number;
  isLoading: boolean;
  onLoad?: () => void;
}

export default function ChapterImage({
  imageUrl,
  drmData,
  title,
}: ChapterImageProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | undefined;
    setSrc(null);
    unscrambleImageUrl(imageUrl, drmData)
      .then((url) => {
        setSrc(url);
        objectUrl = url;

      })
      .catch((err) => {
        console.error("Image decode failed:", err);
      });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, drmData]);
  return (
    <ReaderImage
      src={src || "/placeholder.svg"}
      alt={title || "Chapter Image"}
      width={1024}
      height={1453}
      // style={{
      //   objectFit: "contain",
      //   width: "100%",
      //   height: "auto",
      //   maxHeight: 1469,
      // }}
      className="max-h relative h-full w-full object-contain text-gray-300"
    />
  );
}