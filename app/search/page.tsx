'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { ProductCard } from '@/components/product/ProductCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    articles: any[];
    products: any[];
  }>({ articles: [], products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ articles: [], products: [] });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ articles: [], products: [] });
    
    // Clear URL
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url);
  };

  const totalResults = results.articles.length + results.products.length;

  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-6">Search</h1>
          
          {/* Search form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, articles, and guides..."
                className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                >
                  <SearchIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-8">
            <p className="text-slate-400">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  Found <span className="text-white font-semibold">{totalResults}</span> results for{' '}
                  <span className="text-cyan-400 font-semibold">&quot;{query}&quot;</span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Articles */}
        {results.articles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Articles ({results.articles.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.articles.map((article: any) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        {results.products.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">
              Products ({results.products.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.products.map((product: any) => (
                <ProductCard key={product.slug} product={product} showCTA />
              ))}
            </div>
          </section>
        )}

        {/* No results */}
        {query && !loading && totalResults === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-slate-500">
              Try different keywords or browse our categories
            </p>
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              Enter a search term to find products and articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
