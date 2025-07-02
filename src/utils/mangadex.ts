import type { Relationship } from "@/types/mangadex";

export const extendRelationship = (
  object: Record<string, any> & { relationships: Relationship[] },
) => {
  for (const T of object.relationships) {
    object[T.type] = T;
  }
  return object;
};
