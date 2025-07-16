import { getMediaDetails } from "@/provider/Anilist";
import type { Media, MediaArgs } from "@/types/anilist";
import useSWR, { type SWRConfiguration } from "swr";

const useMediaDetails = (
  args: MediaArgs,
  options?: SWRConfiguration<Media, any>,
) => {
  const { data, isLoading, error } = useSWR<Media>(
    ["media-details", args],
    () => getMediaDetails(args),
    options,
  );
  return {
    data: data,
    isLoading,
    error,
  };
};

export default useMediaDetails;
