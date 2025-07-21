import type { Manga } from "@/provider/CuuTruyen/type";
import useSWR from "swr";
export default function useTruyenQQData(name: string | null, viName: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/truyenqq/list?name=${encodeURIComponent(name)}&viName=${encodeURIComponent(viName?? "")}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    data: (data?.data || []) as Manga,
    isLoading,
    error,
  };
}
