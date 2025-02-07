import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // Add some basic checks
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      apiVersion: '1.0.0'
    };

    // Log the successful request
    console.log('Health check succeeded:', checks);

    return new NextResponse(
      JSON.stringify({
        status: 'healthy',
        ...checks
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  } catch (error) {
    // Log the error details
    console.error('Health check failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
} 