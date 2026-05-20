import { getArticlesByCategory, getAllArticles } from '@/lib/data/articles';
import { generateSEO } from '@/lib/seo/metadata';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { AdSlot } from '@/components/monetization/AdSlot';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const categoryInfo: Record<string, { title: string; description: string }> = {
  'buying-guides': {
    title: 'Buying Guides',
    description: 'Expert buying guides to help you choose the right smart home devices, wearables, and health tech products.'
  },
  'comparisons': {
    title: 'Product Comparisons',
    description: 'Detailed side-by-side comparisons of popular smart home and health tech products.'
  },
  'reviews': {
    title: 'Product Reviews',
    description: 'In-depth reviews of the latest smart home devices, wearables, and health monitoring technology.'
  },
  'guides': {
    title: 'Guides & Tutorials',
    description: 'Learn about smart home technology, health tracking, and how to get the most from your devices.'
  },
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const info = categoryInfo[category];
  
  if (!info) {
    return {};
  }

  return generateSEO({
    title: `${info.title} - RadarScout`,
    description: info.description,
    path: `/${category}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(categoryInfo).map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const articles = getArticlesByCategory(category);
  const info = categoryInfo[category];

  if (!info || articles.length === 0) {
    notFound();
  }

  const featuredArticles = articles.filter(a => a.frontmatter.featured);
  const regularArticles = articles.filter(a => !a.frontmatter.featured);

  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            {info.title}
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl">
            {info.description}
          </p>
        </header>

        {/* Ad Slot */}
        <div className="mb-12">
          <AdSlot placement="category_top" />
        </div>

        {/* Featured articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          </section>
        )}

        {/* All articles */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            All {info.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        {/* Empty state */}
        {articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No articles yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
