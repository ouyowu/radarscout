import fs from 'fs';
import path from 'path';
import type { Product } from '@/types';

const productsDirectory = path.join(process.cwd(), 'content/products');
const publicDirectory = path.join(process.cwd(), 'public');

type RawProduct = Partial<Product> & {
  affiliateUrl?: string;
  prosAndCons?: {
    pros?: string[];
    cons?: string[];
  };
};

function normalizeProduct(raw: RawProduct): Product {
  const imageUrl =
    typeof raw.imageUrl === 'string' && raw.imageUrl.startsWith('/')
      ? fs.existsSync(path.join(publicDirectory, raw.imageUrl.replace(/^\//, '')))
        ? raw.imageUrl
        : undefined
      : raw.imageUrl;

  const affiliateLinks =
    Array.isArray(raw.affiliateLinks) && raw.affiliateLinks.length > 0
      ? raw.affiliateLinks
      : typeof raw.affiliateUrl === 'string' && raw.affiliateUrl.length > 0
        ? [
            {
              label: 'Check price',
              merchant: 'Amazon',
              region: 'US',
              url: raw.affiliateUrl,
              isAffiliate: true,
            },
          ]
        : [];

  return {
    slug: raw.slug || '',
    name: raw.name || '',
    brand: raw.brand || '',
    category: raw.category || '',
    summary: raw.summary || '',
    price: typeof raw.price === 'number' ? raw.price : undefined,
    priceRange: raw.priceRange || '',
    rating: typeof raw.rating === 'number' ? raw.rating : undefined,
    reviewCount: typeof raw.reviewCount === 'number' ? raw.reviewCount : undefined,
    officialUrl: raw.officialUrl || '',
    releaseYear: raw.releaseYear,
    ecosystems: Array.isArray(raw.ecosystems) ? raw.ecosystems : [],
    connectivity: Array.isArray(raw.connectivity) ? raw.connectivity : [],
    sensors: Array.isArray(raw.sensors) ? raw.sensors : [],
    features: Array.isArray(raw.features) ? raw.features : [],
    subscriptionRequired: raw.subscriptionRequired,
    batteryLife: raw.batteryLife,
    pros: Array.isArray(raw.pros)
      ? raw.pros
      : Array.isArray(raw.prosAndCons?.pros)
        ? raw.prosAndCons!.pros!
        : [],
    cons: Array.isArray(raw.cons)
      ? raw.cons
      : Array.isArray(raw.prosAndCons?.cons)
        ? raw.prosAndCons!.cons!
        : [],
    bestFor: Array.isArray(raw.bestFor) ? raw.bestFor : [],
    notBestFor: Array.isArray(raw.notBestFor) ? raw.notBestFor : [],
    alternatives: Array.isArray(raw.alternatives) ? raw.alternatives : [],
    affiliateLinks,
    sources: Array.isArray(raw.sources) ? raw.sources : [],
    lastUpdated: raw.lastUpdated || '',
    imageUrl,
  };
}

export function getAllProducts(): Product[] {
  try {
    const fileNames = fs.readdirSync(productsDirectory);
    const products = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const filePath = path.join(productsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return normalizeProduct(JSON.parse(fileContents) as RawProduct);
      });

    return products.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export function getProductBySlug(slug: string): Product | null {
  try {
    const filePath = path.join(productsDirectory, `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return normalizeProduct(JSON.parse(fileContents) as RawProduct);
  } catch {
    return null;
  }
}

export function getProductsByCategory(category: string): Product[] {
  const allProducts = getAllProducts();
  return allProducts.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProducts(limit = 6): Product[] {
  const allProducts = getAllProducts();
  // Return the first N products (can be enhanced with a featured flag later)
  return allProducts.slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const allProducts = getAllProducts();
  
  // Get products in the same category
  const relatedByCategory = allProducts.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );
  
  // Get alternative products
  const alternatives = allProducts.filter((p) =>
    product.alternatives.includes(p.slug)
  );
  
  // Combine and deduplicate
  const related = [...alternatives, ...relatedByCategory];
  const unique = Array.from(new Map(related.map((p) => [p.slug, p])).values());
  
  return unique.slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const allProducts = getAllProducts();
  const lowerQuery = query.toLowerCase();
  
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.summary.toLowerCase().includes(lowerQuery)
  );
}
