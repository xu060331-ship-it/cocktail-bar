import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAPI } from "../lib/api"
import { Sparkles, Beaker, BookOpen, Shuffle, ShoppingBag, AlertCircle, RefreshCw } from "lucide-react"

const tabs = [
  { key: "quantified", label: "量化参数", icon: Beaker },
  { key: "technique", label: "手法详解", icon: BookOpen },
  { key: "adaptation", label: "改编思路", icon: Shuffle },
  { key: "substitutions", label: "替代方案", icon: ShoppingBag },
]

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-4 bg-[var(--color-accent-dim)] rounded w-1/3" />
      <div className="h-3 bg-[var(--color-accent-dim)] rounded w-full" />
      <div className="h-3 bg-[var(--color-accent-dim)] rounded w-5/6" />
      <div className="h-3 bg-[var(--color-accent-dim)] rounded w-4/6" />
      <div className="flex gap-3 mt-6">
        <div className="h-16 bg-[var(--color-accent-dim)] rounded-xl flex-1" />
        <div className="h-16 bg-[var(--color-accent-dim)] rounded-xl flex-1" />
        <div className="h-16 bg-[var(--color-accent-dim)] rounded-xl flex-1" />
      </div>
    </div>
  )
}

// --- 量化参数 Tab ---
function QuantifiedTab({ data }) {
  if (!data) return <p className="text-sm text-[var(--color-text-muted)]">暂无数据</p>
  const { abv, ratios, dilution, adjustments } = data

  return (
    <div className="space-y-6">
      {/* ABV 展示 */}
      {abv && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-4">🍸 酒精度分析</h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "原始总ABV", value: abv.total, color: "text-amber-400" },
              { label: "基酒ABV", value: abv.base, color: "text-orange-400" },
              { label: "稀释后约", value: abv.afterDilution, color: "text-blue-400" },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--color-bg-page)] rounded-xl p-4 text-center border border-[var(--color-border)]">
                <p className={`text-2xl font-bold ${item.color}`}>{item.value || "—"}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          {abv.note && <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{abv.note}</p>}
        </div>
      )}

      {/* 精准比例表 */}
      {ratios?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">📐 精准比例</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-2 text-[var(--color-text-muted)] font-normal">原料</th>
                  <th className="text-right py-2 text-[var(--color-text-muted)] font-normal">用量</th>
                  <th className="text-right py-2 text-[var(--color-text-muted)] font-normal">占比</th>
                  <th className="text-right py-2 text-[var(--color-text-muted)] font-normal">作用</th>
                </tr>
              </thead>
              <tbody>
                {ratios.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)]/50">
                    <td className="py-2 text-[var(--color-text-main)]">{r.ingredient}</td>
                    <td className="py-2 text-right text-[var(--color-text-gray)]">{r.amount}</td>
                    <td className="py-2 text-right text-[var(--color-accent)]">{r.ratio}</td>
                    <td className="py-2 text-right text-[var(--color-text-muted)]">{r.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 稀释影响 */}
      {dilution && (
        <div className="bg-[var(--color-bg-page)] rounded-xl p-5 border border-[var(--color-border)]">
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">🧊 冰稀释影响</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[var(--color-text-muted)]">建议冰块量</p>
              <p className="text-[var(--color-text-main)] mt-0.5">{dilution.iceVolume || "—"}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">融化速度</p>
              <p className="text-[var(--color-text-main)] mt-0.5">{dilution.meltRate || "—"}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">对酒精度影响</p>
              <p className="text-[var(--color-text-main)] mt-0.5">{dilution.effectOnAbv || "—"}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">对甜度影响</p>
              <p className="text-[var(--color-text-main)] mt-0.5">{dilution.effectOnSweetness || "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* 调整建议 */}
      {adjustments?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">🔧 微调方案</h4>
          <div className="space-y-2">
            {adjustments.map((adj, i) => (
              <div key={i} className="flex items-start gap-3 bg-[var(--color-bg-page)] rounded-lg p-3 border border-[var(--color-border)]">
                <span className="text-xs text-amber-400 font-bold mt-0.5 shrink-0">{adj.scenario}</span>
                <span className="text-xs text-[var(--color-text-gray)] leading-relaxed">{adj.adjustment}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- 手法详解 Tab ---
function TechniqueTab({ data }) {
  if (!data) return <p className="text-sm text-[var(--color-text-muted)]">暂无数据</p>
  const { primaryTechnique, techniqueDetails, commonMistakes, proTips } = data

  return (
    <div className="space-y-6">
      {/* 主要手法 */}
      {primaryTechnique && (
        <div className="bg-[var(--color-bg-page)] rounded-xl p-5 border border-[var(--color-border)]">
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">🎯 核心手法：{primaryTechnique.name}</h4>
          <p className="text-sm text-[var(--color-text-gray)] leading-relaxed mb-3">{primaryTechnique.description}</p>
          {primaryTechnique.keyPoints?.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {primaryTechnique.keyPoints.map((kp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-gray)]">
                  <span className="text-[var(--color-accent)] mt-0.5">●</span>
                  {kp}
                </li>
              ))}
            </ul>
          )}
          {primaryTechnique.whenToUse && (
            <p className="text-xs text-[var(--color-text-muted)]">💡 {primaryTechnique.whenToUse}</p>
          )}
        </div>
      )}

      {/* 手法详情 */}
      {techniqueDetails?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">📋 手法分解</h4>
          <div className="space-y-3">
            {techniqueDetails.map((td, i) => (
              <div key={i} className="bg-[var(--color-bg-page)] rounded-xl p-4 border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm text-[var(--color-text-main)] font-serif">{td.name}</h5>
                  {td.duration && <span className="text-[10px] text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-2 py-0.5 rounded-full">{td.duration}</span>}
                </div>
                <p className="text-xs text-[var(--color-text-gray)] leading-relaxed mb-1">{td.description}</p>
                {td.purpose && <p className="text-[10px] text-[var(--color-text-muted)]">目的：{td.purpose}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 常见错误 */}
      {commonMistakes?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">⚠️ 常见失误</h4>
          <div className="space-y-2">
            {commonMistakes.map((cm, i) => (
              <div key={i} className="bg-[var(--color-bg-page)] rounded-lg p-4 border border-[var(--color-border)]">
                <p className="text-xs text-red-400 mb-1">❌ {cm.mistake}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mb-1">后果：{cm.consequence}</p>
                <p className="text-xs text-green-400">✅ {cm.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 专业技巧 */}
      {proTips?.length > 0 && (
        <div className="bg-[var(--color-accent-dim)] rounded-xl p-5">
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">⭐ 专业技巧</h4>
          <ul className="space-y-2">
            {proTips.map((tip, i) => (
              <li key={i} className="text-xs text-[var(--color-text-gray)] leading-relaxed flex items-start gap-2">
                <span className="text-[var(--color-accent)] font-bold">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// --- 改编思路 Tab ---
function AdaptationTab({ data }) {
  if (!data) return <p className="text-sm text-[var(--color-text-muted)]">暂无数据</p>
  const { spiritSubstitutions, sweetnessAdjustments, nonAlcoholic, creativeVariations } = data

  return (
    <div className="space-y-6">
      {/* 基酒替换 */}
      {spiritSubstitutions?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">🔄 基酒替换</h4>
          {spiritSubstitutions.map((ss, i) => (
            <div key={i} className="bg-[var(--color-bg-page)] rounded-xl p-4 border border-[var(--color-border)] mb-3">
              <p className="text-xs text-[var(--color-text-muted)] mb-2">原基酒：<span className="text-[var(--color-text-main)]">{ss.original}</span></p>
              <div className="space-y-2">
                {ss.alternatives?.map((alt, j) => (
                  <div key={j} className="flex items-center justify-between bg-[var(--color-bg-card)] rounded-lg p-2.5">
                    <div>
                      <p className="text-xs text-[var(--color-text-main)]">{alt.spirit}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{alt.flavorChange}</p>
                    </div>
                    <span className="text-[10px] text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-2 py-0.5 rounded-full">
                      {"⭐".repeat(Math.min(5, alt.recommendation || 3))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 甜度调整 */}
      {sweetnessAdjustments?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">🍯 甜度调整</h4>
          <div className="space-y-2">
            {sweetnessAdjustments.map((sa, i) => (
              <div key={i} className="bg-[var(--color-bg-page)] rounded-lg p-4 border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    sa.direction === "更甜" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                  }`}>{sa.direction}</span>
                </div>
                <p className="text-xs text-[var(--color-text-gray)] leading-relaxed mb-1">{sa.method}</p>
                {sa.note && <p className="text-[10px] text-[var(--color-text-muted)]">{sa.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 无酒精版本 */}
      {nonAlcoholic && (
        <div className="bg-green-500/5 rounded-xl p-5 border border-green-500/20">
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">🌿 无酒精版本：{nonAlcoholic.name}</h4>
          {nonAlcoholic.substitutions?.length > 0 && (
            <div className="space-y-2 mb-3">
              {nonAlcoholic.substitutions.map((ns, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-red-400 line-through">{ns.original}</span>
                  <span className="text-[var(--color-text-muted)]">→</span>
                  <span className="text-green-400">{ns.replaceWith}</span>
                  <span className="text-[var(--color-text-muted)]">{ns.amount}</span>
                </div>
              ))}
            </div>
          )}
          {nonAlcoholic.expectedFlavor && <p className="text-xs text-[var(--color-text-gray)] mb-1">{nonAlcoholic.expectedFlavor}</p>}
          {nonAlcoholic.note && <p className="text-[10px] text-[var(--color-text-muted)]">{nonAlcoholic.note}</p>}
        </div>
      )}

      {/* 创意变体 */}
      {creativeVariations?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">✨ 创意变体</h4>
          <div className="space-y-3">
            {creativeVariations.map((cv, i) => (
              <div key={i} className="bg-[var(--color-bg-page)] rounded-xl p-4 border border-[var(--color-border)]">
                <h5 className="text-sm text-[var(--color-text-main)] font-serif mb-1">{cv.name}</h5>
                <p className="text-xs text-[var(--color-text-gray)] leading-relaxed mb-1">{cv.changes}</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">效果：{cv.result}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- 替代方案 Tab ---
function SubstitutionsTab({ data }) {
  if (!data) return <p className="text-sm text-[var(--color-text-muted)]">暂无数据</p>
  const { items, essentialIngredients, pantryNote } = data

  return (
    <div className="space-y-6">
      {/* 各原料替代方案 */}
      {items?.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-3">🛒 原料替代指南</h4>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="bg-[var(--color-bg-page)] rounded-xl p-4 border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-sm text-[var(--color-text-main)] font-serif">{item.ingredient}</h5>
                    <span className="text-[10px] text-[var(--color-text-muted)]">{item.category}</span>
                  </div>
                  {item.isHardToFind && (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">难买</span>
                  )}
                </div>
                {item.alternatives?.length > 0 && (
                  <div className="space-y-2">
                    {item.alternatives.map((alt, j) => (
                      <div key={j} className="flex items-center justify-between bg-[var(--color-bg-card)] rounded-lg p-2.5">
                        <div className="flex-1">
                          <p className="text-xs text-[var(--color-text-main)]">{alt.name}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">{alt.note}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-[var(--color-text-muted)]">{alt.priceLevel}</span>
                          <span className="text-[10px] text-[var(--color-accent)]">⭐{alt.flavorMatch}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 不可或缺 */}
      {essentialIngredients?.length > 0 && (
        <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20">
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-2">⚠️ 灵魂原料（不建议替换）</h4>
          <div className="flex flex-wrap gap-2">
            {essentialIngredients.map((ei, i) => (
              <span key={i} className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">{ei}</span>
            ))}
          </div>
        </div>
      )}

      {/* 家庭常备建议 */}
      {pantryNote && (
        <div className="bg-[var(--color-accent-dim)] rounded-xl p-4">
          <h4 className="text-sm text-[var(--color-text-main)] font-serif mb-2">🏠 家庭常备建议</h4>
          <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">{pantryNote}</p>
        </div>
      )}
    </div>
  )
}

// --- 主组件 ---
export default function AIDeepAnalysis({ cocktailEng, cocktailData }) {
  const [enhancement, setEnhancement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("quantified")

  useEffect(() => {
    if (!cocktailEng) return
    setLoading(true)
    setError(null)

    fetchAPI(`/api/ai/enhancement/${encodeURIComponent(cocktailEng)}`)
      .then((data) => {
        setEnhancement(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || "加载失败")
        setLoading(false)
      })
  }, [cocktailEng])

  // 根据鸡尾酒的主要手法推荐默认 tab
  useEffect(() => {
    if (!cocktailData?.method?.method) return
    const method = cocktailData.method.method
    if (method.includes("摇")) setActiveTab("technique")
    else if (method.includes("直调")) setActiveTab("quantified")
    else if (method.includes("搅拌")) setActiveTab("technique")
  }, [cocktailData])

  const ActiveIcon = tabs.find(t => t.key === activeTab)?.icon || Sparkles

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
    >
      {/* 头部 */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
          <h2 className="text-xl text-[var(--color-text-main)] font-serif">AI 深度解析</h2>
          <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">AI 生成</span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">基于 {cocktailData?.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || cocktailEng} 的配方数据，AI 提供专业知识补充</p>
      </div>

      {/* Tab 导航 */}
      <div className="px-8 pt-6">
        <div className="flex overflow-x-auto gap-1 border-b border-[var(--color-border)] pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-xs transition-all border-b-2 -mb-px ${
                  isActive
                    ? "text-[var(--color-accent)] border-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-gray)]"
                }`}
              >
                <Icon size={13} strokeWidth={1.5} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab 内容 */}
      <div className="px-8 py-6 min-h-[200px]">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle size={32} strokeWidth={1} className="text-[var(--color-text-muted)] mb-3" />
            <p className="text-sm text-[var(--color-text-muted)] mb-1">AI 内容暂无法加载</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mb-4">可能是网络问题或 AI 服务暂时不可用</p>
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                fetchAPI(`/api/ai/enhancement/${encodeURIComponent(cocktailEng)}`)
                  .then((data) => { setEnhancement(data); setLoading(false) })
                  .catch((err) => { setError(err.message); setLoading(false) })
              }}
              className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] hover:underline"
            >
              <RefreshCw size={12} strokeWidth={1.5} />
              重试
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "quantified" && <QuantifiedTab data={enhancement?.quantified} />}
              {activeTab === "technique" && <TechniqueTab data={enhancement?.technique} />}
              {activeTab === "adaptation" && <AdaptationTab data={enhancement?.adaptation} />}
              {activeTab === "substitutions" && <SubstitutionsTab data={enhancement?.substitutions} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-8 pb-4">
        <p className="text-[9px] text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3">
          ⚠️ AI 生成内容仅供参考，实际调酒结果可能因品牌、手法、原料差异而有所不同。
        </p>
      </div>
    </motion.section>
  )
}
