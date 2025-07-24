"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { Media } from "@/types/anilist"
import { Calendar, Users } from "lucide-react"
import type React from "react"
import { useState } from "react"


interface CardSwiperProps {
    data: Media[]
    onCardClick?: (media: Media) => void
    className?: string
}

const MediaCard: React.FC<{
    media: Media
    isHovered: boolean
    onHover: (hovered: boolean) => void
    onClick?: () => void
}> = ({ media, isHovered, onHover, onClick }) => {
    return (
        <Card
            className={cn(
                "group relative cursor-pointer overflow-hidden border-0 bg-transparent transition-all duration-300 ease-out",
                isHovered ? "z-10 scale-110" : "scale-100",
            )}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            onClick={onClick}
        >
            <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <img
                        src={media.coverImage?.large || "/placeholder.svg"}
                        alt={media.title?.english || "Media Cover Image"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Score badge */}
                    {media.averageScore && (
                        <Badge variant="secondary" className="absolute top-2 right-2 border-0 bg-black/70 text-white">

                            {(media.averageScore / 10).toFixed(1)}
                        </Badge>
                    )}


                    {/* <Badge
                        variant={media.status === "RELEASING" ? "default" : "secondary"}
                        className="absolute top-2 left-2 text-xs"
                    >
                        {media.status.replace("_", " ")}
                    </Badge> */}

                    {/* Hover content */}
                    <div
                        className={cn(
                            "absolute right-0 bottom-0 left-0 transform p-4 text-white transition-all duration-300",
                            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
                        )}
                    >
                        <h3 className="mb-2 line-clamp-2 font-semibold text-sm">ten dasdsad</h3>

                        <div className="mb-2 flex items-center gap-4 text-gray-300 text-xs">
                            {media.startDate?.year && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {media.startDate.year}
                                </div>
                            )}
                            {media.popularity && (
                                <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {(media.popularity / 1000).toFixed(1)}k
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {/* {media.genres.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="outline" className="border-white/30 bg-white/10 text-white text-xs">
                                    {genre}
                                </Badge>
                            ))} */}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const CardSwiper: React.FC<CardSwiperProps> = ({ data, onCardClick, className }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const handleCardHover = (index: number, hovered: boolean) => {
        setHoveredIndex(hovered ? index : null)
    }

    return (
        <div className={cn("w-full", className)}>
            <Carousel
                opts={{
                    align: "start",
                    slidesToScroll: 1,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4 px-5">
                    {data.map((media, index) => (
                        <CarouselItem
                            key={media.id}
                            className="basis-1/2 p-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
                        >
                            <MediaCard
                                media={media}
                                isHovered={hoveredIndex === index}
                                onHover={(hovered) => handleCardHover(index, hovered)}
                                onClick={() => onCardClick?.(media)}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
        </div>
    )
}

export default CardSwiper
