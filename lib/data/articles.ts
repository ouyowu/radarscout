import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { ArticleFrontmatter, Article } from '@/types';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface ArticleWithMeta extends Article {
  readingTime: string;
  excerpt: string;
  category: string;
}

// Get all article categories
export function getArticleCategories(): string[] {
  try {
    const categories = fs.readdirSync(articlesDirectory);
    return categories.filter(cat => {
      const stat = fs.statSync(path.join(articlesDirectory, cat));
      return stat.isDirectory();
    });
  } catch {
    return [];
  }
}

// Get all articles from a category
export function getArticlesByCategory(category: string): ArticleWithMeta[] {
  try {
    const categoryPath = path.join(articlesDirectory, category);
    const files = fs.readdirSync(categoryPath);
    
    const articles = files
      .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
      .map(file => {
        const slug = file.replace(/\.mdx?$/, '');
        const filePath = path.join(categoryPath, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        
        const frontmatter = data as ArticleFrontmatter;
        const stats = readingTime(content);
        
        // Extract excerpt (first paragraph)
        const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
        const excerpt = paragraphs[0]?.substring(0, 160) || frontmatter.description;
        
        return {
          slug,
          frontmatter,
          content,
          readingTime: stats.text,
          excerpt,
          category
        };
      })
      .sort((a, b) => {
        return new Date(b.frontmatter.publishedAt).getTime() - 
               new Date(a.frontmatter.publishedAt).getTime();
      });
    
    return articles;
  } catch {
    return [];
  }
}

// Get all articles across all categories
export function getAllArticles(): ArticleWithMeta[] {
  const categories = getArticleCategories();
  const allArticles: ArticleWithMeta[] = [];
  
  categories.forEach(category => {
    const articles = getArticlesByCategory(category);
    allArticles.push(...articles);
  });
  
  return allArticles.sort((a, b) => {
    return new Date(b.frontmatter.publishedAt).getTime() - 
           new Date(a.frontmatter.publishedAt).getTime();
  });
}

// Get single article by category and slug
export function getArticle(category: string, slug: string): ArticleWithMeta | null {
  try {
    const filePath = path.join(articlesDirectory, category, `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const frontmatter = data as ArticleFrontmatter;
    const stats = readingTime(content);
    
    const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
    const excerpt = paragraphs[0]?.substring(0, 160) || frontmatter.description;
    
    return {
      slug,
      frontmatter,
      content,
      readingTime: stats.text,
      excerpt,
      category
    };
  } catch {
    // Try .md extension
    try {
      const filePath = path.join(articlesDirectory, category, `${slug}.md`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const frontmatter = data as ArticleFrontmatter;
      const stats = readingTime(content);
      
      const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
      const excerpt = paragraphs[0]?.substring(0, 160) || frontmatter.description;
      
      return {
        slug,
        frontmatter,
        content,
        readingTime: stats.text,
        excerpt,
        category
      };
    } catch {
      return null;
    }
  }
}

// Get related articles based on tags
export function getRelatedArticles(article: ArticleWithMeta, limit = 3): ArticleWithMeta[] {
  const allArticles = getAllArticles();
  const tags = article.frontmatter.tags || [];
  
  const related = allArticles
    .filter(a => a.slug !== article.slug)
    .map(a => {
      const aTags = a.frontmatter.tags || [];
      const commonTags = tags.filter(tag => aTags.includes(tag));
      return { article: a, score: commonTags.length };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
  
  // If not enough related by tags, fill with recent from same category
  if (related.length < limit) {
    const sameCategory = allArticles
      .filter(a => a.category === article.category && a.slug !== article.slug)
      .filter(a => !related.includes(a))
      .slice(0, limit - related.length);
    related.push(...sameCategory);
  }
  
  return related;
}

// Get featured articles
export function getFeaturedArticles(limit = 5): ArticleWithMeta[] {
  const allArticles = getAllArticles();
  return allArticles
    .filter(article => article.frontmatter.featured)
    .slice(0, limit);
}

// Search articles
export function searchArticles(query: string): ArticleWithMeta[] {
  const allArticles = getAllArticles();
  const lowerQuery = query.toLowerCase();
  
  return allArticles.filter(article => {
    const titleMatch = article.frontmatter.title.toLowerCase().includes(lowerQuery);
    const descMatch = article.frontmatter.description.toLowerCase().includes(lowerQuery);
    const contentMatch = article.content.toLowerCase().includes(lowerQuery);
    const tagMatch = article.frontmatter.tags?.some(tag => 
      tag.toLowerCase().includes(lowerQuery)
    );
    
    return titleMatch || descMatch || contentMatch || tagMatch;
  });
}

// Get article stats
export function getArticleStats() {
  const allArticles = getAllArticles();
  const categories = getArticleCategories();
  
  return {
    total: allArticles.length,
    byCategory: categories.map(cat => ({
      category: cat,
      count: getArticlesByCategory(cat).length
    })),
    featured: allArticles.filter(a => a.frontmatter.featured).length,
    totalWords: allArticles.reduce((sum, a) => 
      sum + a.content.split(/\s+/).length, 0
    )
  };
}
