import useMedia from "@/hooks/Anilist/useMedia";
import { MediaSort, MediaType } from "@/types/anilist";
import CardSwiper from "./shared/cardSwiper";
import Section from "./shared/section";

const RecommendedManga = () => {
    const {
        data: mangas,
        // isLoading,
        // error,
    } = useMedia({
        type: MediaType.Manga,
        sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
        countryOfOrigin: "JP",
        perPage: 20,
    });


    return (
        <Section title="Truyện đề xuất cho bạn">
            <CardSwiper data={mangas || []} onCardClick={() => { }} className="mb-12" />
        </Section>
    )
}

export default RecommendedManga