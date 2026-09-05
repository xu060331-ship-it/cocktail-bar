import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "./lib/auth"
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
import MakingLogsPage from "./pages/MakingLogsPage"
import MobileBottomNav from "./components/MobileBottomNav"
import AdminPage from "./pages/AdminPage"
import SubmitContentPage from "./pages/SubmitContentPage"
import CommunityPage from "./pages/CommunityPage"
import CommunityDetailPage from "./pages/CommunityDetailPage"
import AuthorPage from "./pages/AuthorPage"
import AdminImagesPage from "./pages/AdminImagesPage"
import MySubmissionsPage from "./pages/MySubmissionsPage"
import AdminReportsPage from "./pages/AdminReportsPage"
import NotificationsPage from "./pages/NotificationsPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import CommunityReportButton from "./components/CommunityReportButton"
import CommunityFavoritesPage from "./pages/CommunityFavoritesPage"
import CommunityPopularPage from "./pages/CommunityPopularPage"

function Layout() {
  const { loading: authLoading } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === "/"

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [location.pathname, location.search])

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)] font-ui text-sm text-[var(--color-text-muted)]">正在恢复登录状态...</div>
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pb-20 font-serif text-[var(--color-text-main)] md:pb-0">
      <Navbar transparent={isHome} />
      <Outlet />
      {location.pathname.startsWith("/community/") && !location.pathname.endsWith("/popular") && <CommunityReportButton contentId={location.pathname.split("/").pop()} />}
      <RandomPicker />
      <MobileBottomNav />
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
          <Route path="/profile/:section" element={<ProfilePage />} />
          <Route path="/making-logs" element={<MakingLogsPage />} />
          <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
          <Route path="/playlist/share/:token" element={<PlaylistDetailPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/taste-test" element={<TasteTestPage />} />
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/content" element={<AdminPage />} />
          <Route path="/submit" element={<SubmitContentPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/author/:id" element={<AuthorPage />} />
          <Route path="/profile/community-favorites" element={<CommunityFavoritesPage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/community/popular" element={<CommunityPopularPage />} />
          <Route path="/admin/images" element={<AdminImagesPage />} />
          <Route path="/submissions" element={<MySubmissionsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}
