# CSS 动画实用技巧

CSS 动画可以让页面从"能用"变成"好用"。以下是我常用的几个技巧。

## 1. 善用 `cubic-bezier`

默认的 `ease` 不一定适合所有场景。一个自然的减速曲线：

```css
.element {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 2. 渐变背景动画

用 `background-size` 放大渐变，再用 `animation` 平移：

```css
.gradient-bg {
  background: linear-gradient(-45deg, #6c63ff, #a29bfe, #fd79a8);
  background-size: 300% 300%;
  animation: gradient 6s ease infinite;
}

@keyframes gradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## 3. 性能优先

- 只动画 `transform` 和 `opacity`
- 避免动画 `width`、`height`、`top` 等触发布局重排的属性
- 使用 `will-change` 提示浏览器

```css
.card:hover {
  transform: translateY(-4px);
  will-change: transform;
}
```

## 4. 滚动触发动画

配合 `IntersectionObserver`，元素进入视口时添加 class：

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
});
observer.observe(element);
```

---

*动画是锦上添花，不是喧宾夺主。*
