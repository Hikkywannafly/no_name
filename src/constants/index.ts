import type { DropDownItem } from "@/components/shared/DropDown";

// vi - VietNamese

export const GENRES_COMICS: DropDownItem[] = [
  { label: "Action", href: "Action" },
  { label: "Adventure", href: "Adventure" },
  { label: "Comedy", href: "Comedy" },
  { label: "Crime", href: "Crime" },
  { label: "Harem", href: "Crime" },
];

export const RANKING_COMICS: DropDownItem[] = [
  { label: "Mới nhất", href: "new" },
  { label: "Đang hot", href: "hot" },
  { label: "Được yêu thích", href: "favorite" },
  { label: "Được xem nhiều", href: "view" },
];

export const VietNameseTitles = {
  Action: "Hành động",
  Adventure: "Phiêu lưu",
  Comedy: "Hài hước",
  Drama: "Drama",
  Ecchi: "Ecchi",
  Fantasy: "Viễn tưỡng",
  Horror: "Kinh dị",
  "Mahou Shoujo": "Mahou Shoujo",
  Mecha: "Mecha",
  Music: "Âm nhạc",
  Mystery: "Bí ẩn",
  Psychological: "Tâm lý",
  Romance: "Lãng mạn",
  "Sci-Fi": "Khoa học viễn tưởng",
  "Slice of Life": "Đời thường",
  Sports: "Thể thao",
  Supernatural: "Siêu nhiên",
  Thriller: "Thriller",
  JP: "Nhật bản",
  KR: "Hàn quốc",
  CN: "Trung quốc",
  US: "Mỹ",
  VN: "Việt nam",
  TW: "Đài loan",
  RELEASING: "Đang phát hành",
  FINISHED: "Hoàn thành",
  NOT_YET_RELEASED: "Chưa phát hành",
  CANCELLED: "Đã hủy",
  HIATUS: "Tạm ngưng",
  YEAR: "Năm",
};

export const GENRES_MANGA: DropDownItem[] = [
  { label: "Action", href: "Hành động" },
  { label: "Adventure", href: "Phiêu lưu" },
  { label: "Comedy", href: "Hài hước" },
  { label: "Drama", href: "Drama" },
  { label: "Ecchi", href: "Ecchi" },
  { label: "Fantasy", href: "Viễn tưởng" },
  { label: "Horror", href: "Kinh dị" },
  { label: "Mahou Shoujo", href: "Mahou Shoujo" },
  { label: "Mecha", href: "Mecha" },
  { label: "Music", href: "Âm nhạc" },
  { label: "Mystery", href: "Bí ẩn" },
  { label: "Psychological", href: "Tâm lý" },
  { label: "Romance", href: "Lãng mạn" },
  { label: "Sci-Fi", href: "Khoa học viễn tường" },
  { label: "Slice of Life", href: "Đời thường" },
  { label: "Sports", href: "Thể thao" },
  { label: "Supernatural", href: "Siêu nhiên" },
  { label: "Thriller", href: "Giật gân" },
  { label: "Xem thêm", href: "Xem thêm" },
];

export const CHARACTERS_ROLES: DropDownItem[] = [
  { label: "MAIN", href: "Nhân vật chính" },
  { label: "SUPPORTING", href: "Nhân vật phụ" },
  { label: "BACKGROUND", href: "Nhân vật làm nền" },
];

export const REVALIDATE_TIME = 24 * 60 * 60; // 24 hours
