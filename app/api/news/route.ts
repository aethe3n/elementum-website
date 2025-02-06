import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('News API: Starting request');

    // Create realistic dummy data with diverse categories and sources
    const dummyArticles = [
      {
        title: "Gold Prices Surge Amid Global Economic Uncertainty",
        description: "Precious metals market sees significant gains as investors seek safe-haven assets. Gold prices have reached a new six-month high, reflecting growing concerns about global economic stability and inflation pressures.",
        url: "https://www.reuters.com/markets/commodities",
        urlToImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800",
        publishedAt: new Date().toISOString(),
        source: { name: "Reuters" },
        category: "Precious Metals",
        importance: "high"
      },
      {
        title: "Agricultural Commodities: Global Trade Outlook 2024",
        description: "Comprehensive analysis of agricultural commodity markets, including wheat, corn, and soybeans. Experts predict significant shifts in global trade patterns due to changing climate conditions and geopolitical tensions.",
        url: "https://www.bloomberg.com/markets/commodities",
        urlToImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: "Bloomberg" },
        category: "Agriculture",
        importance: "medium"
      },
      {
        title: "Cryptocurrency Market Analysis: Bitcoin's Impact on Traditional Commodities",
        description: "Exploring the growing correlation between cryptocurrency markets and traditional commodity trading. New research suggests digital assets are influencing commodity price movements.",
        url: "https://www.coindesk.com/markets",
        urlToImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: "CoinDesk" },
        category: "Crypto Markets",
        importance: "high"
      },
      {
        title: "Energy Markets: Renewable Resources Reshape Global Trade",
        description: "Analysis of how renewable energy adoption is impacting traditional energy commodity markets. Focus on solar and wind energy's growing influence on oil and gas prices.",
        url: "https://www.energyreport.com/markets",
        urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        source: { name: "Energy Report" },
        category: "Energy",
        importance: "high"
      },
      {
        title: "Supply Chain Innovation: AI-Driven Commodity Trading",
        description: "How artificial intelligence and machine learning are transforming commodity trading strategies and risk management approaches in global markets.",
        url: "https://www.ft.com/commodities",
        urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        source: { name: "Financial Times" },
        category: "Technology",
        importance: "medium"
      },
      {
        title: "ESG Impact on Commodity Markets: New Trading Patterns",
        description: "Environmental, Social, and Governance factors are reshaping commodity trading strategies. Analysis of sustainable practices' influence on market valuations.",
        url: "https://www.wsj.com/markets",
        urlToImage: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=800",
        publishedAt: new Date(Date.now() - 432000000).toISOString(),
        source: { name: "Wall Street Journal" },
        category: "ESG",
        importance: "high"
      }
    ];

    console.log('News API: Successfully generated dummy data');

    return NextResponse.json({ 
      success: true,
      data: dummyArticles,
      message: "Successfully retrieved news articles",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('News API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: false,
      data: [],
      message: "Failed to fetch news articles",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
        timestamp: new Date().toISOString()
      }
    }, { 
      status: 500 
    });
  }
} 