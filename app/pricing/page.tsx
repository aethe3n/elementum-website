"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { createStripeCheckoutSession } from '@/lib/firebase/stripe';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      router.push('/auth/login?from=/pricing');
      return;
    }

    try {
      const sessionId = await createStripeCheckoutSession(
        user.uid,
        priceId,
        `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        `${window.location.origin}/pricing`
      );

      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light tracking-tight text-white mb-4">
            Choose Your Trading Plan
          </h1>
          <p className="text-xl text-neutral-400">
            Select the perfect plan for your trading needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.values(STRIPE_PLANS).map((plan) => (
            <Card key={plan.id} className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-light">{plan.name}</CardTitle>
                <CardDescription className="text-neutral-400">
                  Perfect for {plan.name === 'Basic Plan' ? 'getting started' : 
                              plan.name === 'Pro Plan' ? 'professional traders' : 
                              'enterprise needs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-light">${plan.price}</span>
                  <span className="text-neutral-400">/month</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-neutral-200">
                      <Check className="h-5 w-5 text-[#B87D3B]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {user ? 'Subscribe Now' : 'Sign Up to Subscribe'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-light text-white mb-4">
            Enterprise Solutions
          </h2>
          <p className="text-neutral-400 mb-6">
            Need a custom solution? We offer tailored packages for large organizations.
          </p>
          <Button variant="outline" className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B] hover:text-white">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
} 