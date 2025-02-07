import { NextRequest, NextResponse } from 'next/server';

// Remove edge runtime configuration
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API is working',
    path: request.nextUrl.pathname,
    timestamp: new Date().toISOString()
  });
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
  });
} 