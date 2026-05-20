import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/data/articles';
import { getAllProducts } from '@/lib/data/products';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ articles: [], products: [] });
  }

  try {
    // Search articles
    const articles = searchArticles(query);

    // Search products
    const allProducts = getAllProducts();
    const lowerQuery = query.toLowerCase();
    
    const products = allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerQuery);
      const brandMatch = product.brand.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
      const summaryMatch = product.summary.toLowerCase().includes(lowerQuery);
      const featuresMatch = product.features.some(f => 
        f.toLowerCase().includes(lowerQuery)
      );
      
      return nameMatch || brandMatch || categoryMatch || summaryMatch || featuresMatch;
    });

    return NextResponse.json({
      articles: articles.slice(0, 20), // Limit to 20 results
      products: products.slice(0, 20),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
