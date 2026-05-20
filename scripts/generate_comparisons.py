#!/usr/bin/env python3
"""
生成产品对比文章 - 每篇都有独特视角
"""

import json
import os
from datetime import datetime

class ComparisonGenerator:
    
    def __init__(self, products_dir="content/products"):
        self.products_dir = products_dir
        self.products = self.load_products()
    
    def load_products(self):
        products = {}
        for file in os.listdir(self.products_dir):
            if file.endswith('.json'):
                with open(os.path.join(self.products_dir, file)) as f:
                    data = json.load(f)
                    products[data['slug']] = data
        return products
    
    def generate_comparison(self, slug1, slug2, angle="features"):
        """
        生成对比文章
        angle 可以是: features, price, use-case, technical
        """
        p1 = self.products.get(slug1)
        p2 = self.products.get(slug2)
        
        if not p1 or not p2:
            print(f"Products not found: {slug1}, {slug2}")
            return None
        
        # 根据角度选择文章结构
        if angle == "features":
            content = self._compare_features(p1, p2)
        elif angle == "price":
            content = self._compare_value(p1, p2)
        elif angle == "use-case":
            content = self._compare_use_cases(p1, p2)
        else:
            content = self._compare_technical(p1, p2)
        
        article = {
            "title": f"{p1['name']} vs {p2['name']}: Which {p1['category']} Wins in 2026?",
            "description": f"Detailed comparison of {p1['name']} and {p2['name']}. Find out which {p1['category'].lower()} is the better choice for your needs.",
            "category": "Comparisons",
            "publishedAt": datetime.now().isoformat(),
            "tags": [p1['category'], p2['name'], p1['name'], "comparison"],
            "content": content
        }
        
        return article
    
    def _compare_features(self, p1, p2):
        """功能对比视角"""
        return f"""Shopping for a {p1['category'].lower()}? The choice between {p1['name']} and {p2['name']} comes down to what matters most in your daily routine.

## Quick Verdict

**{p1['name']}** wins if you prioritize {p1['bestFor'][0].lower()}.  
**{p2['name']}** is better for {p2['bestFor'][0].lower()}.

Still with me? Let's dig into the details.

## Core Features Comparison

### {p1['name']}: {p1['summary']}

The standout here is {p1['pros'][0].lower()}. {p1['name']} from {p1['brand']} delivers {p1['features'][0].lower()} with {p1['features'][1].lower() if len(p1['features']) > 1 else 'solid performance'}.

**Key strengths:**
- {p1['pros'][0]}
- {p1['pros'][1] if len(p1['pros']) > 1 else 'Reliable performance'}

**Watch out for:**
- {p1['cons'][0] if p1['cons'] else 'No major drawbacks'}

### {p2['name']}: {p2['summary']}

{p2['name']} takes a different approach. {p2['pros'][0]}—which makes it ideal if you're {p2['bestFor'][0].lower()}.

**Key strengths:**
- {p2['pros'][0]}
- {p2['pros'][1] if len(p2['pros']) > 1 else 'Strong core functionality'}

**Watch out for:**
- {p2['cons'][0] if p2['cons'] else 'Minimal limitations'}

## Battery Life Battle

{p1['name']}: {p1.get('batteryLife', 'Standard battery')}  
{p2['name']}: {p2.get('batteryLife', 'Standard battery')}

{'The battery difference is significant here.' if p1.get('batteryLife') != p2.get('batteryLife') else 'Both offer similar battery performance.'}

## Who Wins?

There's no universal winner—it depends on your priorities.

**Choose {p1['name']} if:**
- {p1['bestFor'][0]}
- {p1['bestFor'][1] if len(p1['bestFor']) > 1 else 'You value ' + p1['pros'][0].lower()}

**Choose {p2['name']} if:**
- {p2['bestFor'][0]}
- {p2['bestFor'][1] if len(p2['bestFor']) > 1 else 'You prioritize ' + p2['pros'][0].lower()}

## The Real Question

Don't ask which is "better"—ask which fits your life. {p1['name']} and {p2['name']} excel in different areas. Match your primary need to the product's core strength, and you'll be happy with either choice."""
    
    def _compare_value(self, p1, p2):
        """价值对比视角"""
        return f"""Let's talk money. Both {p1['name']} and {p2['name']} sit in the {p1['priceRange']} price range, but that doesn't mean they offer the same value.

## Price vs Performance

### Initial Investment

{p1['name']}: {p1['priceRange']} upfront  
{p2['name']}: {p2['priceRange']} upfront

### The Subscription Factor

This matters more than you think.

**{p1['name']}:** {'Requires subscription' if p1.get('subscriptionRequired') else 'No subscription needed'}  
**{p2['name']}:** {'Requires subscription' if p2.get('subscriptionRequired') else 'No subscription needed'}

{self._subscription_analysis(p1, p2)}

## What You Actually Get

### {p1['name']} Value Proposition

For your money, you get: {', '.join(p1['features'][:3])}.

The real value? {p1['pros'][0]}. That's harder to find than you'd think at this price point.

### {p2['name']} Value Proposition

{p2['name']} delivers: {', '.join(p2['features'][:3])}.

Where it shines: {p2['pros'][0]}. That's its competitive edge.

## Long-Term Cost Analysis

Over two years:
- {p1['name']}: Initial cost {'+ subscription fees' if p1.get('subscriptionRequired') else '+ no recurring fees'}
- {p2['name']}: Initial cost {'+ subscription fees' if p2.get('subscriptionRequired') else '+ no recurring fees'}

{self._value_conclusion(p1, p2)}

## The Value Verdict

**Best overall value:** {self._pick_value_winner(p1, p2)}

Why? {self._value_reasoning(p1, p2)}"""
    
    def _subscription_analysis(self, p1, p2):
        if p1.get('subscriptionRequired') and p2.get('subscriptionRequired'):
            return "Both require subscriptions, so factor that into your budget planning."
        elif p1.get('subscriptionRequired') or p2.get('subscriptionRequired'):
            return "The subscription difference is significant—calculate the true two-year cost before deciding."
        else:
            return "No subscriptions here, which keeps long-term costs predictable."
    
    def _value_conclusion(self, p1, p2):
        return f"The total cost of ownership shifts the value equation. Don't just compare sticker prices."
    
    def _pick_value_winner(self, p1, p2):
        # Simple logic: no subscription = better value if similar price
        if not p1.get('subscriptionRequired') and p2.get('subscriptionRequired'):
            return p1['name']
        elif not p2.get('subscriptionRequired') and p1.get('subscriptionRequired'):
            return p2['name']
        else:
            return f"Depends on your priorities"
    
    def _value_reasoning(self, p1, p2):
        return f"Consider both upfront cost and long-term expenses. {p1['name']} and {p2['name']} serve different user priorities."
    
    def _compare_use_cases(self, p1, p2):
        """使用场景对比视角"""
        return f"""Wrong product for your situation = wasted money. Let's match {p1['name']} and {p2['name']} to real-world use cases.

## Use Case #1: {p1['bestFor'][0]}

**Winner: {p1['name']}**

Why it works: {p1['pros'][0]}. This directly supports {p1['bestFor'][0].lower()}.

Real-world scenario: {self._scenario_p1(p1)}

## Use Case #2: {p2['bestFor'][0]}

**Winner: {p2['name']}**

Why it works: {p2['pros'][0]}. Perfect if you're {p2['bestFor'][0].lower()}.

Real-world scenario: {self._scenario_p2(p2)}

## Use Case #3: {p1['notBestFor'][0] if p1['notBestFor'] else 'General use'}

**Consider alternatives**

Neither {p1['name']} nor {p2['name']} excels here. {p1['cons'][0] if p1['cons'] else 'Both have limitations'} and {p2['cons'][0] if p2['cons'] else 'certain constraints'}.

## Ecosystem Integration

{p1['name']}: Works with {', '.join(p1.get('ecosystems', ['standard platforms']))}  
{p2['name']}: Works with {', '.join(p2.get('ecosystems', ['standard platforms']))}

This matters if you're already invested in a specific ecosystem.

## The Use-Case Verdict

Don't buy based on specs—buy based on how you'll actually use it.

- **Daily health tracking:** {self._daily_winner(p1, p2)}
- **Occasional monitoring:** {self._occasional_winner(p1, p2)}
- **Serious training:** {self._training_winner(p1, p2)}

Map your primary use case to product strengths, and the decision becomes obvious."""
    
    def _scenario_p1(self, p):
        return f"You want {p['bestFor'][0].lower()}. {p['name']} excels here."
    
    def _scenario_p2(self, p):
        return f"Your focus is {p['bestFor'][0].lower()}. {p['name']} is built for this."
    
    def _daily_winner(self, p1, p2):
        return p1['name'] if 'tracking' in p1['bestFor'][0].lower() else p2['name']
    
    def _occasional_winner(self, p1, p2):
        return p2['name']
    
    def _training_winner(self, p1, p2):
        return p1['name'] if 'athlete' in str(p1['bestFor']).lower() else p2['name']


# 使用示例
if __name__ == "__main__":
    generator = ComparisonGenerator()
    
    # 生成对比文章
    comparisons = [
        ("oura-ring-4", "whoop", "features"),
        ("apple-watch-series", "garmin-fenix-7", "use-case"),
        ("google-nest-doorbell", "ring-video-doorbell-pro-2", "price"),
    ]
    
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
            print(f"✓ Generated: {filename} (Angle: {angle})")
    
    print(f"\n✅ Comparison articles generated in {output_dir}/")
