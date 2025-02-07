import { getMarketOverview } from './market-service';

// Add types at the top of the file
interface AnthropicContent {
  type: string;
  text: string;
}

interface AnthropicResponse {
  content: AnthropicContent[];
  model: string;
  role: string;
}

const SYSTEM_PROMPT = `You are a knowledgeable market analysis AI assistant. Your role is to:
1. Provide clear, concise answers about market conditions, trends, and predictions
2. Explain complex financial concepts in an accessible way
3. Analyze market data and provide insights
4. When specific data is unavailable, provide educational content and general insights
5. Always maintain a professional, confident tone`;

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2024-01-01',
        'anthropic-beta': 'messages-2024-01-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY || ''
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API Error:', errorData);
      throw new Error(`Failed to get AI response: ${response.status}`);
    }

    const data = await response.json();
    
    // The response format for Claude 3 is different
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error('Invalid response format from AI service');
    }
    
    // Get the first text content
    const textContent = data.content.find((c: AnthropicContent) => c.type === 'text');
    if (!textContent || !textContent.text) {
      throw new Error('No text content in AI response');
    }
    
    return textContent.text;
  } catch (error) {
    console.error('AI Service Error:', error);
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
      1. Key market trends
      2. Notable price movements
      3. Potential market drivers
      4. Short-term outlook
      
      If some market data is unavailable, focus on the available data and provide general market insights.
    `;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2024-01-01',
        'anthropic-beta': 'messages-2024-01-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY || ''
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API Error:', errorData);
      throw new Error(`Failed to get AI response: ${response.status}`);
    }

    const data = await response.json();
    
    // The response format for Claude 3 is different
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error('Invalid response format from AI service');
    }
    
    // Get the first text content
    const textContent = data.content.find((c: AnthropicContent) => c.type === 'text');
    if (!textContent || !textContent.text) {
      throw new Error('No text content in AI response');
    }
    
    return textContent.text;
  } catch (error) {
    console.error('Error in getMarketAnalysis:', error);
    return 'I apologize, but I encountered an error generating the market analysis. Please try again later.';
  }
} 