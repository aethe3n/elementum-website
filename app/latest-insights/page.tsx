'use client'

import { useEffect, useState, useRef } from 'react'
import { NewsArticle } from '@/lib/news-service'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { CorrelationCard } from '@/components/correlation-card'

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

interface ChatMessage {
  type: 'user' | 'ai' | 'market';
  content: string;
}

interface JBNewsResponse {
  predictions: Array<{
    eventId: number;
    prediction: string;
    confidence: number;
    analysis: string;
    historical_data?: Array<{
      date: string;
      actual: number;
      forecast: number;
      previous: number;
    }>;
  }>;
  source: string;
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

function formatMarkdown(text: string): string {
  // Replace markdown header syntax with HTML h3 tags
  text = text.replace(/###\s*(.*?)(?:\n|$)/g, '<h3 class="text-xl font-semibold text-[#B87D3B] mt-4 mb-2">$1</h3>');
  // Replace markdown bold syntax with HTML bold tags
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return text;
}

export default function LatestInsightsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [marketData, setMarketData] = useState<MarketOverview | null>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<string>('');
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>(initialMarketInsights);
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom(50);
  }, [chatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat]);

  // Scroll to bottom of chat with smooth animation
  const scrollToBottom = (delay = 100) => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        const scrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }, delay);
  };

  async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
        console.log(`Attempt ${i + 1} failed for ${url}`);
      } catch (error) {
        console.error(`Fetch error (attempt ${i + 1}):`, error);
      }
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
    }
    throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const dataStatus = {
          news: false,
          market: false,
          jbNews: false
        };
        
        const responses = await Promise.all([
          fetchWithRetry('/api/news').catch(() => null),
          fetchWithRetry('/api/market').catch(() => null),
          fetchWithRetry('/api/jb-news').catch(() => null)
        ]);

        const [newsResponse, marketResponse, jbResponse] = responses;

        // Process news data
        let newsData = { data: [] };
        if (newsResponse) {
          newsData = await newsResponse.json();
          dataStatus.news = true;
        }

        // Process market data
        let marketData: { data: MarketOverview | null; analysis?: string } = { data: null };
        if (marketResponse) {
          marketData = await marketResponse.json();
          dataStatus.market = true;
        }

        // Process JB News data with proper typing
        let jbData: JBNewsResponse = { predictions: [], source: 'fallback' };
        if (jbResponse) {
          jbData = await jbResponse.json();
          dataStatus.jbNews = true;
        }

        // Update market insights with ML predictions
        const updatedInsights = marketInsights.map(insight => {
          const mlData = jbData.predictions.find(p => p.eventId === insight.eventId);
          if (mlData) {
            return {
              ...insight,
              mlPrediction: {
                forecast: mlData.prediction,
                probability: mlData.confidence,
                smartAnalysis: mlData.analysis,
                historical_data: mlData.historical_data
              },
              dataSource: jbData.source
            };
          }
          return insight;
        });

        // Update states with fetched data
        setMarketInsights(updatedInsights);
        if (newsData.data.length > 0) {
          setArticles(newsData.data);
        }
        if (marketData.data) {
          setMarketData(marketData.data);
          setMarketAnalysis(marketData.analysis || '');
        }

        // Add a status message if using fallback data
        if (!dataStatus.jbNews || !dataStatus.market || !dataStatus.news) {
          setChatMessages(prev => [
            ...prev,
            {
              type: 'market',
              content: 'Note: Some market data is currently using cached values. Real-time updates may be delayed.'
            }
          ]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Add an error message to the chat
        setChatMessages(prev => [
          ...prev,
          {
            type: 'market',
            content: 'We encountered some issues fetching the latest market data. Some information may not be up to date.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Modify handleAskQuestion to include scroll behavior
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    const currentInput = userInput;
    setUserInput(''); // Clear input immediately for better UX
    
    // Add user message and scroll
    setChatMessages(prev => {
      const newMessages: ChatMessage[] = [...prev, { type: 'user', content: currentInput }];
      // Use setTimeout to ensure the DOM has updated before scrolling
      setTimeout(scrollToBottom, 100);
      return newMessages;
    });
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput })
      });
      
      const data = await response.json();
      
      if (data.response) {
        setChatMessages(prev => {
          const newMessages: ChatMessage[] = [...prev, { type: 'ai', content: data.response }];
          // Use setTimeout to ensure the DOM has updated before scrolling
          setTimeout(scrollToBottom, 100);
          return newMessages;
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setChatMessages(prev => {
        const newMessages: ChatMessage[] = [...prev, { 
          type: 'ai', 
          content: 'I apologize, but I encountered an error processing your request. Please try asking your question again.' 
        }];
        // Use setTimeout to ensure the DOM has updated before scrolling
        setTimeout(scrollToBottom, 100);
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Modified handleGetMarketOverview with loading state
  const handleGetMarketOverview = async () => {
    if (!marketData || isOverviewLoading) return;
    
    setIsOverviewLoading(true);
    try {
      // Add loading message
      setChatMessages(prev => [
        ...prev,
        { 
          type: 'market', 
          content: 'Fetching latest market overview...' 
        }
      ]);

      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add the actual market overview
      setChatMessages(prev => [
        ...prev.filter(msg => msg.content !== 'Fetching latest market overview...'),
        { 
          type: 'market', 
          content: marketData.summary + '\n\n' + marketAnalysis 
        }
      ]);
    } catch (error) {
      console.error('Error getting market overview:', error);
      setChatMessages(prev => [
        ...prev.filter(msg => msg.content !== 'Fetching latest market overview...'),
        { 
          type: 'market', 
          content: 'Failed to fetch market overview. Please try again.' 
        }
      ]);
    } finally {
      setIsOverviewLoading(false);
    }
  };

  // Function to format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
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
            <Button 
              onClick={() => setShowChat(prev => !prev)}
              className="w-full rounded-full bg-[#B87D3B] hover:bg-[#96652F] text-white py-6 text-xl font-medium relative overflow-hidden group transform transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(184,125,59,0.4)] border-2 border-[#B87D3B]"
            >
              {showChat ? 'Close Market Assistant' : 'Open Market Assistant'}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </Button>
          </div>

          {showChat && (
            <div className="glimmer-card p-8 max-w-4xl mx-auto">
              <div className={`transition-opacity duration-300 ${showChat ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center mb-6 space-y-4 animate-fadeIn">
                  <Button 
                    onClick={handleGetMarketOverview}
                    variant="outline" 
                    size="lg"
                    disabled={isOverviewLoading}
                    className="w-full transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10 px-8 py-3"
                  >
                    {isOverviewLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#B87D3B]/20 border-t-[#B87D3B] rounded-full animate-spin" />
                        <span>Fetching Overview...</span>
                      </div>
                    ) : (
                      'Get Global Market Overview'
                    )}
                  </Button>
                </div>
                
                <div 
                  ref={chatContainerRef}
                  className="h-[600px] overflow-y-auto mb-6 space-y-4 pr-4 scrollbar-thin scrollbar-thumb-[#B87D3B] scrollbar-track-transparent scroll-smooth"
                >
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`${
                        msg.type === 'user' ? 'text-right' : 'text-left'
                      } animate-slideIn opacity-0`}
                      style={{ 
                        animation: 'slideIn 0.3s ease-out forwards',
                        animationDelay: `${i * 100}ms` 
                      }}
                    >
                      <div className={`inline-block p-3 rounded-lg max-w-[80%] transform transition-all duration-300 hover:scale-[1.01] ${
                        msg.type === 'user' 
                          ? 'bg-[#B87D3B]/20 ml-auto' 
                          : msg.type === 'market'
                          ? 'bg-[#1A1A1A] border border-[#B87D3B]/30'
                          : 'bg-[#1A1A1A]'
                      }`}>
                        {msg.type === 'market' && (
                          <div className="font-semibold text-[#B87D3B] mb-2">
                            Global Market Overview
                          </div>
                        )}
                        <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}></div>
                      </div>
                    </div>
                  ))}
                  {(isLoading || isOverviewLoading) && (
                    <div className="text-left animate-fadeIn">
                      <div className="inline-block p-4 rounded-lg bg-[#1A1A1A] border border-[#B87D3B]/30">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#B87D3B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-[#B87D3B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-[#B87D3B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <form 
                  onSubmit={handleAskQuestion} 
                  className="flex gap-2 transform transition-all duration-300"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isLoading && userInput.trim()) {
                        e.preventDefault();
                        handleAskQuestion(e as any);
                      }
                    }}
                    placeholder="Ask about market conditions..."
                    className="flex-1 px-4 py-2 rounded-lg bg-black/30 border border-neutral-800 focus:outline-none focus:border-[#B87D3B] transition-all duration-300 hover:bg-black/40"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    variant="default"
                    size="sm"
                    disabled={isLoading || !userInput.trim()}
                    className={`transform transition-all duration-300 ${
                      isLoading ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      'Send'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}

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
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B87D3B] hover:text-[#96652F] transition-colors inline-flex items-center gap-1"
                      >
                        Read Full Article
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 