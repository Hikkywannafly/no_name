"use client";
import Image from "@/components/shared/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import type { Character } from "@/types/anilist";
import classNames from "classnames";
import { Cake, TrendingUp } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { memo, useState } from "react";

interface CharacterCardProps {
    character: Character;
    className?: string;
    imageEndSlot?: React.ReactNode;
    redirectUrl?: string;
    onHover?: (hovered: boolean) => void;
    onClick?: () => void;
    isHovered?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
    character,
    className,
    imageEndSlot,
    onHover,
    onClick,
    isHovered: externalHovered,
}) => {
    const [internalHovered, setInternalHovered] = useState(false);
    const isHovered = externalHovered ?? internalHovered;

    const handleMouseEnter = () => {
        setInternalHovered(true);
        onHover?.(true);
    };

    const handleMouseLeave = () => {
        setInternalHovered(false);
        onHover?.(false);
    };

    return (
        <Link href={" "}>
            <Card
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                className={classNames(
                    "group relative cursor-pointer gap-3 overflow-hidden bg-transparent transition-all duration-300 ease-out",
                    className,
                )}
            >
                <AspectRatio ratio={2 / 3} className="relative h-full w-full">
                    <Image
                        src={
                            character.image?.large ||
                            character.image?.medium ||
                            "/images/default-avatar.png"
                        }
                        fill
                        className="relative rounded-sm object-cover"
                        alt={character.name?.userPreferred || character.name?.full || "Character"}
                    />
                    {imageEndSlot}
                    <div
                        className="pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-sm"
                        style={{
                            height: '60%',
                            background:
                                "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0))",
                        }}
                    />

                    <div
                        className={classNames(
                            "absolute right-0 bottom-0 left-0 transform p-2 text-white transition-all duration-300",
                            isHovered
                                ? "translate-y-0 opacity-100"
                                : "translate-y-full opacity-0",
                        )}
                    >
                        <div className="mb-1 flex items-center gap-4 text-gray-300 text-xs">
                            {character.favourites && (
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {(character.favourites / 1000).toFixed(1)}
                                </div>
                            )}
                            {character.age && (
                                <div className="flex items-center gap-1">
                                    <Cake className="h-3 w-3" />
                                    {character.age}
                                </div>
                            )}
                        </div>
                    </div>
                </AspectRatio>
                <p
                    className="line-clamp-2 font-semibold text-base">
                    {character.name?.userPreferred || character.name?.full || "Unknown Character"}
                </p>
            </Card>
        </Link>
    );
};

export default memo(CharacterCard) as typeof CharacterCard;
