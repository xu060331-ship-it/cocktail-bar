# AI 功能开发记录 —— 调酒百科

> 记录 AI 模块全流程：API 选型、提示词设计、流式输出、引用校验、降级策略、角色系统、记忆系统

---

## 一、AI 提供商选型

| 维度 | DeepSeek V3 | 通义千问 Qwen-Turbo |
|------|-------------|---------------------|
| 输入价格 | ¥0.14 / 百万 token | 免费额度 100万 token/月 |
| 输出价格 | ¥0.28 / 百万 token | 同上 |
| 国内访问 | ✅ 无需 VPN | ✅ 无需 VPN |
| 中文质量 | 优秀 | 优秀 |
| API 协议 | OpenAI 兼容 | OpenAI 兼容 |
| 模型 ID | `deepseek-chat` | `qwen-turbo` |

**最终方案**：DeepSeek V3 主力 + 通义千问 fallback。学生项目每月成本 < ¥1。

---

## 二、架构设计

```
frontend-react/src/
├── components/
│   ├── AIDeepAnalysis.jsx    # 详情页 AI 深度解析（4个Tab）
│   └── PersonaSwitcher.jsx   # AI 角色切换器
├── pages/
│   ├── AIAssistantPage.jsx   # AI 调酒助手（聊天+推荐）
│   └── TasteTestPage.jsx      # 口味测试（规则引擎）

backend/
├── ai.js                     # AI 核心模块
├── ai-personas.js            # 角色定义库
├── server.js                 # API 端点
├── update-ai-enhancements.js # ai_enhancements 表迁移
├── update-ai-memory.js       # user_ai_memory 表迁移
└── generate-ai-enhancements.js # 批量预生成 126 款酒分析
```

---

## 三、核心模块：`backend/ai.js`

### 3.1 主要函数

| 函数 | 用途 |
|------|------|
| `callAI(messages, options)` | 统一 AI 调用（DeepSeek → 通义千问 fallback） |
| `callAIWithRetry(messages, retries)` | 带重试的 AI 调用 |
| `callAIStream(messages)` | SSE 流式输出（async generator） |
| `extractJSON(text)` | 从 AI 回复中提取 JSON（容错解析） |
| `validateCitations(recommendations)` | 引用校验：AI 推荐的酒名是否在数据库中存在 |
| `ruleBasedRecommend(ctx)` | 规则引擎降级推荐（口味+场景+心情+材料匹配打分） |
| `fallbackChatReply(text)` | AI 不可用时的兜底回复（小酒人格） |

### 3.2 Prompt 模板

| 函数 | 用途 |
|------|------|
| `generateCocktailEnhancementPrompt(c)` | 预生成 4 模块分析（量化参数+手法+改编+替代） |
| `generateRecommendationPrompt(ctx)` | 结构化推荐（心情/场景/口味/材料 → 5款酒） |
| `XIAOJIU_SYSTEM_PROMPT` | 小酒人设（2000字，温柔知性女调酒师） |

### 3.3 所有 Prompt 的格式硬性约束

```
严禁使用 markdown 语法：
- 禁止 ** 加粗
- 禁止 * 斜体
- 禁止反引号代码块
- 禁止 # 标题
- 酒名直接写中文名，不要用符号包裹
- 只用 emoji 做段落区分，不用数字或符号列表
```

原因：AI 回复直接展示在聊天框，markdown 格式在纯文本中显得很乱。

---

## 四、角色系统：`backend/ai-personas.js`

### 4.1 四个角色

| ID | 名称 | 风格 | 说话特点 |
|----|------|------|---------|
| `xiaojiu` | 🍸 小酒 | 温柔知性 | 语气松弛、多用「～」、神态描写、生活化 |
| `laolin` | 🥃 老林 | 老派硬核 | 直来直去、叫「小伙子」「姑娘」、句句干货 |
| `tianxin` | 🍹 甜心 | 活泼甜美 | 元气满满、爱用语气词、擅长果味和无酒精 |
| `jiaoshou` | 📚 教授 | 学术严谨 | 严谨准确、从原理讲起、精于历史和化学 |

### 4.2 共享规则（SHARED_RULES）

所有角色共同遵守的 5 条交互规则：

1. **分步提问**：禁止一轮把所有问题全抛出来
2. **表单优先**：用户右侧表单已有勾选 → 跳过提问直接推荐
3. **3 类兜底**：说「随便」→立刻推2款 / 不耐烦→直接推 / 聊知识→专注科普
4. **指名问酒**：直接回答，跳过推荐问卷
5. **技术问题**：专注科普，不强推酒款

### 4.3 设计思路

- 每个 `persona.systemPrompt` 定义该角色的独特性格
- `SHARED_RULES` 作为公共规则追加到所有角色 prompt 末尾
- `getPersona(id)` 返回 `{ ...persona, fullPrompt: systemPrompt + SHARED_RULES }`
- 规则确保 AI 行为可控——不管什么性格，交互逻辑是一致的

---

## 五、流式输出（SSE）

### 5.1 实现

```js
// backend/ai.js
async function* callAIStream(messages) {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "deepseek-chat", messages, stream: true }),
  })
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6)
        if (data === "[DONE]") return
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content
        if (content) yield content
      }
    }
  }
}

// server.js SSE 端点
app.post("/api/ai/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  // ...
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
  }
  res.write("data: [DONE]\n\n")
  res.end()
})
```

### 5.2 前端消费

```js
// AIAssistantPage.jsx
const response = await fetch(`${API_URL}/api/ai/chat/stream`, {
  method: "POST",
  body: JSON.stringify({ messages, personaId }),
})
const reader = response.body.getReader()
const decoder = new TextDecoder()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value)
  // 解析 SSE 格式，逐字追加到聊天消息
}
```

---

## 六、引用校验与降级策略

### 6.1 引用校验（validateCitations）

问题：AI 可能推荐数据库中不存在的鸡尾酒（幻觉）。

方案：
```
1. AI 返回推荐列表
2. 提取所有酒名 → 在 cocktails 表查询
3. 过滤：只保留 eng 或 chn 匹配数据库的酒
4. 无效推荐加标记 _filteredCount，前端显示
```

### 6.2 降级链路

```
AI 推荐请求
  ↓ 失败
规则引擎 ruleBasedRecommend()  ← 口味+场景+心情+材料 打分匹配
  ↓ 也失败
fallbackChatReply()           ← 小酒人格兜底回复
  ↓ 聊天也失败
前端显示「离线模式」         ← 用户侧感知
```

### 6.3 规则引擎打分算法

```js
function ruleBasedRecommend(ctx) {
  // 口味匹配 +30 分
  // 场景匹配 +20 分
  // 心情匹配 +15 分
  // 吧台材料匹配 +25 分
  // 难度加分 +5 分（新手更多、高手不过滤）
  // view_count 对数加权
  // 随机因子（避免总返回同样的酒）
}
```

---

## 七、用户记忆系统

### 7.1 数据库

```sql
CREATE TABLE user_ai_memory (
  user_id INTEGER UNIQUE REFERENCES users(id),
  preferred_tastes TEXT[],        -- ["酸甜", "清爽"]
  preferred_occasions TEXT[],     -- ["派对", "夏日"]
  preferred_persona VARCHAR(50),  -- "xiaojiu"
  mood_history JSONB,             -- [{mood:"开心", at:"..."}, ...]
  interaction_count INTEGER DEFAULT 0,
  last_mood VARCHAR(50),
  last_interaction_at TIMESTAMP
)
```

### 7.2 记忆机制

- **自动检测心情**：从用户聊天文本中识别关键词（开心/难过/疲惫/焦虑...15个词）
- **每次互动后自动保存**：聊天 finally → `saveMemory({}, userText)`；推荐 finally → `saveMemory({ tastes, occasions })`
- **跨会话持久化**：存在 PostgreSQL，刷新/关浏览器后还在
- **React 闭包陷阱**：saveMemory 接受 `lastUserText` 参数（不依赖 state），解决异步 setState 时序问题

### 7.3 个性化每日推荐

```js
// GET /api/daily?date=YYYY-MM-DD
// 已登录 + 有记忆 → 加权评分：
// 口味匹配 +30 / 场景匹配 +20 / 心情匹配 +15 / 难度匹配 +10
// 未登录 → MD5 日期确定性随机（原有逻辑）
```

---

## 八、AI 深度解析

### 8.1 四个模块

| Tab | 内容 | 数据来源 |
|-----|------|---------|
| 📊 量化参数 | ABV 进度条、精确比例表、稀释影响、调整建议 | AI 生成 → ai_enhancements.quantified |
| 🔧 手法详解 | 调制手法、步骤细节、常见错误 ❌→✅、进阶技巧 | AI 生成 → ai_enhancements.technique |
| 🔄 改编思路 | 基酒替换表、甜度调整、无酒精改造方案 | AI 生成 → ai_enhancements.adaptation |
| 🛒 替代方案 | 每种原料的平价替代品（价格/可得性/风味相似度） | AI 生成 → ai_enhancements.substitutions |

### 8.2 缓存策略

- 首次访问：调用 AI 生成 → 存入 `ai_enhancements` 表 → 返回前端
- 再次访问：直接从数据库读取 JSONB → 秒开
- 批量预生成：`generate-ai-enhancements.js` 遍历 126 款酒预生成（约 6 分钟，¥0.07）

---

## 九、关键问题排查

### 后端问题

| # | 问题 | 根因 | 解决 |
|---|------|------|------|
| **E1** | AI routes 全部 404 | 服务器未重启，新代码未加载 | `taskkill /F /IM node.exe` + 重启 |
| **E2** | `DEEPSEEK_API_KEY` 鉴权失败 | `.env` 用引号包裹 `"sk-xxx"`，dotenv 不 strip 引号 | 去掉引号，直接 `sk-xxx` |
| **E3** | `ai-personas.js` SyntaxError | 模板字符串内含 `` `代码块` `` 三个字被解析为 JS 语法 | 改成「反引号代码块」 |
| **E4** | `server.js` 同样的 backtick 问题 | 同上 | `sed` 批量替换 |
| **E5** | 流式对话失败不报错 | 未处理 stream 异常分支 | 加 try-catch → fallback 兜底 |

### 前端问题

| # | 问题 | 根因 | 解决 |
|---|------|------|------|
| **E6** | 聊天后记忆不保存 | saveMemory 只在 PersonaSwitcher 调用，聊天没有 | 在 sendMessage finally 中调用 saveMemory |
| **E7** | 记忆保存了但不正确 | React state 闭包：finally 中的 messages 是旧的 | saveMemory 接受 lastUserText 参数（不依赖 state） |
| **E8** | AI 回复带 markdown **加粗** | DeepSeek 默认输出 markdown | 所有 prompt 加禁止 markdown 硬性约束 |
| **E9** | Persona 切换后角色不变 | 没同步 personaId 到后端 | 请求 body 加 personaId，后端 getPersona 获取 |
| **E10** | 前端缓存导致旧 UI 展示 | Vite 多个进程 + node_modules/.vite 缓存 | 清缓存 + 杀多余进程 |

### 设计问题

| # | 问题 | 解决方案 |
|---|------|---------|
| **E11** | 聊天 loading 用 animate-bounce | 改用 framer-motion 平滑 float |
| **E12** | 角色切换按钮不加 loading 态 | 加了 switch 时的 feedback |

---

## 十、成本分析

### 预生成（一次性）

- 126 款酒 × 4 模块 × 约 500 token/模块 = 约 252,000 token
- DeepSeek 输出 ¥0.28/百万 token ≈ ¥0.07
- **实际成本：< ¥0.10**

### 日常使用（每月估算）

- 100 次推荐（~200 token/次）= 20,000 token
- 100 次对话（~500 token/次）= 50,000 token
- 合计约 70,000 token × ¥0.28/百万 ≈ ¥0.02
- **实际成本：< ¥0.05 / 月**

### 结论

DeepSeek 的学生项目用量基本是免费的。即使高峰期大量使用，月费也不会超过 ¥1。

---

## 十一、AI 功能清单

| 功能 | 页面 | 状态 |
|------|------|------|
| 🔬 AI 深度解析（4 Tab） | 鸡尾酒详情页 | ✅ |
| 💬 AI 调酒师对话（流式） | AI 助手页 | ✅ |
| 📋 AI 智能推荐（表单+聊天） | AI 助手页 | ✅ |
| 🎭 四角色切换（Persona Switcher） | AI 助手页 | ✅ |
| 🧠 用户记忆（偏好+心情+角色） | 后端自动 | ✅ |
| 🛡️ 引用校验（防幻觉） | 后端自动 | ✅ |
| 🧩 规则引擎降级（AI 不可用时） | 后端自动 | ✅ |
| 📅 个性化每日推荐 | 每日推荐页 | ✅ |
| 🧭 口味测试（规则引擎） | 口味测试页 | ✅ |
