// "use client";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import type { Media } from "@/types/anilist";
// import React, { useState } from "react";

// interface CarouselCardSwiperProps {
//   data: Media[];
//   onEachCard?: (data: Media, isHover: boolean) => React.ReactNode;
//   className?: string;
// }

// const CarouselCardSwiper: React.FC<CarouselCardSwiperProps> = ({
//   data,
//   onEachCard = () => null,
//   className,
// }) => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   return (
//     <Carousel className={className || "relative w-full"}>
//       <CarouselContent>
//         {data.map((item, idx) => (
//           <CarouselItem
//             key={item.id || idx}
//             className="basis-1/2 p-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
//           >
//             <div
//               onMouseEnter={() => setHoveredIndex(idx)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               className="h-full"
//             >
//               {onEachCard(item, hoveredIndex === idx)}
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//     </Carousel>
//   );
// };

// export default React.memo(CarouselCardSwiper);
