"use client";

import { useEffect, useState } from 'react';
import { NewsArticle } from '@/lib/news-service';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { CorrelationCard } from '@/components/correlation-card';
import { trackEvent, trackEngagement } from '@/lib/utils';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
  source: string;
}

interface MarketOverview {
  precious_metals: MarketData[];
  forex: MarketData[];
  commodities: MarketData[];
  summary: string;
}

interface MarketPrediction {
  eventId: number;
  prediction: string;
  confidence: number;
  analysis: string;
  timestamp: string;
  historical_data?: HistoricalDataPoint[];
}

interface HistoricalDataPoint {
  date: string;
  actual: number;
  forecast: number;
  previous: number;
}

interface MLPrediction {
  forecast: string;
  probability: number;
  smartAnalysis: string;
  historical_data?: HistoricalDataPoint[];
}

interface MarketInsight {
  title: string;
  impact: 'positive' | 'negative' | 'neutral';
  correlation: number;
  description: string;
  details: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
  lastUpdated: string;
  eventId?: number;
  mlPrediction?: MLPrediction;
  dataSource: string;
}

// Initial market insights with dataSource
const initialMarketInsights: MarketInsight[] = [
  {
    title: "Fed Interest Rate Decision",
    impact: "negative",
    correlation: -0.75,
    description: "Strong negative correlation with precious metals prices",
    details: "Recent Fed policy shifts show a -0.75 correlation coefficient with gold prices, indicating significant inverse relationship between rate decisions and precious metal valuations.",
    sources: [
      {
        title: "Federal Reserve Policy Impact Analysis",
        url: "https://www.reuters.com/markets/commodities/gold-set-weekly-gain-fed-rate-cut-bets-2024-01-26/"
      },
      {
        title: "Gold Market Trends Report",
        url: "https://www.kitco.com/news/2024-01-26/"
      }
    ],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    dataSource: 'initial'
  },
  {
    title: "Global Supply Chain Updates",
    impact: "positive",
    correlation: 0.82,
    description: "Positive impact on commodity market movements",
    details: "Supply chain disruptions show 0.82 correlation with commodity price increases, particularly affecting industrial metals and energy sectors.",
    sources: [
      {
        title: "Global Supply Chain Index Report",
        url: "https://www.bloomberg.com/markets/commodities"
      }
    ],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    dataSource: 'initial'
  },
  {
    title: "Economic Growth Data",
    impact: "neutral",
    correlation: 0.12,
    description: "Limited correlation with current forex trends",
    details: "GDP growth rates show minimal correlation (0.12) with major currency pairs, suggesting other factors are currently driving forex markets.",
    sources: [
      {
        title: "Forex Market Analysis",
        url: "https://www.bloomberg.com/markets/currencies"
      }
    ],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    dataSource: 'initial'
  }
];

export default function LatestInsightsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>(initialMarketInsights);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/news');
        const data = await response.json();
        if (data.data.length > 0) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Track page view
    trackEvent('page_view', { page: 'latest_insights' });
  }, []);

  const handleNewsClick = (article: NewsArticle) => {
    trackEngagement('news_click', {
      title: article.title,
      source: article.source.name,
      category: article.category
    });
  };

  const handleInsightClick = (insight: MarketInsight) => {
    trackEngagement('insight_click', {
      title: insight.title,
      impact: insight.impact,
      correlation: insight.correlation
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#B87D3B]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#B87D3B" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <main className="relative z-10 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">Latest Insights</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
              Stay informed with the latest updates in global trade and finance
            </p>
          </div>

          {/* Market News Correlations */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Market News Correlations</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {marketInsights.map((insight, index) => (
                <CorrelationCard
                  key={index}
                  title={insight.title}
                  impact={insight.impact}
                  correlation={insight.correlation}
                  description={insight.description}
                  details={insight.details}
                  id={insight.title.toLowerCase().replace(/\s+/g, '-')}
                />
              ))}
            </div>
          </div>

          {/* News Articles Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B87D3B]"></div>
              <div className="text-neutral-400 text-sm animate-pulse">Loading latest market insights...</div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#B87D3B] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#B87D3B] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#B87D3B] animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="text-neutral-400 text-center">
                <p className="text-lg mb-2">No articles available at the moment</p>
                <p className="text-sm">Please check back later or refresh the page</p>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
                size="lg"
                className="px-8"
              >
                Refresh Page
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {articles.map((article, index) => (
                <div 
                  key={index} 
                  className="glimmer-card p-6 hover-float transition-opacity"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-out forwards'
                  }}
                >
                  <div className="aspect-video mb-4 bg-[#B87D3B]/10 rounded-lg overflow-hidden">
                    {article.urlToImage ? (
                      <Image
                        src={article.urlToImage}
                        alt={article.title}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#B87D3B]/20 to-transparent" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#B87D3B] px-3 py-1 rounded-full bg-[#B87D3B]/10">
                        {article.category}
                      </span>
                      <span className="text-sm text-neutral-400">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-white">{article.title}</h2>
                    <p className="text-neutral-400">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400">Source: {article.source.name}</span>
                      <Link 
                        href={article.url}
                        onClick={() => handleNewsClick(article)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B87D3B] hover:text-[#96652F] transition-colors inline-flex items-center gap-1"
                      >
                        Read Full Article
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 