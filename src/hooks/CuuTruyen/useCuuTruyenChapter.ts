import type { UPage, UChapter } from "@/types/manga";
import useSWR from "swr";
export default function useCuuTruyenChapter(name: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/cuutruyen/chapter?name=${encodeURIComponent(name)}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  return {
    data: (data?.data || []) as UPage[],
    isLoading,
    error,
  };
}
export function useCuuTruyenChapters(name: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/cuutruyen/chapters?name=${encodeURIComponent(name)}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  return {
    data: (data?.data || []) as UChapter[],
    isLoading,
    error,
  };
}
