import { MangadexApi } from "@/provider";
import type { MediaArgs, PageArgs } from "@/types/anilist";

import axios from "axios";
import { Order } from "../MangaDex/static";
import {
  type MediaDetailsQueryResponse,
  type PageQueryResponse,
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
  console.log("Anilist Media Response:", response);
  const mediaList = response.Page.media || [];

  const updatedMediaList = await Promise.all(
    mediaList.map(async (media) => {
      const title = media?.title?.userPreferred || "";
      let mangaList: any[] = [];
      try {
        const { data } = await MangadexApi.Manga.getSearchManga({
          title,
          includes: [],
          order: {
            followedCount: Order.DESC,
            relevance: Order.DESC,
          },
          limit: 1,
        });
        mangaList = data?.data ?? [];
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

  // return response.Page.media || [];
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

  const title = media?.title?.userPreferred || "";

  let mangaList: any[] = [];
  try {
    const { data } = await MangadexApi.Manga.getSearchManga({
      title,
      includes: [],
      order: {
        followedCount: Order.DESC,
        relevance: Order.DESC,
      },
      limit: 1,
    });
    mangaList = data?.data ?? [];
    console.log("MangaDex Manga List:", data);
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
    mediaQuery(fields),
    args,
  );
  console.log("Anilist Page Media Response:", response);

  return response?.Page;
};

export const getPageCharacters = async (args: any, fields?: string) => {
  const response = await anilistFetcher<any>(charactersQuery(fields), args);
  console.log("AniList Page Characters Response:", response);

  return response?.Page;
};
