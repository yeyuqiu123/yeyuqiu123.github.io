# 矩阵运算基础

矩阵是线性代数的基本工具，本质是一个**数表**。

## 基本概念

$m \times n$ 矩阵有 $m$ 行 $n$ 列：

$$A = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix}$$

## 加法与数乘

同型矩阵才能相加，对应元素相加：

$$(A + B)_{ij} = a_{ij} + b_{ij}$$

数乘：每个元素乘以该数：

$$(kA)_{ij} = k \cdot a_{ij}$$

## 矩阵乘法

$A_{m \times s}$ 乘 $B_{s \times n}$，结果为 $C_{m \times n}$：

$$c_{ij} = \sum_{k=1}^{s} a_{ik} b_{kj}$$

> **注意**：矩阵乘法**不满足交换律**，即 $AB \neq BA$ 一般不成立。

## 转置

将行与列互换：$(A^T)_{ij} = a_{ji}$

性质：
- $(A^T)^T = A$
- $(AB)^T = B^T A^T$
- $(A + B)^T = A^T + B^T$

## 逆矩阵

若 $AB = BA = I$，则 $B$ 是 $A$ 的逆矩阵，记 $A^{-1}$。

$2 \times 2$ 矩阵求逆公式：

$$A^{-1} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$

其中 $|A| = ad - bc \neq 0$。

---

*矩阵运算是线性代数的基石，一定要熟练。*
