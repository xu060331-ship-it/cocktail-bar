require("dotenv").config()

// ====== Provider 配置 ======
const PROVIDERS = {
  deepseek: {
    baseURL: "https://api.deepseek.com/v1",
    apiKey: process.env.DEEPSEEK_API_KEY,
    defaultModel: "deepseek-chat",
  },
  qwen: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.QWEN_API_KEY,
    defaultModel: "qwen-turbo",
  },
}

const AI_ENABLED = process.env.AI_ENABLED !== "false"
const AI_PROVIDER = process.env.AI_PROVIDER || "deepseek"
const FALLBACK_PROVIDER = process.env.AI_FALLBACK || "qwen"

// ====== System Prompt（专业版：用于预生成 JSON 内容） ======
const SYSTEM_PROMPT = `你是一位拥有20年经验的资深调酒师和鸡尾酒教育家。你精通IBA官方配方、经典鸡尾酒的历史渊源、精准调酒技术、食材替换原理。

你的回答应该：
1. 专业但不傲慢——用易懂的语言解释复杂概念
2. 精确——提供具体数值（毫升、比例、ABV百分比），不要使用模糊描述
3. 实用——给出家庭调酒师可以立即应用的技巧
4. 中文为主，但保留英文专业术语（如 Dry Shake, Float, ABV, Build）
5. 如果有不确定的地方，诚实说明

格式约束：
- 严禁使用 markdown 语法：禁止 ** 加粗、禁止 * 斜体、禁止反引号代码块
- 酒名直接写中文即可，不要用任何符号包裹`

// ====== 小酒 System Prompt（对话/推荐场景用） ======
const XIAOJIU_SYSTEM_PROMPT = `你是小酒，一位温柔专业的线下资深调酒师，在线下调酒圈摸爬滚打了很多年。你的语气松弛、生活化，像在吧台后面跟客人聊天一样自然。

===== 你的说话风格 =====
- 多用"～"收尾，不用感叹号
- 偶尔用"说实话""讲道理""说真的"这类口语
- 适当加神态：（眨眨眼）（笑）（歪头想了想）（轻轻推过杯子）
- 穿插酒杯、水果类 emoji：🍸🍃🥃💡✨🍹🍊🍋🍯🧊🌿 等，但不要每句都加，自然穿插就好
- 杜绝生硬机器话术，不用"根据您的需求""经过分析"这类套话
- 不使用 markdown 星号加粗、不罗列数字序号清单
- 只用 emoji 做段落区分，不用 1./2./- 这类列表标记
- 新消息简洁凝练，不啰嗦铺垫，不刻意拉长对话

===== 你的知识范围 =====
你熟悉本站 126 款经典鸡尾酒的配方、口感、适配场景、无酒精复刻方案。
你可以聊调酒技法（干摇湿摇、分层、搅拌、捣压）、食材替代、配方改编。
超出调酒领域的问题（编程、时事、医疗建议等），温柔地表示这不是你的领域。

===== 核心交互规则 =====

【规则1：分步提问，严禁一次性甩问卷】
- 用户随口说想喝酒、没有明确偏好：第一轮只问口味（酸甜清爽 / 苦浓厚重 / 果香花香）
- 用户回答后，第二轮再问酒精度偏好（想微醺还是清醒？）
- 第三轮最后确认场景和天气（独酌还是聚会？今天冷不冷？）
- 严禁：一轮把所有问题全部抛出来

【规则2：表单优先，不重复盘问】
如果用户右侧表单已有勾选内容（心情、场景、口味多选、特殊需求、无酒精勾选），直接基于表单参数生成推荐，跳过提问环节。
- 勾选「只推荐无酒精版本」→ 全部推荐无酒精特调，全程不提烈酒基酒
- 特殊需求（早起、感冒）→ 自动规避高度酒、刺激性酒水

【规则3：3类兜底话术】
- 用户说"随便来一杯 / 随便推荐"：立刻出 2 款百搭万能鸡尾酒，跳过所有提问
- 用户不耐烦或不想回答：直接推 2 款大众适口经典酒，不再追问
- 用户只想聊调酒知识（不问推荐）：放下推荐流程，专注科普答疑

【规则4：指名问酒，直接回答】
- 用户问"Margarita 怎么做""Negroni 什么味道""Old Fashioned 的故事"，直接回答配方/口感/故事/手法，跳过推荐流程，但保持小酒语气

【规则5：技术问题，专注科普】
- 用户问"干摇和湿摇有什么区别""没有君度能用什么替代""为什么我分层总是失败"，专注讲解技法原理，不强推酒款

===== 推荐输出格式 =====
收集全信息后，按这个固定结构出推荐：

🍸 酒品名称（中英文）
🍃 风味简述：简短直白形容入口口感、香气，一两句就行
🥃 基础用料：简洁罗列基酒和关键配料
💡 适配贴士：场景、温度、小技巧
✨ 小酒私房话：（可选，只有特别想说的时候才加，比如一个有趣的冷知识或私藏喝法）

段落简短、分行柔和，不堆大段文字。

===== 硬性底线 =====
每次正式推荐酒水结尾，统一加这句轻提醒：
「小提示：请勿过量饮酒，未成年人不可以饮酒哦～」

全程附带温和饮酒提醒。如果用户说"心情不好想喝醉"或类似倾向，温柔劝导不要借酒消愁，推荐清爽低度酒或热饮。`

// ====== 核心调用函数 ======

async function callAI(messages, options = {}) {
  const provider = options.provider || AI_PROVIDER
  const config = PROVIDERS[provider]
  if (!config) throw new Error(`未知的 AI provider: ${provider}`)
  if (!config.apiKey) throw new Error(`${provider} API key 未配置，请在 .env 中设置`)

  const body = {
    model: options.model || config.defaultModel,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2000,
  }

  const res = await fetch(`${config.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "未知错误")
    throw new Error(`${provider} API 返回 ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error(`${provider} 返回内容为空`)
  return content.trim()
}

async function callAIWithRetry(messages, options = {}, retries = 2) {
  let lastError = null

  for (let i = 0; i <= retries; i++) {
    try {
      return await callAI(messages, options)
    } catch (err) {
      lastError = err
      console.error(`AI 调用失败 (第${i + 1}次):`, err.message)

      if (i === retries - 1 && options.provider !== FALLBACK_PROVIDER) {
        console.log(`切换到 fallback provider: ${FALLBACK_PROVIDER}`)
        options = { ...options, provider: FALLBACK_PROVIDER }
      }

      if (i < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
      }
    }
  }

  throw lastError
}

// ====== 流式调用 ======

/**
 * 流式调用 AI API，返回 async generator，逐个 yield content delta 字符串
 * @param {Array<{role: string, content: string}>} messages
 * @param {Object} options
 * @returns {AsyncGenerator<string>}
 */
async function* callAIStream(messages, options = {}) {
  const provider = options.provider || AI_PROVIDER
  const config = PROVIDERS[provider]
  if (!config) throw new Error(`未知的 AI provider: ${provider}`)
  if (!config.apiKey) throw new Error(`${provider} API key 未配置`)

  const body = {
    model: options.model || config.defaultModel,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2000,
    stream: true,
  }

  const res = await fetch(`${config.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "未知错误")
    throw new Error(`${provider} API 返回 ${res.status}: ${errText.slice(0, 200)}`)
  }

  // 读取 SSE 流
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || "" // 保留不完整的行

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith("data:")) continue

        const jsonStr = trimmed.slice(5).trim()
        if (jsonStr === "[DONE]") return

        try {
          const parsed = JSON.parse(jsonStr)
          const delta = parsed?.choices?.[0]?.delta?.content
          if (delta) yield delta
        } catch (_) {
          // 跳过解析失败的行
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// ====== JSON 解析辅助 ======

function extractJSON(text) {
  try { return JSON.parse(text) } catch (_) {}

  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1].trim()) } catch (_) {}
  }

  const brace = text.match(/\{[\s\S]*\}/)
  if (brace) {
    try { return JSON.parse(brace[0]) } catch (_) {}
  }

  return null
}

// ====== 引用白名单校验 ======

/**
 * 校验 AI 推荐结果中的鸡尾酒名是否都在数据库中
 * @param {Array} aiRecommendations - AI 返回的推荐列表
 * @param {Array} validCocktails - 数据库中的鸡尾酒列表
 * @returns {{ valid: Array, invalid: Array, validCount: number, invalidCount: number }}
 */
function validateCitations(aiRecommendations, validCocktails) {
  if (!aiRecommendations?.length) return { valid: [], invalid: [], validCount: 0, invalidCount: 0 }

  const validEngs = new Set(validCocktails.map(c => c.eng))
  const valid = []
  const invalid = []

  for (const rec of aiRecommendations) {
    if (rec.eng && validEngs.has(rec.eng)) {
      valid.push(rec)
    } else {
      invalid.push(rec)
    }
  }

  return { valid, invalid, validCount: valid.length, invalidCount: invalid.length }
}

// ====== 规则引擎降级推荐 ======

/**
 * 当 AI 不可用时，用规则引擎做推荐
 * @param {Object} userContext - { mood, occasion, tastePrefs, availableIngredients, nonAlcoholic }
 * @param {Array} cocktails - 数据库中的全部鸡尾酒
 * @returns {Object} 推荐结果
 */
function ruleBasedRecommend(userContext, cocktails) {
  const { tastePrefs, occasion, availableIngredients, nonAlcoholic, mood } = userContext

  // 口味映射
  const tasteMap = {
    "清爽": ["清爽", "果香", "酸甜"],
    "果香": ["果香", "酸甜", "甜味"],
    "酸甜": ["酸甜", "果香", "清爽"],
    "甜味": ["甜味", "奶油", "果香"],
    "苦味": ["苦味", "草本", "烈"],
    "奶油": ["奶油", "甜味"],
    "烈": ["烈", "苦味", "草本"],
    "草本": ["草本", "清爽", "苦味"],
    "辛辣": ["辛辣", "烈", "草本"],
  }

  // 场景映射
  const occasionMap = {
    "独自小酌": ["餐后", "酒吧特调"],
    "朋友聚会": ["派对", "夏日"],
    "约会": ["餐后", "派对"],
    "佐餐": ["餐前", "餐后"],
    "睡前一杯": ["餐后"],
    "夏日午后": ["夏日", "餐前"],
  }

  // 心情映射
  const moodMap = {
    "开心": ["派对", "夏日"],
    "放松": ["餐后", "餐前"],
    "疲惫": ["清爽", "夏日"],
    "浪漫": ["餐后", "派对"],
    "庆祝": ["派对", "酒吧特调"],
  }

  const scored = cocktails.map(c => {
    let score = c.view_count || 0

    // 口味匹配
    if (tastePrefs?.length && c.taste_tags?.length) {
      const preferSet = new Set(tastePrefs)
      // 扩展偏好口味
      for (const t of tastePrefs) {
        if (tasteMap[t]) tasteMap[t].forEach(x => preferSet.add(x))
      }
      c.taste_tags.forEach(t => {
        if (preferSet.has(t)) score += 30
      })
    }

    // 场景匹配
    if (occasion && c.occasion?.length) {
      const occasionPrefs = occasionMap[occasion] || []
      c.occasion.forEach(o => {
        if (occasionPrefs.includes(o)) score += 20
      })
    }

    // 心情匹配
    if (mood && c.occasion?.length) {
      const moodPrefs = moodMap[mood] || []
      c.occasion.forEach(o => {
        if (moodPrefs.includes(o)) score += 15
      })
    }

    // 材料匹配
    if (availableIngredients?.length && c.ingredients?.length) {
      const myIngs = availableIngredients.map(i => i.toLowerCase())
      c.ingredients.forEach(ing => {
        const ingLower = ing.toLowerCase()
        if (myIngs.some(mi => ingLower.includes(mi) || mi.includes(ingLower))) {
          score += 25
        }
      })
    }

    // 无酒精偏好 → 降低烈酒权重
    if (nonAlcoholic) {
      if (c.taste_tags?.includes("烈")) score -= 30
      if (c.taste_tags?.includes("清爽") || c.taste_tags?.includes("果香")) score += 10
    }

    // 难度惩罚（新手友好加分）
    if (c.difficulty <= 2) score += 5

    return { ...c, _score: score }
  })

  // 排序取 top 5
  scored.sort((a, b) => b._score - a._score)
  const top5 = scored.slice(0, 5)

  return {
    analysis: `（歪头想了想）根据你${[mood, occasion, (tastePrefs||[]).join("、")].filter(Boolean).join("、")}的感觉，我帮你挑了几款～`,
    recommendations: top5.map(c => ({
      eng: c.eng,
      reason: `口感${(c.taste_tags||[]).join("、")}，适合${(c.occasion||[]).join("、")}，难度${["", "新手", "入门", "进阶", "专业"][c.difficulty]}`,
      matchScore: Math.min(100, Math.round(c._score / 1.5)),
      matchDetails: "基于口味、场景、材料综合匹配",
    })),
    generalAdvice: "这几款是我凭经验挑的，试试看，说不定正好对你的胃口～",
    safetyNote: nonAlcoholic ? "帮你挑了低酒精清爽款，喝得舒服不误事～" : "小提示：请勿过量饮酒，未成年人不可以饮酒哦～",
    _fallback: true,
  }
}

// ====== 结构化降级回答模板 ======

/**
 * 聊天场景的降级回答
 */
function fallbackChatReply(question) {
  const q = (question || "").toLowerCase()

  if (q.includes("推荐") || q.includes("喝什么") || q.includes("什么酒")) {
    return `啊，我的脑子刚才短路了一下～（不好意思地擦擦杯子）\n\n不如这样，你去酒谱页面按口味和场景筛选看看？或者点一下"今天喝什么"那个随机按钮，说不定会有惊喜 🍸`
  }

  if (q.includes("怎么做") || q.includes("配方") || q.includes("调制")) {
    return `抱歉抱歉，这会儿我翻不到配方本子～\n\n你去酒谱页面搜一下酒名，每款酒的完整配方和步骤都在上面，比我背的还全呢（笑）`
  }

  return `哎呀，我这边信号不太好～（敲了敲吧台）\n\n稍等一下再试试？或者先去逛逛酒谱页面，126 款经典鸡尾酒的配方都在那儿 🍹`
}

// ====== Prompt 模板函数（保持不变） ======

function generateQuantifiedParamsPrompt(cocktail) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `请为这款鸡尾酒提供精准的量化分析，以 JSON 格式返回：

鸡尾酒名称：${cocktail.chn}（${cocktail.eng}）
原料：${(cocktail.ingredients || []).join("、")}
调制方法：${cocktail.method?.method || "未知"}
杯型：${cocktail.method?.glass || "未知"}
步骤：${(cocktail.method?.steps || []).join(" → ")}

请返回如下 JSON（不要包含 markdown 代码块标记）：
{
  "abv": { "total": "数字%", "base": "数字%", "afterDilution": "数字%", "note": "计算说明" },
  "ratios": [{ "ingredient": "原料名", "amount": "精确毫升", "ratio": "占比百分比", "role": "作用（基酒/调制剂/填充物）" }],
  "dilution": { "iceVolume": "建议冰块量", "meltRate": "融化速度描述", "effectOnAbv": "稀释后酒精度变化", "effectOnSweetness": "对甜度影响" },
  "adjustments": [
    { "scenario": "太甜/太酸/太烈/太淡等", "adjustment": "具体调整方案（包含精确数值）" }
  ]
}

注意：
- ABV 计算要基于标准酒精度（金酒40%、伏特加40%、威士忌40%、朗姆40%、白兰地40%、龙舌兰40%、味美思15-18%、利口酒15-30%）
- 稀释降度约降低 20-33% 原始酒精度
- adjustments 至少提供 3 种调整方案`,
    },
  ]
}

function generateTechniqueDetailPrompt(cocktail) {
  const method = cocktail.method?.method || ""
  const steps = (cocktail.method?.steps || []).join(" → ")

  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `请为这款鸡尾酒提供调制手法详解，以 JSON 格式返回：

鸡尾酒：${cocktail.chn}（${cocktail.eng}）
调制方法：${method}
步骤：${steps}
杯型：${cocktail.method?.glass || "未知"}
使用的原料：${(cocktail.ingredients || []).join("、")}

请返回如下 JSON（不要包含 markdown 代码块标记）：
{
  "primaryTechnique": {
    "name": "主要手法名称",
    "description": "详细手法描述（50-100字）",
    "keyPoints": ["关键要点1", "关键要点2", "关键要点3"],
    "whenToUse": "什么情况下用此手法"
  },
  "techniqueDetails": [
    { "name": "手法名（如干摇Dry Shake）", "description": "操作方式详解", "duration": "建议时长（秒）", "purpose": "目的" }
  ],
  "commonMistakes": [
    { "mistake": "常见错误描述", "consequence": "导致的问题", "fix": "纠正方法" }
  ],
  "proTips": ["专业技巧1", "专业技巧2", "专业技巧3"]
}

注意：
- 摇和法相关酒款务必包含 Dry Shake（干摇）和 Wet Shake（湿摇）的区别说明
- commonMistakes 至少 3 条`,
    },
  ]
}

function generateAdaptationPrompt(cocktail) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `请为这款鸡尾酒提供配方改编思路，以 JSON 格式返回：

鸡尾酒：${cocktail.chn}（${cocktail.eng}）
原料：${(cocktail.ingredients || []).join("、")}
口感标签：${(cocktail.taste_tags || []).join("、")}
难度：${cocktail.difficulty}/4

请返回如下 JSON（不要包含 markdown 代码块标记）：
{
  "spiritSubstitutions": [
    { "original": "原基酒", "alternatives": [{ "spirit": "替代基酒", "flavorChange": "风味变化描述", "recommendation": "推荐度 1-5" }] }
  ],
  "sweetnessAdjustments": [
    { "direction": "更甜", "method": "具体方法（含精确用量）", "note": "注意事项" },
    { "direction": "更干/不甜", "method": "具体方法（含精确用量）", "note": "注意事项" }
  ],
  "nonAlcoholic": {
    "name": "无酒精版名称",
    "substitutions": [{ "original": "原含酒精原料", "replaceWith": "替代无酒精原料", "amount": "用量" }],
    "expectedFlavor": "预期风味描述",
    "note": "注意事项"
  },
  "creativeVariations": [{ "name": "变体名称", "changes": "具体改动", "result": "预期效果" }]
}

注意：
- spiritSubstitutions 至少提供 2 种基酒替换方案
- creativeVariations 至少提供 2 种创意变体`,
    },
  ]
}

function generateSubstitutionsPrompt(cocktail) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `请为这款鸡尾酒的每种原料提供居家替代方案，以 JSON 格式返回：

鸡尾酒：${cocktail.chn}（${cocktail.eng}）
原料：${(cocktail.ingredients || []).join("、")}

请返回如下 JSON（不要包含 markdown 代码块标记）：
{
  "substitutions": [
    {
      "ingredient": "原料名",
      "category": "类别（基酒/利口酒/调制剂/果汁/装饰）",
      "isHardToFind": true/false,
      "alternatives": [
        { "name": "替代品", "priceLevel": "更贵/相当/更便宜", "availability": "超市/酒行/网购", "flavorMatch": "风味相似度 1-5", "note": "使用注意事项" }
      ]
    }
  ],
  "essentialIngredients": ["不可或缺的原料名称"],
  "pantryNote": "家庭调酒建议：哪些原料值得常备"
}

注意：
- 每个原料至少提供 1 个替代方案
- 优先推荐中国超市容易买到的平价替代品`,
    },
  ]
}

function generateCocktailEnhancementPrompt(cocktail) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `请为这款鸡尾酒提供全面的AI深度解析，以 JSON 格式返回（不要包含 markdown 代码块标记）。

===== 鸡尾酒信息 =====
英文名：${cocktail.eng}
中文名：${cocktail.chn}
分类：${cocktail.cat}
原料：${(cocktail.ingredients || []).join("、")}
调制方法：${cocktail.method?.method || "未知"}
杯型：${cocktail.method?.glass || "未知"}
步骤：${(cocktail.method?.steps || []).join(" → ")}
装饰：${cocktail.method?.garnish || "无"}
口感标签：${(cocktail.taste_tags || []).join("、")}
难度：${cocktail.difficulty}/4
饮用场景：${(cocktail.occasion || []).join("、")}
小贴士：${cocktail.tip || "无"}

请返回如下完整 JSON：

{
  "quantified": {
    "abv": { "total": "...", "base": "...", "afterDilution": "...", "note": "..." },
    "ratios": [{ "ingredient": "...", "amount": "...", "ratio": "...", "role": "..." }],
    "dilution": { "iceVolume": "...", "meltRate": "...", "effectOnAbv": "...", "effectOnSweetness": "..." },
    "adjustments": [
      { "scenario": "太甜了", "adjustment": "..." },
      { "scenario": "太烈了", "adjustment": "..." },
      { "scenario": "太酸了", "adjustment": "..." },
      { "scenario": "太淡了", "adjustment": "..." }
    ]
  },
  "technique": {
    "primaryTechnique": { "name": "...", "description": "...", "keyPoints": ["..."], "whenToUse": "..." },
    "techniqueDetails": [{ "name": "...", "description": "...", "duration": "...", "purpose": "..." }],
    "commonMistakes": [{ "mistake": "...", "consequence": "...", "fix": "..." }],
    "proTips": ["..."]
  },
  "adaptation": {
    "spiritSubstitutions": [{ "original": "...", "alternatives": [{ "spirit": "...", "flavorChange": "...", "recommendation": "1-5" }] }],
    "sweetnessAdjustments": [
      { "direction": "更甜", "method": "...", "note": "..." },
      { "direction": "更干", "method": "...", "note": "..." }
    ],
    "nonAlcoholic": { "name": "...", "substitutions": [{ "original": "...", "replaceWith": "...", "amount": "..." }], "expectedFlavor": "...", "note": "..." },
    "creativeVariations": [{ "name": "...", "changes": "...", "result": "..." }]
  },
  "substitutions": {
    "items": [{ "ingredient": "...", "category": "...", "isHardToFind": true/false, "alternatives": [{ "name": "...", "priceLevel": "...", "availability": "...", "flavorMatch": "1-5", "note": "..." }] }],
    "essentialIngredients": ["..."],
    "pantryNote": "..."
  }
}

严格要求：
- 每个数组至少包含 2 个元素
- ABV 计算：标准烈酒40%，味美思15-18%，利口酒15-30%
- 所有数值精确到整数或小数点后一位
- 返回纯 JSON，不要包含 markdown 代码块标记`,
    },
  ]
}

/**
 * 推荐 prompt — 强化引用白名单规则
 */
function generateRecommendationPrompt(userContext, cocktailsSummary) {
  return [
    { role: "system", content: XIAOJIU_SYSTEM_PROMPT + `

===== 本轮的特别说明 =====
当前用户在右侧表单提交了推荐请求。请结合用户参数生成推荐，以 JSON 格式返回。analysis 字段用小酒的口吻写，generalAdvice 和 safetyNote 也用温柔自然的语气。` },
    {
      role: "user",
      content: `请根据用户的实际情况，从可用酒库中推荐最合适的鸡尾酒。

===== 用户情况 =====
心情：${userContext.mood || "未指定"}
身体状态：${userContext.condition || "正常"}
场景：${userContext.occasion || "未指定"}
口味偏好：${(userContext.tastePrefs || []).join("、") || "未指定"}
已有材料：${(userContext.availableIngredients || []).join("、") || "未指定"}
需要无酒精：${userContext.nonAlcoholic ? "是" : "否"}

===== 可用酒库 =====
${cocktailsSummary}

请返回如下 JSON（不要包含 markdown 代码块标记）：
{
  "analysis": "用小酒的语气，根据用户情况做个温柔简短的分析",
  "recommendations": [
    {
      "eng": "鸡尾酒英文名（⚠️ 必须与上面酒库中的英文名完全一致，一字不差！）",
      "reason": "用小酒的语气写推荐理由",
      "matchScore": 95,
      "matchDetails": "材料匹配度说明",
      "suitable": true
    }
  ],
  "generalAdvice": "用小酒的语气写通用调酒建议",
  "safetyNote": "每次推荐结尾的温和饮酒提醒"
}

⚠️ 严格要求：
- 推荐 3-5 款酒
- eng 字段必须与上面酒库中的完全一致，不要编造不存在的鸡尾酒名！
- 如果你不确定某款酒的 eng 是否正确，就不要推荐它
- 返回纯 JSON，不要包含 markdown 代码块标记`,
    },
  ]
}

// ====== 模块导出 ======
module.exports = {
  AI_ENABLED,
  XIAOJIU_SYSTEM_PROMPT,
  callAI,
  callAIWithRetry,
  callAIStream,
  extractJSON,
  validateCitations,
  ruleBasedRecommend,
  fallbackChatReply,
  generateQuantifiedParamsPrompt,
  generateTechniqueDetailPrompt,
  generateAdaptationPrompt,
  generateSubstitutionsPrompt,
  generateCocktailEnhancementPrompt,
  generateRecommendationPrompt,
}
