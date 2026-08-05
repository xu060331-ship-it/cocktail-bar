# 08 - Framer Motion

> React 生态的动画库。把 CSS 里很难写的动画（出现/消失/滚动触发）变成组件属性。

---

## 1. 安装与引入

```bash
npm install framer-motion
```

```jsx
import { motion } from "framer-motion"
```

用 `<motion.div>` 代替 `<div>`，这个 div 就有了动画能力。所有 HTML 标签都可以加 `motion.` 前缀。

---

## 2. 核心动画模式

### 模式 A：页面加载时自动播放（`animate`）

```jsx
<motion.h1
  initial={{ opacity: 0, y: 32 }}                    // 初始：透明 + 下移
  animate={{ opacity: 1, y: 0 }}                     // 终点：显示 + 归位
  transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
  欢迎来到调酒百科
</motion.h1>
```

| 属性 | 作用 |
|------|------|
| `initial` | 页面加载时元素的起始状态 |
| `animate` | 动画结束后的最终状态 |
| `transition` | 动画怎么过渡 |

### 模式 B：滚到视口内才播放（`whileInView`）

```jsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
>
  卡片内容
</motion.div>
```

| 属性 | 作用 |
|------|------|
| `whileInView` | 元素进入可见区域时触发 |
| `viewport.once: true` | 只触发一次（不反复播） |
| `viewport.amount: 0.3` | 露出 30% 就触发 |

### 模式 C：鼠标悬停（`whileHover`）

```jsx
<motion.div
  whileHover={{ y: -8, borderColor: "var(--color-accent)" }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  卡片
</motion.div>
```

### 模式 D：点击反馈（`whileTap`）

```jsx
<motion.button whileTap={{ scale: 0.97 }}>
  开始探索
</motion.button>
```

> 🟡 **经验：** `whileTap: scale(0.97)` 给按钮一种"被按下去"的物理感。比 CSS 的 `:active` 更自然。

---

## 3. 交错动画（Stagger）— 卡片逐个出现

```jsx
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,           // 🔑 第 i 个延迟 i×0.1 秒
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

// 使用：
{cocktails.map((c, i) => (
  <motion.div
    key={c.eng}
    custom={i}                   // 把索引 i 传给 variants 函数
    initial="hidden"
    whileInView="visible"
    variants={cardVariants}
  >
    ...
  </motion.div>
))}
```

**效果：** 4 张卡片不是同时出现，而是第 1 张 → 0.1 秒后第 2 张 → 第 3 张 → 第 4 张。流畅、有层次。

---

## 4. 贝塞尔曲线 — 动画的"灵魂"

```jsx
ease: [0.16, 1, 0.3, 1]   // 自定义缓动曲线
```

| 曲线 | 感觉 | 适合 |
|------|------|------|
| `ease` (默认) | 标准 | 一般过渡 |
| `ease-out` | 快进慢停 | hover 效果 |
| `ease-in-out` | 慢进慢出 | 大动画 |
| `[0.16, 1, 0.3, 1]` | 有"弹力感"但不夸张 | UI 出现动画（主流） |

---

## 5. 常见动画属性

| 属性 | 什么意思 | 示例 |
|------|---------|------|
| `opacity: 0 → 1` | 从透明到显示 | 淡入 |
| `y: 40 → 0` | 从下往上浮 | 卡片升起 |
| `y: -8` | 向上移动 8px | hover 浮起 |
| `scale: 1 → 1.04` | 稍微放大 | hover 膨胀 |
| `scale: 1 → 0.97` | 稍微缩小 | 点击按下去 |

---

## 6. 你项目中每个动画的"为什么"

| 动画 | 用在哪 | 为什么 |
|------|--------|--------|
| 文字依次淡入上浮 | Hero 标题、副标题、按钮 | 引导视线从上到下读 |
| Hero 按钮 `whileHover: scale(1.04)` | 开始探索 | 视觉反馈：这能点 |
| 卡片 `whileInView` 逐个出现 | 经典鸡尾酒 x4 | 不是同时弹出，有节奏感 |
| 卡片 `whileHover: y: -8` | 每张鸡尾酒卡片 | 物理反馈：被鼠标"抬"起来了 |
| 基酒卡片 hover 边框变色 | 六大基酒 | 引导用户注意当前选项 |

---

## 7. useReducedMotion（可访问性）

```jsx
import { useReducedMotion } from "framer-motion"

const reduce = useReducedMotion()

<motion.div
  initial={reduce ? false : { opacity: 0, y: 40 }}
  animate={reduce ? {} : { opacity: 1, y: 0 }}
>
```

> 🟢 有的人前庭系统敏感，看到动画会头晕。操作系统有"减少动态效果"开关，`useReducedMotion` 读取这个设置。尊重用户偏好。
