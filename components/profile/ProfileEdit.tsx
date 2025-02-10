"use client"

import { useState, useEffect } from 'react'
import { AppUser } from "@/lib/types"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { updateProfile } from '@/lib/firebase/auth'

interface ProfileEditProps {
  user: AppUser
}

export default function ProfileEdit({ user }: ProfileEditProps) {
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    setName(user.name || '')
    setEmail(user.email)
  }, [user])

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      await updateProfile(user.id, { name, email })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Edit Profile</h2>
        <p className="text-neutral-400">Update your profile information</p>
      </div>

      {saveStatus === 'saving' && (
        <Alert className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 rounded-xl">
          <AlertDescription>Saving changes...</AlertDescription>
        </Alert>
      )}

      {saveStatus === 'saved' && (
        <Alert className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl">
          <AlertDescription>Changes saved successfully!</AlertDescription>
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert className="bg-red-500/10 text-red-500 border-red-500/20 rounded-xl">
          <AlertDescription>Error saving changes. Please try again.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/50 border-neutral-800 rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/50 border-neutral-800 rounded-lg"
            placeholder="Enter your email"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="w-full bg-[#B87D3B] hover:bg-[#A16B29] rounded-lg"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
} 