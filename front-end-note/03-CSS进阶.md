# 03 - CSS 进阶

> 编程经验：这些不是"高级技巧"，是你日常项目每天都在写的普通 CSS。

---

## 1. CSS 变量（Custom Properties）

```css
:root {
  --accent: #c9a96e;        /* 定义：两横杠 + 名字 */
  --bg-page: #1a1a2e;
}

.button {
  background-color: var(--accent);   /* 使用：var() 包裹 */
}
```

| 为什么用 | 例子 |
|---------|------|
| 换主题只改一行 | 琥珀色 → 玫瑰金，改 `:root` 里一个值就行 |
| 不用记色号 | 写 `var(--accent)` 比写 `#c9a96e` 更语义化 |
| 全站统一 | 不会出现同一个颜色在不同地方写了 5 个不同的十六进制值 |

> 🔴 **高频写法：** `:root` 里定义，全站引用。Tailwind 项目的 `@theme` 块就是这个的 Tailwind 版本。

---

## 2. 过渡（transition）

> 让状态变化"滑过去"而不是"跳过去"。

```css
.card {
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
}
```

| 参数 | 含义 | 常用值 |
|------|------|--------|
| 属性 | 过渡哪个 CSS 属性 | `transform`, `opacity`, `border-color` |
| 时长 | 动画持续多久 | `0.3s`（UI 微交互），`0.6s`（大动画） |
| 缓动 | 速度曲线 | `ease`, `ease-out`, `cubic-bezier(0.16, 1, 0.3, 1)` |

> 🟡 **经验：** 不要写 `transition: all`——全部属性过渡浪费性能。只过渡你确实在变的那个属性。

---

## 3. 变换（transform）

| 写法 | 效果 |
|------|------|
| `transform: translateY(-8px)` | 竖直上移 8px |
| `transform: translateX(-50%)` | 水平左移自身宽度的一半 |
| `transform: scale(1.08)` | 放大到 108% |
| `transform: translate(-50%, -50%)` | 水平垂直居中（配合 `top: 50%; left: 50%`） |

> 🔴 **高频组合（元素居中必杀技）：**
> ```css
> position: absolute;
> top: 50%;
> left: 50%;
> transform: translate(-50%, -50%);
> ```

---

## 4. 关键帧动画（@keyframes）

```css
@keyframes kenBurns {
  0%   { transform: scale(1); }
  100% { transform: scale(1.08); }
}

.hero-bg-image {
  animation: kenBurns 20s ease-in-out infinite alternate;
}
```

| 参数 | 含义 |
|------|------|
| `20s` | 持续 20 秒 |
| `ease-in-out` | 慢进慢出 |
| `infinite` | 无限循环 |
| `alternate` | 正放再倒放（缩放忽大忽小） |

```css
/* 弹跳 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(8px); }
}
```

---

## 5. CSS Scroll Snap（全屏滚动吸附）

```css
.scroll-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;   /* 竖直方向强制吸附 */
  scroll-behavior: smooth;          /* 丝滑滚动 */
}

.full-screen {
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;        /* 吸附到每屏顶部 */
}
```

| 属性 | 作用 |
|------|------|
| `scroll-snap-type: y mandatory` | 告诉浏览器"必须停在整屏边界" |
| `scroll-snap-align: start` | 每屏顶部对齐视口顶部 |

> 🔴 **配合：** `html, body { overflow: hidden; height: 100%; }` 防止双滚动条。

---

## 6. 伪元素（::after / ::before）

> 不写额外 HTML 就能添加装饰元素。

```css
/* 标题下方的装饰短线 */
.section-title::after {
  content: '';                 /* 必须写，即使是空 */
  display: block;
  width: 60px;
  height: 2px;
  background-color: var(--accent);
  margin: 14px 0 0;
}

/* Tab 选中态的下划线（比文字短、居中） */
.center-tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background-color: var(--accent);
}
```

> 🔴 **绝对居中公式（用在 ::after 上）：** `left: 50%; transform: translateX(-50%);`

---

## 7. 渐变（gradient）

```css
/* 线性渐变（从上到下） — 你 Hero 视频上的遮罩 */
.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(15, 22, 41, 0.6) 0%,
    rgba(15, 22, 41, 0.4) 50%,
    rgba(15, 22, 41, 0.85) 100%
  );
}

/* 径向渐变（从中心向外） */
.hero-overlay {
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(15, 22, 41, 0.9) 100%
  );
}
```

---

## 8. rgba() 半透明颜色

```css
rgba(201, 169, 110, 0.15)   /* 琥珀色 15% 不透明度 */
rgba(255, 255, 255, 0.08)   /* 白色 8% 不透明度 — 做微妙的边框 */
```

| 第四个参数 | 效果 |
|-----------|------|
| `0.04` ~ `0.08` | 几乎不可见，做 hover 时的微光背景 |
| `0.15` ~ `0.2` | 标签/徽章背景 |
| `0.6` ~ `0.85` | 遮罩层 |

> 🟡 **经验：** 暗色背景上的微交互，不要用更亮的颜色，用 `rgba(你的accent色, 0.04)` 做 hover 背景——有光感但不刺眼。

---

## 9. hover 嵌套效果

```css
/* 鼠标悬停卡片 → 改变卡片里面的圆形图标边框 */
.spirit-card:hover .spirit-img {
  border-color: var(--accent);
}
```

读取顺序：鼠标悬停 `.spirit-card` → 找到它里面的 `.spirit-img` → 改属性。

> 🟡 你之前在纯 CSS 里用的就是这个，React + Tailwind 里换成了 Framer Motion 的 `whileHover`。

---

## 10. 背景图 Ken Burns 效果

```css
.hero-bg-image {
  background-image: url('./hero-bg.jpg');
  background-size: cover;
  background-position: center;
  animation: kenBurns 20s ease-in-out infinite alternate;
}

@keyframes kenBurns {
  0%   { transform: scale(1); }
  100% { transform: scale(1.08); }
}
```

> 20 秒从 100% 慢放到 108%，再 20 秒缩回来。IBA-world 首页用的就是这个。

---

## 11. 暗色主题配色经验

```css
:root {
  --bg-page: #1a1a2e;      /* 最深背景 */
  --bg-card: #16213e;      /* 卡片比背景略亮 */
  --bg-nav: #0f1629;       /* 导航栏最深 */
  --accent: #c9a96e;       /* 唯一的强调色 */
  --border: #2a2a3e;       /* 边框比背景亮一点 */
  --text-white: #ffffff;   /* 主文字 */
  --text-gray: #b0b0b0;    /* 次要文字 */
  --text-muted: #6b6b6b;   /* 辅助文字 */
}
```

| 原则 | 说明 |
|------|------|
| 一个强调色 | 全站只用一种 accent 色 |
| 三层灰 | 白色 → 灰白 → 暗灰，拉开信息层级 |
| 边框比背景亮一点 | `#2a2a3e` 比 `#1a1a2e` 亮，能看出边界但不刺眼 |
| 不要纯黑 `#000` | 用深蓝灰更有质感 |
