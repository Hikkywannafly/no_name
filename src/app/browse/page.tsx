"use client";
import Select from "@/components/browse/ClientOnlySelect";
import WideContainer from "@/components/layout/wideLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import BaseLayout from "../baseLayout";

const TYPES = [
    { value: "manga", label: "Manga" },
    { value: "characters", label: "Nhân vật" },
    { value: "voice_actors", label: "Người lồng tiếng" },
    { value: "users", label: "Người dùng" },
];

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

function BrowsePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

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
        [type]
    );


    // const BrowseComponent = useMemo(() => components[type as keyof typeof components], [type]);

    return (
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

                {/* <BrowseComponent ... /> */}
            </BaseLayout>
        </WideContainer>
    );
}

export default function BrowsePage() {
    return (
        <Suspense>
            <BrowsePageContent />
        </Suspense>
    );
}
