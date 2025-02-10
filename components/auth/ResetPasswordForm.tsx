"use client";

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await authService.resetPassword(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-lg p-8 rounded-lg border border-neutral-800">
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-900">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <div className="text-center">
          <Alert className="mb-6 bg-green-900/50 border-green-900">
            <AlertDescription>
              Check your email for a link to reset your password.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="mt-4 w-full border-neutral-800 hover:bg-neutral-900"
          >
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-neutral-900 border-neutral-800 focus:border-[#B87D3B] focus:ring-[#B87D3B]"
              placeholder="Enter your email"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
            disabled={isLoading}
          >
            {isLoading ? 'Sending reset link...' : 'Send reset link'}
          </Button>

          <p className="text-center text-sm text-neutral-400">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-[#B87D3B] hover:text-[#96652F]">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
} 