"use client"

import { useState } from 'react'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileHeaderProps {
  user: User
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter()
  const memberSince = user.createdAt ? new Date(user.createdAt) : new Date()
  const accountType = user.plan === 'premium' ? 'Premium' : 'Basic'

  return (
    <div className="bg-black/50 backdrop-blur-lg rounded-xl p-8 border border-neutral-800">
      <div className="flex items-center gap-4">
        <div className="bg-[#B87D3B] rounded-xl w-16 h-16 flex items-center justify-center text-2xl font-bold">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
          <p className="text-neutral-400">{user.email}</p>
        </div>
        <Badge variant="outline" className="ml-auto rounded-lg border-[#B87D3B] text-[#B87D3B]">
          {accountType}
        </Badge>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-neutral-400">
        <div className="flex items-center gap-2">
          <span>Member since:</span>
          <span className="text-white">{memberSince.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Last login:</span>
          <span className="text-white">{new Date(user.lastLogin).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
} 