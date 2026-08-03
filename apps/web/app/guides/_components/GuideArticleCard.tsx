import Link from 'next/link'

import type { ThailandGuideArticle } from '@/lib/guides/thailandGuides'

export function GuideArticleCard({ article }: { article: ThailandGuideArticle }) {
  return (
    <article className="flex h-full flex-col rounded-rs-lg border border-rs-sage-200/70 bg-white p-7 shadow-rs-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta-600">
        {article.cityName} guide
      </p>
      <h2 className="mt-4 font-rs-display text-3xl font-semibold leading-tight tracking-[-0.03em]">
        <Link href={article.href} className="transition hover:text-rs-terracotta-600">
          {article.title}
        </Link>
      </h2>
      <p className="mt-4 flex-1 text-sm leading-7 text-rs-muted">{article.description}</p>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-rs-sage-200/70 pt-5 text-xs text-rs-muted">
        <span>Reviewed {article.updatedAt}</span>
        <Link href={article.href} className="font-bold text-rs-forest-800 hover:text-rs-terracotta-600">
          Read guide →
        </Link>
      </div>
    </article>
  )
}
