"use client"

import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface ProfileEditProps {
  user: User
}

interface ProfileData {
  displayName: string
  bio: string
  background: string
  tradingExperience: string
  preferredMarkets: string[]
}

const experienceLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional'
]

const marketTypes = [
  'Precious Metals',
  'Food Products',
  'Petroleum',
  'OTC Trading',
  'Forex',
  'Commodities'
]

export default function ProfileEdit({ user }: ProfileEditProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user.displayName || '',
    bio: '',
    background: '',
    tradingExperience: 'Beginner',
    preferredMarkets: []
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const debouncedProfileData = useDebounce(profileData, 1000)

  useEffect(() => {
    // Load profile data from Firestore
    const loadProfileData = async () => {
      try {
        // TODO: Implement Firestore fetch
        // const data = await fetchUserProfile(user.uid)
        // setProfileData(data)
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfileData()
  }, [user.uid])

  useEffect(() => {
    // Auto-save when data changes
    const saveProfileData = async () => {
      if (saveStatus === 'saving') return

      setSaveStatus('saving')
      try {
        // TODO: Implement Firestore update
        // await updateUserProfile(user.uid, debouncedProfileData)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        console.error('Error saving profile:', error)
        setSaveStatus('error')
      }
    }

    if (debouncedProfileData !== profileData) {
      saveProfileData()
    }
  }, [debouncedProfileData, profileData, saveStatus, user.uid])

  const handleChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <p className="text-neutral-400">Update your profile information below.</p>
      </div>

      {/* Save Status */}
      {saveStatus === 'saving' && (
        <Alert className="bg-[#B87D3B]/10 border-[#B87D3B] rounded-xl">
          <AlertDescription>Saving changes...</AlertDescription>
        </Alert>
      )}
      {saveStatus === 'saved' && (
        <Alert className="bg-green-900/10 border-green-900 rounded-xl">
          <AlertDescription>Changes saved successfully!</AlertDescription>
        </Alert>
      )}
      {saveStatus === 'error' && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>Failed to save changes. Please try again.</AlertDescription>
        </Alert>
      )}

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={profileData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className="rounded-lg bg-black/50 border-neutral-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="rounded-lg bg-black/50 border-neutral-800 min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-neutral-400">
            {profileData.bio.length}/500 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background">Professional Background</Label>
          <Textarea
            id="background"
            value={profileData.background}
            onChange={(e) => handleChange('background', e.target.value)}
            className="rounded-lg bg-black/50 border-neutral-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradingExperience">Trading Experience</Label>
          <Select
            value={profileData.tradingExperience}
            onValueChange={(value) => handleChange('tradingExperience', value)}
          >
            <SelectTrigger className="rounded-lg bg-black/50 border-neutral-800">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preferred Markets</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {marketTypes.map((market) => (
              <Button
                key={market}
                variant="outline"
                className={`rounded-lg border-[#B87D3B] ${
                  profileData.preferredMarkets.includes(market)
                    ? 'bg-[#B87D3B] text-white'
                    : 'text-[#B87D3B] hover:bg-[#B87D3B]/10'
                }`}
                onClick={() => {
                  const markets = profileData.preferredMarkets.includes(market)
                    ? profileData.preferredMarkets.filter((m) => m !== market)
                    : [...profileData.preferredMarkets, market]
                  handleChange('preferredMarkets', markets)
                }}
              >
                {market}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full rounded-lg bg-[#B87D3B] hover:bg-[#B87D3B]/80"
        >
          {isSaving ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </div>
  )
} 