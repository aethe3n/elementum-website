"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SubscriptionManager } from '@/components/profile/SubscriptionManager'
import { toast } from 'sonner'
import { trackPageView } from '@/lib/utils'
import { Clock, Globe, Mail, User, Shield, CreditCard, Settings, AlertTriangle } from 'lucide-react'

interface UserProfile {
  displayName: string;
  email: string;
  bio: string;
  preferredMarkets: string[];
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    bio: '',
    preferredMarkets: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      email: true,
      push: true
    }
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?from=/profile')
      return
    }
    
    if (user) {
      setProfile(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
      }))
    }
    
    trackPageView('/profile')
  }, [user, loading, router])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      // TODO: Implement profile update
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement account deletion
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
      toast.success('Account deleted successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  const handleChangePassword = async () => {
    try {
      // TODO: Implement password change
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
      toast.success('Password reset email sent')
    } catch (error) {
      toast.error('Failed to send password reset email')
    }
  }

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-white">Account Settings</h1>
          <Button
            variant="outline"
            className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B] hover:text-white"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-20">
                <TabsList className="bg-black/50 border border-neutral-800 rounded-lg p-2 flex flex-col h-auto space-y-2 w-full">
                  <TabsTrigger 
                    value="profile"
                    className="w-full justify-start gap-2 data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings"
                    className="w-full justify-start gap-2 data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="subscription"
                    className="w-full justify-start gap-2 data-[state=active]:bg-[#B87D3B] data-[state=active]:text-white"
                  >
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
              <TabsContent value="profile" className="mt-0">
                <div className="space-y-6">
                  <div className="grid gap-6">
                    {/* Profile Information */}
                    <div className="glimmer-card p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-light text-white flex items-center gap-2">
                          <User className="h-5 w-5 text-[#B87D3B]" />
                          Profile Information
                        </h2>
                        <p className="text-neutral-400">Update your personal information</p>
                      </div>

                      <div className="grid gap-6">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Display Name</Label>
                          <Input
                            id="name"
                            value={profile.displayName}
                            onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                            className="bg-black/30 border-neutral-800"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-black/30 border-neutral-800"
                            disabled
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            className="bg-black/30 border-neutral-800 min-h-[100px]"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="glimmer-card p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-light text-white flex items-center gap-2">
                          <Globe className="h-5 w-5 text-[#B87D3B]" />
                          Preferences
                        </h2>
                        <p className="text-neutral-400">Customize your trading experience</p>
                      </div>

                      <div className="grid gap-6">
                        <div className="grid gap-2">
                          <Label>Preferred Markets</Label>
                          <Select
                            value={profile.preferredMarkets[0]}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, preferredMarkets: [value] }))}
                          >
                            <SelectTrigger className="bg-black/30 border-neutral-800">
                              <SelectValue placeholder="Select markets" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="forex">Forex</SelectItem>
                              <SelectItem value="commodities">Commodities</SelectItem>
                              <SelectItem value="crypto">Cryptocurrency</SelectItem>
                              <SelectItem value="stocks">Stocks</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Timezone</Label>
                          <Select
                            value={profile.timezone}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}
                          >
                            <SelectTrigger className="bg-black/30 border-neutral-800">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <div className="space-y-6">
                  {/* Security Settings */}
                  <div className="glimmer-card p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-light text-white flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#B87D3B]" />
                        Security
                      </h2>
                      <p className="text-neutral-400">Manage your account security settings</p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B] hover:text-white"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </Button>

                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            handleDeleteAccount()
                          }
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="glimmer-card p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-light text-white flex items-center gap-2">
                        <Mail className="h-5 w-5 text-[#B87D3B]" />
                        Notifications
                      </h2>
                      <p className="text-neutral-400">Manage your notification preferences</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-neutral-400">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={profile.notifications.email}
                          onCheckedChange={(checked) => 
                            setProfile(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, email: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-neutral-400">Receive updates in browser</p>
                        </div>
                        <Switch
                          checked={profile.notifications.push}
                          onCheckedChange={(checked) => 
                            setProfile(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, push: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subscription" className="mt-0">
                <SubscriptionManager />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
} 