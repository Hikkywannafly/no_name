import CarouselCardSwiper from "@/components/shared/CarouselCardSwiper";
import CarouselSwiperCard from "@/components/shared/CarouselSwiperCard";
import useMedia from "@/hooks/Anilist/useMedia";
import { MediaSort, MediaType } from "@/types/anilist";

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
    <CarouselCardSwiper
      data={mangas || []}
      onEachCard={(item, isHover) => (
        <CarouselSwiperCard
          data={item}
          isHovered={isHover}
          onHover={() => {}}
        />
      )}
    />
  );
};

export default RecommendedManga;
