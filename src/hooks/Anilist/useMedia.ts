import { getMedia } from "@/provider/Anilist";
import type { Media, MediaArgs, PageArgs } from "@/types/anilist";
import useSWR, { type SWRConfiguration } from "swr";

const useMedia = (
  args: MediaArgs & PageArgs,
  options?: SWRConfiguration<Media[], any>,
) => {
  return useSWR<Media[]>(["media", args], () => getMedia(args), options);
};

export default useMedia;
