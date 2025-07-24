"use client";
import { unscrambleImageData } from "@/provider/CuuTruyen/image";
import { useEffect, useRef, useState } from "react";
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
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isMounted = true;
    setImageData(null);
    setLoading(true);
    unscrambleImageData(imageUrl, drmData)
      .then((data) => {
        if (isMounted) {
          setImageData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Image decode failed:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [imageUrl, drmData]);

  useEffect(() => {
    if (imageData && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [imageData]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {loading && (
        <div
          className={
            "flex h-60 w-full flex-col items-center justify-center gap-2 text-gray-500"
          }
        >
          <img
            className="w-12 animate-pulse"
            src="/images/nazuna1.gif"
            alt="nazuna1"
          />
          <p>Đợi chút nhé...</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={imageData?.width || 1024}
        height={imageData?.height || 1453}
        className="max-h relative h-full w-full object-contain text-gray-300"
        style={{ display: loading ? "none" : "block" }}
        aria-label={title || "Chapter Image"}
      />
    </div>
  );
}
