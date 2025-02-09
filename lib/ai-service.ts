import { getMarketOverview } from './market-service';

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Add Tavily API interface
interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  published_date?: string;
}

// Add Tavily search function
async function getTavilySearchResults(query: string): Promise<TavilySearchResult[]> {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_domains: [
          "reuters.com",
          "bloomberg.com",
          "ft.com",
          "wsj.com",
          "cnbc.com",
          "marketwatch.com",
          "investing.com"
        ],
        max_results: 5
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.warn('Failed to get Tavily search results:', error);
    return [];
  }
}

const SYSTEM_PROMPT = `You are a knowledgeable market analysis AI assistant for Elementum Global. Your role is to:
1. Provide clear, concise answers about market conditions, trends, and predictions
2. Explain complex financial concepts in an accessible way
3. Analyze market data and provide insights
4. When specific data is unavailable, provide educational content and general insights
5. Always maintain a professional, confident tone
6. Focus on precious metals, commodities, and forex markets
7. Provide actionable insights when appropriate
8. Maintain conversation context and refer to previous discussions when relevant
9. Vary your response style and depth based on the user's questions
10. Use proper markdown formatting:
    - Use ### for section headers (e.g., "### Market Analysis")
    - Use ** for bold text (e.g., "The price of **gold** has increased")
11. Include specific data points and percentages when available, but:
    - Do not start every response with the same market statistics
    - Integrate market data naturally within the analysis where relevant
    - Vary how and where you present market data
12. Structure responses in different ways:
    - Sometimes lead with key insights
    - Sometimes lead with recent developments
    - Sometimes lead with relevant analysis
13. IMPORTANT: Never repeat the same market statistics at the beginning of consecutive messages
14. Structure complex analyses with clear sections using ### headers
15. Adapt your tone and detail level based on the complexity of the question
16. When market data is provided in the context:
    - Use it to inform your analysis but don't always lead with it
    - Integrate it naturally where it adds value to the discussion
    - Present it in different ways throughout your responses`;

async function makeOpenAIRequest(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key is missing');
    throw new Error('OpenAI API key is missing');
  }

  const maxRetries = 3;
  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < maxRetries) {
    try {
      console.log(`Making request to OpenAI API (attempt ${retryCount + 1})...`);
      
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };

      const requestBody = {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.8,
        max_tokens: 2000,
        stream: false,
        presence_penalty: 0.6,
        frequency_penalty: 0.6,
        top_p: 0.9
      };

      console.log('Request configuration:', {
        endpoint,
        headers: { ...headers, Authorization: 'Bearer [REDACTED]' },
        messages: messages.map(m => ({ role: m.role, content: m.content.substring(0, 50) + '...' }))
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.text();
      console.log('Raw API Response:', responseData.substring(0, 200) + '...');

      if (!response.ok) {
        const statusCode = response.status;
        
        // Handle rate limits
        if (statusCode === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1000 * (retryCount + 1);
          console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        }

        // Handle other API errors
        console.error('OpenAI API Error:', {
          status: statusCode,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseData
        });
        
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = JSON.parse(responseData);
      if (!data.choices?.[0]?.message?.content) {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid response format from OpenAI API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error(`Error in OpenAI request (attempt ${retryCount + 1}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (retryCount < maxRetries - 1) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retryCount++;
      } else {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('Failed to get response from OpenAI API');
}

interface Citation {
  title: string;
  url: string;
  content: string;
  source: string;
  date?: string;
}

interface ChatResponse {
  content: string;
  citations: Citation[];
}

export async function getChatResponse(
  message: string, 
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<ChatResponse> {
  try {
    // Get current market data for context
    let marketContext = '';
    try {
      const marketData = await getMarketOverview();
      marketContext = `\nCurrent Market Context:\n${marketData.summary}`;
    } catch (error) {
      console.warn('Failed to get market context:', error);
    }

    // Get relevant news and analysis from Tavily
    let newsContext = '';
    let citations: Citation[] = [];
    try {
      const searchResults = await getTavilySearchResults(message);
      if (searchResults.length > 0) {
        newsContext = '\nRecent Market News & Analysis:\n' + searchResults
          .map(result => `- ${result.title} (${result.published_date || 'Recent'})\n  ${result.content.substring(0, 200)}...`)
          .join('\n\n');
        
        citations = searchResults.map(result => ({
          title: result.title,
          url: result.url,
          content: result.content.substring(0, 200),
          source: new URL(result.url).hostname,
          date: result.published_date
        }));
      }
    } catch (error) {
      console.warn('Failed to get news context:', error);
    }

    const fullPrompt = `${message}\n${marketContext}\n${newsContext}\n\nPlease provide a detailed response with citations to the sources provided above when relevant.`;
    
    // Combine conversation history with current message
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: fullPrompt }
    ];

    // Ensure we don't exceed token limits (keep last 10 messages)
    if (messages.length > 12) {
      messages.splice(1, messages.length - 12);
    }
    
    const response = await makeOpenAIRequest(messages);
    
    return {
      content: response,
      citations
    };
  } catch (error) {
    console.error('Chat Response Error:', error);
    throw error;
  }
}

export async function getMarketAnalysis(): Promise<string> {
  try {
    console.log('AI Service: Getting market data for analysis');
    const marketData = await getMarketOverview();
    
    const prompt = `
      Please provide a comprehensive market analysis based on the following data:
      
      ${JSON.stringify(marketData, null, 2)}
      
      Focus on:
      1. Key market trends and patterns
      2. Notable price movements and their implications
      3. Potential market drivers and risk factors
      4. Short-term outlook and opportunities
      5. Correlations between different markets
      
      If some market data is unavailable, focus on the available data and provide general market insights.
      Format the response with clear sections and bullet points where appropriate.
    `;

    return await makeOpenAIRequest([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ]);
  } catch (error) {
    console.error('Market Analysis Error:', error);
    return 'I apologize, but I encountered an error generating the market analysis. Please try again later.';
  }
} 