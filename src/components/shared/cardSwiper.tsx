// "use client";

// // import { Badge } from "@/components/ui/badge"
// // import { Card, CardContent } from "@/components/ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { cn } from "@/lib/utils";
// import type { Media } from "@/types/anilist";
// // import { Calendar, Users } from "lucide-react"
// import type React from "react";
// import { useState } from "react";
// import MediaCard from "./mediaCard";

// interface CardSwiperProps {
//   data: Media[];
//   onCardClick?: (media: Media) => void;
//   className?: string;
// }

// const CardSwiper: React.FC<CardSwiperProps> = ({
//   data,
//   onCardClick,
//   className,
// }) => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   const handleCardHover = (index: number, hovered: boolean) => {
//     setHoveredIndex(hovered ? index : null);
//   };

//   return (
//     <div className={cn("w-full", className)}>
//       <Carousel
//         opts={{
//           align: "start",
//           slidesToScroll: 1,
//         }}
//         className="w-full"
//       >
//         <CarouselContent className="-ml-2 md:-ml-4">
//           {data.map((media, index) => (
//             <CarouselItem
//               key={media.id}
//               className="basis-1/2 p-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
//             >
//               <MediaCard
//                 isHovered={hoveredIndex === index}
//                 onHover={(hovered) => handleCardHover(index, hovered)}
//                 onClick={() => onCardClick?.(media)}
//                 data={media}
//                 key={media.id + index}
//               />
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         {/* <CarouselPrevious className="left-2" />
//                 <CarouselNext className="right-2" /> */}
//       </Carousel>
//     </div>
//   );
// };

// export default CardSwiper;
