import { NextRequest, NextResponse } from 'next/server'
import { loadPublicThailandProductDetail } from '@/lib/publicProducts/getPublicThailandProduct'

export const dynamic = 'force-dynamic'

const PRODUCT_SOURCE = 'signed-bokun-supplier-products'
const INVENTORY_SCOPE = 'thailand-first'
type ProductDetailMeta = {
  source: typeof PRODUCT_SOURCE
  inventoryScope: typeof INVENTORY_SCOPE
  bookingEnabled: false
  availabilityEnabled: false
  detailSupported: true
}

function meta(): ProductDetailMeta {
  return {
    source: PRODUCT_SOURCE,
    inventoryScope: INVENTORY_SCOPE,
    bookingEnabled: false,
    availabilityEnabled: false,
    detailSupported: true,
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = decodeURIComponent(params.id).trim()

  if (!id) {
    return NextResponse.json({
      product: null,
      meta: meta(),
      error: 'PRODUCT_NOT_FOUND',
    }, { status: 404 })
  }

  const result = await loadPublicThailandProductDetail(id)

  if (result.status === 'not-found') {
    return NextResponse.json({
      product: null,
      meta: meta(),
      error: 'PRODUCT_NOT_FOUND',
    }, { status: 404 })
  }

  if (result.status === 'error') {
    return NextResponse.json({
      product: null,
      meta: meta(),
      error: 'PRODUCT_DETAIL_UNAVAILABLE',
    }, { status: 500 })
  }

  return NextResponse.json({
    product: result.product,
    meta: meta(),
  })
}
