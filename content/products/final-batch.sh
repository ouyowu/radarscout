#!/bin/bash

# Product 15: Garmin Venu 3
cat > garmin-venu-3.json << 'EOF'
{
  "name": "Garmin Venu 3",
  "slug": "garmin-venu-3",
  "brand": "Garmin",
  "category": "Wearables",
  "price": 449.99,
  "rating": 4.6,
  "imageUrl": "/images/products/garmin-venu-3.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B0C62K5JFZ?tag=radarscout20-20",
  "summary": "Premium sports watch with comprehensive sleep tracking and 14-day battery life.",
  "features": [
    "14-day battery life",
    "AMOLED touchscreen display",
    "Advanced sleep tracking with coaching",
    "HRV status and training readiness",
    "Body Battery energy monitoring",
    "Wheelchair mode",
    "Built-in speaker and microphone",
    "30+ sport modes",
    "5 ATM water resistance"
  ],
  "specs": {
    "Display": "1.4-inch AMOLED",
    "Battery": "14 days smartwatch, 26 hours GPS",
    "Water Resistance": "5 ATM (50m)",
    "Sensors": "HR, SpO2, GPS, altimeter, compass",
    "Weight": "47g"
  },
  "prosAndCons": {
    "pros": [
      "Exceptional battery life",
      "Comprehensive health tracking",
      "Excellent for serious athletes",
      "Beautiful AMOLED display",
      "Wheelchair accessibility features"
    ],
    "cons": [
      "Expensive",
      "Garmin ecosystem learning curve",
      "Not as smart as Apple Watch",
      "Larger/heavier than some prefer"
    ]
  },
  "bestFor": "Athletes wanting long battery and comprehensive health/training data",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 16: Fitbit Charge 6
cat > fitbit-charge-6.json << 'EOF'
{
  "name": "Fitbit Charge 6",
  "slug": "fitbit-charge-6",
  "brand": "Fitbit",
  "category": "Wearables",
  "price": 159.99,
  "rating": 4.4,
  "imageUrl": "/images/products/fitbit-charge-6.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B0CC5WKXD8?tag=radarscout20-20",
  "summary": "Best fitness tracker for Google ecosystem users. Heart rate accuracy improved 60% over Charge 5.",
  "features": [
    "60% more accurate heart rate tracking",
    "Built-in GPS",
    "Google Maps turn-by-turn directions",
    "YouTube Music controls",
    "Google Wallet for payments",
    "7-day battery life",
    "Sleep tracking with Sleep Profile",
    "Stress management tools",
    "40+ exercise modes"
  ],
  "specs": {
    "Display": "Color AMOLED",
    "Battery": "7 days",
    "Water Resistance": "5 ATM",
    "Sensors": "HR, SpO2, GPS, accelerometer",
    "Weight": "29g"
  },
  "prosAndCons": {
    "pros": [
      "Much improved heart rate accuracy",
      "Deep Google integration",
      "Slim and comfortable",
      "Good battery life",
      "Affordable fitness tracking"
    ],
    "cons": [
      "Requires Fitbit Premium for best features ($10/month)",
      "Small screen",
      "No music storage",
      "Google ecosystem lock-in"
    ]
  },
  "bestFor": "Google users wanting accurate, affordable fitness tracking",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 17: Samsung Galaxy Watch 6
cat > samsung-galaxy-watch-6.json << 'EOF'
{
  "name": "Samsung Galaxy Watch 6",
  "slug": "samsung-galaxy-watch-6",
  "brand": "Samsung",
  "category": "Wearables",
  "price": 299.99,
  "rating": 4.5,
  "imageUrl": "/images/products/samsung-watch-6.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B0C79HXM44?tag=radarscout20-20",
  "summary": "Best Android smartwatch with comprehensive health tracking and Wear OS ecosystem.",
  "features": [
    "Advanced sleep tracking with sleep coaching",
    "Body composition analysis",
    "Irregular heart rhythm notification (FDA cleared)",
    "Blood pressure monitoring (in select regions)",
    "Sapphire crystal display",
    "Wear OS with Google apps",
    "40-hour battery life",
    "5 ATM + IP68 water resistance",
    "Fast charging (30 min to 45%)"
  ],
  "specs": {
    "Display": "1.3-1.5 inch AMOLED (size dependent)",
    "Battery": "40 hours mixed use",
    "Water Resistance": "5 ATM + IP68",
    "Sensors": "HR, ECG, BIA, SpO2, temp",
    "Weight": "33.3g (40mm)"
  },
  "prosAndCons": {
    "pros": [
      "Most features for Android users",
      "Body composition without scale",
      "Beautiful display",
      "Wear OS app ecosystem",
      "Fast charging"
    ],
    "cons": [
      "Short battery vs Garmin",
      "Best with Samsung phones",
      "Body comp accuracy varies",
      "Pricey"
    ]
  },
  "bestFor": "Android (especially Samsung) users wanting comprehensive smartwatch",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

echo "Created final 3 products (15-17)"
