import { MangadexApi } from "@/provider";
import type { MediaArgs, PageArgs } from "@/types/anilist";
import axios from "axios";
import {
  type MediaDetailsQueryResponse,
  type PageQueryResponse,
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
};

export const getMedia = async (args: MediaArgs & PageArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args,
  );

  return response.Page.media || [];
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
  const authors = (media?.staff?.nodes ?? [])
    .map((author) => author?.name?.full)
    .filter((name): name is string => !!name);
  const year = media?.startDate?.year || undefined;


  let mangaList: any[] = [];
  try {
    const { data } = await MangadexApi.Manga.getSearchManga({
      title,
      authors,
      year,
      includes: [],
      limit: 1,
    });
    mangaList = data?.data ?? [];
  } catch (error) {
    console.error("Lỗi khi fetch MangaDex:", error);
  }
  const firstManga = mangaList?.[0];
  media.translations = firstManga?.attributes?.altTitles ?? [];

  return media;
};