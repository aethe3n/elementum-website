import { getMarketOverview } from './market-service';

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are a knowledgeable market analysis AI assistant. Your role is to:
1. Provide clear, concise answers about market conditions, trends, and predictions
2. Explain complex financial concepts in an accessible way
3. Analyze market data and provide insights
4. When specific data is unavailable, provide educational content and general insights
5. Always maintain a professional, confident tone`;

async function getOpenAIResponse(messages: OpenAIMessage[]): Promise<string> {
  try {
    console.log('Falling back to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Organization': 'org-jb8JEG0Iy8VcVxvvJgwVKBXD'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to get OpenAI response: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Service Error:', error);
    throw error;
  }
}

export async function getChatResponse(message: string): Promise<string> {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY || '';
    console.log('Making request to DeepSeek API...');
    
    if (!apiKey) {
      console.error('DeepSeek API key is missing, falling back to OpenAI');
      return getOpenAIResponse([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]);
    }

    console.log('Sending request to DeepSeek API with message length:', message.length);
    
    const requestBody = {
      model: 'deepseek-chat',
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
      stream: false,
      stop: null
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        console.log('Falling back to OpenAI due to DeepSeek error');
        return getOpenAIResponse([
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ]);
      }

      const data = await response.json();
      console.log('DeepSeek API Response:', JSON.stringify(data, null, 2));
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Invalid response format:', data);
        console.log('Falling back to OpenAI due to invalid DeepSeek response format');
        return getOpenAIResponse([
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ]);
      }
      
      return data.choices[0].message.content;
    } catch (deepseekError) {
      console.error('DeepSeek Service Error:', deepseekError);
      console.log('Falling back to OpenAI due to DeepSeek service error');
      return getOpenAIResponse([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]);
    }
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

    // Try DeepSeek first, then fall back to OpenAI if needed
    try {
      const requestBody = {
        model: 'deepseek-chat',
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
        stream: false,
        stop: null
      };

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || ''}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid DeepSeek response format');
      }

      return data.choices[0].message.content;
    } catch (deepseekError) {
      console.log('Falling back to OpenAI for market analysis');
      return getOpenAIResponse([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]);
    }
  } catch (error) {
    console.error('Error in getMarketAnalysis:', error);
    return 'I apologize, but I encountered an error generating the market analysis. Please try again later.';
  }
} 