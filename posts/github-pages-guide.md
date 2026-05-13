# GitHub Pages 部署指南

GitHub Pages 是 GitHub 提供的免费静态网站托管服务，非常适合个人博客和项目主页。

## 前提条件

1. 一个 GitHub 账号
2. 一个静态网站项目（HTML/CSS/JS）

## 步骤一：创建仓库

仓库名必须为 `<用户名>.github.io`，这样你的网站地址就是：

```
https://<用户名>.github.io
```

## 步骤二：推送代码

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<用户名>/<用户名>.github.io.git
git push -u origin main
```

## 步骤三：开启 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. Source 选择 `Deploy from a branch`
3. Branch 选择 `main`，目录选 `/ (root)`
4. 点击 **Save**

等待 1-2 分钟，你的网站就上线了！

## 自定义域名（可选）

如果你有自己的域名：

1. 在仓库根目录添加 `CNAME` 文件，内容为你的域名
2. 在域名 DNS 设置中添加 CNAME 记录指向 `<用户名>.github.io`
3. 在 GitHub Pages 设置中填入自定义域名

## 注意事项

- GitHub Pages 只支持**静态网站**，不能运行服务端代码
- 仓库必须是 **public**（免费账号）
- 单个文件不能超过 **100MB**
- 网站总大小建议不超过 **1GB**

---

*免费、稳定、够用 — GitHub Pages 三件套。*
