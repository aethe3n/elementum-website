import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if Stripe secret key is configured
    const stripeEnabled = !!process.env.STRIPE_SECRET_KEY

    return NextResponse.json({ enabled: stripeEnabled })
  } catch (error) {
    console.error('Error checking Stripe configuration:', error)
    return NextResponse.json({ enabled: false })
  }
} 