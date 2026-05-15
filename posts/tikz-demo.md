# TikZ 绘图演示

TikZ 是 LaTeX 中最强大的绘图工具之一，可以在 Markdown 笔记中直接画图。

## 简单三角形

```tikz
\begin{tikzpicture}
  \draw (0,0) -- (2,0) -- (1,2) -- cycle;
  \node at (1, -0.4) {三角形};
\end{tikzpicture}
```

## 函数图像

```tikz
\begin{tikzpicture}
  \draw[->] (-3,0) -- (3,0) node[right] {$x$};
  \draw[->] (0,-2) -- (0,2) node[above] {$y$};
  \draw[blue, thick, domain=-2:2, samples=50] plot (\x, {0.5*\x*\x - 1});
  \node at (1.5, 1.2) {$y=\frac{1}{2}x^2-1$};
\end{tikzpicture}
```

## 有向图

```tikz
\begin{tikzpicture}[node distance=2cm, auto,
  every node/.style={circle, draw, minimum size=8mm}]
  \node (A) {$A$};
  \node (B) [right of=A] {$B$};
  \node (C) [below of=B] {$C$};
  \node (D) [below of=A] {$D$};
  \draw[->] (A) -- (B);
  \draw[->] (B) -- (C);
  \draw[->] (C) -- (D);
  \draw[->] (D) -- (A);
  \draw[->] (A) -- (C);
\end{tikzpicture}
```

---

*使用 ` ```tikz ` 代码块即可在笔记中绘制 TikZ 图形。*
