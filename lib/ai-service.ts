import { getMarketOverview } from './market-service';

interface DeepSeekMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are a knowledgeable market analysis AI assistant. Your role is to:
1. Provide clear, concise answers about market conditions, trends, and predictions
2. Explain complex financial concepts in an accessible way
3. Analyze market data and provide insights
4. When specific data is unavailable, provide educational content and general insights
5. Always maintain a professional, confident tone`;

export async function getChatResponse(message: string): Promise<string> {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY || '';
    console.log('Making request to DeepSeek API...');
    
    if (!apiKey) {
      console.error('DeepSeek API key is missing');
      throw new Error('API key configuration is missing');
    }

    console.log('Sending request to DeepSeek API with message length:', message.length);
    
    const requestBody = {
      model: 'deepseek-coder-33b-instruct',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Failed to get AI response: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('DeepSeek API Response:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from AI service');
    }
    
    return data.choices[0].message.content;
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

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'deepseek-coder-33b-instruct',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API Error:', errorData);
      throw new Error(`Failed to get AI response: ${response.status}`);
    }

    const data = await response.json();
    console.log('DeepSeek API Response:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response format from AI service');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in getMarketAnalysis:', error);
    return 'I apologize, but I encountered an error generating the market analysis. Please try again later.';
  }
} 