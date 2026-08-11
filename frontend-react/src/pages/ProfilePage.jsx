import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../lib/auth"
import { fetchAPI } from "../lib/api"
import { cocktailImg } from "../lib/images"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Heart, LogOut, ChevronRight, Clock, GlassWater, Plus, Trash2, X, ListPlus, Sparkles, PenLine, Coffee } from "lucide-react"
import { useExperience } from "../lib/experience"

const COMMON_MATERIALS = [
  "金酒", "伏特加", "白朗姆", "黑朗姆", "龙舌兰", "波本威士忌", "黑麦威士忌", "苏格兰威士忌", "干邑白兰地",
  "干味美思", "甜味美思", "金巴利", "阿佩罗", "君度", "黑樱桃利口酒",
  "新鲜柠檬汁", "新鲜青柠汁", "新鲜橙汁", "菠萝汁", "蔓越莓汁", "葡萄柚汁",
  "单糖浆", "蜂蜜糖浆", "石榴糖浆", "安哥斯图拉苦精",
  "苏打水", "汤力水", "姜汁啤酒", "可乐", "香槟",
  "鲜奶油", "蛋清", "薄荷叶", "方糖",
]
const COMMON_TOOLS = [
  "雪克壶", "搅拌杯", "吧勺", "量酒器", "捣棒", "滤冰器", "马天尼杯", "古典杯", "高球杯", "香槟杯", "飓风杯", "烈酒杯"
]

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const token = localStorage.getItem("token")
  const auth = (method, body) => ({ method, headers: { Authorization: `Bearer ${token}` }, body })

  const [activeTab, setActiveTab] = useState("favorites")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 各 Tab 数据
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [barIngs, setBarIngs] = useState([])
  const [barTools, setBarTools] = useState(() => {
    try { return JSON.parse(localStorage.getItem("barTools") || "[]") } catch { return [] }
  })
  const [playlists, setPlaylists] = useState([])
  const [notes, setNotes] = useState([])
  // 吧台匹配
  const [matchResult, setMatchResult] = useState(null)
  const [matching, setMatching] = useState(false)
  // 添加材料
  const [addIng, setAddIng] = useState("")
  // 新建酒单
  const [newPlName, setNewPlName] = useState("")
  const [newPlDesc, setNewPlDesc] = useState("")
  const [creatingPl, setCreatingPl] = useState(false)
  const { madeSet, tastedSet, count: expCount } = useExperience()

  useEffect(() => {
    if (!user) { setLoading(false); return }
    Promise.all([
      fetchAPI("/api/favorites", auth()),
      fetchAPI("/api/history", auth()),
      fetchAPI("/api/bar", auth()),
      fetchAPI("/api/playlists", auth()),
      fetchAPI("/api/notes", auth()),
    ])
      .then(([fav, hist, bar, pls, nts]) => {
        setFavorites(fav); setHistory(hist); setBarIngs(bar); setPlaylists(pls); setNotes(nts)
        setLoading(false)
      })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [user])

  // 添加吧台材料
  async function addBarIngredient(ing) {
    await fetchAPI("/api/bar", auth("POST", { ingredient: ing }))
    setBarIngs([...barIngs, ing].sort())
    setAddIng("")
  }

  // 删除吧台材料
  async function removeBarIngredient(ing) {
    await fetchAPI("/api/bar", auth("DELETE", { ingredient: ing }))
    setBarIngs(barIngs.filter(i => i !== ing))
  }

  // 匹配能做的酒
  async function doMatch() {
    setMatching(true)
    try {
      const data = await fetchAPI("/api/bar/match", auth())
      setMatchResult(data)
    } catch (err) { console.error(err) }
    setMatching(false)
  }

  // 创建酒单
  async function createPlaylist() {
    if (!newPlName.trim()) return
    setCreatingPl(true)
    const pl = await fetchAPI("/api/playlists", auth("POST", { name: newPlName, description: newPlDesc }))
    setPlaylists([pl, ...playlists])
    setNewPlName(""); setNewPlDesc(""); setCreatingPl(false)
  }

  // 删除酒单
  async function deletePlaylist(id) {
    await fetchAPI(`/api/playlists/${id}`, auth("DELETE"))
    setPlaylists(playlists.filter(p => p.id !== id))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">请先登录</p>
          <Link to="/" className="text-sm text-[var(--color-accent)] hover:underline">返回首页</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 flex items-center justify-center">
        <p className="text-2xl text-[var(--color-text-muted)] animate-pulse">加载中...</p>
      </div>
    )
  }

  const tabs = [
    { key: "favorites", label: "收藏", icon: Heart, count: favorites.length },
    { key: "history", label: "浏览记录", icon: Clock, count: history.length },
    { key: "bar", label: "我的吧台", icon: GlassWater, count: barIngs.length + barTools.length },
    { key: "playlists", label: "我的酒单", icon: ListPlus, count: playlists.length },
    { key: "notes", label: "调酒笔记", icon: PenLine, count: notes.length },
  ]

  const currentData = activeTab === "favorites" ? favorites : activeTab === "history" ? history : []

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        {/* 用户信息 */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.3em] text-[var(--color-accent)] mb-3">MY PROFILE</p>
              <h1 className="text-4xl text-[var(--color-text-main)] font-serif">{user.nickname || "调酒爱好者"}</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">{user.email}</p>
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-text-main)] transition-colors border border-[var(--color-border)] rounded-full px-4 py-2">
              <LogOut size={14} strokeWidth={1.5} /> 退出登录
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 mb-3">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => { setActiveTab(t.key); setMatchResult(null) }}
                className={`bg-[var(--color-bg-card)] border rounded-2xl p-4 transition-all text-left ${activeTab === t.key ? "border-[var(--color-accent)]" : "border-[var(--color-border)] hover:border-[var(--color-text-muted)]"}`}>
                <t.icon size={14} strokeWidth={1.5} className="text-[var(--color-accent)] mb-2" />
                <p className="text-xl text-[var(--color-accent)] font-bold">{t.count}</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{t.label}</p>
              </button>
            ))}
            <div className="bg-[var(--color-bg-card)] border border-emerald-500/20 rounded-2xl p-4">
              <GlassWater size={14} strokeWidth={1.5} className="text-emerald-400 mb-2" />
              <p className="text-xl text-emerald-400 font-bold">{expCount.made}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">调配过</p>
            </div>
            <div className="bg-[var(--color-bg-card)] border border-amber-500/20 rounded-2xl p-4">
              <Coffee size={14} strokeWidth={1.5} className="text-amber-400 mb-2" />
              <p className="text-xl text-amber-400 font-bold">{expCount.tasted}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">喝过</p>
            </div>
          </div>
        </motion.div>

        {/* ========== 收藏/历史 Tab ========== */}
        {(activeTab === "favorites" || activeTab === "history") && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex gap-4 mb-6">
              {[{ key: "favorites", label: "收藏", icon: Heart }, { key: "history", label: "浏览记录", icon: Clock }].map(t => (
                <button key={t.key} onClick={() => { setActiveTab(t.key); setMatchResult(null) }}
                  className={`text-sm flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${activeTab === t.key ? "text-[var(--color-text-main)] border-[var(--color-accent)]" : "text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-main)]"}`}>
                  <t.icon size={14} strokeWidth={1.5} /> {t.label} ({currentData.length})
                </button>
              ))}
            </div>

            {currentData.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-muted)] mb-4">{activeTab === "favorites" ? "还没有收藏任何鸡尾酒" : "还没有浏览记录"}</p>
                <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline flex items-center justify-center gap-1">去酒谱看看 <ArrowRight size={14} /></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {currentData.map((c, i) => (
                  <motion.div key={c.eng} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link to={`/cocktails/${encodeURIComponent(c.eng)}`} className="flex items-center gap-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-accent)] transition-all group">
                      <div className="w-14 h-14 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0">
                        <img src={cocktailImg(c.eng)} alt={c.eng} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">{c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}</h3>
                        <p className="text-xs text-[var(--color-text-muted)] italic">{c.eng}</p>
                      </div>
                      <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ========== 我的吧台 Tab ========== */}
        {activeTab === "bar" && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-lg text-[var(--color-text-main)] font-serif mb-2 flex items-center gap-2"><GlassWater size={16} className="text-[var(--color-accent)]" /> 我的吧台</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-6">标记你家里有的材料，看看能调什么酒</p>

            {/* 已有材料 */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
              {barIngs.length === 0 && <p className="text-xs text-[var(--color-text-muted)]">还没有添加材料</p>}
              {barIngs.map(ing => (
                <span key={ing} className="flex items-center gap-1 text-xs bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-3 py-1.5 rounded-full group">
                  {ing}
                  <button onClick={() => removeBarIngredient(ing)} className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors ml-0.5"><X size={10} /></button>
                </span>
              ))}
            </div>

            {/* 匹配按钮 */}
            <button onClick={doMatch} disabled={matching || barIngs.length === 0}
              className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg-page)] px-5 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 mb-6">
              <Sparkles size={14} /> {matching ? "匹配中..." : `查看我能调什么 (${barIngs.length} 种材料)`}
            </button>

            {/* 匹配结果 */}
            {matchResult && (
              <div className="mb-8 space-y-4">
                {matchResult.matchable.length > 0 && (
                  <div>
                    <p className="text-xs text-green-400 mb-3">✅ 完全能做 ({matchResult.matchable.length} 款)</p>
                    <div className="space-y-2">
                      {matchResult.matchable.map((c, i) => (
                        <Link key={c.eng} to={`/cocktails/${encodeURIComponent(c.eng)}`} className="flex items-center gap-3 bg-[var(--color-bg-card)] border border-green-500/20 rounded-xl p-3 hover:border-[var(--color-accent)] transition-all group">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0"><img src={cocktailImg(c.eng)} alt={c.eng} className="w-full h-full object-cover" /></div>
                          <div className="flex-1 min-w-0"><p className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">{c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}</p></div>
                          <ArrowRight size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {matchResult.partial.length > 0 && (
                  <div>
                    <p className="text-xs text-amber-400 mb-3">⚠ 差一样材料 ({matchResult.partial.length} 款)</p>
                    <div className="space-y-2">
                      {matchResult.partial.map((c, i) => (
                        <Link key={c.eng} to={`/cocktails/${encodeURIComponent(c.eng)}`} className="flex items-center gap-3 bg-[var(--color-bg-card)] border border-amber-500/20 rounded-xl p-3 hover:border-[var(--color-accent)] transition-all group">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0"><img src={cocktailImg(c.eng)} alt={c.eng} className="w-full h-full object-cover" /></div>
                          <div className="flex-1 min-w-0"><p className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">{c.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || c.eng}</p></div>
                          <ArrowRight size={14} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {matchResult.matchable.length === 0 && matchResult.partial.length === 0 && (
                  <p className="text-xs text-[var(--color-text-muted)]">暂时匹配不到，试试添加更多材料</p>
                )}
              </div>
            )}

            {/* 添加材料 */}
            <div className="flex gap-2 mb-3">
              <input value={addIng} onChange={e => setAddIng(e.target.value)}
                placeholder="输入材料名或从下面选择..."
                onKeyDown={e => { if (e.key === "Enter" && addIng.trim()) addBarIngredient(addIng.trim()) }}
                className="flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]" />
              <button onClick={() => addIng.trim() && addBarIngredient(addIng.trim())}
                className="bg-[var(--color-accent)] text-[var(--color-bg-page)] rounded-full px-4 py-2 text-sm font-semibold hover:brightness-110 transition-all">添加</button>
            </div>

            <p className="text-[10px] text-[var(--color-text-muted)] mb-3">常用材料（点击添加，影响匹配）：</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_MATERIALS.filter(i => !barIngs.includes(i)).map(ing => (
                <button key={ing} onClick={() => addBarIngredient(ing)}
                  className="text-[10px] text-[var(--color-text-gray)] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-2.5 py-1 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">{ing}</button>
              ))}
            </div>

            {/* 器具区 */}
            <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
              <h3 className="text-sm text-[var(--color-text-main)] font-serif mb-2 flex items-center gap-2">🛠 调酒器具</h3>
              <p className="text-[10px] text-[var(--color-text-muted)] mb-3">标记你有的工具（不影响匹配，仅供记录）</p>
              <div className="flex flex-wrap gap-2 mb-4 min-h-[24px]">
                {barTools.length === 0 && <p className="text-xs text-[var(--color-text-muted)]">还没有标记任何器具</p>}
                {barTools.map(tool => (
                  <span key={tool} className="flex items-center gap-1 text-xs bg-[var(--color-bg-page)] text-[var(--color-text-gray)] px-3 py-1.5 rounded-full border border-[var(--color-border)] group">
                    {tool}
                    <button onClick={() => {
                      const next = barTools.filter(t => t !== tool)
                      setBarTools(next)
                      localStorage.setItem("barTools", JSON.stringify(next))
                    }} className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors ml-0.5"><X size={10} /></button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_TOOLS.filter(t => !barTools.includes(t)).map(tool => (
                  <button key={tool} onClick={() => {
                    const next = [...barTools, tool].sort()
                    setBarTools(next)
                    localStorage.setItem("barTools", JSON.stringify(next))
                  }}
                    className="text-[10px] text-[var(--color-text-gray)] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-2.5 py-1 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">{tool}</button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ========== 我的酒单 Tab ========== */}
        {activeTab === "playlists" && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-lg text-[var(--color-text-main)] font-serif mb-2 flex items-center gap-2"><ListPlus size={16} className="text-[var(--color-accent)]" /> 我的酒单</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-6">创建自定义酒单：派对、约会、生日、夏日...</p>

            {/* 新建酒单 */}
            <div className="flex gap-2 mb-6">
              <input value={newPlName} onChange={e => setNewPlName(e.target.value)}
                placeholder="酒单名称（如：周末派对）"
                onKeyDown={e => { if (e.key === "Enter") createPlaylist() }}
                className="flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]" />
              <button onClick={createPlaylist} disabled={creatingPl || !newPlName.trim()}
                className="bg-[var(--color-accent)] text-[var(--color-bg-page)] rounded-full px-5 py-2 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-1"><Plus size={14} /> 创建</button>
            </div>

            {playlists.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-muted)] mb-4">还没有创建酒单</p>
                <p className="text-xs text-[var(--color-text-muted)]">创建一个酒单，然后在酒款详情页添加到酒单</p>
              </div>
            ) : (
              <div className="space-y-3">
                {playlists.map(pl => (
                  <div key={pl.id} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 group hover:border-[var(--color-accent)] transition-all">
                    <div className="flex items-start justify-between">
                      <Link to={`/playlist/${pl.id}`} className="flex-1 min-w-0">
                        <h3 className="text-base text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">{pl.name}</h3>
                        {pl.description && <p className="text-xs text-[var(--color-text-muted)] mt-1">{pl.description}</p>}
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-2">{pl.item_count || 0} 款酒</p>
                      </Link>
                      <button onClick={() => deletePlaylist(pl.id)} className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ========== 调酒笔记 Tab ========== */}
        {activeTab === "notes" && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-lg text-[var(--color-text-main)] font-serif mb-2 flex items-center gap-2"><PenLine size={16} className="text-[var(--color-accent)]" /> 我的笔记</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-6">在酒款详情页写的私人笔记</p>

            {notes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-muted)] mb-4">还没有写过笔记</p>
                <Link to="/cocktails" className="text-sm text-[var(--color-accent)] hover:underline flex items-center justify-center gap-1">去酒谱看看 <ArrowRight size={14} /></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((n, i) => (
                  <motion.div key={n.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link to={`/cocktails/${encodeURIComponent(n.cocktail_eng)}`}
                      className="block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-accent)] transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">
                          {n.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || n.cocktail_eng}
                        </h3>
                        <span className="text-[10px] text-[var(--color-text-muted)]">{n.updated_at ? new Date(n.updated_at).toLocaleDateString("zh-CN") : ""}</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-gray)] line-clamp-3 leading-relaxed">{n.body}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  )
}
