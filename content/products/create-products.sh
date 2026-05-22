#!/bin/bash

# Product 4: Aqara Motion Sensor P2
cat > aqara-motion-sensor-p2.json << 'EOF'
{
  "name": "Aqara Motion Sensor P2",
  "slug": "aqara-motion-sensor-p2",
  "brand": "Aqara",
  "category": "Smart Home",
  "price": 19.99,
  "rating": 4.5,
  "imageUrl": "/images/products/aqara-motion-p2.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B0BXVK7RFZ?tag=radarscout20-20",
  "summary": "Matter-certified motion sensor with 5-year battery life. Perfect for automatic lighting and home automation.",
  "features": [
    "Matter certified for universal compatibility",
    "5-year battery life (CR2450 battery)",
    "170° detection angle",
    "7-meter detection range",
    "Light sensor for brightness-based automation",
    "Magnetic mounting with adhesive pad",
    "Works with Echo, HomePod, Google Home as hub",
    "IP44 water resistance"
  ],
  "specs": {
    "Battery": "CR2450 (5 year life)",
    "Detection": "170° angle, 7m range",
    "Connectivity": "Zigbee, Matter",
    "Dimensions": "1.5 x 1.5 x 0.9 inches",
    "Weight": "0.8 oz"
  },
  "prosAndCons": {
    "pros": [
      "Exceptional 5-year battery life",
      "Matter support ensures future compatibility",
      "Tiny and unobtrusive",
      "Reliable motion detection",
      "Built-in light sensor"
    ],
    "cons": [
      "Requires Zigbee hub (Echo/HomePod/etc)",
      "Not as fast as wired sensors",
      "Limited to indoor use despite IP44 rating"
    ]
  },
  "bestFor": "Automatic lighting in hallways, bathrooms, closets, or security alerts",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 5: Wyze Video Doorbell
cat > wyze-video-doorbell.json << 'EOF'
{
  "name": "Wyze Video Doorbell",
  "slug": "wyze-video-doorbell",
  "brand": "Wyze",
  "category": "Smart Home",
  "price": 34.99,
  "rating": 4.3,
  "imageUrl": "/images/products/wyze-doorbell.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B08FHTK8VZ?tag=radarscout20-20",
  "summary": "Budget video doorbell with local storage option and no required subscription fees.",
  "features": [
    "1080p HD video with HDR",
    "Local storage via microSD card (no subscription)",
    "Free cloud storage for 12-second clips",
    "Night vision",
    "Two-way audio",
    "Hardwired installation",
    "Chime included",
    "Person detection (AI)",
    "Works with Alexa and Google Assistant"
  ],
  "specs": {
    "Video": "1080p HD with HDR",
    "Field of View": "3:4 aspect ratio (vertical)",
    "Storage": "microSD up to 256GB",
    "Installation": "Hardwired (requires doorbell wire)",
    "Power": "16-24V AC"
  },
  "prosAndCons": {
    "pros": [
      "Incredibly affordable at $35",
      "Local storage option (no subscription required)",
      "Free cloud tier available",
      "Good video quality for price",
      "Chime included"
    ],
    "cons": [
      "Hardwired only (no battery option)",
      "Free cloud only saves 12-second clips",
      "Wyze Plus subscription adds features",
      "Less polished than Ring/Nest"
    ]
  },
  "bestFor": "Budget-conscious users wanting video doorbell without ongoing subscription costs",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 6: Amazon Smart Thermostat
cat > amazon-smart-thermostat.json << 'EOF'
{
  "name": "Amazon Smart Thermostat",
  "slug": "amazon-smart-thermostat",
  "brand": "Amazon",
  "category": "Smart Home",
  "price": 79.99,
  "rating": 4.4,
  "imageUrl": "/images/products/amazon-thermostat.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B08J4C8871?tag=radarscout20-20",
  "summary": "Most affordable quality smart thermostat. Works with Alexa and pays for itself in energy savings.",
  "features": [
    "Alexa built-in for voice control",
    "Automatic temperature adjustments based on routines",
    "Energy savings tracking",
    "Certified by Energy Star",
    "Many utilities offer rebates ($50-100)",
    "Remote control via Alexa app",
    "Geofencing (auto adjust when leaving/arriving)",
    "Simple installation (C-wire required)"
  ],
  "specs": {
    "Compatibility": "Most 24V HVAC systems",
    "Display": "Touchscreen LCD",
    "Connectivity": "WiFi 2.4GHz",
    "Power": "C-wire required",
    "Dimensions": "3.6 x 3.6 x 1 inches"
  },
  "prosAndCons": {
    "pros": [
      "Cheapest reliable smart thermostat ($80)",
      "Often available with utility rebates",
      "Simple Alexa integration",
      "Saves $50+ annually on energy",
      "Easy to install for most homes"
    ],
    "cons": [
      "Requires C-wire (common wire)",
      "Basic features compared to Nest/Ecobee",
      "Alexa ecosystem only",
      "No remote sensors"
    ]
  },
  "bestFor": "Alexa users wanting affordable smart thermostat that pays for itself quickly",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 7: Google Nest Hub (2nd Gen)
cat > google-nest-hub-2nd-gen.json << 'EOF'
{
  "name": "Google Nest Hub (2nd Gen)",
  "slug": "google-nest-hub-2nd-gen",
  "brand": "Google",
  "category": "Smart Home",
  "price": 99.99,
  "rating": 4.7,
  "imageUrl": "/images/products/nest-hub-2.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B08KSLT8BV?tag=radarscout20-20",
  "summary": "Smart display with sleep tracking and Thread border router. Central control panel for smart home.",
  "features": [
    "7-inch touchscreen display",
    "Soli sleep tracking (no camera/wearable needed)",
    "Thread border router for Matter devices",
    "Google Assistant built-in",
    "Smart home control panel",
    "YouTube, Netflix, photos, recipes",
    "Audio quality optimized for voice/music",
    "Ambient EQ adjusts screen brightness",
    "Privacy with mic/camera hardware switch"
  ],
  "specs": {
    "Display": "7-inch touchscreen",
    "Connectivity": "WiFi, Bluetooth, Thread",
    "Audio": "43.5mm full-range driver",
    "Dimensions": "7 x 4.7 x 2.7 inches",
    "Weight": "12.3 oz"
  },
  "prosAndCons": {
    "pros": [
      "Screen makes smart home control visual",
      "Thread border router adds value",
      "Sleep tracking without wearable",
      "Great for kitchen (recipes/timers)",
      "Good sound for size"
    ],
    "cons": [
      "Small screen (7-inch)",
      "Google ecosystem lock-in",
      "Camera-less (can't make video calls)",
      "Sleep tracking less accurate than wearables"
    ]
  },
  "bestFor": "Google Home users wanting visual smart home control and sleep tracking",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

echo "Created 4 products (4-7)"
