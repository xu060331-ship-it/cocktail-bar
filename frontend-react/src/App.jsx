import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom"
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

function Layout() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="bg-[var(--color-bg-page)] text-white font-serif min-h-screen">
      <Navbar transparent={isHome} />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
