const fs = require('fs');
const path = require('path');

const products = [
  // Smart Rings (5 more)
  {
    slug: 'ultrahuman-ring-air',
    name: 'Ultrahuman Ring Air',
    brand: 'Ultrahuman',
    category: 'Smart Ring',
    summary: 'Ultra-lightweight smart ring with continuous glucose monitoring integration and comprehensive health tracking.',
    priceRange: '$$$',
    officialUrl: 'https://ultrahuman.com',
    releaseYear: 2024,
    ecosystems: ['iOS', 'Android'],
    connectivity: ['Bluetooth'],
    sensors: ['Heart rate', 'HRV', 'Skin temperature', 'SpO2', 'Accelerometer'],
    features: ['Sleep tracking', 'Movement tracking', 'Recovery score', 'Glucose insights', 'Cycle tracking'],
    subscriptionRequired: false,
    batteryLife: 'Up to 6 days',
    pros: [
      'Lightest smart ring on the market',
      'No subscription required',
      'Glucose monitoring integration',
      'Accurate sleep tracking',
      'Comfortable for 24/7 wear'
    ],
    cons: [
      'Limited color options',
      'Smaller ecosystem than Oura',
      'Fewer third-party integrations',
      'Premium pricing'
    ],
    bestFor: [
      'Metabolic health tracking',
      'Users who want no subscription',
      'Athletes tracking recovery',
      'People with glucose concerns'
    ],
    notBestFor: [
      'Those wanting extensive app integrations',
      'Budget-conscious buyers',
      'People preferring smartwatch displays'
    ],
    alternatives: ['oura-ring-4', 'whoop', 'ringconn-smart-ring'],
    affiliateLinks: [
      {
        label: 'Check price on Amazon',
        merchant: 'Amazon',
        region: 'US',
        url: '',
        isAffiliate: true
      },
      {
        label: 'View on Ultrahuman',
        merchant: 'Ultrahuman',
        region: 'Global',
        url: 'https://ultrahuman.com',
        isAffiliate: false
      }
    ],
    sources: [
      {
        title: 'Official product page',
        url: 'https://ultrahuman.com'
      }
    ],
    lastUpdated: '2026-05-19'
  },
  {
    slug: 'ringconn-smart-ring',
    name: 'RingConn Smart Ring',
    brand: 'RingConn',
    category: 'Smart Ring',
    summary: 'Affordable smart ring offering essential health tracking without subscription fees.',
    priceRange: '$$',
    officialUrl: 'https://ringconn.com',
    releaseYear: 2024,
    ecosystems: ['iOS', 'Android'],
    connectivity: ['Bluetooth'],
    sensors: ['Heart rate', 'HRV', 'Skin temperature', 'SpO2'],
    features: ['Sleep tracking', 'Activity tracking', 'Heart rate monitoring', 'Step counting'],
    subscriptionRequired: false,
    batteryLife: 'Up to 7 days',
    pros: [
      'More affordable than competitors',
      'No subscription fees',
      'Good battery life',
      'Accurate step tracking',
      'Water resistant'
    ],
    cons: [
      'Basic app interface',
      'Limited advanced metrics',
      'Smaller brand recognition',
      'Fewer features than Oura'
    ],
    bestFor: [
      'Budget-conscious buyers',
      'First-time smart ring users',
      'Basic health tracking needs',
      'People avoiding subscriptions'
    ],
    notBestFor: [
      'Advanced athletes',
      'Those wanting detailed analytics',
      'Ecosystem integration seekers'
    ],
    alternatives: ['oura-ring-4', 'ultrahuman-ring-air', 'circular-ring'],
    affiliateLinks: [
      {
        label: 'Check price on Amazon',
        merchant: 'Amazon',
        region: 'US',
        url: '',
        isAffiliate: true
      },
      {
        label: 'View official store',
        merchant: 'RingConn',
        region: 'Global',
        url: 'https://ringconn.com',
        isAffiliate: false
      }
    ],
    sources: [
      {
        title: 'Official product page',
        url: 'https://ringconn.com'
      }
    ],
    lastUpdated: '2026-05-19'
  },
  // Smart Watches (8 more)
  {
    slug: 'garmin-fenix-7',
    name: 'Garmin Fenix 7',
    brand: 'Garmin',
    category: 'Smart Watch',
    summary: 'Premium multisport GPS watch with comprehensive training metrics and exceptional battery life.',
    priceRange: '$$$',
    officialUrl: 'https://garmin.com',
    releaseYear: 2024,
    ecosystems: ['iOS', 'Android'],
    connectivity: ['Bluetooth', 'Wi-Fi', 'GPS'],
    sensors: ['Heart rate', 'SpO2', 'Altimeter', 'Barometer', 'Compass', 'Accelerometer', 'Gyroscope'],
    features: ['Advanced training metrics', 'Multi-GNSS support', 'Topographic maps', 'Music storage', 'Garmin Pay', 'Sleep tracking'],
    subscriptionRequired: false,
    batteryLife: 'Up to 18 days (smartwatch mode)',
    pros: [
      'Exceptional battery life',
      'Comprehensive sports tracking',
      'Detailed topographic maps',
      'No subscription required',
      'Extremely durable build'
    ],
    cons: [
      'Expensive',
      'Complex interface for beginners',
      'Bulky compared to Apple Watch',
      'Touchscreen less responsive in some models'
    ],
    bestFor: [
      'Serious athletes and outdoor enthusiasts',
      'Multi-sport training',
      'Long battery life priority',
      'Hiking and trail running',
      'People who want detailed metrics'
    ],
    notBestFor: [
      'Casual fitness users',
      'Those wanting sleek design',
      'Budget buyers',
      'People preferring simple interfaces'
    ],
    alternatives: ['apple-watch-series', 'coros-apex', 'polar-vantage'],
    affiliateLinks: [
      {
        label: 'Check price on Amazon',
        merchant: 'Amazon',
        region: 'US',
        url: '',
        isAffiliate: true
      },
      {
        label: 'View on Garmin',
        merchant: 'Garmin',
        region: 'Global',
        url: 'https://garmin.com',
        isAffiliate: false
      }
    ],
    sources: [
      {
        title: 'Official product page',
        url: 'https://garmin.com'
      }
    ],
    lastUpdated: '2026-05-19'
  },
  {
    slug: 'samsung-galaxy-watch-6',
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    category: 'Smart Watch',
    summary: 'Comprehensive smartwatch with advanced health tracking, seamlessly integrated with Android ecosystem.',
    priceRange: '$$$',
    officialUrl: 'https://samsung.com',
    releaseYear: 2024,
    ecosystems: ['Android', 'Limited iOS'],
    connectivity: ['Bluetooth', 'Wi-Fi', 'LTE'],
    sensors: ['Heart rate', 'ECG', 'Blood pressure', 'SpO2', 'Skin temperature', 'BIA sensor'],
    features: ['Body composition analysis', 'Sleep coaching', 'Advanced workout tracking', 'Samsung Pay', 'Bixby assistant'],
    subscriptionRequired: false,
    batteryLife: 'Up to 40 hours',
    pros: [
      'Body composition measurement',
      'Blood pressure monitoring',
      'Excellent Android integration',
      'Rotating bezel navigation',
      'Good app selection'
    ],
    cons: [
      'Limited iOS compatibility',
      'Battery life shorter than Garmin',
      'Blood pressure requires calibration',
      'Samsung ecosystem lock-in'
    ],
    bestFor: [
      'Samsung phone users',
      'Health tracking enthusiasts',
      'Android users',
      'People wanting body composition tracking'
    ],
    notBestFor: [
      'iPhone users',
      'Multi-day battery life seekers',
      'Cross-platform users'
    ],
    alternatives: ['apple-watch-series', 'google-pixel-watch', 'garmin-venu'],
    affiliateLinks: [
      {
        label: 'Check price on Amazon',
        merchant: 'Amazon',
        region: 'US',
        url: '',
        isAffiliate: true
      },
      {
        label: 'View on Samsung',
        merchant: 'Samsung',
        region: 'Global',
        url: 'https://samsung.com',
        isAffiliate: false
      }
    ],
    sources: [
      {
        title: 'Official product page',
        url: 'https://samsung.com'
      }
    ],
    lastUpdated: '2026-05-19'
  }
];

// Generate JSON files
const outputDir = path.join(__dirname, 'content', 'products');

products.forEach(product => {
  const filePath = path.join(outputDir, `${product.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
  console.log(`Created: ${product.slug}.json`);
});

console.log(`\nTotal products created: ${products.length}`);
