"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FcGoogle } from 'react-icons/fc';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    acceptTerms: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push('at least 8 characters');
    if (!hasUpperCase) errors.push('an uppercase letter');
    if (!hasLowerCase) errors.push('a lowercase letter');
    if (!hasNumbers) errors.push('a number');
    if (!hasSpecialChar) errors.push('a special character');

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain ${passwordErrors.join(', ')}.`);
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(formData.email, formData.password);
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          displayName: '',
          acceptTerms: false
        });
        // Redirect after a delay
        setTimeout(() => {
          router.push('/auth/login?registered=true');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google. Please try again.');
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            required
            className="bg-neutral-900 border-neutral-800 focus:border-[#B87D3B] focus:ring-[#B87D3B]"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="bg-neutral-900 border-neutral-800 focus:border-[#B87D3B] focus:ring-[#B87D3B]"
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="bg-neutral-900 border-neutral-800 focus:border-[#B87D3B] focus:ring-[#B87D3B]"
            placeholder="Create a password"
          />
          <p className="text-xs text-neutral-400">
            Password must be at least 8 characters long and contain uppercase, lowercase, 
            number, and special character.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className="bg-neutral-900 border-neutral-800 focus:border-[#B87D3B] focus:ring-[#B87D3B]"
            placeholder="Confirm your password"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, acceptTerms: checked as boolean })
            }
          />
          <label
            htmlFor="terms"
            className="text-sm text-neutral-400"
          >
            I agree to the{' '}
            <Link href="/terms" className="text-[#B87D3B] hover:text-[#96652F]">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#B87D3B] hover:text-[#96652F]">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#B87D3B] hover:bg-[#96652F]"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
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
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#B87D3B] hover:text-[#96652F]">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
} 