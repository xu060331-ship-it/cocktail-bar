import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import CocktailsPage from "./pages/CocktailsPage"
import CocktailDetailPage from "./pages/CocktailDetailPage"
import ArticleDetailPage from "./pages/ArticleDetailPage"
import SpiritsPage from "./pages/SpiritsPage"
import SpiritDetailPage from "./pages/SpiritDetailPage"
import ArticlesPage from "./pages/ArticlesPage"
import DailyPage from "./pages/DailyPage"
import SearchPage from "./pages/SearchPage"
import AboutPage from "./pages/AboutPage"
import NotFoundPage from "./pages/NotFoundPage"
import RandomPicker from "./components/RandomPicker"
import ProfilePage from "./pages/ProfilePage"
import PopularPage from "./pages/PopularPage"
import PlaylistDetailPage from "./pages/PlaylistDetailPage"
import AIAssistantPage from "./pages/AIAssistantPage"
import LearnPage from "./pages/LearnPage"
import EncyclopediaPage from "./pages/EncyclopediaPage"
import TasteTestPage from "./pages/TasteTestPage"
import GettingStartedPage from "./pages/GettingStartedPage"

function Layout() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif min-h-screen">
      <Navbar transparent={isHome} />
      <Outlet />
      <RandomPicker />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cocktails" element={<CocktailsPage />} />
          <Route path="/cocktails/:name" element={<CocktailDetailPage />} />
          <Route path="/spirits" element={<SpiritsPage />} />
          <Route path="/spirits/:name" element={<SpiritDetailPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/taste-test" element={<TasteTestPage />} />
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}
