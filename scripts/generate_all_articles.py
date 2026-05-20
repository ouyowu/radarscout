#!/usr/bin/env python3
import subprocess
import os

print("🎯 RadarScout 原创内容生成系统\n")
print("=" * 60)

# 1. 生成购买指南
print("\n📝 Step 1: Generating Buying Guides...")
subprocess.run(["python3", "scripts/generate_original_articles.py"])

# 2. 生成对比文章
print("\n📝 Step 2: Generating Comparison Articles...")

comparisons = [
    ("oura-ring-4", "whoop", "features"),
    ("apple-watch-series", "samsung-galaxy-watch-6", "use-case"),
    ("google-nest-doorbell", "ring-video-doorbell-pro-2", "price"),
    ("dexcom-g7", "freestyle-libre-3", "features"),
    ("philips-hue-starter-kit", "lifx-color-a19", "price"),
]

import sys
sys.path.append('.')
from scripts.generate_comparisons import ComparisonGenerator
import json
from datetime import datetime

generator = ComparisonGenerator()
output_dir = "content/articles/comparisons"
os.makedirs(output_dir, exist_ok=True)

for slug1, slug2, angle in comparisons:
    article = generator.generate_comparison(slug1, slug2, angle=angle)
    if article:
        filename = f"{slug1}-vs-{slug2}.md"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w') as f:
            f.write(f"""---
title: "{article['title']}"
description: "{article['description']}"
category: "{article['category']}"
publishedAt: "{article['publishedAt']}"
tags: {json.dumps(article['tags'])}
---

{article['content']}

---

*Last updated: {datetime.now().strftime('%B %d, %Y')}*
""")
        print(f"✓ {filename}")

# 3. 统计
print("\n" + "=" * 60)
print("📊 Content Summary:")

buying_guides = len([f for f in os.listdir("content/articles/buying-guides") if f.endswith('.md')])
comparisons_count = len([f for f in os.listdir("content/articles/comparisons") if f.endswith('.md')])
products = len([f for f in os.listdir("content/products") if f.endswith('.json')])

print(f"  Products: {products}")
print(f"  Buying Guides: {buying_guides}")
print(f"  Comparison Articles: {comparisons_count}")
print(f"  Total Articles: {buying_guides + comparisons_count}")

print("\n✅ All original content generated!")
print("\n💡 Next steps:")
print("  1. Review articles in content/articles/")
print("  2. Customize any content as needed")
print("  3. Build and deploy: npm run build")
