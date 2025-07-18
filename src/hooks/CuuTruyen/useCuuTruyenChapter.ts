import type { Page } from "@/types/manga";
import useSWR from "swr";
export default function useCuuTruyenChapter(name: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/cuutruyen/chapter?name=${encodeURIComponent(name)}` : null,
    fetcher,
  );

  return {
    data: (data?.data || []) as Page[],
    isLoading,
    error,
  };
}
