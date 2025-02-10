"use client"

import { useState } from 'react'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface NotificationCenterProps {
  user: User
}

interface NotificationPreference {
  id: string
  type: string
  category: string
  enabled: boolean
  description: string
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: '1',
    type: 'Market Alerts',
    category: 'price',
    enabled: true,
    description: 'Get notified about significant price movements'
  },
  {
    id: '2',
    type: 'News Updates',
    category: 'news',
    enabled: true,
    description: 'Receive important market news and updates'
  },
  {
    id: '3',
    type: 'Trading Activity',
    category: 'trading',
    enabled: true,
    description: 'Stay informed about your trading activity'
  },
  {
    id: '4',
    type: 'Platform Updates',
    category: 'system',
    enabled: true,
    description: 'Get notified about system updates and maintenance'
  }
]

export default function NotificationCenter({ user }: NotificationCenterProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTogglePreference = async (id: string) => {
    try {
      const updatedPreferences = preferences.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
      setPreferences(updatedPreferences)
      // TODO: Implement preference update in backend
      setSuccess('Preferences updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError('Failed to update preferences')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleToggleChannel = async (channel: 'email' | 'push', enabled: boolean) => {
    try {
      if (channel === 'email') {
        setEmailEnabled(enabled)
      } else {
        setPushEnabled(enabled)
      }
      // TODO: Implement channel update in backend
      setSuccess('Notification channels updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError('Failed to update notification channels')
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-900/10 border-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Notification Channels */}
      <Card className="bg-black/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#B87D3B]">Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-neutral-400">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={emailEnabled}
                onCheckedChange={(checked) => handleToggleChannel('email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-neutral-400">
                  Receive notifications on your device
                </p>
              </div>
              <Switch
                checked={pushEnabled}
                onCheckedChange={(checked) => handleToggleChannel('push', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-black/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#B87D3B]">Notification Preferences</CardTitle>
          <CardDescription>Customize what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {preferences.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{pref.type}</Label>
                  <p className="text-sm text-neutral-400">
                    {pref.description}
                  </p>
                </div>
                <Switch
                  checked={pref.enabled}
                  onCheckedChange={() => handleTogglePreference(pref.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Frequency */}
      <Card className="bg-black/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#B87D3B]">Email Frequency</CardTitle>
          <CardDescription>Set how often you want to receive email notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
              >
                Real-time
              </Button>
              <Button
                variant="outline"
                className="bg-[#B87D3B] text-white hover:bg-[#96652F]"
              >
                Daily Digest
              </Button>
              <Button
                variant="outline"
                className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
              >
                Weekly Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 