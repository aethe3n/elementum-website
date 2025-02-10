"use client"

import { useState } from 'react'
import { User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authService } from '@/lib/services/authService'
import { LogOut, Mail, Lock, X } from 'lucide-react'

interface ProfileSettingsProps {
  user: User
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      router.push('/auth/login')
    } catch (error) {
      setError('Failed to log out. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement email change logic with Firebase
      setSuccess('Email updated successfully')
      setShowEmailForm(false)
      setNewEmail('')
      setCurrentPassword('')
    } catch (error) {
      setError('Failed to update email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement password change logic with Firebase
      setSuccess('Password updated successfully')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setError('Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
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

      {/* Account Actions */}
      <Card className="bg-black/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#B87D3B]">Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Change Form */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Email Address</h3>
                <p className="text-sm text-neutral-400">{user.email}</p>
              </div>
              <Button
                variant="outline"
                className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
                onClick={() => setShowEmailForm(!showEmailForm)}
              >
                {showEmailForm ? <X className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {showEmailForm ? 'Cancel' : 'Change'}
              </Button>
            </div>

            {showEmailForm && (
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newEmail">New Email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Email'}
                </Button>
              </form>
            )}
          </div>

          <div className="border-t border-neutral-800" />

          {/* Password Change Form */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Password</h3>
                <p className="text-sm text-neutral-400">Change your password</p>
              </div>
              <Button
                variant="outline"
                className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? <X className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {showPasswordForm ? 'Cancel' : 'Change'}
              </Button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPasswordForPw">Current Password</Label>
                  <Input
                    id="currentPasswordForPw"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}
          </div>

          <div className="border-t border-neutral-800" />

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full border-red-800 text-red-500 hover:bg-red-950/20"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? 'Logging out...' : 'Log Out'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 