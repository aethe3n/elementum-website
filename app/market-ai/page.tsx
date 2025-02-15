"use client"

import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { trackEvent, trackEngagement, trackError } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'

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

interface MarketInsight {
  title: string;
  impact: 'positive' | 'negative' | 'neutral';
  correlation: number;
  description: string;
}

interface Citation {
  title: string;
  url: string;
  content: string;
  source: string;
  date?: string;
}

interface ChatMessage {
  type: 'user' | 'ai' | 'market';
  content: string;
  citations?: Citation[];
}

export default function MarketAIPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [marketData, setMarketData] = useState<MarketOverview | null>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([
    {
      title: "Fed Interest Rate Decision",
      impact: "negative",
      correlation: -0.75,
      description: "Strong negative correlation with precious metals prices"
    },
    {
      title: "Global Supply Chain Updates",
      impact: "positive",
      correlation: 0.82,
      description: "Positive impact on commodity market movements"
    },
    {
      title: "Economic Growth Data",
      impact: "neutral",
      correlation: 0.12,
      description: "Limited correlation with current forex trends"
    }
  ]);

  // Example questions array
  const exampleQuestions = [
    "What's driving the current gold price movements?",
    "How are forex markets responding to recent economic data?",
    "What's the outlook for commodity prices this quarter?"
  ];

  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?from=/market-ai');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const marketResponse = await fetch('/api/market');
        if (!marketResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const marketData = await marketResponse.json();
        setMarketData(marketData.data);
        setMarketAnalysis(marketData.analysis);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    // Track page view
    trackEvent('page_view', { page: 'market_ai' });
  }, []);

  const handleGetMarketOverview = async () => {
    setIsOverviewLoading(true);
    try {
      trackEngagement('get_market_overview');
      const response = await fetch('/api/market');
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const data = await response.json();
      
      if (data.data && data.analysis) {
        const overviewMessage = `${data.data.summary}\n\n${data.analysis}`;
        setChatMessages(prev => [...prev, { 
          type: 'market', 
          content: overviewMessage,
          citations: data.sources || [] // Include sources if available
        }]);
      } else {
        throw new Error('Invalid market data format');
      }
    } catch (error) {
      trackError(error as Error, 'market_overview');
      console.error('Market overview error:', error);
      setChatMessages(prev => [...prev, { 
        type: 'market', 
        content: 'I apologize, but I was unable to fetch the current market overview. Please try again later.' 
      }]);
    } finally {
      setIsOverviewLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      trackEngagement('ask_question', { question: userInput });
      // Add the user's message to the chat
      setChatMessages(prev => [...prev, { type: 'user', content: userInput }]);

      // Prepare conversation history
      const history = chatMessages
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
        .filter(msg => msg.role === 'user' || msg.role === 'assistant');

      // Make API call to chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userInput,
          history: history
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: data.response || 'I apologize, but I was unable to process your request.',
        citations: data.citations
      }]);

      // Clear input after successful response
      setUserInput('');
      
      // Scroll to bottom of chat
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }

    } catch (error) {
      trackError(error as Error, 'market_ai_question');
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I apologize, but I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add quick action handler
  const handleQuickAction = async (query: string) => {
    if (!showChat) {
      setShowChat(true);
    }
    setUserInput(query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    setIsLoading(true);
    try {
      trackEngagement('quick_action', { query });
      // Add the user's message to the chat
      setChatMessages(prev => [...prev, { type: 'user', content: query }]);

      // Make API call to chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: data.response || 'I apologize, but I was unable to process your request.',
        citations: data.citations
      }]);

      // Clear input after successful response
      setUserInput('');
      
      // Scroll to bottom of chat
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }

    } catch (error) {
      trackError(error as Error, 'quick_action');
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I apologize, but I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  function formatMarkdown(text: string): string {
    // Replace markdown header syntax with HTML h3 tags
    text = text.replace(/###\s*(.*?)(?:\n|$)/g, '<h3 class="text-xl font-semibold text-[#B87D3B] mt-4 mb-2">$1</h3>');
    // Replace markdown bold syntax with HTML bold tags
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return text;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2 mb-4"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

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

      <main className="relative z-10 py-20">
        <div className="px-6 max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">Market AI Assistant</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Your intelligent companion for market analysis and insights
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glimmer-card p-6">
              <div className="mb-4 service-icon-container p-3 rounded-xl inline-block bg-[#B87D3B]/10">
                <svg className="w-8 h-8 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Market Intelligence</h3>
              <p className="text-neutral-400 text-sm">Advanced AI-powered analysis of real-time market data across precious metals, forex, and commodities with comprehensive market overviews</p>
            </div>

            <div className="glimmer-card p-6">
              <div className="mb-4 service-icon-container p-3 rounded-xl inline-block bg-[#B87D3B]/10">
                <svg className="w-8 h-8 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Insights</h3>
              <p className="text-neutral-400 text-sm">Natural language interaction with AI for detailed market analysis, backed by real-time data and expert sources with citation tracking</p>
            </div>

            <div className="glimmer-card p-6">
              <div className="mb-4 service-icon-container p-3 rounded-xl inline-block bg-[#B87D3B]/10">
                <svg className="w-8 h-8 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Strategic Forecasting</h3>
              <p className="text-neutral-400 text-sm">Machine learning-powered predictions and trend analysis using historical data patterns and current market indicators for informed decision-making</p>
            </div>
          </div>
        </div>

        {/* Main Chat Interface - Full Width */}
        <div className="px-4 w-full">
          <div className="glimmer-card p-8">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-6">
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

              {/* Example Questions */}
              {chatMessages.length === 0 && (
                <div className="mb-8 p-6 bg-[#1A1A1A] rounded-lg border border-neutral-800">
                  <h3 className="text-lg font-semibold mb-4 text-[#B87D3B]">Example Questions You Can Ask:</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleQuickAction("What's driving the current gold price movements?")}
                      className="w-full text-left p-3 rounded-lg bg-[#B87D3B]/10 hover:bg-[#B87D3B]/20 transition-colors"
                    >
                      "What's driving the current gold price movements?"
                    </button>
                    <button 
                      onClick={() => handleQuickAction("How are forex markets responding to recent economic data?")}
                      className="w-full text-left p-3 rounded-lg bg-[#B87D3B]/10 hover:bg-[#B87D3B]/20 transition-colors"
                    >
                      "How are forex markets responding to recent economic data?"
                    </button>
                    <button 
                      onClick={() => handleQuickAction("What's the outlook for commodity prices this quarter?")}
                      className="w-full text-left p-3 rounded-lg bg-[#B87D3B]/10 hover:bg-[#B87D3B]/20 transition-colors"
                    >
                      "What's the outlook for commodity prices this quarter?"
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
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
                      
                      {/* Citations Section */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#B87D3B]/20">
                          <div className="text-sm font-medium text-[#B87D3B] mb-2">Sources:</div>
                          <div className="space-y-2">
                            {msg.citations.map((citation, index) => (
                              <a
                                key={index}
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 rounded bg-[#B87D3B]/5 hover:bg-[#B87D3B]/10 transition-colors text-sm"
                              >
                                <div className="font-medium text-[#B87D3B]">{citation.title}</div>
                                <div className="text-neutral-400 text-xs mt-1">{citation.source} • {citation.date || 'Recent'}</div>
                                <div className="text-neutral-300 text-xs mt-1 line-clamp-2">{citation.content}</div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
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

              {/* Input Form */}
              <form 
                onSubmit={handleAskQuestion} 
                className="flex gap-2 transform transition-all duration-300 max-w-[1400px] mx-auto"
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
        </div>
      </main>
    </div>
  )
} 