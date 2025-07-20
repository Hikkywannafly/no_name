// import type { UPage } from "@/types/manga";
import useSWR from "swr";
export default function useTruyenQQChapter(name: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/truyenqq/chapter?name=${encodeURIComponent(name)}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    data: data?.data || [],
    isLoading,
    error,
  };
}
