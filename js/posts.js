/* ===== KaTeX LaTeX 渲染 ===== */
function renderMath(container) {
  // 先处理 $$...$$ 块级公式，再处理 $...$ 行内公式
  // 遍历所有文本节点，跳过 <pre> 和 <code> 内的内容
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (parent && (parent.tagName === "CODE" || parent.tagName === "PRE")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const text = node.textContent;
    if (!text.includes("$")) return;

    const fragment = document.createDocumentFragment();
    const regex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // 普通文本
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      // 公式
      const tex = (match[1] || match[2]).trim();
      const displayMode = !!match[1];
      const span = document.createElement(displayMode ? "div" : "span");
      try {
        katex.render(tex, span, { displayMode, throwOnError: false });
      } catch {
        span.textContent = match[0];
      }
      fragment.appendChild(span);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    if (fragment.childNodes.length > 0) {
      node.parentNode.replaceChild(fragment, node);
    }
  });
}

/* ===== 博客文章索引 ===== */
const POSTS_INDEX = [
  {
    slug: "hello-world",
    type: "md",
    category: "408",
    title: "Hello World — 博客搭建记",
    date: "2026-05-13",
    tags: ["随笔", "博客"],
    excerpt: "这是我的第一篇博客文章，记录了使用纯 HTML + CSS + JS 搭建个人博客并部署到 GitHub Pages 的过程。",
  },
  {
    slug: "css-animation-tips",
    type: "md",
    category: "408",
    title: "CSS 动画实用技巧",
    date: "2026-05-12",
    tags: ["CSS", "前端"],
    excerpt: "分享几个实用的 CSS 动画技巧，让你的页面动起来。包括渐变动画、关键帧优化和性能建议。",
  },
  {
    slug: "github-pages-guide",
    type: "md",
    category: "408",
    title: "GitHub Pages 部署指南",
    date: "2026-05-11",
    tags: ["GitHub", "部署"],
    excerpt: "手把手教你如何将静态网站免费部署到 GitHub Pages，支持自定义域名和 HTTPS。",
  },
  {
    slug: "html-demo",
    type: "html",
    category: "408",
    title: "HTML 动画演示",
    date: "2026-05-10",
    tags: ["HTML", "动画", "演示"],
    excerpt: "在博客中直接运行 HTML 动画和 JS 交互：弹跳球、点击计数器、渐变流动卡片。",
  },
  {
    slug: "calculus-derivative",
    type: "md",
    category: "高数",
    title: "导数的定义与计算",
    date: "2026-05-09",
    tags: ["高数", "导数"],
    excerpt: "导数是微积分的核心概念，本文从极限定义出发，梳理常见求导法则和链式法则。",
  },
  {
    slug: "linear-algebra-matrix",
    type: "md",
    category: "线代",
    title: "矩阵运算基础",
    date: "2026-05-08",
    tags: ["线代", "矩阵"],
    excerpt: "矩阵是线性代数的基本工具，涵盖加减乘、转置、逆矩阵的定义与性质。",
  },
  {
    slug: "tikz-demo",
    type: "md",
    category: "高数",
    title: "TikZ 绘图演示",
    date: "2026-05-07",
    tags: ["高数", "TikZ", "绘图"],
    excerpt: "在 Markdown 笔记中使用 TikZ 代码块绘制几何图形、函数图像和有向图。",
  },
];

/* ===== 滚动动画 ===== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 }
);

/* ===== 渲染文章列表 ===== */
const postsGrid = document.getElementById("postsGrid");
const categoryTabs = document.getElementById("categoryTabs");
let currentCat = "all";

function renderPosts(cat) {
  postsGrid.innerHTML = "";
  const filtered = cat === "all" ? POSTS_INDEX : POSTS_INDEX.filter((p) => p.category === cat);
  filtered.forEach((post, i) => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.dataset.category = post.category;
    card.style.transitionDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <span class="post-cat">${post.category}</span>
      <div class="post-date">${post.date}</div>
      <div class="post-title">${post.title}</div>
      <div class="post-excerpt">${post.excerpt}</div>
      <div class="post-tags">
        ${post.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    `;
    card.addEventListener("click", () => openPost(post.slug));
    postsGrid.appendChild(card);
  });
  document.querySelectorAll(".post-card").forEach((card) => observer.observe(card));
  setTimeout(() => {
    document.querySelectorAll(".post-card:not(.visible)").forEach((card) => card.classList.add("visible"));
  }, 500);
}

categoryTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-tab");
  if (!btn) return;
  categoryTabs.querySelectorAll(".cat-tab").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentCat = btn.dataset.cat;
  renderPosts(currentCat);
});

renderPosts("all");

/* ===== 文章模态框 ===== */
const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

async function openPost(slug) {
  const post = POSTS_INDEX.find((p) => p.slug === slug);
  const type = post ? post.type || "md" : "md";

  modalBody.innerHTML = '<p style="color:var(--fg-muted)">加载中...</p>';
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";

  if (type === "html") {
    modalBody.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = `posts/${slug}.html`;
    iframe.style.cssText = "width:100%;border:none;min-height:70vh;border-radius:8px;";
    iframe.onload = () => {
      try {
        const h = iframe.contentDocument.documentElement.scrollHeight;
        iframe.style.height = h + "px";
      } catch { /* 跨域时忽略 */ }
    };
    modalBody.appendChild(iframe);
    return;
  }

  try {
    const res = await fetch(`posts/${slug}.md`);
    if (!res.ok) throw new Error("文章未找到");
    const md = await res.text();
    modalBody.innerHTML = marked.parse(md);

    // KaTeX 渲染 LaTeX 公式
    renderMath(modalBody);

    modalBody.querySelectorAll("script").forEach((old) => {
      const fresh = document.createElement("script");
      if (old.src) {
        fresh.src = old.src;
      } else {
        fresh.textContent = old.textContent;
      }
      old.replaceWith(fresh);
    });

    modalBody.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  } catch {
    modalBody.innerHTML = '<p style="color:var(--fg-muted)">加载失败，请稍后再试。</p>';
  }
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
  modalBody.innerHTML = "";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
