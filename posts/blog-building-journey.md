# 个人博客搭建记录

## 项目概述

使用纯 HTML/CSS/JS 搭建一个支持 Markdown 和 HTML 笔记的个人博客网站，部署到 GitHub Pages，手机电脑均可访问。

**技术栈：** HTML5 + CSS3 + JavaScript（无框架）+ marked.js + KaTeX + highlight.js + Canvas/SVG 原生绘图

**最终地址：** https://yeyuqiu123.github.io

---

## 搭建过程

### 1. 基础结构搭建

创建项目目录结构：

```
个人网站/
├── index.html          # 首页
├── posts.html          # 笔记列表页
├── css/style.css       # 样式
├── js/
│   ├── nav.js          # 导航逻辑
│   ├── posts.js        # 文章渲染与模态框
│   └── particles.js    # 粒子背景动画
├── img/                # 头像等图片
├── posts/              # 文章目录（.md / .html）
└── .gitignore
```

首页包含：粒子动画背景 + Hero 区域 + 关于我（横向布局）

笔记页包含：分类标签切换（408/高数/线代）+ 文章卡片网格 + 模态框阅读

### 2. 文章系统设计

支持两种文章格式：

- **Markdown（`.md`）**：用 `marked.js` 渲染，支持代码高亮（highlight.js）和 LaTeX 公式（KaTeX）
- **HTML（`.html`）**：用 `<iframe>` 加载，完整运行样式、动画、脚本，互不干扰

在 `posts.js` 的 `POSTS_INDEX` 数组中注册文章，通过 `type` 字段区分格式：

```js
{ slug: "导数笔记", type: "md", category: "高数", ... }
{ slug: "动画演示", type: "html", category: "408", ... }
```

### 3. 分类系统

文章按学科分类，支持切换筛选：

- **408** — 计算机相关笔记
- **高数** — 高等数学笔记
- **线代** — 线性代数笔记

点击顶部标签页按钮即可筛选，实现逻辑在 `renderPosts()` 函数中。

### 4. LaTeX 公式渲染

引入 KaTeX，在 Markdown 解析后遍历文本节点，匹配 `$...$`（行内）和 `$$...$$`（块级）公式：

```js
const regex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
katex.render(tex, span, { displayMode, throwOnError: false });
```

注意跳过 `<code>` 和 `<pre>` 内的文本，避免代码块中的 `$` 被误渲染。

### 5. 绘图方案

放弃 TikZ（TikZJax CDN 已失效，本地编译流程繁琐且不稳定），改用浏览器原生支持的绘图方式：

- **Canvas** — 在 HTML 笔记中用 `<canvas>` + JS 绘制函数图像、几何图形等
- **SVG** — 直接在 HTML 笔记中写内联 SVG，适合静态图形
- **CSS 动画** — 用纯 CSS 实现简单动画效果

这些方案无需编译，浏览器原生支持，HTML 笔记通过 iframe 加载即可完整运行。

### 6. 遇到的坑

| 问题 | 原因 | 解决 |
|------|------|------|
| 文章卡片不显示 | `observer` 变量在 `const` 声明前被引用，JS 报 ReferenceError 中断 | 把 `observer` 定义移到 `renderPosts()` 之前 |
| 卡片始终透明 | CSS 默认 `opacity:0`，滚动动画失效时卡片永远不可见 | 翻转逻辑：默认可见，未进入视口时才透明 |
| 头像不显示 | CSS `background` 简写覆盖了内联 `background-image` | 改用 `<img>` 标签 + `object-fit: cover` |
| TikZJax 不工作 | S3 WASM 文件 403，npm 包下架 | 放弃 TikZ，改用 Canvas/SVG 原生绘图 |

### 7. GitHub Pages 部署

1. 创建仓库 `yeyuqiu123.github.io`
2. 推送代码到 `main` 分支
3. Settings → Pages → Source 选 `main` / `(root)`
4. 等待 1-2 分钟，访问 https://yeyuqiu123.github.io

```bash
git remote add origin https://github.com/yeyuqiu123/yeyuqiu123.github.io.git
git push -u origin main
```

---

## 当前功能清单

- [x] 粒子背景动画（鼠标交互）
- [x] 响应式布局（手机适配）
- [x] Markdown 文章渲染（marked.js）
- [x] HTML 笔记完整运行（iframe）
- [x] LaTeX 公式渲染（KaTeX）
- [x] 原生绘图（Canvas/SVG）
- [x] 代码语法高亮（highlight.js）
- [x] 文章分类切换（408/高数/线代）
- [x] 滚动动画（IntersectionObserver）
- [x] GitHub Pages 部署

---

*2026-05-16*
