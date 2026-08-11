import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAPI } from "../lib/api"
import { cocktailImg } from "../lib/images"
import { useAuth } from "../lib/auth"
import { Sparkles, ArrowRight, RotateCw, ArrowLeft, GlassWater, Send } from "lucide-react"

const QUESTIONS = [
  {
    id: "sweetness",
    title: "你喜欢多甜？",
    subtitle: "甜度决定了酒的基调",
    icon: "🍯",
    options: [
      { value: 1, label: "不甜", desc: "干型、利落", emoji: "🍸" },
      { value: 2, label: "微甜", desc: "一点点甜就够", emoji: "🍊" },
      { value: 3, label: "中等", desc: "平衡的甜感", emoji: "🍯" },
      { value: 4, label: "很甜", desc: "甜党万岁", emoji: "🍫" },
    ],
  },
  {
    id: "sourness",
    title: "酸味对你来说？",
    subtitle: "柠檬汁是鸡尾酒的灵魂",
    icon: "🍋",
    options: [
      { value: 1, label: "不要酸", desc: "避开柠檬类", emoji: "😐" },
      { value: 2, label: "微酸", desc: "一点点清爽", emoji: "🍃" },
      { value: 3, label: "中等", desc: "酸甜平衡正好", emoji: "🍋" },
      { value: 4, label: "喜欢酸", desc: "酸得痛快", emoji: "🤤" },
    ],
  },
  {
    id: "bitterness",
    title: "苦味你能接受吗？",
    subtitle: "金巴利和内格罗尼的灵魂就是苦",
    icon: "☕",
    options: [
      { value: 1, label: "完全不行", desc: "苦的都不喝", emoji: "🙅" },
      { value: 2, label: "一点点", desc: "微苦可以接受", emoji: "🤏" },
      { value: 3, label: "中等", desc: "不排斥苦味", emoji: "😌" },
      { value: 4, label: "喜欢苦味", desc: "Negroni 是我的爱", emoji: "🥃" },
    ],
  },
  {
    id: "strength",
    title: "今晚想喝多烈？",
    subtitle: "酒精度决定了这杯酒的走向",
    icon: "💪",
    options: [
      { value: 1, label: "无酒精", desc: "今晚只喝特调", emoji: "🧃" },
      { value: 2, label: "低度", desc: "微醺就好", emoji: "🍹" },
      { value: 3, label: "中等", desc: "该有的度数", emoji: "🍸" },
      { value: 4, label: "高度", desc: "要的就是烈", emoji: "🥃" },
    ],
  },
  {
    id: "texture",
    title: "你想要什么口感？",
    subtitle: "气泡跳跃还是奶油丝滑？",
    icon: "🫧",
    options: [
      { value: "清爽", label: "清爽利落", desc: "干净通透", emoji: "💧" },
      { value: "丝滑", label: "丝滑绵密", desc: "奶油般口感", emoji: "🥛" },
      { value: "厚重", label: "厚重饱满", desc: "有分量感", emoji: "🪨" },
      { value: "气泡", label: "气泡跳跃", desc: "苏打水的感觉", emoji: "🫧" },
    ],
  },
  {
    id: "occasion",
    title: "现在是什么场景？",
    subtitle: "场景对了，酒才对",
    icon: "🎬",
    options: [
      { value: "独自小酌", label: "独自小酌", desc: "一个人的放松时光", emoji: "🏠" },
      { value: "朋友聚会", label: "朋友聚会", desc: "大家一起嗨", emoji: "🎉" },
      { value: "约会", label: "约会", desc: "浪漫的氛围", emoji: "💕" },
      { value: "佐餐", label: "佐餐", desc: "配一顿好饭", emoji: "🍽️" },
      { value: "睡前", label: "睡前一杯", desc: "晚安前的仪式", emoji: "🌙" },
      { value: "夏日", label: "夏日清凉", desc: "对抗炎热的酒", emoji: "☀️" },
    ],
  },
]

const TOTAL_STEPS = QUESTIONS.length

export default function TasteTestPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [started, setStarted] = useState(false)

  const handleAnswer = async (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      // Last question — submit
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAPI("/api/taste-test", {
          method: "POST",
          body: { answers: newAnswers },
        })
        setResult(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
      const prev = { ...answers }
      delete prev[QUESTIONS[step - 1].id]
      setAnswers(prev)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
    setResult(null)
    setError(null)
    setStarted(false)
  }

  const savePreferences = async () => {
    if (!user || !result) return
    const token = localStorage.getItem("token")
    try {
      await fetchAPI("/api/ai/memory", {
        method: "PUT",
        body: {
          preferred_tastes: result.profile.topTastes,
          preferred_occasions: result.profile.preferredOccasions,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (e) { /* silent */ }
  }

  // Start screen
  if (!started && !result) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-md px-5"
        >
          <div className="text-6xl mb-6">🧭</div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)]">TASTE PROFILE</p>
          </div>
          <h1 className="text-4xl text-[var(--color-text-main)] font-serif mb-4">口味测试</h1>
          <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-8">
            6 道选择题，找到你的味蕾密码。
            <br />我们会根据你的口味偏好，推荐最适合你的鸡尾酒。
          </p>
          <button
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg-page)] px-8 py-3.5 rounded-full text-sm font-medium hover:brightness-110 transition-all"
          >
            开始测试
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-4">约 1 分钟 · 6 道题</p>
        </motion.div>
      </div>
    )
  }

  // Results screen
  if (result) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <div className="text-5xl mb-4">🍸</div>
            <h1 className="text-3xl text-[var(--color-text-main)] font-serif mb-3">你的味蕾画像</h1>
            <p className="text-sm text-[var(--color-text-gray)]">{result.profile.summary}</p>
          </motion.div>

          {/* Taste tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {result.profile.topTastes.map((t) => (
              <span key={t} className="text-sm bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-full px-4 py-1.5">
                {t}
              </span>
            ))}
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-[var(--color-accent)] tracking-wide mb-3 text-center">为你推荐</p>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <motion.div
                  key={rec.eng}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <Link
                    to={`/cocktails/${encodeURIComponent(rec.eng)}`}
                    className="flex items-center gap-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-accent)] transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-[var(--color-accent-dim)] overflow-hidden shrink-0">
                      <img src={cocktailImg(rec.eng)} alt={rec.eng} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-base text-[var(--color-text-main)] font-serif group-hover:text-[var(--color-accent)] transition-colors">
                          {rec.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || rec.eng}
                        </h3>
                        <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-2 py-0.5 rounded-full shrink-0">
                          匹配 {rec.matchScore}%
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] italic mb-1">{rec.eng}</p>
                      <div className="flex items-center gap-2">
                        {rec.taste_tags?.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-1.5 py-0.5 rounded-full">{t}</span>
                        ))}
                        {rec.difficulty && (
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {"⭐".repeat(rec.difficulty)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight size={14} strokeWidth={1.5} className="text-[var(--color-accent)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-3 mt-8"
          >
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-full px-5 py-2.5 hover:border-[var(--color-accent)] hover:text-[var(--color-text-main)] transition-all"
            >
              <RotateCw size={13} strokeWidth={1.5} />
              再测一次
            </button>
            {user && (
              <button
                onClick={savePreferences}
                className="flex items-center gap-1.5 text-xs bg-[var(--color-accent)] text-[var(--color-bg-page)] rounded-full px-5 py-2.5 hover:brightness-110 transition-all"
              >
                <Send size={13} strokeWidth={1.5} />
                保存到我的偏好
              </button>
            )}
            <Link
              to="/ai-assistant"
              className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-full px-5 py-2.5 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-page)] transition-all"
            >
              <Sparkles size={13} strokeWidth={1.5} />
              AI 调酒师聊聊
            </Link>
          </motion.div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 text-center mt-6">{error}</p>
          )}
        </div>
      </div>
    )
  }

  // Quiz in progress
  const q = QUESTIONS[step]
  const progress = ((step) / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
      <div className="max-w-lg mx-auto px-5">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
            <span>第 {step + 1} / {TOTAL_STEPS} 题</span>
            {step > 0 && (
              <button onClick={handleBack} className="flex items-center gap-1 hover:text-[var(--color-text-main)] transition-colors">
                <ArrowLeft size={12} strokeWidth={1.5} />
                上一题
              </button>
            )}
          </div>
          <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-accent)] rounded-full"
              initial={{ width: `${((step - 1) / TOTAL_STEPS) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-8">
              <span className="text-5xl block mb-4">{q.icon}</span>
              <h2 className="text-2xl text-[var(--color-text-main)] font-serif mb-2">{q.title}</h2>
              <p className="text-sm text-[var(--color-text-gray)]">{q.subtitle}</p>
            </div>

            <div className="space-y-3">
              {q.options.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(q.id, opt.value)}
                  className={`w-full flex items-center gap-4 bg-[var(--color-bg-card)] border rounded-xl p-5 text-left transition-all hover:border-[var(--color-accent)] ${
                    answers[q.id] === opt.value
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]"
                      : "border-[var(--color-border)]"
                  }`}
                >
                  <span className="text-2xl shrink-0">{opt.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[var(--color-text-main)] text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{opt.desc}</p>
                  </div>
                  {answers[q.id] === opt.value && (
                    <span className="text-[var(--color-accent)] text-xs">✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Loading overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-[var(--color-bg-page)]/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center"
              >
                <GlassWater size={32} strokeWidth={1.5} className="mx-auto mb-4 text-[var(--color-accent)]" />
              </motion.div>
              <p className="text-sm text-[var(--color-text-muted)]">正在调配你的味蕾画像...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
