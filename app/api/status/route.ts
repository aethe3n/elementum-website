import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('Status check failed:', error);
    return NextResponse.json(
      { 
        ok: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
} 