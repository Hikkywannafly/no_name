"use client";

import type { MangaSource } from "@/types/manga";
import Image from "next/image";
import type React from "react";

interface MangaCardProps {
  manga: MangaSource;
  showSource?: boolean;
  showRating?: boolean;
  showViewCount?: boolean;
  className?: string;
}

const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  showSource = true,
  showRating = true,
  showViewCount = true,
  className = "",
}) => {
  // Fallback cho cover image
  const getCoverUrl = () => {
    if (manga.coverUrl) return manga.coverUrl;
    if (manga.largeCoverUrl) return manga.largeCoverUrl;
    return "/images/default-cover.jpg"; // Default cover
  };

  // Fallback cho title
  const getTitle = () => {
    return manga.title || "Không có tiêu đề";
  };

  // Format rating
  const formatRating = (rating: number | null) => {
    if (!rating) return null;
    return rating.toFixed(1);
  };

  // Format view count
  const formatViewCount = (count: number | null) => {
    if (!count) return null;
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return "Không có ngày";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("vi-VN");
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  // Get source display name
  const getSourceDisplayName = () => {
    const sourceNames: Record<string, string> = {
      cuutruyen: "Cứu Truyện",
      nettruyen: "Net Truyện",
      truyenqq: "Truyện QQ",
      truyenfull: "Truyện Full",
    };
    return sourceNames[manga.sourceName] || manga.sourceName;
  };

  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg ${className}`}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] bg-gray-200">
        <Image
          src={getCoverUrl()}
          alt={getTitle()}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback khi ảnh lỗi
            const target = e.target as HTMLImageElement;
            target.src = "/images/default-cover.jpg";
          }}
        />

        {/* Source badge */}
        {showSource && (
          <div className="absolute top-2 left-2 rounded bg-black bg-opacity-70 px-2 py-1 text-white text-xs">
            {getSourceDisplayName()}
          </div>
        )}

        {/* Rating badge */}
        {showRating && manga.rating && (
          <div className="absolute top-2 right-2 rounded bg-yellow-500 px-2 py-1 font-bold text-white text-xs">
            ⭐ {formatRating(manga.rating)}
          </div>
        )}

        {/* View count badge */}
        {showViewCount && manga.viewCount && (
          <div className="absolute right-2 bottom-2 rounded bg-black bg-opacity-70 px-2 py-1 text-white text-xs">
            👁 {formatViewCount(manga.viewCount)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 text-sm">
          {getTitle()}
        </h3>

        {/* Description preview */}
        {manga.description && (
          <p className="mb-2 line-clamp-3 text-gray-600 text-xs">
            {manga.description}
          </p>
        )}

        {/* Additional info */}
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <span>{formatDate(manga.lastUpdated)}</span>

          {/* Status indicator */}
          <span
            className={`rounded px-2 py-1 text-xs ${
              manga.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {manga.isActive ? "Hoạt động" : "Không hoạt động"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MangaCard;
