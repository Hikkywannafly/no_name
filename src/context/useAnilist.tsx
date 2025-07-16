"use client";
import { getMediaDetails } from "@/provider/Anilist";
import { type Media, MediaType } from "@/types/anilist";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type AnilistContextType = {
  mediaCache: Record<number, Media>;
  getMedia: (id: number) => Promise<Media | undefined>;
  setMedia: (id: number, media: Media) => void;
  updateMedias: (ids: number[]) => Promise<void>;
};

const AnilistContext = createContext<AnilistContextType>({
  mediaCache: {},
  getMedia: async () => undefined,
  setMedia: () => {},
  updateMedias: async () => {},
});

export const AnilistContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const mediaCacheRef = useRef<Record<number, Media>>({});
  const [, forceUpdate] = useState({}); // Trigger render if needed

  const getMedia = useCallback(async (id: number) => {
    if (mediaCacheRef.current[id]) return mediaCacheRef.current[id];

    const data = await getMediaDetails({ id, type: MediaType.Manga });
    if (data) {
      mediaCacheRef.current[id] = data;
      forceUpdate({});
    }
    return data;
  }, []);

  const setMedia = useCallback((id: number, media: Media) => {
    mediaCacheRef.current[id] = media;
    forceUpdate({});
  }, []);

  const updateMedias = useCallback(async (ids: number[]) => {
    const fetches = ids.map(async (id) => {
      if (!mediaCacheRef.current[id]) {
        const data = await getMediaDetails({ id, type: MediaType.Manga });
        if (data) {
          mediaCacheRef.current[id] = data;
        }
      }
    });
    await Promise.all(fetches);
    forceUpdate({});
  }, []);

  return (
    <AnilistContext.Provider
      value={{
        mediaCache: mediaCacheRef.current,
        getMedia,
        setMedia,
        updateMedias,
      }}
    >
      {children}
    </AnilistContext.Provider>
  );
};

export const useAnilist = () => useContext(AnilistContext);
