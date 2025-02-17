"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

// Stripe integration coming soon
export function SubscriptionManager() {
  const { user } = useAuth()

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
          <CardTitle className="text-xl font-light">Free Plan</CardTitle>
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
                <p className="text-yellow-400 text-xs">Premium features coming soon!</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
            onClick={() => window.location.href = '/pricing'}
            disabled
          >
            Premium Coming Soon
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 