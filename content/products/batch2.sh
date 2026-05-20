#!/bin/bash

# Product 8: Awair Element  
cat > awair-element.json << 'EOF'
{
  "name": "Awair Element",
  "slug": "awair-element",
  "brand": "Awair",
  "category": "Health Devices",
  "price": 199.99,
  "rating": 4.4,
  "imageUrl": "/images/products/awair-element.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B07L8FLMLH?tag=radarscout-20",
  "summary": "Premium air quality monitor with smart home automation triggers. Tracks PM2.5, VOC, CO2, humidity, and temperature.",
  "features": [
    "Tracks PM2.5, VOC, CO2, humidity, temperature",
    "Works with Alexa, Google Home, IFTTT",
    "Automate air purifiers based on air quality",
    "Historical data and trends",
    "Personalized tips for better air",
    "LED indicator shows air quality at a glance",
    "Compact modern design",
    "Local and cloud data storage"
  ],
  "specs": {
    "Sensors": "PM2.5, VOC, CO2, humidity, temperature",
    "Connectivity": "WiFi 2.4/5GHz",
    "Power": "USB-C (cable included)",
    "Dimensions": "4.5 x 4.5 x 1.4 inches",
    "Weight": "11 oz"
  },
  "prosAndCons": {
    "pros": [
      "Comprehensive air quality tracking",
      "Smart home automation triggers",
      "Accurate sensors",
      "Clean, minimal design",
      "Good app with insights"
    ],
    "cons": [
      "Expensive at $200",
      "Requires constant power",
      "No radon detection",
      "Cloud-dependent for some features"
    ]
  },
  "bestFor": "Smart home users wanting automated air quality management",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 9: Amazon Smart Air Quality Monitor
cat > amazon-smart-air-quality-monitor.json << 'EOF'
{
  "name": "Amazon Smart Air Quality Monitor",
  "slug": "amazon-smart-air-quality-monitor",
  "brand": "Amazon",
  "category": "Health Devices",
  "price": 69.99,
  "rating": 4.3,
  "imageUrl": "/images/products/amazon-aqm.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B08W8KS8D3?tag=radarscout-20",
  "summary": "Budget air quality monitor with essential sensors. Works with Alexa routines for automation.",
  "features": [
    "Tracks PM2.5, VOC, CO, humidity, temperature",
    "Alexa integration for voice alerts",
    "Automate smart plugs/purifiers via routines",
    "Color-coded LED for quick status",
    "Historical data in Alexa app",
    "Compact hockey-puck design",
    "USB-C powered",
    "Easy setup"
  ],
  "specs": {
    "Sensors": "PM2.5, VOC, CO, humidity, temperature",
    "Connectivity": "WiFi 2.4GHz",
    "Power": "USB-C",
    "Dimensions": "2.9 x 2.9 x 1 inches",
    "Weight": "3.5 oz"
  },
  "prosAndCons": {
    "pros": [
      "Very affordable ($70)",
      "Works with Alexa routines",
      "Covers essential air quality metrics",
      "Tiny and portable",
      "Simple setup"
    ],
    "cons": [
      "No CO2 sensor (measures CO instead)",
      "Basic Alexa app interface",
      "Alexa ecosystem only",
      "Less accurate than premium monitors"
    ]
  },
  "bestFor": "Budget buyers or Alexa users wanting basic air quality tracking",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 10: Qingping Air Monitor Lite
cat > qingping-air-monitor-lite.json << 'EOF'
{
  "name": "Qingping Air Monitor Lite",
  "slug": "qingping-air-monitor-lite",
  "brand": "Qingping",
  "category": "Health Devices",
  "price": 79.99,
  "rating": 4.5,
  "imageUrl": "/images/products/qingping-lite.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B09JQKZ3KW?tag=radarscout-20",
  "summary": "Best value CO2 monitor with HomeKit integration. Compact with real-time LCD display.",
  "features": [
    "NDIR CO2 sensor (accurate type)",
    "Tracks PM2.5, CO2, humidity, temperature",
    "Apple HomeKit native support",
    "LCD display shows all readings",
    "Historical data and trends",
    "Magnetic mounting option",
    "USB-C powered",
    "Export data for analysis"
  ],
  "specs": {
    "Sensors": "PM2.5, CO2 (NDIR), humidity, temperature",
    "Connectivity": "WiFi, HomeKit",
    "Display": "LCD screen",
    "Power": "USB-C",
    "Dimensions": "3.1 x 3.1 x 1.2 inches",
    "Weight": "4.2 oz"
  },
  "prosAndCons": {
    "pros": [
      "Includes accurate NDIR CO2 sensor",
      "HomeKit integration (rare for air monitors)",
      "Good value at $80",
      "Real-time LCD display",
      "Clean minimalist design"
    ],
    "cons": [
      "No VOC sensor",
      "Smaller brand, less support",
      "App translations sometimes awkward",
      "HomeKit only (no Alexa/Google)"
    ]
  },
  "bestFor": "HomeKit users or anyone wanting affordable CO2 monitoring",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

echo "Created products 8-10"
