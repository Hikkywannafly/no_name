import Image from "@/components/shared/image";
import { Card } from "@/components/ui/card";
import type { Media } from "@/types/anilist";
import classNames from "classnames";
import { Calendar, Users } from "lucide-react";
import type React from "react";
import { memo, useMemo } from "react";
import { Badge } from "../ui/badge";

interface CarouselSwiperCardProps {
  data: Media;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

const CarouselSwiperCard: React.FC<CarouselSwiperCardProps> = ({
  data,
  isHovered,
  onHover,
}) => {
  const primaryColor = useMemo(() => data.coverImage?.color || "white", [data]);

  return (
    <Card
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={classNames(
        "group relatiz-10 ve cursorter overflow-hidden bg-transparent transition-all duration-300 ease-out",
        isHovered ? "z-10 scale-105 shadow-2xl" : "scale-100",
      )}
    >
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={
            data.coverImage?.extraLarge ||
            data.coverImage?.large ||
            "/placeholder.svg"
          }
          fill
          className="rounded-xl object-cover"
          alt={data.title?.userPreferred || "Nazuna"}
        />

        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-xl"
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
              data.genres.slice(0, 2).map((genre) => (
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
      </div>
      <p
        className="line-clamp-2 font-semibold text-base"
        style={{ color: primaryColor }}
      >
        {data.title?.userPreferred}
      </p>
    </Card>
  );
};

export default memo(CarouselSwiperCard);
