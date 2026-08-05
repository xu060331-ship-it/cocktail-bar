# 05 - Git 与 GitHub

> Git = 代码的时间机器。GitHub = 代码的云盘 + 社交网络。

---

## 1. 核心概念

| 概念 | 类比 | 说明 |
|------|------|------|
| **仓库（repo）** | 一个项目的文件夹 | `cocktail-bar` 就是一个仓库 |
| **提交（commit）** | 游戏存档 | 记录这一刻所有文件的快照 |
| **暂存（stage）** | 购物车 | 决定哪些改动放进下一次提交 |
| **分支（branch）** | 平行宇宙 | 主线 v1.0 和实验版 v2.0 互不影响 |
| **推送（push）** | 上传 | 本地 → GitHub |
| **拉取（pull）** | 下载 | GitHub → 本地 |
| **克隆（clone）** | 下载副本 | 把别人的项目拷到自己电脑 |

---

## 2. 日常命令（你需要的就这 7 个）

```bash
# 1. 初始化（新项目第一次用）
git init

# 2. 查看状态（看看改了哪些文件）
git status

# 3. 添加到暂存区（选择要保存的改动）
git add .                    # 添加所有改动
git add index.html           # 只添加某个文件

# 4. 提交（存档）
git commit -m "完成了导航栏"

# 5. 连接远程仓库（关联 GitHub）
git remote add origin https://github.com/你的用户名/仓库名.git

# 6. 推送（上传到 GitHub）
git push -u origin main

# 7. 克隆（从 GitHub 拉下来）
git clone https://github.com/用户名/仓库名.git
```

---

## 3. 提交信息怎么写

```bash
# ✅ 好：一句话说明做了什么
git commit -m "加上了经典鸡尾酒四列卡片区块"
git commit -m "修复卡片图片圆角不显示的问题"

# ❌ 不好
git commit -m "改了一些东西"
git commit -m "update"
```

---

## 4. 日常工作流

```
1. 写代码
2. git add .                    （把所有改动放入购物车）
3. git commit -m "做了XXX"      （存档）
4. 继续写代码
5. git add . && git commit -m "..."
6. git push                     （一天结束时上传到 GitHub）
```

> 🟡 **经验：** 每完成一个小功能就 commit 一次，不要攒几百行再一次性提交。回滚的时候粒度越小越好找。

---

## 5. GitHub 对现在的你的用途

| 用途 | 说明 |
|------|------|
| 备份代码 | 电脑坏了代码还在 |
| 给别人看 | 发一个链接，不用传文件 |
| GitHub Pages | 免费部署静态网站（纯 HTML/CSS/JS 可以直接托管） |
| 展示项目 | 以后找工作的作品集 |

---

## 6. .gitignore

有些文件**绝对不能**上传：

```
node_modules/       # npm 依赖，几万个文件，别人可以自己 npm install
.env                # 密钥
dist/               # 构建产物
```

在项目根目录创建 `.gitignore` 文件，把上面这些写进去，一行一个。

---

## 7. 你实际用过的 Git 操作

```bash
# 克隆 taste-skill
git clone https://github.com/Leonxlnx/taste-skill.git

# 克隆 ui-ux-pro-max
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git
```

> 🟡 你还没有做过 `git init` / `git add` / `git commit` / `git push`。下一步把你调酒百科项目初始化 Git 仓库并推到 GitHub 上，就完整了。
