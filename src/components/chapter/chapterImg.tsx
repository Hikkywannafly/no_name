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
      className="max-h relative h-full w-full object-contain"
    />
  );
}


// "use client";
// import { useEffect, useRef, useState } from "react";
// import Loading from "../shared/loading";
// import ReaderImage from "./readerImage";
// interface ChapterImageProps {
//   imageUrl: string;
//   drmData: string;
//   title?: string;
//   width?: number;
//   height?: number;
//   isLoading: boolean;
//   onLoad?: () => void;
// }

// export default function ChapterImage({
//   imageUrl,
//   drmData,
//   title,
//   width,
//   height,
//   isLoading
// }: ChapterImageProps) {
//   const [src, setSrc] = useState<string | null>(null);
//   const workerRef = useRef<Worker | null>(null);

//   useEffect(() => {
//     if (!workerRef.current) {
//       workerRef.current = new Worker(new URL("@/worker/unscramble.worker.ts", import.meta.url));
//     }
//     return () => {
//       workerRef.current?.terminate();
//       workerRef.current = null;
//     };
//   }, []);

//   useEffect(() => {
//     let objectUrl: string | undefined;
//     setSrc(null);
//     let cancelled = false;

//     async function process() {
//       try {
//         // 1. Fetch ảnh gốc
//         const res = await fetch(imageUrl);
//         if (!res.ok) throw new Error("Failed to fetch image");
//         const blob = await res.blob();
//         const imageBitmap = await createImageBitmap(blob);

//         // 2. Lấy imageData từ canvas
//         const canvas = document.createElement("canvas");
//         canvas.width = imageBitmap.width;
//         canvas.height = imageBitmap.height;
//         const ctx = canvas.getContext("2d");
//         if (!ctx) throw new Error("Failed to get canvas context");
//         ctx.drawImage(imageBitmap, 0, 0);
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//         // 3. Gửi sang worker để decode
//         const worker = workerRef.current;
//         if (!worker) throw new Error("Worker not initialized");
//         const result: Promise<ImageData> = new Promise((resolve, reject) => {
//           worker.onmessage = (e) => {
//             if (e.data.error) return reject(new Error(e.data.error));
//             resolve(e.data.unscrambled);
//           };
//           worker.onerror = (err) => reject(err);
//         });
//         worker.postMessage({ imageData, drmData });
//         const unscrambled: ImageData = await result;

//         ctx.putImageData(unscrambled, 0, 0);
//         objectUrl = await new Promise((resolve, reject) => {
//           canvas.toBlob((blob) => {
//             if (!blob) return reject(new Error("Failed to convert canvas to blob"));
//             resolve(URL.createObjectURL(blob));
//           }, "image/png");
//         });

//         if (!cancelled && typeof objectUrl === 'string') setSrc(objectUrl);
//       } catch (err) {
//         if (!cancelled) setSrc("/placeholder.svg");
//         console.error("Image decode failed:", err);
//       }
//     }
//     process();

//     return () => {
//       cancelled = true;
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [imageUrl, drmData]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-black ">
//         <div className="text-center">
//           <Loading className="h-12 w-12" />
//         </div>
//       </div>
//     )
//   }
//   return (
//     <ReaderImage
//       src={src || "/placeholder.svg"}
//       alt={title || "Chapter Image"}
//       width={width}
//       height={height}
//       style={{
//         objectFit: "contain",
//         width: width,
//         height: height,
//       }}
//       className="h-auto max-w-full"
//     />
//   );
// }