"use client"

import { useState } from 'react'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileHeaderProps {
  user: User
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter()
  const memberSince = user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date()
  const accountType = 'Basic' // This should come from your user data in Firestore

  return (
    <div className="bg-black/50 rounded-lg p-8 backdrop-blur-lg border border-neutral-800">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* User Information */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{user.displayName || user.email?.split('@')[0] || 'User'}</h1>
            <Badge variant="outline" className="bg-[#B87D3B]/10 text-[#B87D3B] border-[#B87D3B]">
              {accountType}
            </Badge>
          </div>
          <p className="text-neutral-400 mb-4">{user.email}</p>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
            <div>
              <span className="font-medium text-white">Member since:</span>{' '}
              {memberSince.toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-white">Last login:</span>{' '}
              {user.metadata.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                : 'Never'}
            </div>
          </div>
        </div>

        {/* Settings Button */}
        <div>
          <Button 
            variant="outline" 
            className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
            onClick={() => router.push('/settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
} 