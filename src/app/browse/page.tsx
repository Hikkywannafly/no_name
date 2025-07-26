"use client";
import Select from "@/components/browse/ClientOnlySelect";
import CharacterBrowseList from "@/components/browse/characterBrowseList";
import MangaBrowseList from "@/components/browse/mangaBrowseList";
// import UniversalBrowseList from "@/components/browse/universalBrowseList";
import WideContainer from "@/components/layout/wideLayout";
import type { MediaFormat, MediaSort } from "@/types/anilist";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import BaseLayout from "../baseLayout";

const TYPES = [
  { value: "manga", label: "Manga" },
  { value: "characters", label: "Nhân vật" },
  // { value: "light_novel", label: "Light Novel" },
  // { value: "manhua", label: "Manhua" },
  // { value: "anime", label: "Anime" },
];

const components = {
  manga: MangaBrowseList,
  characters: CharacterBrowseList,
};

const convertQueryToArray = <T,>(query: T[] | string) => {
  if (typeof query === "string") return [query];
  return query;
};

const typeSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#1a1a1a",
    border: 0,
    boxShadow: "none",
    padding: "0.25rem",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontSize: "1.2rem",
    lineHeight: "1.5rem",
    color: "white",
    fontWeight: 600,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: "1.2rem",
    lineHeight: "1.5rem",
    color: "white",
    fontWeight: 600,
  }),
};

function BrowsePageContent({ query: baseQuery }: { query: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const type = searchParams.get("type") ?? "manga";

  const handleTypeChange = (
    newValue: { value: string; label: string } | null,
  ) => {
    if (!newValue) return;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("type", newValue.value);
    router.replace(`/browse?${params.toString()}`);
  };

  const chosenType = useMemo(
    () => TYPES.find((t) => t.value === type) || TYPES[0],
    [type],
  );

  const {
    format = undefined,
    keyword = "",
    season = undefined,
    seasonYear = undefined,
    sort = "popularity",
    genres = [],
    tags = [],
    countries = [],
  } = baseQuery || {};

  const query = {
    format: format as MediaFormat,
    keyword: keyword as string,
    genres: convertQueryToArray<string>(genres),
    tags: convertQueryToArray<string>(tags),
    countries: convertQueryToArray<string>(countries),
    season: season as string,
    seasonYear: seasonYear as string,
    sort: sort as MediaSort,
    type, // Pass the current type to the universal component
  };

  const BrowseComponent = useMemo(
    () => components[type as keyof typeof components],
    [type],
  );

  return (
    <BaseLayout showHeader={true} showFooter={true}>
      <WideContainer classNames="mt-20">
        <div className="mb-8 flex items-center space-x-3">
          <h1 className="text-center font-semibold text-2xl md:text-left">
            Tìm kiếm theo
          </h1>
          <div className="relative h-12 min-w-[5rem] max-w-[14rem]">
            {!mounted ? (
              <div className="absolute inset-0 h-full w-[8rem] animate-pulse rounded bg-black/50" />
            ) : (
              <Select
                value={{ value: type, label: chosenType.label || "manga" }}
                options={TYPES}
                isClearable={false}
                isSearchable={false}
                components={{ IndicatorSeparator: () => null }}
                onChange={handleTypeChange as any}
                styles={typeSelectStyles}
              />
            )}
          </div>
        </div>
        {/* <UniversalBrowseList defaultQuery={query as any} /> */}
        <BrowseComponent defaultQuery={query as any} />
      </WideContainer>
    </BaseLayout>
  );
}

export default function BrowsePage({ query }: { query: any }) {
  return (
    <Suspense>
      <BrowsePageContent query={query} />
    </Suspense>
  );
}
