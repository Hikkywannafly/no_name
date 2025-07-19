
import useSWR from "swr";
export default function useCuuTruyenData(name: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/cuutruyen/list?name=${encodeURIComponent(name)}` : null,
    fetcher,
  );

  return {
    data: (data?.data || []),
    isLoading,
    error,
  };
}
