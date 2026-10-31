import FeaturedStudios from "@/components/home/featured-studios";
import HeroSlider from "@/components/home/hero-slider";
import StudioCategories from "@/components/home/studio-categories";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <FeaturedStudios />
      <StudioCategories />
    </div>
  );
}
