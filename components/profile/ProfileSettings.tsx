"use client"

import { useState } from 'react'
import { AppUser } from "@/lib/types"
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ProfileSettingsProps {
  user: AppUser
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketAlerts: true,
    twoFactorAuth: false,
    darkMode: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement settings update logic
      setSuccess('Settings updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to update settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-neutral-400">Manage your account settings and preferences.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-900/10 border-green-900 rounded-xl">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="bg-black/50 rounded-xl p-6 border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-neutral-400">Receive updates about your account</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
              className="data-[state=checked]:bg-[#B87D3B]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Market Alerts</Label>
              <p className="text-sm text-neutral-400">Get notified about market changes</p>
            </div>
            <Switch
              checked={settings.marketAlerts}
              onCheckedChange={() => handleToggle('marketAlerts')}
              className="data-[state=checked]:bg-[#B87D3B]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-neutral-400">Enable 2FA for enhanced security</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={() => handleToggle('twoFactorAuth')}
              className="data-[state=checked]:bg-[#B87D3B]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-neutral-400">Toggle dark mode appearance</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={() => handleToggle('darkMode')}
              className="data-[state=checked]:bg-[#B87D3B]"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="w-full rounded-lg bg-[#B87D3B] hover:bg-[#B87D3B]/80"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>

        <div className="bg-red-950/20 rounded-xl p-6 border border-red-900">
          <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
          <p className="text-sm text-neutral-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="destructive"
            className="w-full rounded-lg"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
} 