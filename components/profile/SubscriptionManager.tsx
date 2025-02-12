"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { 
  getSubscription, 
  onSubscriptionUpdate, 
  createStripeCheckoutSession,
  createCustomerPortalLink,
  type Subscription 
} from '@/lib/firebase/stripe'
import { STRIPE_PLANS, type StripePlan } from '@/lib/stripe/config'

export function SubscriptionManager() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Initial subscription fetch
    getSubscription(user.uid).then(setSubscription).finally(() => setLoading(false))

    // Subscribe to subscription updates
    const unsubscribe = onSubscriptionUpdate(user.uid, (updatedSubscription) => {
      setSubscription(updatedSubscription)
    })

    return () => unsubscribe()
  }, [user])

  const handleUpgrade = async () => {
    if (!user) return
    
    try {
      // Find the next tier plan
      const plans = Object.values(STRIPE_PLANS)
      const currentPlanIndex = plans.findIndex(
        (plan: StripePlan) => plan.id === subscription?.items.data[0].price.id
      )
      const nextPlan = plans[currentPlanIndex + 1] as StripePlan | undefined
      
      if (nextPlan) {
        const sessionId = await createStripeCheckoutSession(
          user.uid,
          nextPlan.id,
          `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          `${window.location.origin}/pricing`
        )

        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
    }
  }

  const handleManageSubscription = async () => {
    if (!user) return
    
    try {
      const portalUrl = await createCustomerPortalLink(`${window.location.origin}/profile`)
      window.location.href = portalUrl
    } catch (error) {
      console.error('Error opening customer portal:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#B87D3B]" />
      </div>
    )
  }

  const currentPlan = subscription ? Object.values(STRIPE_PLANS).find(
    (plan: StripePlan) => plan.id === subscription.items.data[0].price.id
  ) : null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-light text-white">Subscription</h2>
          <p className="text-neutral-400">Manage your subscription and billing</p>
        </div>
        <Button
          variant="outline"
          className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B] hover:text-white"
          onClick={handleManageSubscription}
        >
          Manage Billing
        </Button>
      </div>

      {subscription ? (
        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-light">
                {currentPlan?.name || 'Current Plan'}
              </CardTitle>
              <Badge
                variant={
                  subscription.status === 'active' ? 'default' :
                  subscription.status === 'canceled' ? 'destructive' :
                  'secondary'
                }
                className={
                  subscription.status === 'active' ? 'bg-emerald-500' :
                  subscription.status === 'canceled' ? 'bg-red-500' :
                  'bg-yellow-500'
                }
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
            </div>
            <CardDescription className="text-neutral-400">
              {subscription.cancel_at_period_end
                ? 'Your subscription will end on '
                : 'Next billing date: '}
              {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Price</span>
                <span className="text-white">
                  ${subscription.items.data[0].price.unit_amount ? 
                    subscription.items.data[0].price.unit_amount / 100 : 0}/
                  {subscription.items.data[0].price.interval}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Status</span>
                <span className="text-white capitalize">{subscription.status}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {currentPlan?.name !== 'Enterprise Plan' && !subscription.cancel_at_period_end && (
              <Button
                className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
                onClick={handleUpgrade}
              >
                Upgrade Plan
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-light">No Active Subscription</CardTitle>
            <CardDescription className="text-neutral-400">
              Choose a plan to get started with our services
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
              onClick={() => window.location.href = '/pricing'}
            >
              View Plans
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 