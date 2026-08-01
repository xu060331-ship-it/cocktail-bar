# 04 - JavaScript 入门

> 网页的大脑。让页面"活"起来。

---

## 1. 最核心的三件事

你在百度项目里写的 JS，基本覆盖了前端 JS 90% 的操作：

| 操作 | 代码 | 做什么 |
|------|------|--------|
| 找到元素 | `document.querySelector('#search-box input')` | 选中页面上的元素 |
| 监听事件 | `element.addEventListener('click', function() { ... })` | "当用户点这个的时候，干这件事" |
| 修改元素 | `input.focus()` / `button.click()` | 操作元素的行为 |

```javascript
// 🔴 你写的第一个 JS 程序：
const input = document.querySelector('#search-box input');
input.focus();                     // 页面打开，光标自动进搜索框

const button = document.querySelector('#search-box button');
button.addEventListener('click', function() {
  const keyword = input.value.trim();
  if (keyword === '') {
    alert('请输入搜索内容');
  } else {
    alert('你搜索了：' + keyword);
  }
});

// 按回车 = 点按钮
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    button.click();
  }
});
```

---

## 2. 事件类型

| 事件 | 什么时候触发 | 你用过 |
|------|-------------|--------|
| `click` | 鼠标点击 | ✅ 百度一下按钮 |
| `keydown` | 按下键盘 | ✅ 回车搜索 |
| `input` | 输入框内容变化 | 搜索联想（以后会用到） |
| `submit` | 表单提交 | 以后会用到 |
| `scroll` | 页面滚动 | 以后会用到（但用 Framer Motion 代替） |

---

## 3. DOM 操作速查

```javascript
// 找一个元素
const el = document.querySelector('.class-name');

// 找多个元素
const allCards = document.querySelectorAll('.article-card');

// 读/写文字
el.textContent = '新标题';
const title = el.textContent;

// 读/写输入框的值
const keyword = input.value;
input.value = '';

// 读/写 class
el.classList.add('active');
el.classList.remove('active');

// 读/写属性
const url = link.href;
img.src = './new-image.jpg';

// 改样式（少量可以，大量用 CSS）
el.style.display = 'none';
```

---

## 4. 变量

```javascript
const name = '内格罗尼';     // const：不会重新赋值（默认用这个）
let count = 0;               // let：可能重新赋值
count = count + 1;
```

> 🔴 **经验：** 默认用 `const`，只有当值会变的时候才用 `let`。永远不用 `var`。

---

## 5. 条件判断

```javascript
if (keyword === '') {
  alert('请输入搜索内容');
} else {
  alert('你搜索了：' + keyword);
}
```

| 运算符 | 含义 |
|--------|------|
| `===` | 严格等于 |
| `!==` | 不等于 |
| `>` `<` | 大于 / 小于 |

---

## 6. 函数

```javascript
// 定义
function sayHello(name) {
  return '你好，' + name;
}

// 匿名函数（作为回调传给 addEventListener）
button.addEventListener('click', function() {
  alert('被点了');
});
```

---

## 7. `<script>` 放哪

```html
<body>
  <!-- 所有 HTML 内容 -->

  <script>
    // JS 写在这里，放在 </body> 前面
  </script>
</body>
```

> 🔴 **为什么放最后：** 浏览器从上到下读 HTML。JS 放在开头，搜索框还没被浏览器看到，`document.querySelector` 就找不到它。放在底部 = 所有元素都加载好了。

---

## 8. event.preventDefault()

```javascript
link.addEventListener('click', function(event) {
  event.preventDefault();   // 阻止浏览器的默认行为（比如 a 标签跳转）
  // 自己做其他的事
});
```

> 🟡 掘金的 Tab 点击不跳转页面，靠的就是这个 + 后续自己处理内容切换。

---

## 9. 你写过就不需要再手写的（因为有更好的工具了）

| 手写 JS | 被什么替代 |
|---------|-----------|
| 滚动监听 `window.addEventListener('scroll')` | Framer Motion `useScroll` / CSS scroll-snap |
| 元素出现动画 | Framer Motion `whileInView` |
| 复杂 class 切换 | React 状态管理 |
| 手动插 HTML | React JSX |
