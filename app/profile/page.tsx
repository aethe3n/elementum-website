"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionManager } from '@/components/profile/SubscriptionManager'
import { trackPageView } from '@/lib/utils'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?from=/profile')
      return
    }
    trackPageView('/profile')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2 mb-4"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-white mb-8">Account Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-black/50 border-neutral-800">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="subscription"
              className="data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white"
            >
              Subscription
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="profile">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-light text-white">Profile Information</h2>
                  <p className="text-neutral-400">Update your account settings</p>
                </div>

                <div className="grid gap-6">
                  <div>
                    <label className="text-sm font-medium text-white">Email</label>
                    <p className="text-neutral-400">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">Name</label>
                    <p className="text-neutral-400">{user.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">Account Created</label>
                    <p className="text-neutral-400">
                      {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionManager />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
} 