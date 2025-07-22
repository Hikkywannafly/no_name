"use client";
import useChapterData from "@/hooks/useChapterData";
import type { UChapter, UPage } from "@/types/manga";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ReadingMode = "vertical" | "horizontal" | "single-page" | "page-flip";

interface ReaderSettings {
  readingMode: ReadingMode;
  zoomLevel: number;
  autoFullscreen: boolean;
  showProgress: boolean;
  preloadPages: number;
}

interface ChapterContextType {
  chapters: UPage[];
  chapterList: UChapter[];
  isLoading: boolean;
  error: any;

  // Reader state
  settings: ReaderSettings;
  setSettings: (settings: ReaderSettings) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  readingProgress: number;
  setReadingProgress: (progress: number) => void;

  // Image loading
  loadedImages: Set<number>;
  setLoadedImages: (images: Set<number>) => void;
  preloadedImages: Map<number, string>;
  setPreloadedImages: (images: Map<number, string>) => void;

  // Navigation
  goToNextPage: () => void;
  goToPrevPage: () => void;
  toggleFullscreen: () => void;

  // Utils
  reportError: (pageIndex: number) => void;
}

const ChapterContext = createContext<ChapterContextType | undefined>(undefined);

interface ChapterProviderProps {
  children: ReactNode;
  mangaId: string;
  chapterId: string;
  source?: string;
  nextChapter?: string;
  prevChapter?: string;
}


export function ChapterProvider({
  children,
  mangaId,
  chapterId,
  source = "source1",
}: ChapterProviderProps) {
  const { chapters, chapterList, isLoading, error } = useChapterData(
    source,
    mangaId,
    chapterId,
  );

  // Reader settings
  const [settings, setSettings] = useState<ReaderSettings>({
    readingMode: "vertical",
    zoomLevel: 100,
    autoFullscreen: false,
    showProgress: true,
    preloadPages: chapters.length,
  });
  // Reader state
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Image loading state
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [preloadedImages, setPreloadedImages] = useState<Map<number, string>>(
    new Map(),
  );

  // Load user preferences
  useEffect(() => {
    const savedSettings = localStorage.getItem("manga-reader-settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({
        ...parsed,
        preloadPages: chapters.length, // Always preload all
      });
    }
  }, [chapters.length]);

  // Save user preferences
  useEffect(() => {
    localStorage.setItem("manga-reader-settings", JSON.stringify(settings));
  }, [settings]);

  // Update preload pages when chapters change
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      preloadPages: chapters.length,
    }));
  }, [chapters.length]);

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < chapters.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const reportError = (pageIndex: number) => {
    console.log(`Error reported for page ${pageIndex + 1}`);
    alert(
      `Error reported for page ${pageIndex + 1}. Thank you for your feedback!`,
    );
  };

  const contextValue: ChapterContextType = {
    // Chapter data
    chapters,
    chapterList,
    isLoading,
    error,

    // Reader state
    settings,
    setSettings,
    currentPage,
    setCurrentPage,
    isFullscreen,
    setIsFullscreen,
    showControls,
    setShowControls,
    showSettings,
    setShowSettings,
    readingProgress,
    setReadingProgress,

    // Image loading
    loadedImages,
    setLoadedImages,
    preloadedImages,
    setPreloadedImages,

    // Navigation
    goToNextPage,
    goToPrevPage,
    toggleFullscreen,

    // Utils
    reportError,
  };

  return (
    <ChapterContext.Provider value={contextValue}>
      {children}
    </ChapterContext.Provider>
  );
}

export function useChapter() {
  const context = useContext(ChapterContext);
  if (context === undefined) {
    throw new Error("useChapter must be used within a ChapterProvider");
  }
  return context;
}
