import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/ai-service';
import { CJBNews } from '@/lib/jb-news';

export async function POST(req: NextRequest) {
  try {
    console.log('Chat API: Starting request');
    
    if (!process.env.DEEPSEEK_API_KEY && !process.env.OPENAI_API_KEY) {
      console.error('Chat API: Missing both DEEPSEEK_API_KEY and OPENAI_API_KEY');
      return NextResponse.json(
        { response: "I apologize, but I'm temporarily unable to process your request due to missing API configuration. Please try again later." },
        { status: 200 }
      );
    }

    const body = await req.json();
    
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Chat API: Processing message:', body.message);

    let jbContext = '';
    
    // Try to get JB-News data, but don't fail if unavailable
    try {
      if (process.env.JB_NEWS_API_KEY) {
        const jb = new CJBNews();
        if (await jb.get(process.env.JB_NEWS_API_KEY)) {
          const eventIds = [756020001, 840010002, 978030001]; // Key market events
          const predictions = [];
          
          for (const eventId of eventIds) {
            try {
              if (await jb.load(eventId)) {
                predictions.push({
                  event: jb.info.name,
                  prediction: jb.info.machine_learning.prediction,
                  analysis: jb.info.smart_analysis,
                  confidence: jb.info.machine_learning.confidence
                });
              }
            } catch (error) {
              console.error(`Failed to load event ${eventId}:`, error);
              continue;
            }
          }
          
          if (predictions.length > 0) {
            jbContext = '\nLatest Market Event Predictions:\n' + 
              predictions.map(p => 
                `${p.event}: ${p.prediction} (${Math.round(p.confidence * 100)}% confidence)`
              ).join('\n');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch JB-News data:', error);
      // Continue without JB-News context
    }

    // Get AI response
    const response = await getChatResponse(body.message);
    
    if (!response) {
      console.error('Chat API: No response received from AI service');
      throw new Error('No response received from AI service');
    }

    console.log('Chat API: Successfully got response');

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString(),
      status: 'success'
    });

  } catch (error) {
    console.error('Chat API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        response: "I apologize, but I encountered an error processing your request. Please try again.",
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        status: 'error'
      },
      { status: 200 }
    );
  }
} 