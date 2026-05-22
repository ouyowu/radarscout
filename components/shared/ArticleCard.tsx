import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import type { ArticleWithMeta } from '@/lib/data/articles';

interface ArticleCardProps {
  article: ArticleWithMeta;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const categorySlug = article.category.toLowerCase().replace(/\s+/g, '-');
  const articleUrl = `/${categorySlug}/${article.slug}`;
  
  return (
    <article 
      className={`group bg-slate-900 border ${
        featured ? 'border-cyan-500/50' : 'border-slate-800'
      } rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Category badge */}
      <div className="p-6 pb-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
          {article.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 pt-2">
        <Link href={articleUrl}>
          <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3 line-clamp-2">
            {article.frontmatter.title}
          </h2>
        </Link>
        
        <p className="text-slate-400 mb-4 line-clamp-3">
          {article.frontmatter.description}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={article.frontmatter.publishedAt}>
              {new Date(article.frontmatter.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{article.readingTime}</span>
          </div>
        </div>
        
        {/* Tags */}
        {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.frontmatter.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Read more link */}
        <Link
          href={articleUrl}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          Read article
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </article>
  );
}
