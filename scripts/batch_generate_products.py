#!/usr/bin/env python3
import json
import os

# Complete product database for RadarScout
PRODUCTS = [
    # === SMART HOME - DOORBELLS (3 products) ===
    {
        "slug": "ring-video-doorbell-pro-2",
        "name": "Ring Video Doorbell Pro 2",
        "brand": "Ring",
        "category": "Smart Doorbell",
        "summary": "Advanced video doorbell with 3D motion detection and bird's eye view.",
        "priceRange": "$$",
        "officialUrl": "https://ring.com",
        "releaseYear": 2023,
        "ecosystems": ["Alexa", "Ring"],
        "connectivity": ["Wi-Fi"],
        "sensors": ["Camera", "Motion detection", "Audio"],
        "features": ["1536p HD video", "3D motion detection", "Bird's Eye View", "Two-way talk", "Pre-roll video"],
        "subscriptionRequired": False,
        "batteryLife": "Wired",
        "pros": [
            "Excellent video quality",
            "3D motion detection",
            "Bird's Eye aerial view",
            "Alexa integration"
        ],
        "cons": [
            "Requires Ring Protect for full features",
            "Wired only",
            "Limited to Amazon ecosystem"
        ],
        "bestFor": [
            "Alexa users",
            "Detailed motion tracking",
            "High-quality video needs"
        ],
        "notBestFor": [
            "HomeKit users",
            "Wireless installation needs",
            "Those avoiding subscriptions"
        ],
        "alternatives": ["google-nest-doorbell", "aqara-doorbell", "eufy-doorbell"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}
        ],
        "sources": [{"title": "Official product page", "url": "https://ring.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "aqara-video-doorbell-g4",
        "name": "Aqara Video Doorbell G4",
        "brand": "Aqara",
        "category": "Smart Doorbell",
        "summary": "HomeKit-compatible video doorbell with package detection and local storage.",
        "priceRange": "$$",
        "officialUrl": "https://aqara.com",
        "releaseYear": 2024,
        "ecosystems": ["HomeKit", "Alexa", "Google Home"],
        "connectivity": ["Wi-Fi"],
        "sensors": ["Camera", "Motion detection", "Package detection"],
        "features": ["1080p video", "Package detection", "Local storage", "Dual-band Wi-Fi", "Face recognition"],
        "subscriptionRequired": False,
        "batteryLife": "Wired",
        "pros": [
            "HomeKit Secure Video support",
            "No subscription required",
            "Local storage option",
            "Multi-platform support"
        ],
        "cons": [
            "Lower resolution than competitors",
            "Requires Aqara hub for some features",
            "Smaller brand recognition"
        ],
        "bestFor": [
            "HomeKit users",
            "Privacy-conscious buyers",
            "Multi-platform needs"
        ],
        "notBestFor": [
            "4K video seekers",
            "Those wanting wireless option"
        ],
        "alternatives": ["google-nest-doorbell", "ring-video-doorbell-pro-2", "eufy-doorbell"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}
        ],
        "sources": [{"title": "Official product page", "url": "https://aqara.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # === SMART HOME - LOCKS (4 products) ===
    {
        "slug": "august-wifi-smart-lock",
        "name": "August WiFi Smart Lock (4th Gen)",
        "brand": "August",
        "category": "Smart Lock",
        "summary": "Retrofit smart lock that works with existing deadbolt, no key replacement needed.",
        "priceRange": "$$",
        "officialUrl": "https://august.com",
        "releaseYear": 2023,
        "ecosystems": ["HomeKit", "Alexa", "Google Home"],
        "connectivity": ["Wi-Fi", "Bluetooth"],
        "sensors": ["DoorSense"],
        "features": ["Auto-lock", "Auto-unlock", "Remote access", "Activity log", "Guest access"],
        "subscriptionRequired": False,
        "batteryLife": "4-6 months (4 AA batteries)",
        "pros": [
            "Keeps existing keys",
            "Easy installation",
            "Multi-platform support",
            "Built-in WiFi"
        ],
        "cons": [
            "Bulky interior design",
            "Battery-powered only",
            "No keypad included"
        ],
        "bestFor": [
            "Renters",
            "Easy installation needs",
            "Keeping existing keys"
        ],
        "notBestFor": [
            "Those wanting keypad",
            "Minimalist design preference",
            "Outdoor access needs"
        ],
        "alternatives": ["yale-assure-lock", "schlage-encode", "level-lock"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}
        ],
        "sources": [{"title": "Official product page", "url": "https://august.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "yale-assure-lock-2",
        "name": "Yale Assure Lock 2",
        "brand": "Yale",
        "category": "Smart Lock",
        "summary": "Keyless smart lock with built-in keypad and Matter support.",
        "priceRange": "$$$",
        "officialUrl": "https://yale.com",
        "releaseYear": 2024,
        "ecosystems": ["Matter", "HomeKit", "Alexa", "Google Home"],
        "connectivity": ["Matter", "Wi-Fi", "Bluetooth"],
        "sensors": ["Touchscreen keypad"],
        "features": ["Matter certified", "Keypad access", "Auto-lock", "Tamper alert", "Voice control"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 12 months",
        "pros": [
            "Matter support",
            "No keys needed",
            "Long battery life",
            "Multiple access methods"
        ],
        "cons": [
            "Expensive",
            "Full replacement lock",
            "Complex installation for some"
        ],
        "bestFor": [
            "Keyless access preference",
            "Matter ecosystem",
            "Family access management"
        ],
        "notBestFor": [
            "Renters",
            "Budget buyers",
            "DIY installation hesitant"
        ],
        "alternatives": ["schlage-encode", "august-wifi-smart-lock", "level-lock"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}
        ],
        "sources": [{"title": "Official product page", "url": "https://yale.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # === SMART HOME - LIGHTING (3 products) ===
    {
        "slug": "philips-hue-starter-kit",
        "name": "Philips Hue White and Color Starter Kit",
        "brand": "Philips",
        "category": "Smart Lighting",
        "summary": "Industry-leading smart lighting system with millions of colors and extensive integrations.",
        "priceRange": "$$$",
        "officialUrl": "https://philips-hue.com",
        "releaseYear": 2024,
        "ecosystems": ["Matter", "HomeKit", "Alexa", "Google Home"],
        "connectivity": ["Zigbee", "Bluetooth"],
        "sensors": [],
        "features": ["16 million colors", "Voice control", "Automation", "Sync with entertainment", "Scenes"],
        "subscriptionRequired": False,
        "batteryLife": "N/A (Powered)",
        "pros": [
            "Excellent color range",
            "Reliable performance",
            "Wide ecosystem support",
            "Large accessory selection"
        ],
        "cons": [
            "Expensive",
            "Requires Hue Bridge for full features",
            "Proprietary ecosystem"
        ],
        "bestFor": [
            "Whole-home lighting",
            "Entertainment sync",
            "Ecosystem flexibility"
        ],
        "notBestFor": [
            "Budget buyers",
            "Simple lighting needs",
            "Bridge-free preference"
        ],
        "alternatives": ["lifx-color", "nanoleaf-lines", "wyze-bulbs"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}
        ],
        "sources": [{"title": "Official product page", "url": "https://philips-hue.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # === HEALTH TECH - CGM (3 products) ===
    {
        "slug": "dexcom-g7",
        "name": "Dexcom G7",
        "brand": "Dexcom",
        "category": "Glucose Monitor",
        "summary": "FDA-cleared continuous glucose monitoring system with real-time alerts and smartphone integration.",
        "priceRange": "$$$",
        "officialUrl": "https://dexcom.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android", "Apple Watch"],
        "connectivity": ["Bluetooth"],
        "sensors": ["Glucose sensor"],
        "features": ["Real-time glucose readings", "Customizable alerts", "Share data with caregivers", "No fingersticks", "10-day wear"],
        "subscriptionRequired": False,
        "batteryLife": "10 days per sensor",
        "pros": [
            "FDA cleared",
            "No calibration needed",
            "Excellent accuracy",
            "Real-time alerts"
        ],
        "cons": [
            "Expensive",
            "Prescription required in US",
            "Sensor adhesive may irritate skin"
        ],
        "bestFor": [
            "Diabetes management",
            "Type 1 diabetics",
            "Insulin users",
            "Detailed glucose tracking"
        ],
        "notBestFor": [
            "Non-diabetics (unless prescribed)",
            "Budget buyers",
            "Casual wellness tracking"
        ],
        "alternatives": ["freestyle-libre-3", "guardian-connect"],
        "affiliateLinks": [
            {"label": "View on Dexcom", "merchant": "Dexcom", "region": "Global", "url": "https://dexcom.com", "isAffiliate": False}
        ],
        "sources": [{"title": "Official product page", "url": "https://dexcom.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    {
        "slug": "freestyle-libre-3",
        "name": "FreeStyle Libre 3",
        "brand": "Abbott",
        "category": "Glucose Monitor",
        "summary": "Compact CGM with real-time glucose readings and smartphone alerts.",
        "priceRange": "$$",
        "officialUrl": "https://freestylelibre.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android"],
        "connectivity": ["Bluetooth"],
        "sensors": ["Glucose sensor"],
        "features": ["Real-time readings", "Minute-by-minute data", "Customizable alarms", "14-day wear", "Smallest sensor"],
        "subscriptionRequired": False,
        "batteryLife": "14 days per sensor",
        "pros": [
            "Smallest CGM sensor",
            "More affordable than Dexcom",
            "14-day wear time",
            "Real-time alerts"
        ],
        "cons": [
            "Requires prescription",
            "Less accurate than Dexcom G7",
            "No sensor warmup period shown"
        ],
        "bestFor": [
            "Diabetes management",
            "Budget-conscious diabetics",
            "Discreet sensor preference"
        ],
        "notBestFor": [
            "Those wanting highest accuracy",
            "Non-prescription users"
        ],
        "alternatives": ["dexcom-g7", "guardian-connect"],
        "affiliateLinks": [
            {"label": "View on Abbott", "merchant": "Abbott", "region": "Global", "url": "https://freestylelibre.com", "isAffiliate": False}
        ],
        "sources": [{"title": "Official product page", "url": "https://freestylelibre.com"}],
        "lastUpdated": "2026-05-19"
    },
    
    # === HEALTH TECH - SCALES (2 products) ===
    {
        "slug": "withings-body-comp",
        "name": "Withings Body Comp",
        "brand": "Withings",
        "category": "Smart Scale",
        "summary": "Advanced smart scale with comprehensive body composition and cardiovascular health insights.",
        "priceRange": "$$$",
        "officialUrl": "https://withings.com",
        "releaseYear": 2023,
        "ecosystems": ["iOS", "Android", "Apple Health", "Google Fit"],
        "connectivity": ["Wi-Fi", "Bluetooth"],
        "sensors": ["Weight", "Body composition", "Segmental analysis", "ECG"],
        "features": ["Body composition", "Vascular age", "Nerve health score", "Segmental analysis", "Multi-user"],
        "subscriptionRequired": False,
        "batteryLife": "Up to 18 months",
        "pros": [
            "Most comprehensive metrics",
            "No subscription needed",
            "ECG functionality",
            "Excellent app integration"
        ],
        "cons": [
            "Expensive",
            "Some metrics need medical validation",
            "Overkill for basic needs"
        ],
        "bestFor": [
            "Comprehensive health tracking",
            "Athletes",
            "Health enthusiasts",
            "Multi-user households"
        ],
        "notBestFor": [
            "Budget buyers",
            "Simple weight tracking needs"
        ],
        "alternatives": ["garmin-index-s2", "fitbit-aria-air", "eufy-smart-scale"],
        "affiliateLinks": [
            {"label": "Check price on Amazon", "merchant": "Amazon", "region": "US", "url": "", "isAffiliate": True}
        ],
        "sources": [{"title": "Official product page", "url": "https://withings.com"}],
        "lastUpdated": "2026-05-19"
    }
]

# Generate files
output_dir = "content/products"
os.makedirs(output_dir, exist_ok=True)

created = 0
for product in PRODUCTS:
    filepath = os.path.join(output_dir, f"{product['slug']}.json")
    with open(filepath, 'w') as f:
        json.dump(product, f, indent=2)
    created += 1
    print(f"✓ {created:2d}. {product['name']}")

# Count all products
existing_files = [f for f in os.listdir(output_dir) if f.endswith('.json')]
total_count = len(existing_files)

print(f"\n✅ Generated {created} new products")
print(f"📊 Total products in database: {total_count}")
print(f"\n🎯 Product distribution:")

categories = {}
for f in existing_files:
    with open(os.path.join(output_dir, f)) as file:
        data = json.load(file)
        cat = data.get('category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1

for cat, count in sorted(categories.items()):
    print(f"   {cat}: {count} products")
