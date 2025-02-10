"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FcGoogle } from 'react-icons/fc';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setSuccess('Account created successfully! Please verify your email before logging in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setShowVerificationMessage(false);
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        if (!result.user.emailVerified && result.user.providerData[0].providerId === 'password') {
          // User needs to verify email
          setShowVerificationMessage(true);
          await authService.resendVerificationEmail(email);
          await authService.logout(); // Sign out until verified
        } else {
          // User is verified or using social login
          const redirectTo = searchParams.get('from') || '/';
          router.push(redirectTo);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await authService.googleSignIn();
      if (result.error) {
        setError(result.error);
      } else {
        const redirectTo = searchParams.get('from') || '/';
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      await authService.resendVerificationEmail(email);
      setSuccess('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email. Please try again.');
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
      
      {success && (
        <Alert className="mb-6 bg-green-900/10 border-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {showVerificationMessage && (
        <Alert className="mb-6 bg-yellow-900/10 border-yellow-900">
          <AlertDescription>
            Please verify your email address before logging in. 
            Check your inbox for the verification link.
            <Button
              variant="link"
              onClick={resendVerificationEmail}
              disabled={isLoading}
              className="text-[#B87D3B] hover:text-[#96652F] p-0 ml-2"
            >
              Resend verification email
            </Button>
          </AlertDescription>
        </Alert>
      )}

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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/reset-password"
              className="text-sm text-[#B87D3B] hover:text-[#96652F]"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-neutral-900 border-neutral-800 focus:border-[#B87D3B] focus:ring-[#B87D3B]"
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-neutral-400">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full border-neutral-800 hover:bg-neutral-900"
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>

        <p className="text-center text-sm text-neutral-400">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-[#B87D3B] hover:text-[#96652F]">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
} 