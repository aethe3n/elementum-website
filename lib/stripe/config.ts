import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});

export interface StripePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export const STRIPE_PLANS: Record<string, StripePlan> = {
  BASIC: {
    id: process.env.STRIPE_BASIC_PRICE_ID!,
    name: 'Basic Plan',
    description: 'Perfect for getting started with trading',
    price: 49,
    features: [
      'Basic market analysis tools',
      'Real-time price alerts',
      'Daily market insights',
      'Email support',
      'Basic API access'
    ]
  },
  PRO: {
    id: process.env.STRIPE_PRO_PRICE_ID!,
    name: 'Pro Plan',
    description: 'Advanced features for serious traders',
    price: 99,
    features: [
      'All Basic features',
      'Advanced technical analysis',
      'Priority API access',
      'Custom alerts configuration',
      'Priority support',
      'Trading signals',
      'Portfolio tracking'
    ]
  },
  ENTERPRISE: {
    id: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    name: 'Enterprise Plan',
    description: 'Full suite of trading tools for organizations',
    price: 299,
    features: [
      'All Pro features',
      'Dedicated account manager',
      'Custom integration support',
      'Advanced API features',
      'Team collaboration tools',
      'Custom reporting',
      'SLA guarantees',
      'Training sessions'
    ]
  }
}; 