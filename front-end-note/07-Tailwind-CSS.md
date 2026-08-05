# 07 - Tailwind CSS

> 把 CSS 拆成原子类名，直接在 HTML/JSX 标签上拼。不需要再翻 .css 文件。

---

## 1. 纯 CSS vs Tailwind

```css
/* 纯 CSS：给元素起名，在另一处写样式 */
.card {
  background-color: #16213e;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 16px;
}
```

```html
<!-- Tailwind：样式就是类名，写在标签上 -->
<div className="bg-[#16213e] rounded-lg p-5 flex gap-4">
```

> 🟡 **优势：** 不用在 CSS 和 HTML 之间来回切文件，不用给每个 div 起名字。

---

## 2. 常用类名速查

### 布局

| 类名 | 等效 CSS | ⭐ |
|------|---------|-----|
| `flex` | `display: flex` | 🔴 |
| `flex-col` | `flex-direction: column` | 🔴 |
| `grid` | `display: grid` | 🔴 |
| `grid-cols-4` | `grid-template-columns: repeat(4, 1fr)` | 🔴 |
| `gap-6` | `gap: 1.5rem` (24px) | 🔴 |
| `items-center` | `align-items: center` | 🔴 |
| `justify-between` | `justify-content: space-between` | 🔴 |
| `justify-center` | `justify-content: center` | 🔴 |

### 间距

| 类名 | 等效 CSS | 数值 |
|------|---------|------|
| `p-5` | `padding: 1.25rem` | 20px |
| `px-8` | `padding-left/right: 2rem` | 32px |
| `py-3.5` | `padding-top/bottom: 0.875rem` | 14px |
| `m-0` | `margin: 0` | |
| `gap-4` | `gap: 1rem` | 16px |

### 尺寸

| 类名 | 等效 CSS |
|------|---------|
| `w-full` | `width: 100%` |
| `w-56` | `width: 14rem` (224px) |
| `h-16` | `height: 4rem` (64px) |
| `h-[100dvh]` | `height: 100dvh` |
| `max-w-6xl` | `max-width: 72rem` (1152px) |

### 颜色与背景

| 类名 | 等效 CSS |
|------|---------|
| `bg-[var(--color-bg-card)]` | 自定义 CSS 变量 |
| `bg-[#16213e]` | 任意十六进制颜色 |
| `text-white` | `color: white` |
| `text-[var(--color-accent)]` | 自定义 CSS 变量 |
| `border-[var(--color-border)]` | 自定义 CSS 变量 |

### 文字

| 类名 | 等效 CSS |
|------|---------|
| `text-xs` | `font-size: 0.75rem` (12px) |
| `text-sm` | `font-size: 0.875rem` (14px) |
| `text-base` | `font-size: 1rem` (16px) |
| `text-xl` | `font-size: 1.25rem` (20px) |
| `text-4xl` | `font-size: 2.25rem` (36px) |
| `text-7xl` | `font-size: 4.5rem` (72px) |
| `font-bold` | `font-weight: 700` |
| `font-serif` | `font-family: serif` |
| `tracking-[0.15em]` | `letter-spacing: 0.15em` |
| `italic` | `font-style: italic` |

### 视觉效果

| 类名 | 等效 CSS |
|------|---------|
| `rounded-lg` | `border-radius: 0.5rem` (8px) |
| `rounded-2xl` | `border-radius: 1rem` (16px) |
| `rounded-full` | `border-radius: 9999px` (完全圆形) |
| `border` | `border: 1px solid` |
| `cursor-pointer` | `cursor: pointer` |
| `overflow-hidden` | `overflow: hidden` |
| `transition-all` | `transition: all` |
| `duration-300` | `transition-duration: 300ms` |

### 定位

| 类名 | 等效 CSS |
|------|---------|
| `relative` | `position: relative` |
| `absolute` | `position: absolute` |
| `fixed` | `position: fixed` |
| `inset-0` | `top/right/bottom/left: 0` |
| `z-10` / `z-20` / `z-50` | `z-index: 10/20/50` |

---

## 3. Tailwind v4 的自定义主题

```css
/* index.css 里 */
@import "tailwindcss";

@theme {
  --color-bg-page: #1a1a2e;
  --color-bg-card: #16213e;
  --color-accent: #c9a96e;
  --color-accent-dim: rgba(201, 169, 110, 0.15);
  --color-border: #2a2a3e;
}
```

定义后在任意 JSX 里直接用：

```jsx
<div className="bg-[var(--color-bg-card)] text-[var(--color-accent)]">
```

---

## 4. 任意值语法 `[...]`

Tailwind 没有内置你需要的每个值，但你随时可以写任意值：

```jsx
<p className="tracking-[0.35em]">          {/* letter-spacing: 0.35em */}
<div className="bg-[#16213e]">              {/* 任意十六进制色 */}
<div className="h-[100dvh]">                {/* 动态视口高度 */}
```

---

## 5. 响应式前缀

```jsx
<h1 className="text-5xl md:text-7xl">
  {/* 手机：text-5xl（48px） | 平板及以上：text-7xl（72px） */}
</h1>
```

| 前缀 | 生效宽度 |
|------|---------|
| 无 | 所有尺寸 |
| `sm:` | ≥ 640px |
| `md:` | ≥ 768px |
| `lg:` | ≥ 1024px |
| `xl:` | ≥ 1280px |

---

## 6. Tailwind vs 传统 CSS 对照（你实际转换过的）

| 你之前在 style.css 里写的 | Tailwind 等价 |
|---|---|
| `display: flex; align-items: center; gap: 28px;` | `flex items-center gap-7` |
| `position: absolute; inset: 0; z-index: 10;` | `absolute inset-0 z-10` |
| `background: linear-gradient(to bottom, ...)` | `bg-gradient-to-b from-... to-...` |
| `transition: transform 0.3s ease` | `transition-transform duration-300` |
| `width: 200px; flex-shrink: 0;` | `w-56 shrink-0` |

---

## 7. 经验

- Tailwind 不适合全部样式。全局重置（`* { margin: 0 }`）、CSS 变量（`:root`）、`@keyframes` 还是写在 `index.css` 里。
- 类名太长时，说明该拆组件了。一个 div 上 20 个类名 → 提取成 `<Card>` 组件。
- `[@apply]` 能不用就不用。Tailwind v4 本身已经不推荐了。
