# 02 - CSS 基础与布局

> 网页的皮肤。布局是 CSS 里最重要也最容易卡住的部分。

---

## 1. CSS 写在哪

| 方式 | 写法 | 适合 |
|------|------|------|
| 外部文件 | `<link rel="stylesheet" href="./style.css">` | 🔴 默认用这个 |
| 内嵌 | `<style> ... </style>` 写在 head 里 | 小练习 |
| 行内 | `<div style="color: red">` | 几乎不用 |

---

## 2. 选择器（如何"选中"你要改的元素）

| 选择器 | 写法 | 选中什么 | ⭐ |
|--------|------|---------|-----|
| 标签 | `a { }` | 所有 `<a>` 标签 | 🟡 |
| 类 | `.card { }` | 所有 `class="card"` | 🔴 最常用 |
| ID | `#navbar { }` | `id="navbar"` 的那个元素 | 🟡 |
| 后代 | `#navbar a { }` | navbar 里面的所有 a | 🟡 |
| 直接子 | `#navbar > a { }` | navbar 的直接孩子 a | 🟢 |
| 伪类 | `.card:hover { }` | 鼠标悬停时的 card | 🔴 高频 |
| 伪元素 | `.title::after { }` | 在 title 后面插入虚拟元素 | 🟡 |

> 🔴 **高频错误：** CSS 写 `.card` 但 HTML 里写的是 `id="card"`——匹配不上，样式不生效。

---

## 3. 盒模型（每个元素都是一个盒子）

```
┌──────────────────────────────┐
│          margin              │  ← 元素外面的间距
│   ┌──────────────────────┐   │
│   │       border         │   │  ← 边框
│   │   ┌──────────────┐   │   │
│   │   │   padding     │   │   │  ← 内容到边框的距离
│   │   │   ┌──────┐   │   │   │
│   │   │   │ 内容  │   │   │   │
│   │   │   └──────┘   │   │   │
│   │   └──────────────┘   │   │
│   └──────────────────────┘   │
└──────────────────────────────┘
```

| 属性 | 作用 | 记忆 |
|------|------|------|
| `padding` | 内容 → 边框 | "内边距" |
| `border` | 边框线 | "边界" |
| `margin` | 边框 → 外部 | "外边距" |

```css
/* 🔴 几乎所有项目的第一行 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

`box-sizing: border-box` 的意思是：你设 `width: 200px`，那这 200px 已经包含了 padding 和 border，不会把元素撑大。**不写这行，布局会莫名其妙地歪。**

---

## 4. 定位（position）

| 值 | 行为 | 用在哪 |
|----|------|--------|
| `static` | 默认，按正常文档流排列 | 不用写 |
| `relative` | 相对自己原位偏移，**但不脱离文档流** | 给 `absolute` 子元素当参照物 |
| `absolute` | 脱离文档流，相对最近的 `relative` 父元素定位 | 右上角链接、Hero 文字层 |
| `fixed` | 脱离文档流，相对浏览器窗口定位 | 导航栏固定顶部 |
| `sticky` | 滚动到阈值后固定 | 滚动吸附（以后会遇到） |

```css
/* 🔴 经典组合：把文字叠在视频上面 */
.hero { position: relative; }              /* 父元素：参照物 */
.hero-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
```

```css
/* 🔴 让链接固定在右上角 */
#top-link { position: absolute; top: 10px; right: 10px; }
```

---

## 5. Flexbox（一维布局）

> 适合：一排导航、一列卡片、左右两栏。**最常用的布局工具。**

### 父元素上的属性

```css
.container {
  display: flex;                    /* 开启 flex */
  flex-direction: column;           /* row=横排 | column=竖排 */
  justify-content: center;          /* 主轴方向的对齐 */
  align-items: center;              /* 交叉轴方向的对齐 */
  gap: 16px;                        /* 子元素间距 */
}
```

### 🔴 背诵这三组

| 需求 | 代码 |
|------|------|
| 一排东西横排、居中、有间距 | `display: flex; align-items: center; gap: 16px;` |
| 垂直居中 + 水平居中 | `display: flex; align-items: center; justify-content: center;` |
| 左右两栏，左边固定、右边撑满 | 左边 `width: 200px; flex-shrink: 0;` 右边 `flex: 1;` |

### 子元素上的属性

| 属性 | 作用 |
|------|------|
| `flex: 1` | 占满剩余空间 |
| `flex-shrink: 0` | 不缩小 |

### 🔴 关键理解：margin-top: auto 在 Flex 里的特殊行为

```css
/* 普通布局：几乎没用 */
/* Flex 布局（flex-direction: column）：把剩余空间全塞在顶部 → 元素推到底 */
.bottom-area { margin-top: auto; }
```

这就是你怎么把百度底部分页推到页面底部的原理。

---

## 6. CSS Grid（二维布局）

> 适合：卡片墙、图片网格。比 Flex 多一个维度。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 4 列等宽 */
  grid-template-columns: 1fr 1fr;          /* 2 列等宽 */
  grid-template-columns: 360px 1fr;        /* 左侧固定 360px，右侧撑满 */
  gap: 24px;                               /* 卡片间距 */
}
```

| 写法 | 含义 |
|------|------|
| `repeat(4, 1fr)` | 4 列，每列平分可用空间 |
| `1fr 1fr` | 2 列，平分 |
| `360px 1fr` | 左列 360px 固定，右列撑满 |
| `gap: 32px 40px` | 行间距 32px，列间距 40px |

### Flex vs Grid 选择指南

| 场景 | 用什么 |
|------|--------|
| 导航栏横排 | Flex |
| 文章列表竖排 | Flex |
| 左右两栏 | Grid（`360px 1fr`）或 Flex |
| 卡片墙 2×2 或 3×2 | Grid |
| 4 列等宽卡片 | Grid `repeat(4, 1fr)` |

---

## 7. 常用样式属性速查

| 属性 | 示例 | 用途 |
|------|------|------|
| `color` | `color: #fff` | 文字颜色 |
| `background-color` | `background-color: #1a1a2e` | 背景色 |
| `font-size` | `font-size: 16px` | 字号 |
| `font-weight` | `font-weight: bold` / `500` | 字重 |
| `font-style` | `font-style: italic` | 斜体 |
| `font-family` | `font-family: 'Georgia', serif` | 字体 |
| `letter-spacing` | `letter-spacing: 0.15em` | 字间距 |
| `line-height` | `line-height: 1.6` | 行高 |
| `text-align` | `text-align: center` / `left` | 文字对齐 |
| `text-decoration` | `text-decoration: none` | 去掉下划线 |
| `border` | `border: 1px solid #2a2a3e` | 边框 |
| `border-radius` | `border-radius: 8px` / `50%` | 圆角（50%=圆形） |
| `width` / `height` | `width: 200px` | 宽高 |
| `overflow` | `overflow: hidden` | 超出部分裁掉 |
| `cursor` | `cursor: pointer` | 鼠标变手型 |
| `outline` | `outline: none` | 去掉输入框聚焦时的蓝框 |
| `object-fit` | `object-fit: cover` | 图片填满容器不变形 |

---

## 8. 你实际踩过的坑

1. **`min-height: 100vh` 不等于"推到底"** — 需要配合 `margin-top: auto`（Flex 子元素上）
2. **id 重复** — 8 个 `id="article-meta"` 应该用 `class`
3. **`left` vs `right`** — 百度链接在左上角，应该写 `left: 10px` 不是 `right`
4. **`18opx`** — 字母 o 不是数字 0，宽度写错了
5. **`font-weight: blod`** — 拼写错误，应该是 `bold`
6. **HTML 标签没闭合** — `<div class="cfc-img">` 少了 `</div>`，整个 Grid 塌了
7. **图片路径少了 `"`** — `src="./images/xx.png alt=` 浏览器解析失败
