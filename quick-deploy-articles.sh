#!/bin/bash

# RadarScout - 快速部署新文章脚本
# 用法: ./quick-deploy-articles.sh

set -e

echo "🚀 RadarScout 新文章部署脚本"
echo "================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 radarscout 项目根目录运行此脚本"
    exit 1
fi

echo "📦 检查新文章文件..."

# 检查新文章是否存在
NEW_ARTICLES=(
    "content/articles/buying-guides/best-smart-home-devices-for-beginners.mdx"
    "content/articles/buying-guides/best-smart-locks-for-apartments.mdx"
    "content/articles/buying-guides/best-air-quality-monitors.mdx"
    "content/articles/comparisons/ring-vs-nest-doorbell.mdx"
)

MISSING_COUNT=0
for article in "${NEW_ARTICLES[@]}"; do
    if [ ! -f "$article" ]; then
        echo "   ⚠️  缺失: $article"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    else
        echo "   ✓ 找到: $(basename $article)"
    fi
done

if [ $MISSING_COUNT -gt 0 ]; then
    echo ""
    echo "❌ 错误: 发现 $MISSING_COUNT 个文章文件缺失"
    echo ""
    echo "请先解压 new-articles-pack.tar.gz 并复制文件："
    echo "  tar -xzf new-articles-pack.tar.gz"
    echo "  cp -r content/articles/* YOUR_PROJECT/content/articles/"
    echo ""
    exit 1
fi

echo ""
echo "✅ 所有新文章文件就绪"
echo ""

# 显示 Git 状态
echo "📊 检查 Git 状态..."
git status --short content/articles/

echo ""
read -p "确认要提交这些更改吗? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ 部署已取消"
    exit 0
fi

echo ""
echo "📝 添加文件到 Git..."
git add content/articles/buying-guides/best-smart-home-devices-for-beginners.mdx
git add content/articles/buying-guides/best-smart-locks-for-apartments.mdx
git add content/articles/buying-guides/best-air-quality-monitors.mdx
git add content/articles/comparisons/ring-vs-nest-doorbell.mdx

echo "✅ 文件已添加"
echo ""

echo "💾 创建提交..."
git commit -m "Add 4 new articles

- Best Smart Home Devices for Beginners (3,200 words)
- Best Smart Locks for Apartments (2,800 words)
- Best Air Quality Monitors (3,000 words)
- Ring vs Nest Doorbell Comparison (2,400 words)

Total: 11,400 words of new original content"

echo "✅ 提交已创建"
echo ""

echo "🚀 推送到 GitHub..."
git push origin main

echo ""
echo "================================"
echo "✅ 部署成功!"
echo "================================"
echo ""
echo "接下来发生的事："
echo "  1. GitHub 接收到更新"
echo "  2. Vercel 自动检测变化"
echo "  3. 开始构建（约 2-3 分钟）"
echo "  4. 自动部署到生产环境"
echo ""
echo "📊 查看部署状态："
echo "  https://vercel.com/dashboard"
echo ""
echo "🌐 新文章将在这些 URL 可用："
echo "  /buying-guides/best-smart-home-devices-for-beginners"
echo "  /buying-guides/best-smart-locks-for-apartments"
echo "  /buying-guides/best-air-quality-monitors"
echo "  /comparisons/ring-vs-nest-doorbell"
echo ""
echo "🎉 恭喜！你的网站现在有 15 篇文章了！"
echo ""
