#!/bin/bash

# Product 11: Contour Next One
cat > contour-next-one.json << 'EOF'
{
  "name": "Contour Next One Blood Glucose Meter",
  "slug": "contour-next-one",
  "brand": "Contour",
  "category": "Health Devices",
  "price": 29.99,
  "rating": 4.7,
  "imageUrl": "/images/products/contour-next-one.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B01FQ1XUTK?tag=radarscout20-20",
  "summary": "Best traditional glucose meter with second-chance sampling and Bluetooth connectivity.",
  "features": [
    "Bluetooth sync to Contour app",
    "Second-chance sampling (add more blood within 60 seconds)",
    "Excellent accuracy (meets FDA standards)",
    "Large easy-to-read display",
    "Smartlight indicator (high/low/in-range)",
    "5-second test time",
    "Pre/post meal markers",
    "Stores 800 results"
  ],
  "specs": {
    "Test Time": "5 seconds",
    "Sample Size": "0.6 microliters",
    "Memory": "800 results",
    "Connectivity": "Bluetooth",
    "Battery": "2x CR2032"
  },
  "prosAndCons": {
    "pros": [
      "Second-chance sampling saves wasted strips",
      "Very accurate readings",
      "Bluetooth for app tracking",
      "Smartlight visual feedback",
      "Generic strips available"
    ],
    "cons": [
      "Strips more expensive than some competitors",
      "Still requires finger pricks",
      "Bluetooth occasionally drops"
    ]
  },
  "bestFor": "Anyone needing traditional glucose meter with phone tracking",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 12: OneTouch Verio Reflect
cat > onetouch-verio-reflect.json << 'EOF'
{
  "name": "OneTouch Verio Reflect",
  "slug": "onetouch-verio-reflect",
  "brand": "OneTouch",
  "category": "Health Devices",
  "price": 34.99,
  "rating": 4.6,
  "imageUrl": "/images/products/onetouch-verio.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B07RWWLM6V?tag=radarscout20-20",
  "summary": "Glucose meter with AI coaching features. Analyzes patterns and provides personalized guidance.",
  "features": [
    "Blood Sugar Mentor (AI pattern analysis)",
    "ColorSure technology (visual high/low indicators)",
    "Bluetooth sync to OneTouch Reveal app",
    "Personalized insights and coaching",
    "Simple three-button design",
    "Backlit display",
    "5-second test time",
    "Stores 750 results"
  ],
  "specs": {
    "Test Time": "5 seconds",
    "Sample Size": "0.4 microliters",
    "Memory": "750 results",
    "Connectivity": "Bluetooth",
    "Battery": "1x CR2032"
  },
  "prosAndCons": {
    "pros": [
      "AI coaching helps understand patterns",
      "ColorSure makes readings easy to interpret",
      "OneTouch strips widely available",
      "Good app with insights",
      "Backlit display for low light"
    ],
    "cons": [
      "Strips are pricier",
      "Coaching requires consistent app use",
      "Basic compared to CGM systems"
    ]
  },
  "bestFor": "Newly diagnosed diabetics needing guidance interpreting results",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 13: Level Lock+
cat > level-lock-plus.json << 'EOF'
{
  "name": "Level Lock+",
  "slug": "level-lock-plus",
  "brand": "Level",
  "category": "Smart Home",
  "price": 329.99,
  "rating": 4.4,
  "imageUrl": "/images/products/level-lock-plus.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B08SGZXGZ8?tag=radarscout20-20",
  "summary": "Completely invisible smart lock. Entire mechanism fits inside existing deadbolt.",
  "features": [
    "Completely invisible from both sides",
    "Works with Apple HomeKit natively",
    "Touch-to-lock convenience",
    "One-year battery life (CR2)",
    "Auto-lock and unlock",
    "Remote access with Level Connect (sold separately)",
    "Premium build quality",
    "Fits standard deadbolts"
  ],
  "specs": {
    "Compatibility": "Standard US deadbolts",
    "Battery": "CR2 (1 year)",
    "Connectivity": "Bluetooth, HomeKit",
    "Finish": "Satin Nickel, Matte Black",
    "Installation": "Replaces interior mechanism"
  },
  "prosAndCons": {
    "pros": [
      "Totally invisible installation",
      "Premium build and materials",
      "Excellent HomeKit integration",
      "Year-long battery",
      "Looks like normal lock"
    ],
    "cons": [
      "Very expensive ($330)",
      "Bluetooth only without Level Connect bridge",
      "HomeKit focused (limited Alexa/Google)",
      "Installation slightly more complex"
    ]
  },
  "bestFor": "Apple users prioritizing aesthetics and invisible smart home tech",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

# Product 14: Level Bolt
cat > level-bolt.json << 'EOF'
{
  "name": "Level Bolt",
  "slug": "level-bolt",
  "brand": "Level",
  "category": "Smart Home",
  "price": 129.99,
  "rating": 4.2,
  "imageUrl": "/images/products/level-bolt.jpg",
  "affiliateUrl": "https://www.amazon.com/dp/B07V6KF1VY?tag=radarscout20-20",
  "summary": "Entry-level invisible smart lock. Basic lock/unlock via phone with year-long battery.",
  "features": [
    "Completely invisible installation",
    "Bluetooth control via phone",
    "Touch-to-lock",
    "Year-long battery (CR2)",
    "Works with HomeKit",
    "Simple installation",
    "Affordable invisible lock option",
    "Quality build"
  ],
  "specs": {
    "Compatibility": "Standard US deadbolts",
    "Battery": "CR2 (1 year)",
    "Connectivity": "Bluetooth, HomeKit",
    "Finish": "Universal",
    "Range": "~40 feet Bluetooth"
  },
  "prosAndCons": {
    "pros": [
      "Invisible smart lock at half Level Lock+ price",
      "Year-long battery",
      "Simple functionality works well",
      "HomeKit compatible",
      "Easy installation"
    ],
    "cons": [
      "No auto-lock or auto-unlock",
      "Bluetooth range only (no remote access)",
      "Very basic features",
      "No guest codes",
      "HomeKit required for best experience"
    ]
  },
  "bestFor": "Minimalists wanting invisible tech and basic remote lock/unlock",
  "publishedAt": "2026-05-20",
  "updatedAt": "2026-05-20"
}
EOF

echo "Created products 11-14"
