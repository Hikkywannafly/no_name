"use client";
import { unscrambleImageUrl } from "@/provider/CuuTruyen/image";
import { useEffect, useState } from "react";
import Loading from "../shared/loading";
import ReadImage from "./readerImage";
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
  const [, setObjectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setSrc(null);
    let localObjectUrl: string | undefined;
    unscrambleImageUrl(imageUrl, drmData)
      .then((url) => {
        setSrc(url);
        setObjectUrl(url);
        localObjectUrl = url;
      })
      .catch((err) => {
        console.error("Image decode failed:", err);
      });

    return () => {
      if (localObjectUrl) URL.revokeObjectURL(localObjectUrl);
    };
  }, [imageUrl, drmData]);

  if (!src) {
    return <div className="flex min-h-screen items-center justify-center bg-black ">
      <div className="text-center">
        <Loading className="h-12 w-12" />
      </div>
    </div>
  }

  return (
    <ReadImage
      src={src}
      alt={title || "Chapter Image"}
      width={width}
      height={height}
      style={{ objectFit: "contain" }}
      className="h-auto max-w-full"
      onLoad={onLoad}
    />
  );
}
