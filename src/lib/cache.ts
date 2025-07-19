import { Redis } from "@upstash/redis";

// Redis client for caching

export const redis = new Redis({
  url: process.env.NEXT_PUBLIC_URL_CACHE,
  token: process.env.NEXT_PUBLIC_URL_CACHE_TOKEN,
});

// Cache keys
export const CACHE_KEYS = {
  MANGA_INFO: (id: string) => `manga:info:${id}`,
  MANGA_CHAPTERS: (id: string, source: string) =>
    `manga:chapters:${id}:${source}`,
  MANGA_PAGES: (chapterId: string, source: string) =>
    `manga:pages:${chapterId}:${source}`,
  SEARCH_RESULTS: (query: string) => `search:${query}`,
  TRENDING_MANGA: () => "trending:manga",
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  MANGA_INFO: 24 * 60 * 60, // 24 hours
  CHAPTERS: 6 * 60 * 60, // 6 hours
  PAGES: 7 * 24 * 60 * 60, // 7 days (pages rarely change)
  SEARCH: 30 * 60, // 30 minutes
  TRENDING: 60 * 60, // 1 hour
} as const;

export const CacheManager = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Cache set error:", error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  },

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error("Cache invalidate error:", error);
    }
  },
};
