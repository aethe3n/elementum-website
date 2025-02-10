"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileEdit from '@/components/profile/ProfileEdit'
import SubscriptionManager from '@/components/profile/SubscriptionManager'
import ProfileSettings from '@/components/profile/ProfileSettings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trackPageView } from '@/lib/utils'
import { AppUser } from '@/lib/types'

export default function ProfilePage() {
  const { user: firebaseUser, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')

  // Transform Firebase user to our AppUser interface
  const transformedUser: AppUser | null = firebaseUser ? {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || undefined,
    email: firebaseUser.email || '',
    plan: 'basic' as const,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    lastLogin: firebaseUser.metadata.lastSignInTime || new Date().toISOString()
  } : null

  useEffect(() => {
    if (!loading && !transformedUser) {
      router.push('/auth/login?from=/profile')
    }
    trackPageView('/profile')
  }, [transformedUser, loading, router])

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

  if (!transformedUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <ProfileHeader user={transformedUser} />
        
        <Tabs defaultValue="profile" className="mt-12">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur-lg rounded-xl p-1 border border-neutral-800">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white rounded-lg"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="subscription"
              className="data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white rounded-lg"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white rounded-lg"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="bg-black/50 backdrop-blur-lg rounded-xl p-8 border border-neutral-800">
            <ProfileEdit user={transformedUser} />
          </TabsContent>

          <TabsContent value="subscription" className="bg-black/50 backdrop-blur-lg rounded-xl p-8 border border-neutral-800">
            <SubscriptionManager user={transformedUser} />
          </TabsContent>

          <TabsContent value="settings" className="bg-black/50 backdrop-blur-lg rounded-xl p-8 border border-neutral-800">
            <ProfileSettings user={transformedUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 