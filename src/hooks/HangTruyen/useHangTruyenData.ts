import useSWR from "swr";

export default function useHangTruyenData(name: string | null, viName?: string) {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, isLoading, error } = useSWR(
        name ? `/api/hangtruyen/list?name=${encodeURIComponent(name)}${viName ? `&viName=${encodeURIComponent(viName)}` : ''}` : null,
        fetcher,
        { revalidateOnFocus: false },
    );

    return {
        data: data?.data || [],
        isLoading,
        error,
    };
} 