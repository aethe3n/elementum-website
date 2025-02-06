'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"

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

export default function MarketAIPage() {
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai' | 'market', content: string}>>([])
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
  }, []);

  const handleGetMarketOverview = () => {
    if (marketData) {
      setChatMessages(prev => [
        ...prev,
        { type: 'market', content: marketData.summary + '\n\n' + marketAnalysis }
      ]);
    }
  };

  const submitQuestion = async (question: string) => {
    if (!showChat) {
      setShowChat(true);
    }

    setChatMessages(prev => [...prev, { type: 'user', content: question }]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      setChatMessages(prev => [...prev, { type: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I apologize, but I encountered an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    await submitQuestion(userInput);
    setUserInput('');
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
    await submitQuestion(query);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
              Market AI Assistant
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
              Your intelligent companion for market analysis and insights
            </p>

            {/* AI Capabilities Section */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <div className="glimmer-card p-6 text-left">
                <div className="mb-4 p-3 rounded-xl inline-block bg-[#B87D3B]/10">
                  <svg className="w-8 h-8 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-Time Analysis</h3>
                <p className="text-neutral-400">
                  Get instant analysis of market conditions across precious metals, forex, and commodities
                </p>
              </div>

              <div className="glimmer-card p-6 text-left">
                <div className="mb-4 p-3 rounded-xl inline-block bg-[#B87D3B]/10">
                  <svg className="w-8 h-8 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Interactive Insights</h3>
                <p className="text-neutral-400">
                  Ask questions and receive detailed explanations about market trends and movements
                </p>
              </div>

              <div className="glimmer-card p-6 text-left">
                <div className="mb-4 p-3 rounded-xl inline-block bg-[#B87D3B]/10">
                  <svg className="w-8 h-8 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Predictive Insights</h3>
                <p className="text-neutral-400">
                  Get forward-looking analysis based on current market conditions and historical trends
                </p>
              </div>
            </div>

            {/* Example Questions */}
            <div className="max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl font-semibold mb-6">Example Questions You Can Ask</h2>
              <div className="grid gap-4 text-left">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => submitQuestion(question)}
                    className="glimmer-card p-4 text-left w-full hover:bg-[#B87D3B]/10 transition-colors duration-200 cursor-pointer"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                ["What's the latest prediction for USD Interest Rate?", "USD Interest Rate"],
                ["What's the CPI forecast?", "CPI Forecast"],
                ["Tell me about EUR GDP predictions", "EUR GDP"],
                ["What's the market sentiment analysis?", "Market Sentiment"]
              ].map(([query, label]) => (
                <Button
                  key={label}
                  variant="quick"
                  className="p-3 text-sm bg-[#B87D3B]/10 border border-[#B87D3B]/20 hover:bg-[#B87D3B]/20 hover:border-[#B87D3B]/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => handleQuickAction(query)}
                >
                  {label}
                </Button>
              ))}
            </div>
            
            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto">
              <Button 
                onClick={() => setShowChat(prev => !prev)}
                className="w-full bg-[#B87D3B] hover:bg-[#96652F] text-white mb-4"
              >
                {showChat ? 'Close Market Assistant' : 'Open Market Assistant'}
              </Button>
              
              {showChat && (
                <div className="glimmer-card p-8">
                  {chatMessages.length === 0 && (
                    <div className="text-center mb-6">
                      <Button 
                        onClick={handleGetMarketOverview}
                        variant="outline" 
                        size="lg"
                        className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10 px-8 py-3"
                      >
                        Get Global Market Overview
                      </Button>
                    </div>
                  )}
                  
                  {/* Enhanced Chat Messages Container */}
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
                        <div className={`inline-block p-4 rounded-lg max-w-[85%] transform transition-all duration-300 hover:scale-[1.01] ${
                          msg.type === 'user' 
                            ? 'bg-[#B87D3B]/20 ml-auto shadow-lg' 
                            : msg.type === 'market'
                            ? 'bg-[#1A1A1A] border border-[#B87D3B]/30 shadow-xl'
                            : 'bg-[#1A1A1A] shadow-lg'
                        }`}>
                          {msg.type === 'market' && (
                            <div className="font-semibold text-[#B87D3B] mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              Global Market Overview
                            </div>
                          )}
                          {msg.type === 'ai' && (
                            <div className="font-semibold text-[#B87D3B] mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              AI Assistant
                            </div>
                          )}
                          <div className="whitespace-pre-line">{msg.content}</div>
                        </div>
                      </div>
                    ))}
                    {(isLoading || isOverviewLoading) && (
                      <div className="text-left animate-fadeIn">
                        <div className="inline-block p-4 rounded-lg bg-[#1A1A1A] border border-[#B87D3B]/30 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-[#B87D3B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-[#B87D3B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-[#B87D3B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-sm text-neutral-400">Processing your request...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Input Form */}
                  <form 
                    onSubmit={handleAskQuestion} 
                    className="flex gap-3 transform transition-all duration-300"
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
                      className="flex-1 px-6 py-4 text-lg rounded-lg bg-black/30 border border-neutral-800 focus:outline-none focus:border-[#B87D3B] transition-all duration-300 hover:bg-black/40 placeholder-neutral-500"
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      variant="default"
                      size="lg"
                      disabled={isLoading || !userInput.trim()}
                      className={`min-w-[120px] py-4 text-lg transform transition-all duration-300 ${
                        isLoading ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 