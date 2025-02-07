import { NextResponse } from 'next/server';
import { CJBNews } from '@/lib/jb-news';

// Fallback data structure
const FALLBACK_DATA = {
  predictions: [
    {
      eventId: 756020001,
      name: "CHF Consumer Price Index",
      prediction: "Expecting a moderate increase in CPI values",
      confidence: 0.85,
      analysis: "Historical patterns and current economic indicators suggest inflationary pressures",
      timestamp: new Date().toISOString(),
      historical_data: [
        { date: "2024-03-01", actual: 2.8, forecast: 2.6, previous: 2.5 },
        { date: "2024-02-01", actual: 2.5, forecast: 2.4, previous: 2.3 }
      ],
      category: "Economic Indicators",
      currency: "CHF"
    },
    {
      eventId: 840010002,
      name: "USD Federal Funds Rate",
      prediction: "Federal Reserve likely to maintain current rates",
      confidence: 0.92,
      analysis: "Strong employment data and stable inflation metrics support current policy stance",
      timestamp: new Date().toISOString(),
      historical_data: [
        { date: "2024-03-15", actual: 5.25, forecast: 5.25, previous: 5.25 },
        { date: "2024-02-15", actual: 5.25, forecast: 5.25, previous: 5.25 }
      ],
      category: "Central Bank",
      currency: "USD"
    },
    {
      eventId: 978030001,
      name: "EUR Gross Domestic Product",
      prediction: "GDP growth expected to show modest improvement",
      confidence: 0.78,
      analysis: "Recent economic indicators suggest a gradual recovery in European economic activity",
      timestamp: new Date().toISOString(),
      historical_data: [
        { date: "2024-03-01", actual: 0.3, forecast: 0.2, previous: 0.1 },
        { date: "2024-02-01", actual: 0.1, forecast: 0.1, previous: 0.0 }
      ],
      category: "Economic Growth",
      currency: "EUR"
    }
  ]
};

export async function GET() {
  try {
    const API_KEY = process.env.JB_NEWS_API_KEY;
    
    // If no API key, return fallback data immediately
    if (!API_KEY) {
      console.log('JB News API: No API key found, using fallback data');
      return NextResponse.json({
        ...FALLBACK_DATA,
        source: 'fallback',
        message: 'Using fallback data (no API key)',
        timestamp: new Date().toISOString()
      });
    }

    const eventIds = [756020001, 840010002, 978030001];
    const jb = new CJBNews();
    const predictions = [];

    try {
      const connected = await jb.get(API_KEY);
      
      if (!connected) {
        console.log('JB News API: Connection failed, using fallback data');
        return NextResponse.json({
          ...FALLBACK_DATA,
          source: 'fallback',
          message: 'Using fallback data (connection failed)',
          timestamp: new Date().toISOString()
        });
      }

      for (const eventId of eventIds) {
        try {
          const loaded = await jb.load(eventId);
          if (loaded && jb.info) {
            predictions.push({
              eventId: jb.info.eventID,
              name: jb.info.name,
              prediction: jb.info.machine_learning.prediction,
              confidence: jb.info.machine_learning.confidence,
              analysis: jb.info.smart_analysis,
              timestamp: new Date().toISOString(),
              historical_data: jb.info.history,
              category: jb.info.category,
              currency: jb.info.currency
            });
          }
        } catch (eventError) {
          console.log(`Non-critical: Failed to load event ${eventId}`);
          continue;
        }
      }
    } catch (connectionError) {
      console.log('Non-critical: JB News connection error, using fallback');
      return NextResponse.json({
        ...FALLBACK_DATA,
        source: 'fallback',
        message: 'Using fallback data (connection error)',
        timestamp: new Date().toISOString()
      });
    }

    // If we got no predictions, use fallback
    if (predictions.length === 0) {
      console.log('JB News API: No predictions available, using fallback data');
      return NextResponse.json({
        ...FALLBACK_DATA,
        source: 'fallback',
        message: 'Using fallback data (no predictions)',
        timestamp: new Date().toISOString()
      });
    }

    // Return whatever predictions we got
    return NextResponse.json({ 
      predictions,
      source: 'live',
      message: 'Using live data',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.log('JB News API: Unexpected error, using fallback data');
    return NextResponse.json({
      ...FALLBACK_DATA,
      source: 'fallback',
      message: 'Using fallback data (unexpected error)',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 