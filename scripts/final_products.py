#!/usr/bin/env python3
import json
import os

# Complete 30+ product database
PRODUCTS = [
    # ADDITIONAL SMART WATCHES
    {
        "slug": "coros-apex-2-pro",
        "name": "COROS APEX 2 Pro",
        "brand": "COROS",
        "category": "Smart Watch",
        "summary": "Ultra-endurance GPS watch with exceptional battery life for serious athletes.",
        "priceRange": "$$$",
        "officialUrl": "https://coros.com",
        "releaseYear": 2024,
        "ecosystems": ["iOS", "Android"],
        "connectivity": ["Bluetooth", "GPS"],
        "sensors": ["Heart rate", "SpO2", "Barometer", "Compass"],
        "features": ["Multi-GNSS", "Training load tracking", "Race predictor", "Global maps"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 30 days",
        "pros": ["Exceptional battery life", "Accurate GPS", "Detailed training metrics", "No subscription"],
        "cons": ["Smaller app ecosystem", "Less smart features", "Basic UI"],
        "bestFor": ["Ultra-endurance athletes", "Multi-day adventures", "Detailed training data"],
        "notBestFor": ["Casual users", "Smartwatch features", "Fashion-conscious buyers"],
        "alternatives": ["garmin-fenix-7", "polar-grit-x", "suunto-9-peak"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://coros.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # ADDITIONAL SMART HOME
    {
        "slug": "nanoleaf-shapes",
        "name": "Nanoleaf Shapes Hexagons",
        "brand": "Nanoleaf",
        "category": "Smart Lighting",
        "summary": "Modular hexagonal light panels with touch control and music sync.",
        "priceRange": "$$$",
        "officialUrl": "https://nanoleaf.me",
        "releaseYear": 2023,
        "ecosystems": ["Matter", "HomeKit", "Alexa", "Google Home"],
        "connectivity": ["Wi-Fi", "Thread"],
        "sensors": ["Touch"],
        "features": ["16M colors", "Touch-reactive", "Music sync", "Screen mirror"],
        "subscriptionRequired": False,
        "batteryLife": "N/A",
        "pros": ["Unique design", "Touch control", "Music reactive", "Expandable"],
        "cons": ["Very expensive", "Requires planning", "Not for general lighting"],
        "bestFor": ["Ambient lighting", "Gaming setups", "Creative spaces"],
        "notBestFor": ["Budget buyers", "General lighting", "Traditional decor"],
        "alternatives": ["philips-hue-gradient", "govee-glide", "lifx-beam"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://nanoleaf.me"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "eufy-video-doorbell-2k",
        "name": "eufy Security Video Doorbell 2K",
        "brand": "eufy",
        "category": "Smart Doorbell",
        "summary": "Battery-powered doorbell with 2K resolution and local storage, no subscription needed.",
        "priceRange": "$$",
        "officialUrl": "https://eufy.com",
        "releaseYear": 2023,
        "ecosystems": ["Alexa", "Google Home"],
        "connectivity": ["Wi-Fi"],
        "sensors": ["Camera", "Motion", "Person detection"],
        "features": ["2K resolution", "Local storage", "No subscription", "AI detection"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 180 days",
        "pros": ["No subscription needed", "Local storage", "Long battery", "2K video"],
        "cons": ["No HomeKit", "Basic app", "Slower notifications"],
        "bestFor": ["Privacy-conscious users", "No subscription preference", "Budget-conscious"],
        "notBestFor": ["HomeKit users", "Cloud storage preference"],
        "alternatives": ["ring-video-doorbell-pro-2", "google-nest-doorbell", "aqara-doorbell"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://eufy.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "schlage-encode-plus",
        "name": "Schlage Encode Plus",
        "brand": "Schlage",
        "category": "Smart Lock",
        "summary": "WiFi smart lock with built-in alarm and Apple Home Key support.",
        "priceRange": "$$$",
        "officialUrl": "https://schlage.com",
        "releaseYear": 2024,
        "ecosystems": ["HomeKit", "Alexa", "Google Home"],
        "connectivity": ["Wi-Fi"],
        "sensors": ["Keypad"],
        "features": ["Apple Home Key", "Built-in alarm", "Auto-lock", "Voice control"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 12 months",
        "pros": ["Apple Home Key", "Built-in WiFi", "Alarm feature", "No hub needed"],
        "cons": ["Expensive", "Full lock replacement", "Battery-powered"],
        "bestFor": ["iPhone users", "Security priority", "Keyless preference"],
        "notBestFor": ["Budget buyers", "Renters"],
        "alternatives": ["yale-assure-lock-2", "august-wifi-smart-lock", "level-lock"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://schlage.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "wyze-cam-v3",
        "name": "Wyze Cam v3",
        "brand": "Wyze",
        "category": "Smart Camera",
        "summary": "Budget-friendly indoor/outdoor camera with color night vision.",
        "priceRange": "$",
        "officialUrl": "https://wyze.com",
        "releaseYear": 2023,
        "ecosystems": ["Alexa", "Google Home"],
        "connectivity": ["Wi-Fi"],
        "sensors": ["Camera", "Motion", "Sound"],
        "features": ["Color night vision", "Two-way audio", "Local/cloud storage", "Weather resistant"],
        "subscriptionRequired": False,
        "batteryLife": "N/A (Wired)",
        "pros": ["Very affordable", "Color night vision", "Indoor/outdoor", "Local SD storage"],
        "cons": ["Basic app", "Cloud features need subscription", "Frequent updates"],
        "bestFor": ["Budget security", "Multiple camera setups", "Casual monitoring"],
        "notBestFor": ["HomeKit users", "Premium features", "Advanced AI"],
        "alternatives": ["blink-outdoor", "eufy-cam-2c", "ring-stick-up-cam"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://wyze.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # HEALTH TECH
    {
        "slug": "withings-bpm-connect",
        "name": "Withings BPM Connect",
        "brand": "Withings",
        "category": "Blood Pressure Monitor",
        "summary": "Compact WiFi blood pressure monitor with automatic sync to Health Mate app.",
        "priceRange": "$$",
        "officialUrl": "https://withings.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android", "Apple Health"],
        "connectivity": ["Wi-Fi", "Bluetooth"],
        "sensors": ["Blood pressure", "Heart rate"],
        "features": ["WiFi sync", "Clinically validated", "Color-coded feedback", "Multi-user"],
        "subscriptionRequired": False,
        "batteryLife": "6+ months (4 AAA)",
        "pros": ["WiFi connectivity", "Compact design", "Easy to use", "App integration"],
        "cons": ["Wrist measurement less accurate", "Small display", "Premium price"],
        "bestFor": ["Frequent monitoring", "App tracking", "Travel"],
        "notBestFor": ["Upper arm preference", "Budget buyers"],
        "alternatives": ["omron-complete", "qardioarm", "evolv-bp-monitor"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://withings.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "garmin-index-s2",
        "name": "Garmin Index S2 Smart Scale",
        "brand": "Garmin",
        "category": "Smart Scale",
        "summary": "Smart scale with comprehensive body composition and Garmin Connect integration.",
        "priceRange": "$$",
        "officialUrl": "https://garmin.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android", "Garmin Connect"],
        "connectivity": ["Wi-Fi", "Bluetooth"],
        "sensors": ["Weight", "Body composition"],
        "features": ["Body composition", "Multi-user", "Weather display", "Trend graphs"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 9 months",
        "pros": ["Garmin ecosystem integration", "Accurate", "Weather display", "Multi-user"],
        "cons": ["Garmin ecosystem focused", "Expensive for features", "Basic app"],
        "bestFor": ["Garmin watch users", "Athletes", "Multi-user families"],
        "notBestFor": ["Non-Garmin users", "Budget buyers"],
        "alternatives": ["withings-body-comp", "fitbit-aria-air", "eufy-smart-scale"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://garmin.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # MORE CATEGORIES
    {
        "slug": "amazfit-gtr-4",
        "name": "Amazfit GTR 4",
        "brand": "Amazfit",
        "category": "Smart Watch",
        "summary": "Affordable smartwatch with comprehensive health tracking and impressive battery life.",
        "priceRange": "$$",
        "officialUrl": "https://amazfit.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android"],
        "connectivity": ["Bluetooth", "GPS"],
        "sensors": ["Heart rate", "SpO2", "Stress"],
        "features": ["Dual-band GPS", "150+ sports modes", "Alexa built-in", "Music storage"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 14 days",
        "pros": ["Great battery life", "Affordable", "AMOLED display", "Comprehensive tracking"],
        "cons": ["Basic smart features", "Third-party app limitations", "Weaker ecosystem"],
        "bestFor": ["Budget buyers", "Battery life priority", "Fitness tracking"],
        "notBestFor": ["Advanced smart features", "Strong ecosystem needs"],
        "alternatives": ["fitbit-sense-2", "samsung-galaxy-watch-6", "garmin-venu"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://amazfit.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "polar-h10",
        "name": "Polar H10 Heart Rate Sensor",
        "brand": "Polar",
        "category": "Heart Rate Monitor",
        "summary": "Professional-grade chest strap heart rate monitor with exceptional accuracy.",
        "priceRange": "$$",
        "officialUrl": "https://polar.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android", "ANT+"],
        "connectivity": ["Bluetooth", "ANT+"],
        "sensors": ["Heart rate", "ECG"],
        "features": ["Most accurate HR", "Waterproof", "Internal memory", "Multi-sport"],
        "subscriptionRequired": False,
        "batteryLife": "400 hours (CR2025)",
        "pros": ["Most accurate", "Waterproof", "ANT+ and Bluetooth", "Proven reliability"],
        "cons": ["Chest strap less comfortable", "No display", "Requires washing"],
        "bestFor": ["Serious athletes", "Accuracy priority", "Training zones"],
        "notBestFor": ["Casual users", "24/7 tracking", "Strap aversion"],
        "alternatives": ["garmin-hrm-pro", "wahoo-tickr-x", "coros-pod-2"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://polar.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "hubitat-elevation",
        "name": "Hubitat Elevation",
        "brand": "Hubitat",
        "category": "Smart Home Hub",
        "summary": "Local smart home hub supporting Zigbee, Z-Wave, and Matter with no cloud dependency.",
        "priceRange": "$$",
        "officialUrl": "https://hubitat.com",
        "releaseYear": 2024,
        "ecosystems": ["Zigbee", "Z-Wave", "Matter", "HomeKit"],
        "connectivity": ["Ethernet", "Zigbee", "Z-Wave"],
        "sensors": [],
        "features": ["Local processing", "No cloud required", "Advanced automation", "Matter hub"],
        "subscriptionRequired": False,
        "batteryLife": "N/A",
        "pros": ["Complete local control", "No subscriptions", "Powerful automation", "Privacy-focused"],
        "cons": ["Steeper learning curve", "Requires technical knowledge", "Less polished UI"],
        "bestFor": ["Privacy advocates", "Advanced users", "Local control priority"],
        "notBestFor": ["Beginners", "Simple setup needs", "Cloud service preference"],
        "alternatives": ["home-assistant-green", "smartthings-hub", "homey-pro"],
        "affiliateLinks": [{"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}],
        "sources": [{"title": "Official product page", "url": "https://hubitat.com"}],
        "lastUpdated": "2026-05-19"
    }
]

output_dir = "content/products"
os.makedirs(output_dir, exist_ok=True)

created = 0
for product in PRODUCTS:
    filepath = os.path.join(output_dir, f"{product['slug']}.json")
    with open(filepath, 'w') as f:
        json.dump(product, f, indent=2)
    created += 1
    print(f"✓ {created:2d}. {product['name']}")

existing_files = [f for f in os.listdir(output_dir) if f.endswith('.json')]
print(f"\n✅ Generated {created} new products")
print(f"📊 Total: {len(existing_files)} products")
