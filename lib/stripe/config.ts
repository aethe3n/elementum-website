import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest API version
  typescript: true,
});

export const STRIPE_PLANS = {
  BASIC: {
    name: 'Basic Plan',
    id: process.env.STRIPE_BASIC_PRICE_ID || '',
    price: 49,
    features: [
      'Basic market analysis',
      'Standard trading tools',
      'Email support',
      'Market reports (weekly)',
    ],
  },
  PRO: {
    name: 'Pro Plan',
    id: process.env.STRIPE_PRO_PRICE_ID || '',
    price: 99,
    features: [
      'Advanced market analysis',
      'Premium trading tools',
      'Priority support',
      'Market reports (daily)',
      'API access',
      'Custom alerts',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise Plan',
    id: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    price: 299,
    features: [
      'Full market analysis suite',
      'Enterprise trading tools',
      'Dedicated support',
      'Real-time market reports',
      'Advanced API access',
      'Custom solutions',
      'Account manager',
    ],
  },
}; 