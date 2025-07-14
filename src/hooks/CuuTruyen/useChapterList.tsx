import useSWR from "swr";

export default function useCuuTruyenChapters(name: string | null) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    name ? `/api/cuutruyen/chapters?name=${encodeURIComponent(name)}` : null,
    fetcher,
  );
  console.log("CuuTruyen chapters data:", name);

  return {
    chapters: data?.chapters || [],
    isLoading,
    error,
  };
}
