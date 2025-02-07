import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
} 