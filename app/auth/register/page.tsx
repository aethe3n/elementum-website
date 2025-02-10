import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up - Elementum Global',
  description: 'Create your Elementum Global account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light tracking-tight text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Join Elementum Global to access our services
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
} 