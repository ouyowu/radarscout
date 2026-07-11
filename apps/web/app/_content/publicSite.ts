export const publicNavLinks = [
  { href: '/ai-trip-planner', label: 'Plan a day' },
  { href: '/tours', label: 'Experiences' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/about-us', label: 'About' },
] as const

export const publicFooterGroups = [
  {
    label: 'Discover',
    links: publicNavLinks.slice(0, 3),
  },
  {
    label: 'Company',
    links: [
      { href: '/about-us', label: 'About' },
      { href: '/contact', label: 'Contact' },
      {
        href: 'mailto:hello@radarscout.io?subject=RadarScout%20Supplier%20Partnership%20Inquiry',
        label: 'Supplier partners',
      },
    ],
  },
  {
    label: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy' },
      { href: '/terms-of-service', label: 'Terms' },
    ],
  },
] as const

export const homepageTrustItems = [
  { label: 'Reviewed products', value: 'Real Thailand experience records' },
  { label: 'Clear comparison', value: 'Fit reasons before product details' },
  { label: 'Safe handoff', value: 'Continue with a booking partner' },
] as const

export const homepageSteps = [
  {
    title: 'Describe your ideal day',
    body: 'Share the Thailand city, interests, pace, group, and day-trip style that matter to you.',
  },
  {
    title: 'Compare reviewed matches',
    body: 'See real experiences with a clear explanation of why each option fits your request.',
  },
  {
    title: 'Check current details',
    body: 'Open the experience page, then continue with the booking partner when you are ready.',
  },
] as const

export const homepageFaqItems = [
  {
    question: 'What does RadarScout help me plan?',
    answer:
      'RadarScout helps English-speaking travelers compare reviewed day trips and local experiences across Thailand. Coverage expands city by city.',
  },
  {
    question: 'Where do the experiences come from?',
    answer:
      'Traveler-facing recommendations use real reviewed product records. Missing product facts are left out rather than invented.',
  },
  {
    question: 'Does RadarScout complete the booking?',
    answer:
      'No. RadarScout helps you plan and compare. Current details and the next booking step remain on the booking partner page.',
  },
] as const
