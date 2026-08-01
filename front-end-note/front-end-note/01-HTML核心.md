# 01 - HTML 核心

> 网页的骨架。每个标签都有语义，选对标签比写对样式更重要。

---

## 1. 基础结构（每个页面都有）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <!-- 所有可见内容写这里 -->
</body>
</html>
```

| 标签 | 干什么 | ⭐ 重要度 |
|------|--------|----------|
| `<!DOCTYPE html>` | 告诉浏览器"这是 HTML5" | 🔴 必写 |
| `<html lang="zh-CN">` | 中文页面用 `zh-CN`，英文用 `en` | 🔴 必写 |
| `<meta charset="UTF-8">` | 防止中文乱码 | 🔴 必写 |
| `<meta viewport>` | 手机端缩放正常 | 🔴 必写 |
| `<link>` | 引入外部 CSS 文件 | 🟡 高频 |

---

## 2. 常用标签速查

### 文本

| 标签 | 用途 | 示例 |
|------|------|------|
| `<h1>` ~ `<h6>` | 标题，h1 一个页面只用一次 | `<h1>调酒百科</h1>` |
| `<p>` | 段落 | `<p>每一杯酒都有一段故事</p>` |
| `<span>` | 行内文字片段，不改行 | `<span>作者名</span>` |
| `<a>` | 链接 / 跳转 | `<a href="/daily">每日推荐</a>` |

### 布局容器

| 标签 | 用途 | ⭐ 重要度 |
|------|------|----------|
| `<div>` | 万能容器，没特殊含义 | 🟡 最常用 |
| `<header>` | 页头 / 导航栏 | 🟢 语义化 |
| `<nav>` | 导航链接组 | 🟢 语义化 |
| `<main>` | 页面主体内容 | 🟢 语义化 |
| `<section>` | 一个独立区块（如 Hero、精选） | 🟢 语义化 |
| `<aside>` | 侧边栏 / 附加内容 | 🟢 语义化 |
| `<footer>` | 页脚 | 🟢 语义化 |

### 表单与交互

| 标签 | 用途 | 示例 |
|------|------|------|
| `<input>` | 输入框 | `<input type="text" placeholder="搜索...">` |
| `<button>` | 按钮（触发动作） | `<button>百度一下</button>` |
| `<img>` | 图片 | `<img src="./hero.jpg" alt="鸡尾酒">` |
| `<video>` | 视频 | `<video autoplay muted loop playsinline>` |

---

## 3. 核心经验

### id vs class

| | `id` | `class` |
|---|------|---------|
| 唯一性 | 页面上只能出现 **1 次** | 可用**无数次** |
| CSS 写法 | `#xxx` | `.xxx` |
| 适合 | 导航栏、侧边栏（唯一的） | 文章卡片、按钮（成组的） |
| 规则 | 像身份证号 | 像标签/分类 |

> 🔴 **高频错误：** 把 `id` 当 `class` 用。8 张卡片都写 `id="card"`，CSS 只对第一个生效。

### `<a>` vs `<button>`

| 场景 | 用什么 |
|------|--------|
| 跳转到另一个页面 | `<a href="...">` |
| 在当前页面做一件事（提交、打开弹窗） | `<button>` |

### alt 属性不能省

```html
<!-- ❌ 不好 -->
<img src="cocktail.jpg">

<!-- ✅ 好 -->
<img src="cocktail.jpg" alt="一杯琥珀色的内格罗尼鸡尾酒">
```

---

## 4. 你在项目中实际用过的结构

```
百度首页复现：
  body > div#top-link + div#logo-area + div#search-area + div#bottom-area

掘金首页复现：
  body > header#nav-bar + div#main-content > (aside#left-sidebar + main#center-column + aside#right-sidebar)

调酒百科首页：
  body > header#navbar + div#scroll-container > (section#hero + section#classic-cocktails + section#base-spirits)
```
