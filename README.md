# RadarScout.io

> Smart home, wearables, and health tech product reviews and buying guides

## 🎯 项目概述

RadarScout 是一个现代化的科技产品评测和导购网站，专注于智能家居、可穿戴设备和健康监测技术。

### ✨ 特性

- ✅ **33+ 产品数据库** - 智能戒指、手表、家居设备等
- ✅ **5 篇原创文章** (13,100+ 字) - 购买指南、对比、评测
- ✅ **MDX 文章系统** - 灵活的内容管理
- ✅ **全文搜索** - 同时搜索文章和产品
- ✅ **SEO 优化** - 完整 Meta 标签和 Schema.org
- ✅ **响应式设计** - 完美移动端支持
- ✅ **商业化就绪** - AdSense + Affiliate 集成

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
npm run build
npm run start
```

## 📝 添加内容

### 新建文章

在 `content/articles/[category]/` 创建 `.mdx`:

```yaml
---
title: "文章标题"
description: "描述"
category: "Buying Guides"
publishedAt: "2026-05-19"
tags: ["tag1"]
featured: true
---

## 内容开始

文章正文...
```

### 新建产品

在 `content/products/` 创建 `product-slug.json`

## 🌐 部署到 Vercel

```bash
# 推送到 GitHub
./deploy-to-github.sh

# 或手动
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

然后在 Vercel:
1. 导入 GitHub 仓库
2. 点击 Deploy
3. 完成！

详细指南: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

## 🛠️ 技术栈

- Next.js 16 + TypeScript
- Tailwind CSS v4
- MDX + Remark/Rehype
- Vercel Deployment

## 📊 内容统计

- **文章**: 5 篇 (13,100+ 字)
- **产品**: 33 个
- **分类**: 4 个 (Buying Guides, Reviews, Comparisons, Guides)

## 📄 文档

- [技术集成文档](./TECHNICAL_INTEGRATION_COMPLETE.md)
- [部署指南](./VERCEL_DEPLOYMENT_GUIDE.md)
- [快速启动](./QUICK_START_GUIDE.md)

## 📈 路线图

- [ ] 50+ 产品
- [ ] 20+ 文章
- [ ] 评论系统
- [ ] Newsletter
- [ ] 产品图片

---

Made with ❤️ by RadarScout Team
