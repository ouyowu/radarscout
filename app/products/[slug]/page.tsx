import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ExternalLink, Check, X } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/lib/data/products';
import { generateSEO, generateProductSchema } from '@/lib/seo/metadata';
import { WhereToBuy } from '@/components/product/WhereToBuy';
import { ProsCons } from '@/components/product/ProsCons';
import { ProductCard } from '@/components/product/ProductCard';
import { AdSlot } from '@/components/monetization/AdSlot';
import { AffiliateDisclosure } from '@/components/monetization/AffiliateDisclosure';
import { getAllProducts } from '@/lib/data/products';

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    return {};
  }

  return generateSEO({
    title: `${product.name} Review - ${product.brand} | RadarScout`,
    description: product.summary,
    path: `/products/${product.slug}`,
    type: 'product',
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Schema.org Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product)),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700">
              <div className="absolute inset-0 bg-grid-slate-700 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl font-black text-slate-700 tracking-tighter">
                  {product.brand.charAt(0)}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                {product.category}
              </div>

              <h1 className="text-5xl font-black text-white mb-4">
                {product.name}
              </h1>

              <p className="text-xl text-slate-300 mb-6">
                {product.summary}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-cyan-400">
                  {product.priceRange}
                </span>
                {product.releaseYear && (
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {product.releaseYear}
                  </span>
                )}
              </div>

              <WhereToBuy
                links={product.affiliateLinks}
                productName={product.name}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Key Specs */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">Key Specs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {product.ecosystems.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">Ecosystems</div>
                    <div className="flex flex-wrap gap-2">
                      {product.ecosystems.map((eco) => (
                        <span
                          key={eco}
                          className="px-2 py-1 bg-slate-800 text-slate-200 text-sm rounded"
                        >
                          {eco}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.connectivity.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">Connectivity</div>
                    <div className="flex flex-wrap gap-2">
                      {product.connectivity.map((conn) => (
                        <span
                          key={conn}
                          className="px-2 py-1 bg-slate-800 text-slate-200 text-sm rounded"
                        >
                          {conn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.batteryLife && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">Battery Life</div>
                    <div className="text-lg font-semibold text-white">
                      {product.batteryLife}
                    </div>
                  </div>
                )}

                {product.subscriptionRequired !== undefined && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">Subscription</div>
                    <div className="text-lg font-semibold text-white">
                      {product.subscriptionRequired ? 'Required' : 'Optional'}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Features & Sensors */}
            {(product.features.length > 0 || product.sensors && product.sensors.length > 0) && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Features & Sensors</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {product.features.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.sensors && product.sensors.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Sensors</h3>
                      <ul className="space-y-2">
                        {product.sensors.map((sensor, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                            <span>{sensor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Pros & Cons */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">Pros & Cons</h2>
              <ProsCons pros={product.pros} cons={product.cons} />
            </section>

            <AdSlot placement="article_inline" />

            {/* Best For / Not Best For */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">Who Should Buy This?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-200 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Best For
                  </h3>
                  <ul className="space-y-2">
                    {product.bestFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-100">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border border-red-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-200 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    Not Best For
                  </h3>
                  <ul className="space-y-2">
                    {product.notBestFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-red-100">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <AffiliateDisclosure />

            {/* Sources */}
            {product.sources.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Sources</h2>
                <div className="space-y-2">
                  {product.sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{source.title}</span>
                    </a>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-4">
                  Last updated: {product.lastUpdated}
                </p>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <AdSlot placement="product_sidebar" />

            <WhereToBuy
              links={product.affiliateLinks}
              productName={product.name}
            />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-white mb-8">Similar Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.slug}
                  product={relatedProduct}
                  showCTA
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
