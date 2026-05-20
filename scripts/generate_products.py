#!/usr/bin/env python3
import json
import os

# Product database
PRODUCTS = [
    # === SMART RINGS (3 more) ===
    {
        "slug": "circular-ring-slim",
        "name": "Circular Ring Slim",
        "brand": "Circular",
        "category": "Smart Ring",
        "summary": "Elegant smart ring with focus on actionable health insights and sleep optimization.",
        "priceRange": "$$$",
        "officialUrl": "https://circular.xyz",
        "releaseYear": 2024,
        "ecosystems": ["iOS", "Android"],
        "connectivity": ["Bluetooth"],
        "sensors": ["Heart rate", "HRV", "Skin temperature", "SpO2", "Accelerometer"],
        "features": ["Sleep tracking", "Energy prediction", "Activity tracking", "Keto mode"],
        "subscriptionRequired": True,
        "batteryLife": "Up to 5 days",
        "pros": [
            "Slim and elegant design",
            "Actionable insights focus",
            "Keto tracking feature",
            "Comfortable for continuous wear"
        ],
        "cons": [
            "Requires subscription",
            "Shorter battery than Oura",
            "Limited third-party integrations"
        ],
        "bestFor": [
            "Fashion-conscious users",
            "Keto diet followers",
            "People wanting actionable advice"
        ],
        "notBestFor": [
            "Budget buyers",
            "Those avoiding subscriptions",
            "Long battery life seekers"
        ],
        "alternatives": ["oura-ring-4", "ultrahuman-ring-air", "ringconn-smart-ring"],
        "affiliateLinks": [
            {"label": "View on Circular", "merchant": "Circular", "region": "Global", "url": "https://circular.xyz", "isAffiliate": False}
        ],
        "sources": [{"title": "Official product page", "url": "https://circular.xyz"}],
        "lastUpdated": "2026-05-19"
    },
    
    # === SMART WATCHES (8 more) ===
    {
        "slug": "google-pixel-watch-2",
        "name": "Google Pixel Watch 2",
        "brand": "Google",
        "category": "Smart Watch",
        "summary": "Google's refined smartwatch with Fitbit integration, excellent for Android users.",
        "priceRange": "$$$",
        "officialUrl": "https://store.google.com",
        "releaseYear": 2024,
        "ecosystems": ["Android", "Limited iOS"],
        "connectivity": ["Bluetooth", "Wi-Fi", "LTE"],
        "sensors": ["Heart rate", "ECG", "SpO2", "Skin temperature", "Accelerometer"],
        "features": ["Fitbit integration", "Google Assistant", "Wear OS apps", "Safety features"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 24 hours",
        "pros": [
            "Excellent Android integration",
            "Fitbit health tracking",
            "Clean design",
            "Google ecosystem benefits"
        ],
        "cons": [
            "Short battery life",
            "Limited iOS support",
            "Smaller app selection than Apple",
            "Crown can be finicky"
        ],
        "bestFor": [
            "Android users",
            "Google ecosystem fans",
            "Fitbit migrators"
        ],
        "notBestFor": [
            "iPhone users",
            "Multi-day battery seekers",
            "Advanced fitness athletes"
        ],
        "alternatives": ["samsung-galaxy-watch-6", "apple-watch-series", "fitbit-sense"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True},
            {"label": "View on Google Store", "merchant": "Google", "region": "Global", "url": "https://store.google.com", "isAffiliate": False}
        ],
        "sources": [{"title": "Official product page", "url": "https://store.google.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "fitbit-sense-2",
        "name": "Fitbit Sense 2",
        "brand": "Fitbit",
        "category": "Smart Watch",
        "summary": "Health-focused smartwatch with stress management and comprehensive wellness features.",
        "priceRange": "$$",
        "officialUrl": "https://fitbit.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android"],
        "connectivity": ["Bluetooth", "GPS"],
        "sensors": ["Heart rate", "ECG", "EDA sensor", "Skin temperature", "SpO2"],
        "features": ["Stress management", "Sleep tracking", "Guided breathing", "Active Zone Minutes"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 6 days",
        "pros": [
            "Excellent battery life",
            "Stress management focus",
            "Comfortable design",
            "More affordable than Apple Watch"
        ],
        "cons": [
            "Limited app selection",
            "Best features need subscription",
            "No music storage",
            "Slower processor"
        ],
        "bestFor": [
            "Stress management focus",
            "Multi-day battery life",
            "Fitbit ecosystem users",
            "Wellness-focused users"
        ],
        "notBestFor": [
            "Power users",
            "Music lovers",
            "Advanced athletes"
        ],
        "alternatives": ["google-pixel-watch-2", "garmin-venu", "apple-watch-series"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True},
            {"label": "View on Fitbit", "merchant": "Fitbit", "region": "Global", "url": "https://fitbit.com", "isAffiliate": False}
        ],
        "sources": [{"title": "Official product page", "url": "https://fitbit.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # === SLEEP TRACKERS (5 products) ===
    {
        "slug": "eight-sleep-pod-4",
        "name": "Eight Sleep Pod 4",
        "brand": "Eight Sleep",
        "category": "Sleep Tracker",
        "summary": "Smart mattress cover with temperature control and comprehensive sleep tracking.",
        "priceRange": "$$$$",
        "officialUrl": "https://eightsleep.com",
        "releaseYear": 2024,
        "ecosystems": ["iOS", "Android"],
        "connectivity": ["Wi-Fi", "Bluetooth"],
        "sensors": ["Heart rate", "HRV", "Respiratory rate", "Movement", "Room temperature"],
        "features": ["Temperature regulation", "Sleep stages", "Smart alarm", "Health insights", "Autopilot mode"],
        "subscriptionRequired": True,
        "batteryLife": "N/A (Powered)",
        "pros": [
            "Active temperature control",
            "Comprehensive sleep data",
            "Non-wearable tracking",
            "Partner-friendly dual zones"
        ],
        "cons": [
            "Very expensive",
            "Requires subscription",
            "Not portable",
            "Complex setup"
        ],
        "bestFor": [
            "Sleep optimization enthusiasts",
            "Hot/cold sleepers",
            "People who dislike wearables",
            "Couples with different temp preferences"
        ],
        "notBestFor": [
            "Budget buyers",
            "Renters",
            "Travelers",
            "Those avoiding subscriptions"
        ],
        "alternatives": ["withings-sleep", "oura-ring-4", "whoop"],
        "affiliateLinks": [
            {"label": "View on Eight Sleep", "merchant": "Eight Sleep", "region": "Global", "url": "https://eightsleep.com", "isAffiliate": False}
        ],
        "sources": [{"title": "Official product page", "url": "https://eightsleep.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "withings-sleep",
        "name": "Withings Sleep Tracking Mat",
        "brand": "Withings",
        "category": "Sleep Tracker",
        "summary": "Non-wearable sleep tracking mat that slips under your mattress for effortless monitoring.",
        "priceRange": "$$",
        "officialUrl": "https://withings.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android", "IFTTT"],
        "connectivity": ["Wi-Fi"],
        "sensors": ["Pressure", "Movement", "Heart rate", "Snoring detection"],
        "features": ["Sleep score", "Sleep cycle analysis", "Snoring detection", "Smart home integration"],
        "subscriptionRequired": False,
        "batteryLife": "N/A (Powered)",
        "pros": [
            "No wearable needed",
            "Set and forget",
            "Smart home integration",
            "No subscription",
            "Affordable"
        ],
        "cons": [
            "Not portable",
            "Single user only",
            "Less accurate than wearables",
            "Requires power outlet nearby"
        ],
        "bestFor": [
            "People who dislike wearables",
            "Smart home enthusiasts",
            "Casual sleep tracking",
            "Budget-conscious buyers"
        ],
        "notBestFor": [
            "Couples sharing a bed",
            "Travelers",
            "Detailed metrics seekers"
        ],
        "alternatives": ["eight-sleep-pod-4", "oura-ring-4", "emfit-qs"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True},
            {"label": "View on Withings", "merchant": "Withings", "region": "Global", "url": "https://withings.com", "isAffiliate": False}
        ],
        "sources": [{"title": "Official product page", "url": "https://withings.com"}],
        "lastUpdated": "2026-05-19"
    }
]

# Continue with more categories...
# I'll add more products in the next batch

# Generate files
output_dir = "content/products"
os.makedirs(output_dir, exist_ok=True)

for product in PRODUCTS:
    filepath = os.path.join(output_dir, f"{product['slug']}.json")
    with open(filepath, 'w') as f:
        json.dump(product, f, indent=2)
    print(f"✓ Created: {product['slug']}.json")

print(f"\n✅ Generated {len(PRODUCTS)} products")
