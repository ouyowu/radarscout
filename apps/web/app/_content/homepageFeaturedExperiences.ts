import { listTourDetailSeoCandidates } from '@/lib/publicProducts/tourDetailSeoCandidates'
import { loadReviewedViatorPublicCatalogue } from '@/lib/viator/reviewedViatorPublicCatalogue'

const reviewedViatorProductsById = new Map(
  loadReviewedViatorPublicCatalogue().map(product => [product.id, product]),
)

export const featuredViatorExperiences = listTourDetailSeoCandidates().map(candidate => {
  const product = reviewedViatorProductsById.get(candidate.publicProductId)

  if (!product) {
    throw new Error(`Approved homepage experience is missing: ${candidate.publicProductId}`)
  }

  return product
})
