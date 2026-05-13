/* ===== 博客文章索引 ===== */
const POSTS_INDEX = [
  {
    slug: "hello-world",
    title: "Hello World — 博客搭建记",
    date: "2026-05-13",
    tags: ["随笔", "博客"],
    excerpt: "这是我的第一篇博客文章，记录了使用纯 HTML + CSS + JS 搭建个人博客并部署到 GitHub Pages 的过程。",
  },
  {
    slug: "css-animation-tips",
    title: "CSS 动画实用技巧",
    date: "2026-05-12",
    tags: ["CSS", "前端"],
    excerpt: "分享几个实用的 CSS 动画技巧，让你的页面动起来。包括渐变动画、关键帧优化和性能建议。",
  },
  {
    slug: "github-pages-guide",
    title: "GitHub Pages 部署指南",
    date: "2026-05-11",
    tags: ["GitHub", "部署"],
    excerpt: "手把手教你如何将静态网站免费部署到 GitHub Pages，支持自定义域名和 HTTPS。",
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

POSTS_INDEX.forEach((post, i) => {
  const card = document.createElement("div");
  card.className = "post-card";
  card.style.transitionDelay = `${i * 0.1}s`;
  card.innerHTML = `
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
  modalBody.innerHTML = '<p style="color:var(--fg-muted)">加载中...</p>';
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";

  try {
    const res = await fetch(`posts/${slug}.md`);
    if (!res.ok) throw new Error("文章未找到");
    const md = await res.text();
    modalBody.innerHTML = marked.parse(md);
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
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
