import type { ExtendManga, Relationship } from "@/types/mangadex";

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
  console.log("getcoverart", manga);
  if (!manga) {
    return "";
  }
  if (manga.cover_art?.attributes) {
    return `${MANGADEX_API_RESIZES}/?url=${MANGADEX_API_URL}/covers/${manga.id}/${manga.cover_art.attributes.fileName}`;
  }
  return "";
};
