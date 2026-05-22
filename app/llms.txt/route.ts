import { getAllArticles } from '@/lib/data/articles';
import { getAllProducts } from '@/lib/data/products';

const BASE_URL = 'https://radarscout.io';

export const dynamic = 'force-static';

export function GET() {
  const articles = getAllArticles();
  const products = getAllProducts();

  const articlesByCategory = articles.reduce<Record<string, typeof articles>>(
    (acc, article) => {
      const cat = article.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(article);
      return acc;
    },
    {},
  );

  const lines: string[] = [
    `# RadarScout`,
    ``,
    `> Your radar for smart home, wearables, and health tech. Expert buying guides, in-depth product reviews, and side-by-side comparisons.`,
    ``,
    `## Site`,
    ``,
    `- Homepage: ${BASE_URL}`,
    `- Search: ${BASE_URL}/search`,
    `- About: ${BASE_URL}/about`,
    `- Affiliate Disclosure: ${BASE_URL}/about/affiliate-disclosure`,
    ``,
    `## Content Sections`,
    ``,
    `- Buying Guides: ${BASE_URL}/buying-guides`,
    `- Product Reviews: ${BASE_URL}/reviews`,
    `- Comparisons: ${BASE_URL}/comparisons`,
    `- Guides & Tutorials: ${BASE_URL}/guides`,
    ``,
  ];

  // Articles by category
  for (const [category, categoryArticles] of Object.entries(articlesByCategory)) {
    const categoryLabel = category
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    lines.push(`## ${categoryLabel}`, ``);
    for (const article of categoryArticles) {
      lines.push(
        `- [${article.frontmatter.title}](${BASE_URL}/${category}/${article.slug}): ${article.frontmatter.description}`,
      );
    }
    lines.push(``);
  }

  // Products
  lines.push(`## Products Database`, ``);
  lines.push(
    `RadarScout maintains a database of ${products.length} smart home and health tech products with specs, pros/cons, and affiliate links.`,
    ``,
  );

  const productsByCategory = products.reduce<Record<string, typeof products>>(
    (acc, product) => {
      const cat = product.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    },
    {},
  );

  for (const [category, categoryProducts] of Object.entries(productsByCategory).slice(0, 8)) {
    lines.push(`### ${category}`, ``);
    for (const product of categoryProducts.slice(0, 6)) {
      lines.push(`- [${product.name}](${BASE_URL}/products/${product.slug}): ${product.summary}`);
    }
    lines.push(``);
  }

  lines.push(
    `## Editorial Standards`,
    ``,
    `RadarScout follows a hands-on testing methodology. Products reviewed are tested for a minimum of two weeks. Buying guide rankings prioritize user experience, reliability, and value over affiliate commission rates. All affiliate relationships are disclosed.`,
    ``,
    `## Coverage Areas`,
    ``,
    `- Smart rings (Oura, Ultrahuman, RingConn, Circular)`,
    `- Fitness trackers and smartwatches (Apple Watch, Garmin, Whoop)`,
    `- Smart home devices (smart locks, doorbells, thermostats, lighting)`,
    `- Health monitoring (blood glucose monitors, sleep trackers, air quality)`,
    `- Wearable health tech (HRV, SpO2, skin temperature, ECG)`,
    ``,
  );

  const body = lines.join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}
