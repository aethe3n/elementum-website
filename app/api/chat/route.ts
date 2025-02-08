import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    console.log('Chat API: Starting request');
    
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('Chat API: Missing OPENAI_API_KEY');
      return new NextResponse(
        JSON.stringify({
          error: 'Configuration error',
          message: "I apologize, but I'm temporarily unable to process your request due to missing API configuration. Please try again later."
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Chat API: Failed to parse request body:', parseError);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!body.message) {
      console.error('Chat API: Missing message in request body');
      return new NextResponse(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Chat API: Processing message:', body.message);

    // Get conversation history from request
    const conversationHistory = body.history || [];
    
    // Get AI response with market context and conversation history
    const response = await getChatResponse(body.message, conversationHistory);
    
    if (!response) {
      console.error('Chat API: No response received from AI service');
      throw new Error('No response received from AI service');
    }

    console.log('Chat API: Successfully got response');

    return new NextResponse(
      JSON.stringify({ 
        response,
        timestamp: new Date().toISOString(),
        status: 'success'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Chat API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        message: "I apologize, but I encountered an error processing your request. Please try again.",
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 