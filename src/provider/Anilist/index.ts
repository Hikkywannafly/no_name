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
  // let translations: Translation[] = [];
  // const media = response?.Media;

  // const { data } = await supabaseClient
  //   .from<Translation>("kaguya_translations")
  //   .select("*")
  //   .eq("mediaId", media.id)
  //   .eq("mediaType", args?.type || MediaType.Anime);

  // if (data?.length) {
  //   translations = data;
  // } else if (args?.type === MediaType.Manga) {
  //   translations = null;
  // } else {
  //   translations = await getTranslations(media);
  // }

  return media;
};
