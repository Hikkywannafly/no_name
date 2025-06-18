"use client";

import MangaCard from "@/components/MangaCard";
import type { MangaSource } from "@/types/manga";
import { useState } from "react";

export default function TestMangaPage() {
  const [mangaList, setMangaList] = useState<MangaSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "merged">("list");
  const [error, setError] = useState<string | null>(null);

  const loadMangaList = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/manga/list?page=1&order=UPDATED");
      const result = await response.json();

      if (result.success) {
        setMangaList(result.data);
      } else {
        setError(result.error || "Lỗi khi tải danh sách manga");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách manga:", error);
      setError("Lỗi kết nối mạng");
    } finally {
      setLoading(false);
    }
  };

  const searchManga = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/manga/search?q=${encodeURIComponent(searchQuery)}&page=1&order=UPDATED`,
      );
      const result = await response.json();

      if (result.success) {
        setMangaList(result.data);
      } else {
        setError(result.error || "Lỗi khi tìm kiếm manga");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm manga:", error);
      setError("Lỗi kết nối mạng");
    } finally {
      setLoading(false);
    }
  };

  const getMergedManga = async () => {
    if (mangaList.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/manga/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mangaList }),
      });

      const result = await response.json();

      if (result.success) {
        setMangaList(result.data);
      } else {
        setError(result.error || "Lỗi khi merge dữ liệu manga");
      }
    } catch (error) {
      console.error("Lỗi khi merge manga:", error);
      setError("Lỗi kết nối mạng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 font-bold text-3xl text-gray-900">
          Test Multi-Source Manga System
        </h1>

        {/* Controls */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="min-w-[300px] flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && searchManga()}
              />
            </div>

            {/* Buttons */}
            <button
              type="button"
              onClick={searchManga}
              disabled={loading || !searchQuery.trim()}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>

            <button
              type="button"
              onClick={loadMangaList}
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Đang tải..." : "Tải danh sách"}
            </button>

            <button
              type="button"
              onClick={getMergedManga}
              disabled={loading || mangaList.length === 0}
              className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Đang merge..." : "Merge dữ liệu"}
            </button>
          </div>

          {/* View mode toggle */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-4 py-2 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Danh sách riêng lẻ
            </button>
            <button
              type="button"
              onClick={() => setViewMode("merged")}
              className={`rounded-lg px-4 py-2 ${
                viewMode === "merged"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Dữ liệu đã merge
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <h2 className="mb-2 font-semibold text-gray-900 text-xl">
            Kết quả ({mangaList.length} manga)
          </h2>
          {loading && (
            <div className="py-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          )}
        </div>

        {/* Manga Grid */}
        {!loading && mangaList.length > 0 && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {mangaList.map((manga) => (
              <MangaCard
                key={manga.id}
                manga={manga}
                showSource={viewMode === "list"}
                showRating={true}
                showViewCount={true}
              />
            ))}
          </div>
        )}

        {!loading && mangaList.length === 0 && !error && (
          <div className="py-12 text-center">
            <p className="text-gray-600 text-lg">
              {searchQuery
                ? "Không tìm thấy manga nào phù hợp"
                : "Chưa có dữ liệu manga"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
