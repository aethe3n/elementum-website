export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
  source: string;
}

export interface MarketOverview {
  precious_metals: MarketData[];
  forex: MarketData[];
  commodities: MarketData[];
  summary: string;
}

// Alpha Vantage API
async function getAlphaVantageData(symbol: string): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      console.error(`Alpha Vantage API error for ${symbol}:`, await response.text());
      return null;
    }
    
    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        symbol,
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        timestamp: quote['07. latest trading day'] || new Date().toISOString(),
        source: 'Alpha Vantage'
      };
    }
    return null;
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    return null;
  }
}

// Finnhub API
async function getFinnhubData(symbol: string): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      console.error(`Finnhub API error for ${symbol}:`, await response.text());
      return null;
    }
    
    const data = await response.json();
    
    if (data.c) {
      return {
        symbol,
        price: data.c || 0,
        change: data.d || 0,
        changePercent: data.dp || 0,
        timestamp: new Date(data.t * 1000).toISOString(),
        source: 'Finnhub'
      };
    }
    return null;
  } catch (error) {
    console.error('Finnhub API error:', error);
    return null;
  }
}

// Polygon API
async function getPolygonData(symbol: string): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`
    );
    
    if (!response.ok) {
      console.error(`Polygon API error for ${symbol}:`, await response.text());
      return null;
    }
    
    const data = await response.json();
    
    if (data.results?.[0]) {
      const result = data.results[0];
      const change = result.c - result.o;
      const changePercent = (change / result.o) * 100;
      
      return {
        symbol,
        price: result.c || 0,
        change,
        changePercent,
        timestamp: new Date(result.t).toISOString(),
        source: 'Polygon'
      };
    }
    return null;
  } catch (error) {
    console.error('Polygon API error:', error);
    return null;
  }
}

// Combined market data function with retries
export async function getMarketData(symbol: string): Promise<MarketData | null> {
  console.log(`Fetching data for symbol: ${symbol}`);
  
  // Try each API in sequence until we get data
  const data = await getAlphaVantageData(symbol) ||
               await getFinnhubData(symbol) ||
               await getPolygonData(symbol);
  
  if (!data) {
    console.log(`No data available for symbol: ${symbol}`);
  }
  
  return data;
}

// Get comprehensive market overview
export async function getMarketOverview(): Promise<MarketOverview> {
  console.log('Fetching market overview...');
  
  // Use proper symbols for each API
  const precious_metals = await Promise.all([
    getMarketData('XAUUSD'), // Gold
    getMarketData('XAGUSD'), // Silver
    getMarketData('XPTUSD')  // Platinum
  ]);

  const forex = await Promise.all([
    getMarketData('EUR/USD'),
    getMarketData('GBP/USD'),
    getMarketData('USD/JPY')
  ]);

  const commodities = await Promise.all([
    getMarketData('CL'), // Crude Oil
    getMarketData('NG'), // Natural Gas
    getMarketData('ZW')  // Wheat
  ]);

  // Generate market summary
  const summary = generateMarketSummary(precious_metals, forex, commodities);

  const overview = {
    precious_metals: precious_metals.filter((data): data is MarketData => data !== null),
    forex: forex.filter((data): data is MarketData => data !== null),
    commodities: commodities.filter((data): data is MarketData => data !== null),
    summary
  };

  console.log('Market overview:', overview);
  return overview;
}

function generateMarketSummary(
  precious_metals: (MarketData | null)[],
  forex: (MarketData | null)[],
  commodities: (MarketData | null)[]
): string {
  const sections: string[] = [];

  // Precious Metals Summary
  const metals = precious_metals.filter((data): data is MarketData => data !== null);
  if (metals.length > 0) {
    const trend = metals.reduce((sum, data) => sum + data.changePercent, 0) / metals.length;
    sections.push(`Precious Metals: ${trend > 0 ? 'Showing strength' : 'Under pressure'} with ${Math.abs(trend).toFixed(2)}% average ${trend > 0 ? 'gain' : 'loss'}`);
  } else {
    sections.push('Precious Metals: Data currently unavailable');
  }

  // Forex Summary
  const fxPairs = forex.filter((data): data is MarketData => data !== null);
  if (fxPairs.length > 0) {
    const usdStrength = fxPairs.reduce((sum, data) => sum + data.changePercent, 0) / fxPairs.length;
    sections.push(`Forex Markets: USD ${usdStrength > 0 ? 'strengthening' : 'weakening'} against major currencies`);
  } else {
    sections.push('Forex Markets: Data currently unavailable');
  }

  // Commodities Summary
  const comms = commodities.filter((data): data is MarketData => data !== null);
  if (comms.length > 0) {
    const trend = comms.reduce((sum, data) => sum + data.changePercent, 0) / comms.length;
    sections.push(`Commodities: ${trend > 0 ? 'Bullish momentum' : 'Bearish pressure'} with ${Math.abs(trend).toFixed(2)}% average ${trend > 0 ? 'gain' : 'loss'}`);
  } else {
    sections.push('Commodities: Data currently unavailable');
  }

  if (sections.length === 0) {
    return 'Market data is currently unavailable. Please try again later.';
  }

  return sections.join('\n');
} 