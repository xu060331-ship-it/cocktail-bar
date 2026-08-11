import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Check, BookOpen, Compass, GlassWater, Flame, MessageCircle, Search, ChevronDown, ChevronUp, Star } from "lucide-react"

const STAGES = [
  {
    id: "taste",
    icon: Compass,
    emoji: "🧭",
    title: "认识你的味蕾",
    subtitle: "先搞清楚自己喜欢什么，才知道该喝什么",
    color: "#c9a96e",
    steps: [
      {
        id: "taste_test",
        label: "完成口味测试，找到你的味蕾画像",
        action: { type: "link", to: "/taste-test", text: "去做测试 →" },
      },
      {
        id: "taste_read",
        label: "阅读百科：了解「餐前酒 vs 餐后酒」的区别",
        action: { type: "link", to: "/encyclopedia", text: "去百科 →" },
      },
      {
        id: "taste_save",
        label: "把口味偏好保存到 AI 记忆（登录后自动提示）",
        action: null,
      },
    ],
  },
  {
    id: "technique",
    icon: GlassWater,
    emoji: "🔧",
    title: "掌握基础手法",
    subtitle: "Shake、Stir、Build——三个词覆盖90%的鸡尾酒",
    color: "#8b9dc3",
    steps: [
      {
        id: "tech_shake",
        label: "阅读百科：了解「摇和法（Shake）」的原理和技巧",
        action: { type: "encyclopedia", to: "/encyclopedia", category: "technique", text: "去百科看手法 →" },
      },
      {
        id: "tech_stir",
        label: "阅读百科：了解「搅拌法（Stir）」和「直调法（Build）」",
        action: { type: "encyclopedia", to: "/encyclopedia", category: "technique", text: "去百科看手法 →" },
      },
      {
        id: "tech_cards",
        label: "用学习卡片刷 10 道手法题，巩固记忆",
        action: { type: "link", to: "/learn", text: "去刷卡片 →" },
      },
    ],
  },
  {
    id: "spirits",
    icon: Flame,
    emoji: "🥃",
    title: "了解六大基酒",
    subtitle: "金酒、伏特加、朗姆、龙舌兰、威士忌、白兰地——每款基酒都是一个世界",
    color: "#d4a574",
    steps: [
      {
        id: "spirits_browse",
        label: "浏览基酒百科页面，了解每款基酒的风味特征",
        action: { type: "link", to: "/spirits", text: "去基酒百科 →" },
      },
      {
        id: "spirits_gin",
        label: "精读「金酒」（Gin）——鸡尾酒最常见的基酒",
        action: { type: "link", to: "/spirits/gin", text: "了解金酒 →" },
      },
      {
        id: "spirits_cards",
        label: "用学习卡片刷 5 道基酒知识题",
        action: { type: "link", to: "/learn", text: "去刷卡片 →" },
      },
    ],
  },
  {
    id: "ordering",
    icon: MessageCircle,
    emoji: "📖",
    title: "学会点酒",
    subtitle: "Dry、Up、Neat、On the Rocks——记住这些词，在任何酒吧都能点出你想要的",
    color: "#7eb8a0",
    steps: [
      {
        id: "order_terms",
        label: "阅读百科术语词条：Dry / Up / On the Rocks / Neat",
        action: { type: "encyclopedia", to: "/encyclopedia", category: "terminology", text: "去百科学术语 →" },
      },
      {
        id: "order_cards",
        label: "用学习卡片刷完「术语」分类的全部卡片",
        action: { type: "link", to: "/learn", text: "去刷术语卡 →" },
      },
      {
        id: "order_search",
        label: "在智能搜酒里尝试用自然语言描述你想要的风味",
        action: { type: "link", to: "/search", text: "去搜酒 →" },
      },
    ],
  },
  {
    id: "make",
    icon: Star,
    emoji: "🍸",
    title: "调出你的第一杯酒",
    subtitle: "理论全会了，该动手了——从最简单的酒开始",
    color: "#e87890",
    steps: [
      {
        id: "make_classic",
        label: "阅读百科「经典名酒」分类，选一款你最感兴趣的",
        action: { type: "encyclopedia", to: "/encyclopedia", category: "classics", text: "去百科看经典名酒 →" },
      },
      {
        id: "make_ai",
        label: "和 AI 调酒师聊聊，让它根据你的口味推荐第一杯酒",
        action: { type: "link", to: "/ai-assistant", text: "去找 AI 调酒师 →" },
      },
      {
        id: "make_search",
        label: "搜索「我家有哪些材料能做什么酒」，看看你的酒柜能做出什么",
        action: { type: "link", to: "/search", text: "去搜酒 →" },
      },
    ],
  },
]

const STORAGE_KEY = "cocktail_learning_progress"

export default function GettingStartedPage() {
  const [progress, setProgress] = useState({})
  const [expandedStage, setExpandedStage] = useState("taste")

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setProgress(JSON.parse(saved))
    } catch (e) { /* ignore */ }
  }, [])

  // Save progress
  const saveProgress = (newProgress) => {
    setProgress(newProgress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
  }

  const toggleStep = (stageId, stepId) => {
    const key = `${stageId}:${stepId}`
    const newProgress = { ...progress, [key]: !progress[key] }
    saveProgress(newProgress)
  }

  // Calculate totals
  const totalSteps = STAGES.reduce((sum, s) => sum + s.steps.length, 0)
  const completedSteps = STAGES.reduce((sum, s) =>
    sum + s.steps.filter(step => progress[`${s.id}:${step.id}`]).length, 0
  )
  const overallPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  // Check if a stage is fully completed
  const isStageComplete = (stageId) => {
    const stage = STAGES.find(s => s.id === stageId)
    if (!stage) return false
    return stage.steps.every(step => progress[`${stageId}:${step.id}`])
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-main)] font-serif pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
            <p className="text-xs tracking-[0.3em] text-[var(--color-accent)]">NEWBIE GUIDE</p>
          </div>
          <h1 className="text-5xl text-[var(--color-text-main)] font-serif mb-3">新手入门</h1>
          <p className="text-[var(--color-text-gray)] text-lg leading-relaxed">
            从零开始，五步走进鸡尾酒的世界。每完成一步就勾掉——像打游戏通关一样。
          </p>
        </motion.div>

        {/* Overall progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-text-main)] font-serif">总体进度</span>
            <span className="text-sm text-[var(--color-accent)]">{completedSteps}/{totalSteps} 步 · {overallPercent}%</span>
          </div>
          <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-accent)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          {overallPercent === 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[var(--color-accent)] text-center mt-4"
            >
              🎉 恭喜！你已经完成了新手入门全部课程——现在你是懂酒的人了。
            </motion.p>
          )}
        </motion.div>

        {/* Stages */}
        <div className="space-y-4">
          {STAGES.map((stage, stageIndex) => {
            const complete = isStageComplete(stage.id)
            const stageCompleted = stage.steps.filter(s => progress[`${stage.id}:${s.id}`]).length
            const isExpanded = expandedStage === stage.id

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + stageIndex * 0.06 }}
                className={`bg-[var(--color-bg-card)] border rounded-2xl overflow-hidden transition-all ${
                  complete ? "border-emerald-500/30" : "border-[var(--color-border)]"
                }`}
              >
                {/* Stage header */}
                <button
                  onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                  className="w-full p-6 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                    style={{ background: `${stage.color}15` }}
                  >
                    {complete ? "✅" : stage.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-lg text-[var(--color-text-main)] font-serif">{stage.title}</h3>
                      {complete && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                          已完成
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{stage.subtitle}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                      {stageCompleted}/{stage.steps.length} 步完成
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} strokeWidth={1.5} className="text-[var(--color-text-muted)] shrink-0" />
                  ) : (
                    <ChevronDown size={18} strokeWidth={1.5} className="text-[var(--color-text-muted)] shrink-0" />
                  )}
                </button>

                {/* Stage steps */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-1 border-t border-[var(--color-border)] pt-4">
                        {stage.steps.map((step, i) => {
                          const stepKey = `${stage.id}:${step.id}`
                          const done = !!progress[stepKey]

                          return (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all ${
                                done ? "bg-emerald-500/5" : "hover:bg-white/[0.02]"
                              }`}
                            >
                              {/* Checkbox */}
                              <button
                                onClick={() => toggleStep(stage.id, step.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  done
                                    ? "bg-emerald-500 border-emerald-500"
                                    : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                                }`}
                              >
                                {done && <Check size={12} strokeWidth={3} className="text-[var(--color-text-main)]" />}
                              </button>

                              {/* Label */}
                              <span className={`text-sm flex-1 ${done ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-gray)]"}`}>
                                {step.label}
                              </span>

                              {/* Action link */}
                              {step.action && (
                                <Link
                                  to={step.action.to}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs text-[var(--color-accent)] hover:underline shrink-0 flex items-center gap-1"
                                >
                                  {step.action.text}
                                  <ArrowRight size={11} strokeWidth={1.5} />
                                </Link>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-[var(--color-border)]"
        >
          <p className="text-xs text-[var(--color-text-muted)] text-center mb-5">学习工具箱</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/taste-test", icon: Compass, label: "口味测试" },
              { to: "/encyclopedia", icon: BookOpen, label: "调酒百科" },
              { to: "/learn", icon: Star, label: "学习卡片" },
              { to: "/ai-assistant", icon: MessageCircle, label: "AI 调酒师" },
              { to: "/search", icon: Search, label: "智能搜酒" },
            ].map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="flex items-center gap-2 text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full px-4 py-2 hover:border-[var(--color-accent)] hover:text-[var(--color-text-main)] transition-all text-[var(--color-text-muted)]"
              >
                <tool.icon size={13} strokeWidth={1.5} />
                {tool.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-[10px] text-[var(--color-text-muted)]">
            进度保存在本地浏览器中 · 不会丢失
          </p>
        </div>
      </div>
    </div>
  )
}
