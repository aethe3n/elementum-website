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

  const handleGetMarketOverview = async () => {
    setIsOverviewLoading(true);
    try {
      const response = await fetch('/api/market');
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const data = await response.json();
      
      if (data.data && data.analysis) {
        const overviewMessage = `${data.data.summary}\n\n${data.analysis}`;
        setChatMessages(prev => [...prev, { type: 'market', content: overviewMessage }]);
      } else {
        throw new Error('Invalid market data format');
      }
    } catch (error) {
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
                    onClick={() => handleQuickAction(question)}
                    className="glimmer-card p-4 text-left w-full hover:bg-[#B87D3B]/10 transition-colors duration-200 cursor-pointer"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto">
              <Button 
                onClick={() => setShowChat(prev => !prev)}
                className="w-full rounded-full bg-[#B87D3B] hover:bg-[#96652F] text-white py-10 text-2xl font-medium relative overflow-hidden group transform transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(184,125,59,0.4)] border-2 border-[#B87D3B]"
              >
                {showChat ? 'Close Market Assistant' : 'Open Market Assistant'}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
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
                              Market AI Assistant
                            </div>
                          )}
                          <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}></div>
                          
                          {/* Citations Section */}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[#B87D3B]/20">
                              <div className="text-sm font-medium text-[#B87D3B] mb-2">Sources:</div>
                              <div className="space-y-2">
                                {msg.citations.map((citation: Citation, index: number) => (
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