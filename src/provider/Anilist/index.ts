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

// export const getMediaDetails = async (
//   args: MediaArgs & PageArgs,
//   fields?: string,
// ) => {
//   const response = await anilistFetcher<MediaDetailsQueryResponse>(
//     mediaDetailsQuery(fields),
//     args,
//   );
//   const media = response?.Media;

//   if (media?.title?.userPreferred) {
//     const mangadex = await MangadexApi.Manga.getSearchManga({
//       title: media.title.userPreferred,
//       limit: 1,
//       includes: [],
//     });
//     console.log("Anilist Manga", media?.title?.userPreferred, mangadex);
//   }

//   return media;
// };
export const getMediaDetails = async (
  args: MediaArgs & PageArgs,
  fields?: string,
) => {
  const response = await anilistFetcher<MediaDetailsQueryResponse>(
    mediaDetailsQuery(fields),
    args,
  );
  const media = response?.Media;


  const { data: { data: mangaList }, } = await MangadexApi.Manga.getSearchManga({
    title: media?.title?.userPreferred || "",
    authors: (media?.staff?.nodes ?? [])
      .map((author) => author?.name?.full)
      .filter((name): name is string => !!name),
    year: media?.startDate?.year || undefined,

    includes: [],
    limit: 1,
  })
  media.translations = mangaList[0].attributes.altTitles

  return media;
};
