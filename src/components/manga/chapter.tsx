"use client";
import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import useCuuTruyenChapterList from "@/hooks/CuuTruyen/useChapterList";
import useChapterList from "@/hooks/MangaDex/useChapterList";
// import { Separator } from "@/components/ui/separator"

interface ChapterProps {
  mangaId: string;
  name: string;
}
const tags = Array.from({ length: 50 }).map((_, i, a) => `${a.length - i}`);

export function Chapter(props: ChapterProps) {
  const { mangaId, name } = props;
  const { chapters: data } = useCuuTruyenChapterList(name);
  const { chapters: data2 } = useChapterList(mangaId, {});
  console.log("test chapter manga", name, mangaId, data, data2);
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            {/* <Separator className="my-2" /> */}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
