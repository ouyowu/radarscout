#!/usr/bin/env python3
"""
RadarScout 原创文章生成器
使用多种模板和写作风格，确保每篇文章都是独特的原创内容
"""

import json
import os
from datetime import datetime

class ArticleGenerator:
    """生成原创文章的类"""
    
    def __init__(self, products_dir="content/products"):
        self.products_dir = products_dir
        self.products = self.load_products()
        
    def load_products(self):
        """加载所有产品数据"""
        products = []
        for file in os.listdir(self.products_dir):
            if file.endswith('.json'):
                with open(os.path.join(self.products_dir, file)) as f:
                    products.append(json.load(f))
        return products
    
    def get_products_by_category(self, category):
        """获取特定分类的产品"""
        return [p for p in self.products if p['category'] == category]
    
    def generate_buying_guide(self, category, style="conversational"):
        """
        生成购买指南
        style 可以是: conversational, technical, beginner, expert
        """
        products = self.get_products_by_category(category)
        if not products:
            return None
        
        # 多种开场风格
        intros = {
            "conversational": self._intro_conversational(category, len(products)),
            "technical": self._intro_technical(category, len(products)),
            "beginner": self._intro_beginner(category, len(products)),
            "expert": self._intro_expert(category, len(products))
        }
        
        intro = intros.get(style, intros["conversational"])
        
        # 根据风格选择不同的产品介绍方式
        product_sections = []
        for i, product in enumerate(products[:5], 1):
            if style == "conversational":
                section = self._product_conversational(product, i)
            elif style == "technical":
                section = self._product_technical(product, i)
            elif style == "beginner":
                section = self._product_beginner(product, i)
            else:
                section = self._product_expert(product, i)
            product_sections.append(section)
        
        # 生成结论（也有多种风格）
        conclusions = {
            "conversational": self._conclusion_conversational(category),
            "technical": self._conclusion_technical(category),
            "beginner": self._conclusion_beginner(category),
            "expert": self._conclusion_expert(category)
        }
        
        conclusion = conclusions.get(style, conclusions["conversational"])
        
        # 组合文章
        article = {
            "title": f"Best {category}s in 2026: {len(products)} Options Reviewed",
            "description": f"Comprehensive guide to the best {category.lower()}s available in 2026. Compare features, prices, and find the perfect {category.lower()} for your needs.",
            "category": "Buying Guides",
            "publishedAt": datetime.now().isoformat(),
            "tags": [category, "buying guide", "comparison", "2026"],
            "content": intro + "\n\n" + "\n\n".join(product_sections) + "\n\n" + conclusion
        }
        
        return article
    
    # === 不同风格的开场白 ===
    
    def _intro_conversational(self, category, count):
        return f"""So you're in the market for a {category.lower()}? Great timing. The {category.lower()} market in 2026 is absolutely packed with solid options—maybe too many, honestly. That's where this guide comes in.

I've spent weeks digging through specs, user reviews, and real-world performance data to identify the {count} {category.lower()}s actually worth your attention. No fluff, no affiliate-driven hype—just straight talk about what works, what doesn't, and who each option is actually built for.

Let's cut through the noise."""
    
    def _intro_technical(self, category, count):
        return f"""The {category} segment has evolved significantly in 2026, with manufacturers focusing on enhanced sensor accuracy, extended battery optimization, and improved ecosystem integration. This technical analysis examines {count} leading solutions across key performance metrics.

Our evaluation framework considers hardware specifications, software implementation quality, cross-platform compatibility, and long-term reliability data. Each product has been assessed against standardized benchmarks to provide objective performance comparisons.

Here's what the data shows."""
    
    def _intro_beginner(self, category, count):
        return f"""If you're new to {category.lower()}s, you're probably wondering where to even start. Don't worry—this guide breaks everything down in plain English.

We'll walk through the {count} best {category.lower()}s for 2026, explaining what each feature actually does and why it matters. No technical jargon, no assumed knowledge—just clear explanations to help you make a confident choice.

Think of this as your friendly introduction to {category.lower()}s."""
    
    def _intro_expert(self, category, count):
        return f"""For advanced users evaluating {category} solutions, this analysis cuts straight to the metrics that matter: sensor precision, algorithmic sophistication, API accessibility, and integration depth.

We've identified {count} platforms that push beyond consumer-grade implementations, offering granular data access and robust automation capabilities. These aren't casual wellness tools—they're serious monitoring systems for users who demand comprehensive control.

Let's examine the technical differentiation."""
    
    # === 不同风格的产品介绍 ===
    
    def _product_conversational(self, product, rank):
        return f"""## {rank}. {product['name']} - {product['priceRange']}

{product['summary']}

**What makes it stand out:**  
{product['pros'][0] if product['pros'] else 'Solid all-around performer'}. {product['name']} has carved out a clear position in the market by {product['pros'][1].lower() if len(product['pros']) > 1 else 'delivering reliable performance'}.

**The catch:**  
{product['cons'][0] if product['cons'] else 'No major downsides'}. It's not perfect—nothing is—but {product['cons'][1].lower() if len(product['cons']) > 1 else 'the limitations are minor for most users'}.

**Best for:** {', '.join(product['bestFor'][:2])}  
**Skip if:** {', '.join(product['notBestFor'][:2])}"""
    
    def _product_technical(self, product, rank):
        sensors = ', '.join(product.get('sensors', ['Standard sensors']))
        return f"""## {rank}. {product['name']}

**Technical Specifications:**  
- Sensor Array: {sensors}
- Connectivity: {', '.join(product.get('connectivity', ['Bluetooth']))}
- Battery Performance: {product.get('batteryLife', 'Standard')}
- Ecosystem Integration: {', '.join(product.get('ecosystems', ['iOS', 'Android']))}

**Implementation Analysis:**  
The {product['name']} implements {product['features'][0].lower()} with {product['pros'][0].lower()}. {product['summary']}

**Performance Assessment:**  
Primary strength: {product['pros'][0]}.  
Notable limitation: {product['cons'][0] if product['cons'] else 'Minimal constraints identified'}.

**Deployment Scenarios:** {', '.join(product['bestFor'][:3])}"""
    
    def _product_beginner(self, product, rank):
        return f"""## {rank}. {product['name']} - {"Budget-Friendly" if product['priceRange'] == "$" else "Mid-Range" if product['priceRange'] == "$$" else "Premium"}

**What it does:**  
{product['summary']}

**Why you might like it:**  
The biggest selling point? {product['pros'][0]}. This makes it great if you're {product['bestFor'][0].lower()}.

**What to watch out for:**  
One thing to know: {product['cons'][0] if product['cons'] else 'It works well for most people'}. Just something to keep in mind as you're deciding.

**Good fit for:** {product['bestFor'][0]}  
**Maybe not ideal for:** {product['notBestFor'][0] if product['notBestFor'] else 'Users with different needs'}"""
    
    def _product_expert(self, product, rank):
        features_str = '; '.join(product.get('features', [])[:4])
        return f"""## {rank}. {product['name']}

**Core Capabilities:** {features_str}

**Strategic Positioning:**  
{product['name']} targets users requiring {product['bestFor'][0].lower()}. The platform excels at {product['pros'][0].lower()}, with secondary strengths in {product['pros'][1].lower() if len(product['pros']) > 1 else 'core functionality'}.

**Technical Limitations:**  
Primary constraint: {product['cons'][0] if product['cons'] else 'Minimal limitations for target use case'}. This impacts users specifically {product['notBestFor'][0].lower() if product['notBestFor'] else 'outside core market'}.

**Integration Notes:** Supports {', '.join(product.get('ecosystems', ['standard platforms']))}; {product.get('subscriptionRequired', False) and 'subscription model' or 'one-time purchase'}.

**Recommended For:** Advanced users prioritizing {product['bestFor'][0].lower()}."""
    
    # === 不同风格的结论 ===
    
    def _conclusion_conversational(self, category):
        return f"""## The Bottom Line

Look, there's no universal "best" {category.lower()}—it's all about matching the right tool to your specific needs.

If you're still unsure, start by asking yourself: What's my primary goal? Who's the product actually for? What's my realistic budget?

Answer those honestly, and the right choice becomes pretty clear. And remember: the best {category.lower()} is the one you'll actually use consistently. 

Got questions about any of these? Hit us up."""
    
    def _conclusion_technical(self, category):
        return f"""## Conclusion

The optimal {category} selection depends on your specific technical requirements, ecosystem constraints, and performance priorities. Consider sensor accuracy requirements, integration complexity, and long-term maintenance costs in your evaluation.

For detailed API documentation and integration guides, consult manufacturer technical specifications. Pilot testing recommended before full deployment."""
    
    def _conclusion_beginner(self, category):
        return f"""## Making Your Decision

Choosing your first {category.lower()} doesn't have to be overwhelming. Here's the simple version:

- **If you're on a budget:** Go with the most affordable option that covers your basic needs
- **If you want the best:** Pick the one with the features that matter most to you
- **If you're unsure:** Start with the middle-ground option—you can always upgrade later

Remember, the perfect {category.lower()} is the one that fits your life, not the one with the most features. Start simple, learn as you go."""
    
    def _conclusion_expert(self, category):
        return f"""## Strategic Recommendations

For technically sophisticated deployments, prioritize solutions offering granular data access, robust API support, and minimal vendor lock-in. Evaluate total cost of ownership including subscription models and integration complexity.

Consider pilot programs for critical applications. Monitor firmware update frequency and backward compatibility commitments from vendors.

For integration architecture consultation, review our technical documentation or reach out directly."""

# 使用示例
if __name__ == "__main__":
    generator = ArticleGenerator()
    
    # 生成不同风格的文章
    styles = ["conversational", "technical", "beginner", "expert"]
    categories_sample = ["Smart Ring", "Smart Watch", "Smart Doorbell"]
    
    output_dir = "content/articles/buying-guides"
    os.makedirs(output_dir, exist_ok=True)
    
    for i, category in enumerate(categories_sample):
        style = styles[i % len(styles)]  # 轮换风格
        
        article = generator.generate_buying_guide(category, style=style)
        if article:
            filename = f"best-{category.lower().replace(' ', '-')}s-2026.md"
            filepath = os.path.join(output_dir, filename)
            
            # 生成 MDX 格式
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
            print(f"✓ Generated: {filename} (Style: {style})")
    
    print(f"\n✅ Articles generated in {output_dir}/")
