import Link from 'next/link';
import { ArrowRight, Database, Layers3 } from 'lucide-react';
import { getAllProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { generateSEO } from '@/lib/seo/metadata';

export const metadata = generateSEO({
  title: 'Product Database - RadarScout',
  description:
    'Browse RadarScout’s full product database for smart home devices, wearables, sleep tech, and health monitoring products.',
  path: '/products',
});

const categoryDescriptions: Record<string, string> = {
  'Smart Home': 'Speakers, displays, locks, thermostats, lighting, and connected home essentials.',
  Wearables: 'Smart rings, fitness trackers, watches, and recovery-focused devices.',
  'Health Tech': 'Air quality monitors, sleep tools, scales, and consumer health devices.',
};

export default function ProductsIndexPage() {
  const products = getAllProducts();
  const groups = Array.from(
    products.reduce((map, product) => {
      const key = product.category || 'Other';
      const bucket = map.get(key) ?? [];
      bucket.push(product);
      map.set(key, bucket);
      return map;
    }, new Map<string, typeof products>())
  ).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="bg-slate-950 min-h-screen">
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold mb-6">
              <Database className="w-4 h-4" />
              Full Product Database
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Browse Every Product
              <span className="block text-cyan-400">RadarScout Tracks</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mb-8">
              Explore {products.length} products across smart home, wearables, and consumer health tech.
              Each page includes category fit, pros and cons, buying guidance, and source-backed notes.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              {groups.map(([category, items]) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 border border-slate-800"
                >
                  <Layers3 className="w-4 h-4 text-cyan-400" />
                  {category} · {items.length}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {groups.map(([category, items]) => (
            <section key={category}>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white">{category}</h2>
                  <p className="text-slate-400 max-w-2xl">
                    {categoryDescriptions[category] ?? 'Carefully tracked products with review context and buying guidance.'}
                  </p>
                </div>

                <Link
                  href="/buying-guides"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  See related guides
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} showCTA />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
