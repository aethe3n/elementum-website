export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}

export async function getLatestNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

function formatArticles(articles: any[], defaultCategory: string): NewsArticle[] {
  return articles.map(article => ({
    title: article.title || '',
    description: article.description || article.summary || '',
    url: article.url || '',
    urlToImage: article.image || '',
    publishedAt: article.published_at || new Date().toISOString(),
    source: {
      name: article.source || 'JB News'
    },
    category: categorizeArticle(article.title + ' ' + (article.description || article.summary), defaultCategory)
  }));
}

function categorizeArticle(content: string, defaultCategory: string): string {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('precious metal') || lowerContent.includes('gold') || lowerContent.includes('silver')) {
    return 'Precious Metals';
  }
  if (lowerContent.includes('commodity') || lowerContent.includes('trading')) {
    return 'Trading Insights';
  }
  if (lowerContent.includes('market') || lowerContent.includes('analysis')) {
    return 'Market Analysis';
  }
  return defaultCategory;
} 