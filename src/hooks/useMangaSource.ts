// import { MERGE_STRATEGY, SOURCE_CONFIGS } from "@/constants/sources"
// import { SourceManager } from "@/provider/SourceManager"
// import useSWR from "swr"

// const sourceManager = new SourceManager(SOURCE_CONFIGS, MERGE_STRATEGY)

// interface UseMangaSourcesOptions {
//     enabled?: boolean
//     revalidateOnFocus?: boolean
// }

// export function useMangaSources(mangaName: string | null, options: UseMangaSourcesOptions = {}) {
//     const { enabled = true, revalidateOnFocus = false } = options

//     const fetcher = async (name: string) => {
//         if (!name) return { sources: [], merged: null }
//         // Tùy vào logic của bạn, có thể là searchMangaID hoặc method khác
//         const sources = await sourceManager.searchMangaID(name)
//         // Nếu có merge logic, bạn có thể merge ở đây
//         return { sources, merged: null }
//     }

//     const { data, error, isLoading, mutate } = useSWR(
//         enabled && mangaName ? `manga-sources:${mangaName}` : null,
//         () => fetcher(mangaName!),
//         {
//             revalidateOnFocus,
//             dedupingInterval: 60000, // 1 minute
//             errorRetryCount: 2,
//             errorRetryInterval: 5000,
//         },
//     )

//     return {
//         sources: data?.sources || [],
//         mergedData: data?.merged || null,
//         isLoading,
//         error,
//         refetch: mutate,
//     }
// }

// // Hook riêng cho từng source nếu cần
// export function useMangaFromSource(mangaId: string | null, sourceName: string, options: UseMangaSourcesOptions = {}) {
//     const { enabled = true, revalidateOnFocus = false } = options

//     const fetcher = async (id: string, source: string) => {
//         // Tùy vào logic, có thể cần method khác
//         return await sourceManager.getChapters(id, source)
//     }

//     const { data, error, isLoading, mutate } = useSWR(
//         enabled && mangaId ? `manga-source:${sourceName}:${mangaId}` : null,
//         () => fetcher(mangaId!, sourceName),
//         {
//             revalidateOnFocus,
//             dedupingInterval: 60000,
//             errorRetryCount: 2,
//         },
//     )

//     return {
//         data: data || null,
//         isLoading,
//         error,
//         refetch: mutate,
//     }
// }

// // Hook cho chapter pages
// export function useChapterPages(chapterId: string | null, sourceName: string, options: UseMangaSourcesOptions = {}) {
//     const { enabled = true, revalidateOnFocus = false } = options

//     const fetcher = async (id: string, source: string) => {
//         return await sourceManager.getPages(id, source)
//     }

//     const { data, error, isLoading, mutate } = useSWR(
//         enabled && chapterId ? `chapter-pages:${sourceName}:${chapterId}` : null,
//         () => fetcher(chapterId!, sourceName),
//         {
//             revalidateOnFocus,
//             dedupingInterval: 300000, // 5 minutes
//             errorRetryCount: 1,
//         },
//     )

//     return {
//         pages: data || [],
//         isLoading,
//         error,
//         refetch: mutate,
//     }
// }
