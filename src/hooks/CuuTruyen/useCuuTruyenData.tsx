import type { Manga } from "@/provider/CuuTruyen/type";
import useSWR from "swr";
// import {convertCuuTruyen1} from "@/utils";

export default function useCuuTruyenData(name: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/cuutruyen/chapters?name=${encodeURIComponent(name)}` : null,
    fetcher,
  );

  return {
    data: (data?.data || []) as Manga,
    isLoading,
    error,
  };
}
