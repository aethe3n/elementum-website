"use client"

import { useState } from 'react'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check } from 'lucide-react'

interface SubscriptionManagerProps {
  user: User
}

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  isPopular?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic market data access',
      'Limited API calls',
      'Standard support',
      'Basic analytics',
      'Simple Market AI capabilities',
      'Basic market trend analysis',
      'Limited historical data access',
      'Simple price predictions',
      '1 Premium search per day'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 35,
    isPopular: true,
    features: [
      'Advanced market data access',
      'Unlimited API calls',
      'Priority support',
      'Advanced analytics & insights',
      'Enhanced Market AI Features:',
      'Advanced predictive modeling',
      'Real-time market sentiment analysis',
      'Deep learning price forecasting',
      'Multi-factor market analysis',
      'Comprehensive historical data',
      '3 Premium searches per day'
    ]
  }
]

export default function SubscriptionManager({ user }: SubscriptionManagerProps) {
  const [currentPlan, setCurrentPlan] = useState('free')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return
    
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement subscription upgrade logic
      // This would typically integrate with a payment processor like Stripe
      setSuccess('Subscription updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to update subscription. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Promotional Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2C1810] via-[#4A2817] to-[#2C1810] p-6 rounded-lg border border-[#B87D3B]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
        <div className="relative text-center">
          <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#FFB259] via-[#B87D3B] to-[#FFB259] bg-clip-text text-transparent">
            🎉 Special Launch Offer!
          </p>
          <div className="text-[#FFD700] text-base space-y-1">
            <p>
              <span className="font-semibold">Free Premium Access</span> until February 15th
            </p>
            <p className="text-sm text-neutral-300">
              After Feb 15: Get a <span className="text-white font-medium">2-Week Free Trial</span> of all premium features
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#B87D3B] opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFB259] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-900/10 border-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative bg-black/50 border-neutral-800 ${
              plan.isPopular ? 'border-[#B87D3B]' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#B87D3B] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#B87D3B]">
                {plan.name}
              </CardTitle>
              <CardDescription>
                {plan.price === 0 ? 'Free' : `$${plan.price}/month`}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#B87D3B] shrink-0" />
                    <span className="text-sm text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  currentPlan === plan.id
                    ? 'bg-neutral-700 cursor-default'
                    : 'bg-[#B87D3B] hover:bg-[#96652F]'
                }`}
                disabled={isLoading || currentPlan === plan.id}
                onClick={() => handleUpgrade(plan.id)}
              >
                {currentPlan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-black/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#B87D3B]">
            Subscription Details
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm text-neutral-400">Current Plan</p>
            <p className="font-medium">{plans.find(p => p.id === currentPlan)?.name}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-neutral-400">Billing Cycle</p>
            <p className="font-medium">Monthly</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-neutral-400">Next Billing Date</p>
            <p className="font-medium">
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 