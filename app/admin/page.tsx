'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Admin check
  const ADMIN_EMAILS = useMemo(() => [
    'jono@elementum.com',
    // ... other admin emails
  ], []); // Empty dependency array since this is constant

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?from=/admin');
      return;
    }

    if (user && !ADMIN_EMAILS.includes(user.email || '')) {
      router.push('/');
      return;
    }
  }, [loading, user, router, ADMIN_EMAILS]);

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-light text-white mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/analytics">
          <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white hover:border-[#B87D3B] transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl font-light">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400">
                View subscription metrics, revenue analytics, and user engagement data
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white hover:border-[#B87D3B] transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl font-light">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400">
                Manage users, view user details, and handle user permissions
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 