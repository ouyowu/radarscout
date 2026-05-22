import Link from 'next/link';
import { Star, TrendingUp } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showCTA?: boolean;
  featured?: boolean;
}

export function ProductCard({ product, showCTA = false, featured = false }: ProductCardProps) {
  const primaryLink = product.affiliateLinks.find(link => link.isAffiliate) || product.affiliateLinks[0];

  return (
    <div className={`group relative bg-white dark:bg-slate-900 border ${featured ? 'border-cyan-300 dark:border-cyan-700' : 'border-slate-200 dark:border-slate-800'} rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
      {featured && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        </div>
      )}

      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-300 dark:bg-grid-slate-700 opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-black text-slate-300 dark:text-slate-700 tracking-tighter">
              {product.brand.charAt(0)}
            </div>
          </div>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            {product.brand}
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {product.summary}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {product.category}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            {product.priceRange}
          </span>
        </div>

        {product.pros.length > 0 && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                {product.pros[0]}
              </p>
            </div>
          </div>
        )}

        {showCTA && primaryLink && (
          <div className="pt-4">
            <Link
              href={`/products/${product.slug}`}
              className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
