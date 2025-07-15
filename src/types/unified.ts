export interface UnifiedChapter {
  id: string;
  title: string;
  number: number;
  source: string; // "mangadex" | "cuutruyen"
  chapterId: any;
  extraData?: Record<string, any>; // Thông tin bổ sung tùy chọn
}

export interface UnifiedManga {
  id: string;
  title: string;
  coverUrl: string | null;
  description: string | null;
  source: string; // "mangadex" | "cuutruyen"
  chapters: UnifiedChapter[];
  extraData?: Record<string, any>; // Thông tin bổ sung tùy chọn
}
