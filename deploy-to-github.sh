#!/bin/bash

# RadarScout GitHub 部署脚本
# 用法: ./deploy-to-github.sh

set -e

echo "🚀 RadarScout GitHub 部署开始..."
echo ""

# 检查是否已经是 git 仓库
if [ -d .git ]; then
    echo "⚠️  检测到已存在的 git 仓库"
    read -p "是否要重新初始化? (y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        rm -rf .git
        echo "✓ 已删除旧的 git 仓库"
    else
        echo "✓ 使用现有 git 仓库"
    fi
fi

# 初始化 git 仓库（如果需要）
if [ ! -d .git ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git branch -M main
    echo "✓ Git 仓库初始化完成"
fi

# 添加所有文件
echo ""
echo "📝 添加文件到 Git..."
git add .

# 提交
echo ""
echo "💾 创建提交..."
git commit -m "Initial commit: RadarScout MVP with MDX system

- 33 products (Smart Rings, Watches, Home Devices, Health Tech)
- 5 original articles (13,100+ words total)
- Complete MDX article rendering system
- Full-text search (articles + products)
- 4 article categories with filtering
- SEO optimized (Meta tags, Schema.org)
- AdSense + Affiliate ready
- Responsive design
- Production ready" || echo "⚠️  没有新的更改需要提交"

# 询问 GitHub 仓库 URL
echo ""
echo "📡 GitHub 仓库设置"
echo "================================================"
echo ""
echo "请先在 GitHub 创建一个新仓库："
echo "1. 访问 https://github.com/new"
echo "2. 仓库名称: radarscout"
echo "3. 设置为 Public 或 Private"
echo "4. 不要添加 README, .gitignore 或 license"
echo "5. 点击 'Create repository'"
echo ""
read -p "请输入你的 GitHub 仓库 URL (例如: https://github.com/username/radarscout.git): " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ 错误: 仓库 URL 不能为空"
    exit 1
fi

# 检查是否已经设置了 origin
if git remote | grep -q "^origin$"; then
    echo "⚠️  已存在 origin remote"
    read -p "是否要更新为新的 URL? (y/N): " update_origin
    if [ "$update_origin" = "y" ] || [ "$update_origin" = "Y" ]; then
        git remote remove origin
        git remote add origin "$repo_url"
        echo "✓ 已更新 origin remote"
    fi
else
    git remote add origin "$repo_url"
    echo "✓ 已添加 origin remote"
fi

# 推送到 GitHub
echo ""
echo "🚀 推送到 GitHub..."
git push -u origin main

echo ""
echo "✅ 成功推送到 GitHub!"
echo ""
echo "================================================"
echo "下一步: 部署到 Vercel"
echo "================================================"
echo ""
echo "1. 访问 https://vercel.com"
echo "2. 点击 'New Project'"
echo "3. 导入你的 GitHub 仓库: $(basename $repo_url .git)"
echo "4. Vercel 会自动检测 Next.js 配置"
echo "5. 点击 'Deploy' 开始部署"
echo ""
echo "可选: 环境变量设置"
echo "- NEXT_PUBLIC_ENABLE_ADS=false"
echo "- NEXT_PUBLIC_ENABLE_AFFILIATE=true"
echo "- NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-YOUR-ID"
echo ""
echo "部署完成后，你将获得："
echo "- 免费的 .vercel.app 域名"
echo "- 自动 HTTPS"
echo "- 全球 CDN 加速"
echo "- 自动部署（推送即部署）"
echo ""
echo "🎉 准备好上线了！"
echo ""
