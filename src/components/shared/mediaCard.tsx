"use client";
import Image from "@/components/shared/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
// import TextIcon from "@/components/shared/TextIcon";
import { Card } from "@/components/ui/card";
import { Constants } from "@/constants/index";
import type { Media } from "@/types/anilist";
import { getTitle } from "@/utils";
// import { convert, getTitle } from "@/utils/data";
import classNames from "classnames";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/router";
import type React from "react";
import { memo, useMemo } from "react";
import { Badge } from "../ui/badge";
interface CardProps {
  data: Media;
  className?: string;
  imageEndSlot?: React.ReactNode;
  redirectUrl?: string;
  onHover: (hovered: boolean) => void;
  onClick?: () => void;
  isHovered: boolean;
}

const MediaCard: React.FC<CardProps> = ({
  data,
  className,
  imageEndSlot,
  onHover,
  onClick,
  isHovered,
  // redirectUrl = createMediaDetailsUrl(data),
}) => {
  // const router = useRouter();

  const primaryColor = useMemo(() => {
    return data.coverImage?.color ? data.coverImage.color : "white";
  }, [data]);

  // const title = useMemo(() => getTitle(data, router.locale), [data, router.locale]);
  // const description = useMemo(() => getDescription(data, router.locale), [data, router.locale]);

  return (
    <Link href={`${Constants.router.manga(data.id, getTitle(data, "vi-VN"))}`}>
      <Card
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onClick}
        className={classNames(
          "group relative cursor-pointer gap-3 overflow-hidden bg-transparent transition-all duration-300 ease-out",
          className,
        )}
      >
        <AspectRatio ratio={2 / 3} className="relative w-full">
          <Image
            src={
              data.coverImage?.extraLarge ||
              data.coverImage?.large ||
              "/placeholder.svg"
            }
            fill
            className="rounded-sm object-cover"
            alt={data.title?.userPreferred || "Nazuna"}
          />
          {imageEndSlot}

          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-sm"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
            }}
          />

          <div
            className={classNames(
              "absolute right-0 bottom-0 left-0 transform p-4 text-white transition-all duration-300",
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0",
            )}
          >
            <h3 className="mb-2 line-clamp-2 font-semibold text-sm">
              {data.title?.english}
            </h3>

            <div className="mb-2 flex items-center gap-4 text-gray-300 text-xs">
              {data.startDate?.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.startDate.year}
                </div>
              )}
              {data.popularity && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {(data.popularity / 1000).toFixed(1)}k
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {data.genres &&
                data?.genres.slice(0, 2).map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
            </div>
          </div>
        </AspectRatio>

        <p
          className=" line-clamp-2 font-semibold text-base"
          style={{ color: primaryColor }}
        >
          {data.title?.userPreferred}
        </p>
      </Card>
    </Link>
  );
};

export default memo(MediaCard);
