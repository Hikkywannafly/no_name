import type { MangaMergeStrategy, SourceConfig } from "@/types/manga";

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

export const MERGE_STRATEGY: MangaMergeStrategy = {
  title: "MOST_COMPLETE", // Lấy title dài nhất (thường đầy đủ nhất)
  description: "MOST_COMPLETE", // Lấy description dài nhất
  cover: "PRIORITY_SOURCE", // Ưu tiên theo nguồn
  banner: "PRIORITY_SOURCE", // Ưu tiên theo nguồn
  rating: "AVERAGE", // Lấy trung bình rating
  tags: "UNION", // Gộp tất cả tags từ các nguồn
};

export function getSourceConfig(sourceName: string): SourceConfig | undefined {
  return SOURCE_CONFIGS.find((config) => config.name === sourceName);
}

export function getActiveSources(): SourceConfig[] {
  return SOURCE_CONFIGS.filter((config) => config.isActive);
}

export function getHighestPrioritySource(): SourceConfig | undefined {
  const activeSources = getActiveSources();
  return activeSources.reduce((highest, current) =>
    current.priority > highest.priority ? current : highest,
  );
}

export const sourceInfo = {
  cuutruyen: {
    name: "source1",
    baseUrl: "https://cuutruyen.net",
    logo: "/logos/cuutruyen.png",
    description: "Nơi lưu trữ và đọc truyện tranh miễn phí.",
  },
  nettruyen: {
    name: "Net Truyện",
    baseUrl: "https://nettruyen.com",
    logo: "/logos/nettruyen.png",
    description: "Kho truyện tranh lớn nhất Việt Nam.",
  },
  truyenqq: {
    name: "Truyện QQ",
    baseUrl: "https://truyenqq.com",
    logo: "/logos/truyenqq.png",
    description: "Đọc truyện tranh online chất lượng cao.",
  },
  truyenfull: {
    name: "Truyện Full",
    baseUrl: "https://truyenfull.vn",
    logo: "/logos/truyenfull.png",
    description: "Truyện ngắn, tiểu thuyết và nhiều thể loại khác.",
  },
};
