"use client";
import Select from "@/components/browse/ClientOnlySelect";
import WideContainer from "@/components/layout/wideLayout";
// import type { MediaFormat, MediaSort } from "@/types/anilist";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import BaseLayout from "../baseLayout";
// const components = {
//     anime: AnimeBrowseList,
//     manga: MangaBrowseList,
//     characters: CharacterBrowseList,
//     voice_actors: VABrowseList,
//     users: UserBrowseList,
// };
const TYPES = [
    {
        value: "manga",
        label: "Manga",
    },
    {
        value: "characters",
        label: "Nhân vật",
    },
    {
        value: "voice_actors",
        label: "Người lồng tiếng",
    },
    {
        value: "users",
        label: "Người dùng",
    },
];

// const convertQueryToArray = <T,>(query: T[] | string | null | undefined) => {
//     if (!query) return [];
//     if (typeof query === "string") return [query];
//     return query;
// };

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
        fontSize: "1.25rem",
        lineHeight: "1.5rem",
        color: "white",
        fontWeight: 600,
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: "1.25rem",
        lineHeight: "1.5rem",
        color: "white",
        fontWeight: 600,
    }),
};

export default function BrowsePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // const { TYPES } = useConstantTranslation();

    // const format = searchParams.get("format") ?? undefined;
    // const keyword = searchParams.get("keyword") ?? "";
    // const season = searchParams.get("season") ?? undefined;
    // const seasonYear = searchParams.get("seasonYear") ?? undefined;
    // const sort = searchParams.get("sort") ?? "popularity";
    // const genres = searchParams.getAll("genres");
    // const tags = searchParams.getAll("tags");
    // const countries = searchParams.getAll("countries");
    const type = searchParams.get("type") ?? "anime";

    // const query = {
    //     format: format as MediaFormat,
    //     keyword: keyword as string,
    //     genres: convertQueryToArray<string>(genres),
    //     tags: convertQueryToArray<string>(tags),
    //     countries: convertQueryToArray<string>(countries),
    //     season: season as string,
    //     seasonYear: seasonYear as string,
    //     sort: sort as MediaSort,
    //     type,
    // };

    const handleTypeChange = (
        newValue: { value: string; label: string } | null,
    ) => {
        if (!newValue) return;
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("type", newValue.value);
        router.replace(`/browse?${params.toString()}`);
    };

    // const BrowseComponent = useMemo(() => components[type as keyof typeof components], [type]);
    const chosenType = useMemo(
        () => TYPES.find((t: any) => t.value === type) || TYPES[0],
        [type]
    );

    return (
        <Suspense>
            <WideContainer classNames="mt-20">
                <BaseLayout showHeader={true} showFooter={true}>
                    <div className="mb-8 flex items-center space-x-2">
                        <h1 className="text-center font-semibold text-2xl md:text-left">
                            Tìm kiếm theo
                        </h1>
                        <Select
                            value={{ value: type, label: chosenType.label }}
                            options={TYPES}
                            isClearable={false}
                            isSearchable={false}
                            components={{ IndicatorSeparator: () => null }}
                            onChange={handleTypeChange as any}
                            styles={typeSelectStyles}
                        />
                    </div>
                </BaseLayout>
            </WideContainer>
        </Suspense>
    );
}
