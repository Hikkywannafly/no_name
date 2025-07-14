import type { ExtendManga, Relationship, Tag } from "@/types/mangadex";

// const BlanklImage = "https://mangadex.org/assets/blank.png";
const MANGADEX_API_URL = process.env.NEXT_PUBLIC_MANGADEX_URL;
const MANGADEX_API_RESIZES = process.env.NEXT_PUBLIC_RESIZER;
export const extendRelationship = (
  object: Record<string, any> & { relationships: Relationship[] },
) => {
  for (const T of object.relationships) {
    object[T.type] = T;
  }
  return object;
};

export const getCoverArt = (manga?: ExtendManga | undefined) => {
  if (!manga) {
    return "";
  }
  if (manga.cover_art?.attributes) {
    return `${MANGADEX_API_RESIZES}/?url=${MANGADEX_API_URL}/covers/${manga.id}/${manga.cover_art.attributes.fileName}`;
  }
  return "";
};

export const getMangaTitle = (
  manga: ExtendManga | null | undefined,
  options?: { local?: string; allTitle?: boolean },
): string | string[] => {
  if (!manga) return "";
  if (options?.allTitle && manga.attributes.altTitles) {
    const t = manga.attributes.altTitles.map((t) => Object.values(t)[0]);
    return t[1] || t[0];
  }
  if (options?.local && manga.attributes.title) {
    return manga.attributes.title[options.local];
  }
  return (
    manga.attributes.altTitles.find((t) => t.vi)?.vi ||
    manga.attributes.title?.en ||
    Object.values(manga.attributes.title)?.[0] ||
    "No title"
  );
};

export const getTagName = (tag: Tag) => {
  if (!tag) return "";
  return (
    tag.attributes.name.en ||
    tag.attributes.name.ja ||
    tag.attributes.name.zh ||
    tag.attributes.name.vi ||
    tag.attributes.name.es ||
    tag.attributes.name.fr ||
    tag.attributes.name.id ||
    tag.attributes.name.th ||
    "No name"
  );
};
