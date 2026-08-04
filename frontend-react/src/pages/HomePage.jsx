import HeroSection from "../components/HeroSection"
import ClassicCocktails from "../components/ClassicCocktails"
import BaseSpirits from "../components/BaseSpirits"
import WhiskyQA from "../components/WhiskyQA"
import Footer from "../components/Footer"

export default function HomePage() {
  return (
    <div className="bg-[var(--color-bg-page)] text-white font-serif">
      <div className="h-[100dvh] overflow-y-scroll scroll-smooth snap-y snap-mandatory">
        <HeroSection />
        <ClassicCocktails />
        <BaseSpirits />
        <WhiskyQA />
        <Footer />
      </div>
    </div>
  )
}
