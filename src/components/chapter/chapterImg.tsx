"use client";
import Image from "@/components/shared/image"; // Hoặc next/image nếu dùng default
import { unscrambleImageUrl } from "@/provider/CuuTruyen/image";
import { useEffect, useState } from "react";

interface ChapterImageProps {
    imageUrl: string;
    drmData: string;
    title?: string;
}

export default function ChapterImage({ imageUrl, drmData, title }: ChapterImageProps) {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string;

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

    if (!src) return <p>Loading image...</p>;

    return (
        <div className="flex items-center justify-center">

            <Image
                src={src}
                alt={title || "Chapter Image"}
                width={1024}
                height={1469}
            />
        </div>

    );
}
