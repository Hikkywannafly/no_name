import { MangadexApi } from "@/provider";
import type { MediaArgs, PageArgs } from "@/types/anilist";

import axios from "axios";
import { Order } from "../MangaDex/static";
import {
  type MediaDetailsQueryResponse,
  type PageQueryResponse,
  browseMangaQuery,
  charactersQuery,
  mediaDetailsQuery,
  mediaQuery,
} from "./queries";
const URL = "https://graphql.anilist.co";

export const anilistFetcher = async <T>(
  query: string,
  variables?: Record<string, any>,
) => {
  type Response = {
    data: T;
  };

  try {
    const { data } = await axios.post<Response>(
      URL,
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data?.data;
  } catch (error: any) {
    console.error("AniList API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getMedia = async (args: MediaArgs & PageArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args,
  );
  const mediaList = response.Page.media || [];

  const updatedMediaList = await Promise.all(
    mediaList.map(async (media) => {
      const userPreferredTitle = media?.title?.userPreferred || "";
      const englishTitle = media?.title?.english || "";

      let mangaList: any[] = [];

      try {
        // Try with userPreferred title first
        const { data: userPreferredData } =
          await MangadexApi.Manga.getSearchManga({
            title: userPreferredTitle,
            includes: [],
            order: {
              followedCount: Order.DESC,
              relevance: Order.DESC,
            },
            limit: 1,
          });

        mangaList = userPreferredData?.data ?? [];

        // If no results with userPreferred, try with english title
        if (
          mangaList.length === 0 &&
          englishTitle &&
          englishTitle !== userPreferredTitle
        ) {
          console.log(
            `No results for "${userPreferredTitle}", trying "${englishTitle}"`,
          );

          const { data: englishData } = await MangadexApi.Manga.getSearchManga({
            title: englishTitle,
            includes: [],
            order: {
              followedCount: Order.DESC,
              relevance: Order.DESC,
            },
            limit: 1,
          });

          mangaList = englishData?.data ?? [];
        }
      } catch (error) {
        console.error("Lỗi khi fetch MangaDex:", error);
      }

      const firstManga = mangaList?.[0];
      return {
        ...media,
        translations: firstManga?.attributes?.altTitles ?? [],
      };
    }),
  );

  return updatedMediaList || [];
};

export const getMediaDetails = async (
  args: MediaArgs & PageArgs,
  fields?: string,
) => {
  const response = await anilistFetcher<MediaDetailsQueryResponse>(
    mediaDetailsQuery(fields),
    args,
  );
  const media = response?.Media;

  const userPreferredTitle = media?.title?.userPreferred || "";
  const englishTitle = media?.title?.english || "";
  const isAdult = media?.isAdult || "";

  let mangaList: any[] = [];
  try {
    if (isAdult) {
      return {
        ...media,
        translations: [],
      };
    }

    const { data: userPreferredData } = await MangadexApi.Manga.getSearchManga({
      title: userPreferredTitle,
      includes: [],
      order: {
        followedCount: Order.DESC,
        relevance: Order.DESC,
      },
      limit: 1,
    });

    mangaList = userPreferredData?.data ?? [];

    if (
      mangaList.length === 0 &&
      englishTitle &&
      englishTitle !== userPreferredTitle
    ) {
      const { data: englishData } = await MangadexApi.Manga.getSearchManga({
        title: englishTitle,
        includes: [],
        order: {
          followedCount: Order.DESC,
          relevance: Order.DESC,
        },
        limit: 1,
      });

      mangaList = englishData?.data ?? [];
    }

  } catch (error) {
    console.error("Lỗi khi fetch MangaDex:", error);
  }

  const firstManga = mangaList?.[0];
  media.translations = firstManga?.attributes?.altTitles ?? [];

  return media;
};

export const getPageMedia = async (
  args: MediaArgs & PageArgs,
  fields?: string,
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    browseMangaQuery(fields),
    args,
  );
  console.log("Anilist Page Media Response:", response);

  return response?.Page;
};

// export const getPageMedia = async (
//   args: MediaArgs & PageArgs,
//   fields?: string,
// ) => {
//   const response = await anilistFetcher<PageQueryResponse>(
//     mediaQuery(fields),
//     args,
//   );
//   console.log("Anilist Page Media Response:", response);

//   return response?.Page;
// };

export const getPageCharacters = async (args: any, fields?: string) => {
  const response = await anilistFetcher<any>(charactersQuery(fields), args);
  console.log("AniList Page Characters Response:", response);

  return response?.Page;
};
