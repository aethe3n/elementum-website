import { NextResponse } from 'next/server';

async function testOpenAI() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'OpenAI API key missing' };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello, this is a test.' }],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await response.text();
    console.log('OpenAI Response:', data);

    return {
      success: response.ok,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error('OpenAI Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function testGroq() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'GROQ API key missing' };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: 'Hello, this is a test.' }],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await response.text();
    console.log('GROQ Response:', data);

    return {
      success: response.ok,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error('GROQ Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function testAnthropicClaude() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'Anthropic API key missing' };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Hello, this is a test.' }]
      })
    });

    const data = await response.text();
    console.log('Anthropic Response:', data);

    return {
      success: response.ok,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error('Anthropic Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function testDeepSeek() {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'DeepSeek API key missing' };
    }

    const response = await fetch('https://api.deepseek.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hello, this is a test.' }],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await response.text();
    console.log('DeepSeek Response:', data);

    return {
      success: response.ok,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error('DeepSeek Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function testMoonshot() {
  try {
    const apiKey = process.env.MOONSHOT_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'Moonshot API key missing' };
    }

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'kimi-v2',
        messages: [{ role: 'user', content: 'Hello, this is a test.' }],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await response.text();
    console.log('Moonshot Response:', data);

    return {
      success: response.ok,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error('Moonshot Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET() {
  console.log('Testing AI Services...');
  
  // Test Moonshot
  console.log('Testing Moonshot...');
  const moonshotResult = await testMoonshot();
  
  // Test OpenAI
  console.log('Testing OpenAI...');
  const openaiResult = await testOpenAI();
  
  // Test GROQ
  console.log('Testing GROQ...');
  const groqResult = await testGroq();
  
  // Test Anthropic
  console.log('Testing Anthropic...');
  const anthropicResult = await testAnthropicClaude();
  
  // Test DeepSeek
  console.log('Testing DeepSeek...');
  const deepseekResult = await testDeepSeek();
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    moonshot: moonshotResult,
    openai: openaiResult,
    groq: groqResult,
    anthropic: anthropicResult,
    deepseek: deepseekResult
  });
} 