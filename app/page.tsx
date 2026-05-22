import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getFeaturedArticles, getAllArticles } from '@/lib/data/articles';
import { getFeaturedProducts } from '@/lib/data/products';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { ProductCard } from '@/components/product/ProductCard';
import { AdSlot } from '@/components/monetization/AdSlot';
import { NewsletterForm } from '@/components/shared/NewsletterForm';

const homePageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'RadarScout',
      url: 'https://www.radarscout.io',
      description:
        'Discover, compare, and track the best smart home devices, wearables, and health tech.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.radarscout.io/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'RadarScout',
      url: 'https://www.radarscout.io',
      logo: 'https://www.radarscout.io/logo.svg',
    },
  ],
};

export default function HomePage() {
  const featuredArticles = getFeaturedArticles(6);
  const recentArticles = getAllArticles().slice(0, 3);
  const featuredProducts = getFeaturedProducts(6);

  return (
    <div className="bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageSchema),
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Smart Home • Wearables • Health Tech
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
              Find the Perfect
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Smart Tech
              </span>
              for Your Lifestyle
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Expert reviews, buying guides, and comparisons to help you choose the right smart home devices, wearables, and health monitoring tech.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/buying-guides"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Browse Buying Guides
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-slate-600"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-white mb-2">
                Featured Guides
              </h2>
              <p className="text-slate-400">
                Our most popular buying guides and reviews
              </p>
            </div>
            <Link
              href="/buying-guides"
              className="hidden sm:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {featuredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">No featured articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Ad Slot */}
      <section className="py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlot placement="homepage_mid" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-white mb-2">
                Top Products
              </h2>
              <p className="text-slate-400">
                Highly rated smart home and health tech devices
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} showCTA />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">No featured products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white mb-10 text-center">
            Browse by Category
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Buying Guides',
                href: '/buying-guides',
                description: 'Expert recommendations for choosing the right products',
                icon: '📚',
              },
              {
                name: 'Product Reviews',
                href: '/reviews',
                description: 'In-depth testing and honest reviews',
                icon: '⭐',
              },
              {
                name: 'Comparisons',
                href: '/comparisons',
                description: 'Side-by-side product comparisons',
                icon: '⚖️',
              },
              {
                name: 'Guides & Tips',
                href: '/guides',
                description: 'Learn about smart home and health tech',
                icon: '💡',
              },
            ].map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-slate-400 text-sm">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black text-white mb-2">
                  Latest Articles
                </h2>
                <p className="text-slate-400">
                  Fresh content to help you make better decisions
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Stay Updated on the Latest Tech
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Get expert reviews and buying guides delivered to your inbox
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
