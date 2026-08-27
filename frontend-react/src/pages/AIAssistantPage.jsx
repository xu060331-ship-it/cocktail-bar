import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAPI, API_URL } from "../lib/api"
import { useAuth } from "../lib/auth"
import { cocktailHeroImg } from "../lib/images"
import PersonaSwitcher from "../components/PersonaSwitcher"
import { Send, Sparkles, Coffee, Users, Heart, Zap, Smile, Moon, Sun, Wine, ShoppingBag, MessageSquare, SlidersHorizontal } from "lucide-react"

// 快捷提问
const quickQuestions = [
  { icon: Coffee, text: "今天喝什么？", prompt: "我今天想喝一杯，你有什么推荐？" },
  { icon: Zap, text: "Negroni太苦怎么调？", prompt: "Negroni太苦了，怎么调整让它更易入口？" },
  { icon: Smile, text: "我只有伏特加和柠檬", prompt: "我家里只有伏特加和柠檬，能做什么简单的酒？" },
  { icon: Moon, text: "睡前适合喝什么？", prompt: "睡前想喝一杯放松的酒，有什么推荐？低酒精度的。" },
  { icon: Users, text: "聚会做什么酒？", prompt: "朋友聚会，想做一些适合大众口味的鸡尾酒，有什么推荐？" },
  { icon: Heart, text: "适合女生的甜酒推荐", prompt: "推荐几款适合女生的、口感偏甜的鸡尾酒。" },
]

// 心情选项
const moods = [
  { emoji: "😊", label: "开心" },
  { emoji: "😌", label: "放松" },
  { emoji: "😴", label: "疲惫" },
  { emoji: "💕", label: "浪漫" },
  { emoji: "🫠", label: "放空" },
  { emoji: "🎉", label: "庆祝" },
]

// 场景选项
const occasions = [
  { icon: "🏠", label: "独自小酌" },
  { icon: "👥", label: "朋友聚会" },
  { icon: "💑", label: "约会" },
  { icon: "🍽️", label: "佐餐" },
  { icon: "🌙", label: "睡前一杯" },
  { icon: "☀️", label: "夏日午后" },
]

// 口味选项
const tasteOptions = ["清爽", "果香", "酸甜", "甜味", "苦味", "奶油", "烈", "草本", "辛辣"]
const restrictionOptions = ["不含乳制品", "不含蛋清", "不含坚果", "不含咖啡因", "低酒精"]

function MessageBubble({ msg }) {
  const isUser = msg.role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "bg-[var(--color-accent)] text-[var(--color-bg-page)] rounded-br-md"
          : "bg-[var(--color-bg-page)] text-[var(--color-text-gray)] rounded-bl-md border border-[var(--color-border)]"
      }`}>
        {msg.content}
        {msg._fallback && !isUser && (
          <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
            <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">离线模式</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIAssistantPage() {
  const { user } = useAuth()
  const chatEndRef = useRef(null)

  // 聊天状态
  const [personaId, setPersonaId] = useState("xiaojiu")
  const [aiMemory, setAiMemory] = useState(null)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "你好！我是小酒，你的专属调酒师 🍸\n\n想喝点什么？或者随便聊聊调酒的事也可以～" },
  ])
  const [input, setInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  // 自动保存记忆
  function saveMemory(extra = {}, lastUserText = "") {
    if (!user) return
    const token = localStorage.getItem("token")
    const body = { ...extra }
    // 检测用户是否提了心情相关（用传入的最新消息，避免 React 状态延迟）
    const textToCheck = lastUserText || (() => {
      const last = [...messages].reverse().find(m => m.role === "user")
      return last?.content || ""
    })()
    if (textToCheck) {
      const moodWords = ["开心", "难过", "伤心", "疲惫", "累", "焦虑", "兴奋", "放松", "生气", "emo", "低落", "高兴", "压力", "紧张", "无聊"]
      for (const w of moodWords) {
        if (textToCheck.includes(w)) {
          body.last_mood = w
          break
        }
      }
    }
    fetchAPI("/api/ai/memory", {
      method: "PUT",
      body,
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }

  // 推荐表单状态
  const [selectedMood, setSelectedMood] = useState("")
  const [selectedOccasion, setSelectedOccasion] = useState("")
  const [condition, setCondition] = useState("")
  const [selectedTastes, setSelectedTastes] = useState([])
  const [barIngredients, setBarIngredients] = useState([])
  const [nonAlcoholic, setNonAlcoholic] = useState(false)
  const [restrictions, setRestrictions] = useState([])
  const [recommendLoading, setRecommendLoading] = useState(false)
  const [recommendResult, setRecommendResult] = useState(null)

  // 移动端 Tab
  const [mobileTab, setMobileTab] = useState("chat") // "chat" | "recommend"

  // 加载用户吧台材料
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem("token")
    fetchAPI("/api/bar", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => setBarIngredients(data))
      .catch(() => {})
  }, [user])

  // 自动滚动聊天
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送聊天消息（流式 SSE）
  async function sendMessage(text) {
    if (!text?.trim() || chatLoading) return
    const userMsg = { role: "user", content: text.trim() }
    const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setChatLoading(true)

    // 先插入一个空的 assistant 占位消息，后续逐步填充
    const assistantMsg = { role: "assistant", content: "", _fallback: false }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const res = await fetch(`${API_URL}/api/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(() => {
            const token = localStorage.getItem("token")
            return token ? { Authorization: `Bearer ${token}` } : {}
          })(),
        },
        body: JSON.stringify({ messages: allMessages, personaId }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let fullContent = ""
      let isFallback = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith("data:")) continue

          const jsonStr = trimmed.slice(5).trim()
          if (jsonStr === "[DONE]") continue

          try {
            const parsed = JSON.parse(jsonStr)
            if (parsed.content) {
              if (parsed._fallback) isFallback = true
              fullContent += parsed.content
              // 更新最后一条消息
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: "assistant", content: fullContent, _fallback: isFallback }
                return updated
              })
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      console.error("流式对话失败:", err)
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "assistant", content: "抱歉，AI 服务暂时不可用，请稍后再试。😥", _fallback: true }
        return updated
      })
    } finally {
      setChatLoading(false)
      // 自动保存记忆（传入用户最新消息以检测心情）
      saveMemory({}, text.trim())
    }
  }

  // 获取推荐
  async function getRecommendation() {
    if (recommendLoading) return
    setRecommendLoading(true)
    setRecommendResult(null)

    try {
      const data = await fetchAPI("/api/ai/recommend", {
        method: "POST",
        body: {
          mood: selectedMood || undefined,
          occasion: selectedOccasion || undefined,
          condition: condition || undefined,
          restrictions: restrictions.length ? restrictions : undefined,
          tastePrefs: selectedTastes.length > 0 ? selectedTastes : undefined,
          availableIngredients: barIngredients.length > 0 ? barIngredients : undefined,
          nonAlcoholic,
        },
      })
      setRecommendResult(data)
    } catch (err) {
      setRecommendResult({ error: "AI 推荐服务暂时不可用，请稍后再试" })
    } finally {
      setRecommendLoading(false)
      // 自动保存偏好 + 心情
      saveMemory({
        preferred_tastes: selectedTastes.length > 0 ? selectedTastes : undefined,
        preferred_occasions: selectedOccasion ? [selectedOccasion] : undefined,
        last_mood: selectedMood || undefined,
      })
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={28} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <h1 className="text-3xl md:text-4xl text-[var(--color-text-main)] font-serif">AI 调酒助手</h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <PersonaSwitcher
              currentId={personaId}
              onSwitch={setPersonaId}
              onMemoryLoaded={setAiMemory}
            />
          </div>
          {/* 记忆问候 */}
          {aiMemory?.interaction_count > 0 && (
            <p className="text-xs text-[var(--color-text-muted)] mb-1">
              欢迎回来～ 上次你的心情是「{aiMemory.last_mood || "未知"}」，今天想喝点什么特别的吗？
            </p>
          )}
          <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
            基于 126 款经典鸡尾酒配方，AI 为你提供个性化推荐和专业调酒建议
          </p>
        </motion.div>

        {/* 移动端 Tab 切换 */}
        <div className="md:hidden flex mb-6 border-b border-[var(--color-border)]">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex items-center gap-1.5 flex-1 py-3 text-sm text-center border-b-2 transition-colors ${
              mobileTab === "chat" ? "text-[var(--color-accent)] border-[var(--color-accent)]" : "text-[var(--color-text-muted)] border-transparent"
            }`}
          >
            <MessageSquare size={14} strokeWidth={1.5} /> 自由问答
          </button>
          <button
            onClick={() => setMobileTab("recommend")}
            className={`flex items-center gap-1.5 flex-1 py-3 text-sm text-center border-b-2 transition-colors ${
              mobileTab === "recommend" ? "text-[var(--color-accent)] border-[var(--color-accent)]" : "text-[var(--color-text-muted)] border-transparent"
            }`}
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} /> 智能推荐
          </button>
        </div>

        {/* 主体布局 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* ===== 左侧：聊天面板 ===== */}
          <div className={`md:col-span-3 ${mobileTab === "recommend" ? "hidden md:block" : ""}`}>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col h-[70vh] md:h-[75vh]">
              {/* 聊天消息区 */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MessageBubble msg={msg} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 快捷提问（仅初始状态显示） */}
                {messages.length <= 1 && (
                  <div className="mt-6">
                    <p className="text-[10px] text-[var(--color-text-muted)] mb-3 tracking-wide">快捷提问</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickQuestions.map((qq, i) => {
                        const Icon = qq.icon
                        return (
                          <button
                            key={i}
                            onClick={() => sendMessage(qq.prompt)}
                            className="flex items-center gap-2 text-left text-xs text-[var(--color-text-gray)] hover:text-[var(--color-text-main)] bg-[var(--color-bg-page)] hover:bg-[var(--color-accent-dim)] rounded-xl p-3 transition-colors border border-[var(--color-border)]"
                          >
                            <Icon size={14} strokeWidth={1.5} className="text-[var(--color-accent)] shrink-0" />
                            <span className="line-clamp-2">{qq.text}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 加载指示器 */}
                {chatLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full" style={{ animation: "dotPulse 0.8s ease-out infinite", animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full" style={{ animation: "dotPulse 0.8s ease-out infinite", animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full" style={{ animation: "dotPulse 0.8s ease-out infinite", animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* 输入区 */}
              <div className="border-t border-[var(--color-border)] p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                    placeholder="输入调酒问题..."
                    className="flex-1 bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-full px-5 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={chatLoading || !input.trim()}
                    className="bg-[var(--color-accent)] text-[var(--color-bg-page)] rounded-full p-3 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== 右侧：推荐面板 ===== */}
          <div className={`md:col-span-2 ${mobileTab === "chat" ? "hidden md:block" : ""}`}>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <Wine size={16} strokeWidth={1.5} className="text-[var(--color-accent)]" />
                <h3 className="text-base text-[var(--color-text-main)] font-serif">智能推荐</h3>
              </div>

              {/* 心情 */}
              <div className="mb-5">
                <p className="text-xs text-[var(--color-text-muted)] mb-2.5">你的心情</p>
                <div className="grid grid-cols-6 gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setSelectedMood(selectedMood === m.label ? "" : m.label)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all border ${
                        selectedMood === m.label
                          ? "bg-[var(--color-accent-dim)] border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "bg-[var(--color-bg-page)] border-[var(--color-border)] text-[var(--color-text-gray)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <span className="text-[10px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 场景 */}
              <div className="mb-5">
                <p className="text-xs text-[var(--color-text-muted)] mb-2.5">饮用场景</p>
                <div className="grid grid-cols-3 gap-2">
                  {occasions.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => setSelectedOccasion(selectedOccasion === o.label ? "" : o.label)}
                      className={`flex items-center gap-1.5 p-2.5 rounded-xl text-xs transition-all border ${
                        selectedOccasion === o.label
                          ? "bg-[var(--color-accent-dim)] border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "bg-[var(--color-bg-page)] border-[var(--color-border)] text-[var(--color-text-gray)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      <span className="text-sm">{o.icon}</span>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 口味 */}
              <div className="mb-5">
                <p className="text-xs text-[var(--color-text-muted)] mb-2.5">口味偏好（可多选）</p>
                <div className="flex flex-wrap gap-1.5">
                  {tasteOptions.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTastes((prev) =>
                        prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                      )}
                      className={`text-[10px] px-3 py-1.5 rounded-full transition-all border ${
                        selectedTastes.includes(t)
                          ? "bg-[var(--color-accent-dim)] border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "bg-[var(--color-bg-page)] border-[var(--color-border)] text-[var(--color-text-gray)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 身体状态 */}
              <div className="mb-5">
                <p className="text-xs text-[var(--color-text-muted)] mb-2.5">特殊需求</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCondition("")}
                    className={`text-[10px] px-3 py-1.5 rounded-full transition-all border ${
                      !condition
                        ? "bg-[var(--color-accent-dim)] border-[var(--color-accent)] text-[var(--color-accent)]"
                        : "bg-[var(--color-bg-page)] border-[var(--color-border)] text-[var(--color-text-gray)]"
                    }`}
                  >
                    正常
                  </button>
                  <button
                    onClick={() => setCondition("明天要早起")}
                    className={`text-[10px] px-3 py-1.5 rounded-full transition-all border ${
                      condition === "明天要早起"
                        ? "bg-[var(--color-accent-dim)] border-[var(--color-accent)] text-[var(--color-accent)]"
                        : "bg-[var(--color-bg-page)] border-[var(--color-border)] text-[var(--color-text-gray)]"
                    }`}
                  >
                    明天要早起
                  </button>
                  <button
                    onClick={() => setCondition("有点感冒")}
                    className={`text-[10px] px-3 py-1.5 rounded-full transition-all border ${
                      condition === "有点感冒"
                        ? "bg-[var(--color-accent-dim)] border-[var(--color-accent)] text-[var(--color-accent)]"
                        : "bg-[var(--color-bg-page)] border-[var(--color-border)] text-[var(--color-text-gray)]"
                    }`}
                  >
                    有点感冒
                  </button>
                </div>
              </div>

              {/* 无酒精 */}
              <div className="mb-5"><p className="mb-2.5 text-xs text-[var(--color-text-muted)]">忌口与限制</p><div className="flex flex-wrap gap-2">{restrictionOptions.map((item) => <button type="button" key={item} onClick={() => setRestrictions((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item])} className={`rounded-full border px-3 py-1.5 text-[10px] transition-all ${restrictions.includes(item) ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]" : "border-[var(--color-border)] bg-[var(--color-bg-page)] text-[var(--color-text-gray)]"}`}>{item}</button>)}</div></div>
              {/* 无酒精 */}
              <div className="mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nonAlcoholic}
                    onChange={(e) => setNonAlcoholic(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--color-accent)]"
                  />
                  <span className="text-xs text-[var(--color-text-gray)]">只推荐无酒精版本</span>
                </label>
              </div>

              {/* 吧台材料提示 */}
              {barIngredients.length > 0 && (
                <div className="mb-5 bg-[var(--color-bg-page)] rounded-xl p-3 border border-[var(--color-border)]">
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-1">
                    <ShoppingBag size={12} strokeWidth={1.5} className="inline mr-1" />
                    吧台已有材料（{barIngredients.length}种）
                  </p>
                  <p className="text-[10px] text-[var(--color-text-gray)] line-clamp-2">{barIngredients.join("、")}</p>
                </div>
              )}

              {/* 推荐按钮 */}
              <button
                onClick={getRecommendation}
                disabled={recommendLoading}
                className="w-full bg-[var(--color-accent)] text-[var(--color-bg-page)] rounded-full py-3 text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} strokeWidth={1.5} />
                {recommendLoading ? "AI 思考中..." : "获取推荐"}
              </button>

              {/* 推荐结果 */}
              <AnimatePresence>
                {recommendResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5"
                  >
                    {recommendResult.error ? (
                      <p className="text-xs text-red-400 text-center py-4">{recommendResult.error}</p>
                    ) : (
                      <div className="space-y-4">
                        {/* 来源标识 */}
                        <div className="flex items-center gap-2">
                          {recommendResult._fallback ? (
                            <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">规则引擎</span>
                          ) : recommendResult._source === "ai-validated" ? (
                            <span className="text-[9px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">AI 生成 · 已校验</span>
                          ) : (
                            <span className="text-[9px] text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-2 py-0.5 rounded-full">AI 生成</span>
                          )}
                          {recommendResult._filteredCount > 0 && (
                            <span className="text-[9px] text-[var(--color-text-muted)]">过滤 {recommendResult._filteredCount} 条无效推荐</span>
                          )}
                        </div>

                        {/* AI 分析 */}
                        {recommendResult.analysis && (
                          <div className="bg-[var(--color-accent-dim)] rounded-xl p-4">
                            <p className="text-xs text-[var(--color-accent)] tracking-wide mb-1">AI 分析</p>
                            <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">{recommendResult.analysis}</p>
                          </div>
                        )}

                        {/* 推荐列表 */}
                        {recommendResult.recommendations?.length > 0 && (
                          <div>
                            <p className="text-xs text-[var(--color-accent)] tracking-wide mb-2">推荐酒款</p>
                            <div className="space-y-3">
                              {recommendResult.recommendations.map((rec, i) => (
                                <Link
                                  key={rec.eng || i}
                                  to={`/cocktails/${encodeURIComponent(rec.eng)}`}
                                  className="flex gap-3 bg-[var(--color-bg-page)] rounded-xl p-3 border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all group"
                                >
                                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--color-accent-dim)]">
                                    <img src={cocktailHeroImg(rec.eng)} alt={rec.eng} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <h4 className="text-sm text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors truncate">
                                        {rec.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || rec.eng}
                                      </h4>
                                      {rec.matchScore && (
                                        <span className="text-[10px] text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-1.5 py-0.5 rounded-full shrink-0">
                                          {rec.matchScore}%
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-[var(--color-text-muted)] italic truncate">{rec.eng}</p>
                                    {rec.aiReason && (
                                      <p className="text-[10px] text-[var(--color-text-gray)] mt-1 line-clamp-2">{rec.aiReason}</p>
                                    )}
                                    {rec.validation && <div className="mt-2 space-y-0.5 text-[10px] text-[var(--color-text-muted)]"><p className={rec.validation.missingIngredients?.length ? "text-amber-400" : "text-emerald-400"}>{rec.validation.missingIngredients?.length ? `缺少：${rec.validation.missingIngredients.join("、")}` : "材料齐全"}</p><p>{rec.validation.alcohol}</p><p>{rec.validation.balance}</p>{rec.validation.restrictions?.length > 0 && <p className="text-red-400">可能包含忌口：{rec.validation.restrictions.join("、")}</p>}<p>{rec.validation.suitable}</p></div>}
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-3 text-center">
                              <Link
                                to="/search"
                                className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                              >
                                想按口味精确筛选？试试智能搜酒 →
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* 通用建议 */}
                        {recommendResult.generalAdvice && (
                          <div className="bg-[var(--color-bg-page)] rounded-xl p-3 border border-[var(--color-border)]">
                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1">💡 调酒建议</p>
                            <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">{recommendResult.generalAdvice}</p>
                          </div>
                        )}

                        {/* 安全提醒 */}
                        {recommendResult.safetyNote && (
                          <div className="bg-amber-500/5 rounded-xl p-3 border border-amber-500/20">
                            <p className="text-[10px] text-amber-400 leading-relaxed">⚠️ {recommendResult.safetyNote}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
