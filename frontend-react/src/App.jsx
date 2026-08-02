import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import ClassicCocktails from "./components/ClassicCocktails"
import BaseSpirits from "./components/BaseSpirits"
import WhiskyQA from "./components/WhiskyQA"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="bg-[var(--color-bg-page)] text-white font-serif">
      {/* 导航栏：首页透明，滚动后变深色 */}
      <Navbar transparent />

      {/* 滚动容器：全屏吸附 */}
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
