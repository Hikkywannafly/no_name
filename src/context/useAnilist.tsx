"use client";
import { getMediaDetails } from "@/provider/Anilist";
import { type Media, MediaType } from "@/types/anilist";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

type AnilistContextType = {
  mediaCache: Record<number, Media>;
  getMedia: (id: number) => Promise<Media | undefined>;
  setMedia: (id: number, media: Media) => void;
};

const AnilistContext = createContext<AnilistContextType>({
  mediaCache: {},
  getMedia: async () => undefined,
  setMedia: () => {},
});

export const AnilistContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [mediaCache, setMediaCache] = useState<Record<number, Media>>({});

  // Lấy media từ cache, nếu chưa có thì fetch và cache lại
  const getMedia = useCallback(
    async (id: number) => {
      if (mediaCache[id]) return mediaCache[id];
      const data = await getMediaDetails({ id, type: MediaType.Manga });
      if (data) setMediaCache((prev) => ({ ...prev, [id]: data }));
      return data;
    },
    [mediaCache],
  );
  const setMedia = useCallback((id: number, media: Media) => {
    setMediaCache((prev) => ({ ...prev, [id]: media }));
  }, []);

  return (
    <AnilistContext.Provider value={{ mediaCache, getMedia, setMedia }}>
      {children}
    </AnilistContext.Provider>
  );
};

export const useAnilist = () => useContext(AnilistContext);
