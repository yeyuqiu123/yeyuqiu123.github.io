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
];

/* ===== 导航栏 ===== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// 点击链接后关闭移动菜单
navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// 滚动时导航栏高亮
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 100;
  sections.forEach((sec) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      link.classList.toggle("active", scrollY >= top && scrollY < top + height);
    }
  });
});

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
  // 重新观察滚动动画
  document.querySelectorAll(".post-card").forEach((card) => observer.observe(card));
}

// 分类切换
categoryTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-tab");
  if (!btn) return;
  categoryTabs.querySelectorAll(".cat-tab").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentCat = btn.dataset.cat;
  renderPosts(currentCat);
});

renderPosts("all");

/* ===== 滚动动画 (Intersection Observer) ===== */
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

document.querySelectorAll(".post-card").forEach((card) => observer.observe(card));

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
    // HTML 文章：用 iframe 完整运行
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

  // Markdown 文章
  try {
    const res = await fetch(`posts/${slug}.md`);
    if (!res.ok) throw new Error("文章未找到");
    const md = await res.text();
    modalBody.innerHTML = marked.parse(md);

    // 执行文章中的 <script>（innerHTML 插入的 script 不会自动执行）
    modalBody.querySelectorAll("script").forEach((old) => {
      const fresh = document.createElement("script");
      if (old.src) {
        fresh.src = old.src;
      } else {
        fresh.textContent = old.textContent;
      }
      old.replaceWith(fresh);
    });

    // 代码高亮
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
  // 清理文章注入的 style/script 残留
  modalBody.innerHTML = "";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
