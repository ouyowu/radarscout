import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getArticle, getRelatedArticles, getArticlesByCategory } from '@/lib/data/articles';
import { generateSEO, generateArticleSchema } from '@/lib/seo/metadata';
import { MDXComponents } from '@/components/shared/MDXComponents';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { AffiliateDisclosure } from '@/components/monetization/AffiliateDisclosure';
import { AdSlot } from '@/components/monetization/AdSlot';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

// Generate static params for all articles
export async function generateStaticParams() {
  const categories = ['buying-guides', 'comparisons', 'reviews', 'guides'];
  const params: { category: string; slug: string }[] = [];

  categories.forEach((category) => {
    const articles = getArticlesByCategory(category);
    articles.forEach((article) => {
      params.push({
        category,
        slug: article.slug,
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = getArticle(params.category, params.slug);
  
  if (!article) {
    return {};
  }

  return generateSEO({
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    path: `/${params.category}/${params.slug}`,
    type: 'article',
    publishedTime: article.frontmatter.publishedAt,
    modifiedTime: article.frontmatter.updatedAt,
  });
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticle(params.category, params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 3);

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Schema.org Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema({
            title: article.frontmatter.title,
            description: article.frontmatter.description,
            publishedAt: article.frontmatter.publishedAt,
            updatedAt: article.frontmatter.updatedAt,
          })),
        }}
      />

      {/* Header */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href={`/${params.category}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {article.category}</span>
          </Link>

          {/* Category badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            {article.category}
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            {article.frontmatter.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-300 mb-6">
            {article.frontmatter.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={article.frontmatter.publishedAt}>
                {new Date(article.frontmatter.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime}</span>
            </div>
            {article.frontmatter.author && (
              <div>
                By {article.frontmatter.author}
              </div>
            )}
          </div>

          {/* Tags */}
          {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {article.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article content */}
          <div className="lg:col-span-2">
            <article className="prose prose-invert prose-lg max-w-none">
              <MDXRemote
                source={article.content}
                components={MDXComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    ],
                  },
                }}
              />
            </article>

            {/* Affiliate disclosure */}
            <div className="mt-12">
              <AffiliateDisclosure />
            </div>

            {/* Last updated */}
            {article.frontmatter.updatedAt && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-sm text-slate-500">
                  Last updated:{' '}
                  {new Date(article.frontmatter.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <AdSlot placement="article_sidebar" />
          </aside>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
