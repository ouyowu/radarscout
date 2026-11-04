import {
  thailandGuideArticles,
  type ThailandGuideArticle,
} from '../guides/thailandGuides'

/**
 * Short answers to the questions travellers actually ask, in a shape answer
 * engines can quote.
 *
 * Every answer is derived from a reviewed guide rather than written here: the
 * question is that guide's title, the answer is its `quickAnswer`, and the
 * reviewer and date are carried over unchanged. Nothing on this page is a
 * claim the guide did not already make, so there is no second body of Thailand
 * facts to keep true.
 *
 * The answers live on one hub rather than a page each. Ten pages repeating a
 * paragraph already published in the guide would be duplicate, thin content;
 * one hub that links into each guide gives the engines a FAQPage to cite and
 * sends the reader to where the reasoning — and the booking handoff — lives.
 */
export type ThailandAnswer = {
  /**
   * The guide's href. A slug alone is not unique — several cities publish a
   * `where-to-stay` guide — so identity comes from the path, which is unique
   * by construction.
   */
  id: string
  question: string
  answer: string
  cityName: string
  /** The reviewed guide this answer was taken from. */
  sourceHref: string
  reviewedBy: string
  updatedAt: string
}

function isAnswerable(guide: ThailandGuideArticle): boolean {
  return (
    guide.quickAnswer.trim().length > 0
    && guide.title.trim().length > 0
    && guide.reviewedBy.trim().length > 0
    && guide.href.trim().length > 0
  )
}

/**
 * Only guides that carry a reviewer and a real short answer become answers.
 * A guide missing either is skipped rather than published unattributed.
 */
export function buildThailandAnswers(
  guides: readonly ThailandGuideArticle[] = thailandGuideArticles,
): ThailandAnswer[] {
  return guides.filter(isAnswerable).map(guide => ({
    id: guide.href,
    question: guide.title,
    answer: guide.quickAnswer,
    cityName: guide.cityName,
    sourceHref: guide.href,
    reviewedBy: guide.reviewedBy,
    updatedAt: guide.updatedAt,
  }))
}

export const thailandAnswers: readonly ThailandAnswer[] = buildThailandAnswers()

/** Answers grouped by city, cities in the order they first appear. */
export function groupAnswersByCity(
  answers: readonly ThailandAnswer[] = thailandAnswers,
): { cityName: string; answers: ThailandAnswer[] }[] {
  const byCity = new Map<string, ThailandAnswer[]>()

  for (const answer of answers) {
    const existing = byCity.get(answer.cityName)
    if (existing) existing.push(answer)
    else byCity.set(answer.cityName, [answer])
  }

  return [...byCity.entries()].map(([cityName, cityAnswers]) => ({
    cityName,
    answers: cityAnswers,
  }))
}

/**
 * schema.org FAQPage. This is what an answer engine reads to quote the page,
 * so it carries the same text the reader sees — never a longer or different
 * answer written for crawlers.
 */
export function buildFaqPageSchema(
  answers: readonly ThailandAnswer[] = thailandAnswers,
  baseUrl = 'https://www.radarscout.io',
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}/answers#faq`,
    mainEntity: answers.map(answer => ({
      '@type': 'Question',
      name: answer.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer.answer,
        url: `${baseUrl}${answer.sourceHref}`,
      },
    })),
  }
}

/** Most recent review date across the published answers, for the page header. */
export function latestAnswerReviewDate(
  answers: readonly ThailandAnswer[] = thailandAnswers,
): string | null {
  const dates = answers.map(answer => answer.updatedAt).filter(Boolean).sort()
  return dates.length > 0 ? dates[dates.length - 1] : null
}
