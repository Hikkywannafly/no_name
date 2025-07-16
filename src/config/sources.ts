import type { MangaMergeStrategy, SourceConfig } from "@/types/manga";

// Cấu hình các nguồn manga
export const SOURCE_CONFIGS: SourceConfig[] = [
  {
    name: "cuutruyen",
    displayName: "Cứu Truyện",
    baseUrl: "https://cuutruyen.net",
    isActive: true,
    priority: 10,
    supportedLanguages: ["vi"],
    features: {
      hasBanner: false,
      hasLargeCover: true,
      hasRating: false,
      hasViewCount: false,
      hasLikeCount: false,
      supportsDRM: true,
    },
  },
  {
    name: "nettruyen",
    displayName: "Net Truyện",
    baseUrl: "https://nettruyen.com",
    isActive: false, // Chưa implement
    priority: 8,
    supportedLanguages: ["vi"],
    features: {
      hasBanner: true,
      hasLargeCover: true,
      hasRating: true,
      hasViewCount: true,
      hasLikeCount: true,
      supportsDRM: false,
    },
  },
  {
    name: "truyenqq",
    displayName: "Truyện QQ",
    baseUrl: "https://truyenqq.com",
    isActive: false, // Chưa implement
    priority: 7,
    supportedLanguages: ["vi"],
    features: {
      hasBanner: false,
      hasLargeCover: true,
      hasRating: true,
      hasViewCount: true,
      hasLikeCount: false,
      supportsDRM: false,
    },
  },
  {
    name: "truyenfull",
    displayName: "Truyện Full",
    baseUrl: "https://truyenfull.vn",
    isActive: false, // Chưa implement
    priority: 6,
    supportedLanguages: ["vi"],
    features: {
      hasBanner: false,
      hasLargeCover: false,
      hasRating: false,
      hasViewCount: false,
      hasLikeCount: false,
      supportsDRM: false,
    },
  },
];

// Chiến lược merge dữ liệu
export const MERGE_STRATEGY: MangaMergeStrategy = {
  title: "MOST_COMPLETE", // Lấy title dài nhất (thường đầy đủ nhất)
  description: "MOST_COMPLETE", // Lấy description dài nhất
  cover: "PRIORITY_SOURCE", // Ưu tiên theo nguồn
  banner: "PRIORITY_SOURCE", // Ưu tiên theo nguồn
  rating: "AVERAGE", // Lấy trung bình rating
  tags: "UNION", // Gộp tất cả tags từ các nguồn
};

// Helper function để lấy cấu hình nguồn
export function getSourceConfig(sourceName: string): SourceConfig | undefined {
  return SOURCE_CONFIGS.find((config) => config.name === sourceName);
}

// Helper function để lấy danh sách nguồn đang hoạt động
export function getActiveSources(): SourceConfig[] {
  return SOURCE_CONFIGS.filter((config) => config.isActive);
}

// Helper function để lấy nguồn có priority cao nhất
export function getHighestPrioritySource(): SourceConfig | undefined {
  const activeSources = getActiveSources();
  return activeSources.reduce((highest, current) =>
    current.priority > highest.priority ? current : highest,
  );
}
