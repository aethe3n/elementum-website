"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

// Import Stripe functions conditionally
let stripeUtils: any = null;
try {
  stripeUtils = require('@/lib/firebase/stripe');
} catch (error) {
  console.warn('Stripe utilities not available:', error);
}

export function SubscriptionManager() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !stripeUtils) {
      setLoading(false)
      return
    }

    const loadSubscription = async () => {
      try {
        // Initial subscription fetch
        const sub = await stripeUtils.getSubscription(user.uid)
        setSubscription(sub)
      } catch (error) {
        console.error('Error loading subscription:', error)
        setError('Unable to load subscription information')
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()

    // Only set up subscription updates if stripeUtils is available
    if (stripeUtils?.onSubscriptionUpdate) {
      const unsubscribe = stripeUtils.onSubscriptionUpdate(user.uid, (updatedSubscription: any) => {
        setSubscription(updatedSubscription)
      })
      return () => unsubscribe()
    }
  }, [user])

  if (!stripeUtils) {
    return (
      <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-light">Subscription Management Unavailable</CardTitle>
          <CardDescription className="text-neutral-400">
            Subscription management is currently being set up. Please check back later.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#B87D3B]" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-light">Error Loading Subscription</CardTitle>
          <CardDescription className="text-neutral-400">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-light text-white">Subscription</h2>
          <p className="text-neutral-400">Manage your subscription and billing</p>
        </div>
      </div>

      <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-light">
            Free Plan
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Access to our advanced AI chat assistant with powerful capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Status</span>
              <span className="text-white">Active</span>
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="text-[#B87D3B] font-medium mb-2">Current Features:</h4>
              <ul className="space-y-2 text-neutral-300">
                <li>• Advanced AI chat assistant with real-time responses</li>
                <li>• Web search capabilities for up-to-date information</li>
                <li>• Multiple AI models for diverse capabilities</li>
                <li>• Market analysis and insights</li>
                <li>• Basic data visualization</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-md border border-yellow-500/20">
                <p className="text-yellow-400 text-xs">Coming Soon: Limited to 3 free searches per day. Upgrade to premium for unlimited access.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
            onClick={() => window.location.href = '/pricing'}
          >
            View Plans
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 