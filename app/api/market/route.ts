import { NextResponse } from 'next/server';
import { getMarketOverview } from '@/lib/market-service';
import { getMarketAnalysis } from '@/lib/ai-service';

export async function GET() {
  try {
    console.log('Market API: Starting request');
    console.log('Environment variables check:', {
      hasAlphaVantage: !!process.env.ALPHA_VANTAGE_API_KEY,
      hasFinnhub: !!process.env.FINNHUB_API_KEY,
      hasPolygon: !!process.env.POLYGON_API_KEY,
      hasAnthropic: !!process.env.ANTHROPIC_API_KEY
    });

    const marketData = await getMarketOverview();
    console.log('Market API: Got market data');

    let aiAnalysis = '';
    try {
      aiAnalysis = await getMarketAnalysis();
      console.log('Market API: Got AI analysis');
    } catch (analysisError) {
      console.error('Error getting AI analysis:', analysisError);
      aiAnalysis = 'AI analysis temporarily unavailable';
    }

    // Generate sources based on the data providers used
    const sources = [
      {
        title: 'Real-Time Market Data',
        url: 'https://elementumglobal.com/market-data',
        content: 'Live market data from multiple trusted sources including major exchanges and data providers',
        source: 'Elementum Global',
        date: new Date().toISOString()
      }
    ];

    if (process.env.ALPHA_VANTAGE_API_KEY) {
      sources.push({
        title: 'Alpha Vantage Market Data',
        url: 'https://www.alphavantage.co',
        content: 'Real-time and historical financial market data',
        source: 'Alpha Vantage',
        date: new Date().toISOString()
      });
    }

    if (process.env.FINNHUB_API_KEY) {
      sources.push({
        title: 'Finnhub Market Analysis',
        url: 'https://finnhub.io',
        content: 'Real-time RESTful APIs for Stocks, Currencies, and Crypto',
        source: 'Finnhub',
        date: new Date().toISOString()
      });
    }

    if (process.env.POLYGON_API_KEY) {
      sources.push({
        title: 'Polygon.io Market Data',
        url: 'https://polygon.io',
        content: 'Real-Time and Historical Financial Market Data APIs',
        source: 'Polygon.io',
        date: new Date().toISOString()
      });
    }

    // If we have no market data but no error was thrown
    if (!marketData.precious_metals.length && !marketData.forex.length && !marketData.commodities.length) {
      return NextResponse.json({
        data: {
          precious_metals: [],
          forex: [],
          commodities: [],
          summary: 'Market data is currently unavailable. Please try again later.'
        },
        analysis: 'Market analysis is currently unavailable due to data access issues.',
        sources: sources
      });
    }

    return NextResponse.json({
      data: marketData,
      analysis: aiAnalysis,
      sources: sources
    });
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch market data',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: {
          precious_metals: [],
          forex: [],
          commodities: [],
          summary: 'Market data is currently unavailable. Please try again later.'
        },
        analysis: 'Market analysis is currently unavailable due to an error.',
        sources: [{
          title: 'System Status',
          url: '#',
          content: 'Market data service temporarily unavailable',
          source: 'Elementum Global',
          date: new Date().toISOString()
        }]
      },
      { status: 500 }
    );
  }
} 