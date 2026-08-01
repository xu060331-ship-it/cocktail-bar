# 06 - React 组件化

> 把页面拆成独立积木。每个 `.jsx` 文件就是一个积木块。

---

## 1. 纯 HTML vs React

```
纯 HTML 时代：                    React 组件化：
index.html（全部页面混一起）        App.jsx（组装者）
  ├── 导航栏（几十行）              ├── Navbar.jsx（导航栏组件）
  ├── Hero（几十行）                ├── HeroSection.jsx（Hero 组件）
  ├── 卡片区（几百行）              ├── ClassicCocktails.jsx（卡片组件）
  └── 底部（几十行）                └── BaseSpirits.jsx（基酒组件）
```

> 改导航栏？打开 `Navbar.jsx`，只改这一个文件。不用在几千行里翻。

---

## 2. 组件的结构

```jsx
// 1. 引入依赖
import { motion } from "framer-motion"

// 2. 数据（可选，可以放在组件外面）
const cocktails = [
  { name: "干马天尼", eng: "Dry Martini", spirit: "金酒" },
  // ...
]

// 3. 定义组件
export default function ClassicCocktails() {
  // 4. 返回 JSX（HTML 的 JS 写法）
  return (
    <section className="...">
      {cocktails.map((c) => (
        <div key={c.eng}>...</div>
      ))}
    </section>
  )
}
```

---

## 3. JSX 规则（跟 HTML 不一样的地方）

| HTML | JSX | 原因 |
|------|-----|------|
| `<div class="hero">` | `<div className="hero">` | `class` 是 JS 关键字 |
| `<img src="...">` | `<img src="..." />` | 自闭合标签要加 `/` |
| `style="color: red"` | `style={{ color: "red" }}` | 双花括号：外层=JS 表达式，内层=对象 |
| `<!-- 注释 -->` | `{/* 注释 */}` | JSX 注释格式 |
| 字符串拼接 | `{`你好，${name}`}` | 用模板字符串 |

---

## 4. 组件间传递数据（Props）

```jsx
// 父组件传值
<Navbar transparent={true} />

// 子组件接收
export default function Navbar({ transparent = false }) {
  // transparent 默认值是 false
  return (
    <header className={transparent ? "透明样式" : "普通样式"}>
      ...
    </header>
  )
}
```

---

## 5. 列表渲染（map）

```jsx
// 之前：手动复制 6 次卡片 HTML
// 现在：一个数组 + .map()

const spirits = [
  { name: "金酒", eng: "Gin", desc: "杜松子的清香" },
  { name: "伏特加", eng: "Vodka", desc: "纯粹透明" },
  // ...
]

{spirits.map((s) => (
  <a key={s.eng} className="spirit-card">
    <h3>{s.name}</h3>
    <p>{s.desc}</p>
  </a>
))}
```

> 🔴 **`key` 属性必须写！** React 用 `key` 来区分每个列表项。用不会重复的值（id、英文名），不用数组索引。

---

## 6. 条件渲染（三元表达式）

```jsx
// 如果 transparent 为 true → 用透明样式
// 如果 transparent 为 false → 用普通样式
className={transparent ? "bg-transparent border-white/10" : "bg-nav border-border"}
```

---

## 7. import / export

```jsx
// 一个文件默认导出一个组件
export default function Navbar() { ... }

// 另一个文件导入
import Navbar from "./components/Navbar"
```

| 写法 | 含义 |
|------|------|
| `export default` | 每个文件只能有一个默认导出 |
| `import Navbar from "./components/Navbar"` | 导入默认导出 |
| `./` | 当前文件夹 |

---

## 8. 组件文件组织

```
src/
├── App.jsx                    ← 主页面，组装所有组件
├── components/
│   ├── Navbar.jsx             ← 导航栏
│   ├── HeroSection.jsx        ← Hero 区块
│   ├── ClassicCocktails.jsx   ← 经典鸡尾酒区块
│   └── BaseSpirits.jsx        ← 六大基酒区块
├── index.css                  ← 全局样式 + Tailwind 配置
└── main.jsx                   ← React 入口（不用改）
```

---

## 9. 你在项目中实际用过的 React 模式

| 模式 | 出现在哪 |
|------|---------|
| 函数组件 | 每个 `.jsx` 文件 |
| 列表渲染 `.map()` | `ClassicCocktails.jsx` — 4 张鸡尾酒卡片 |
| 列表渲染 `.map()` | `BaseSpirits.jsx` — 6 种基酒 |
| Props 传值 | `Navbar` 接收 `transparent` 属性 |
| 条件渲染 | `Navbar` 根据 `transparent` 切换样式 |
| 组件组合 | `App.jsx` 引入并排列 4 个组件 |
