import useSWR from "swr";

export default function useHangTruyenChapter(chapterUrl: string | null) {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, isLoading, error } = useSWR(
        chapterUrl ? `/api/hangtruyen/chapter?name=${encodeURIComponent(chapterUrl)}` : null,
        fetcher,
        { revalidateOnFocus: false },
    );

    return {
        data: data?.data || [],
        isLoading,
        error,
    };
} 