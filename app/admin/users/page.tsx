"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserData {
  uid: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  creationTime: string;
  lastSignInTime: string;
  provider: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin check
  const ADMIN_EMAILS = useMemo(() => [
    'jono@elementum.com',
    // ... other admin emails
  ], []); // Empty dependency array since this is constant

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?from=/admin/users');
      return;
    }

    if (user && !ADMIN_EMAILS.includes(user.email || '')) {
      router.push('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(usersQuery);
        const userData: UserData[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          userData.push({
            uid: doc.id,
            email: data.email,
            displayName: data.displayName,
            emailVerified: data.emailVerified,
            creationTime: data.createdAt,
            lastSignInTime: data.lastSignIn,
            provider: data.provider || 'email/password'
          });
        });

        setUsers(userData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loading, user, router, ADMIN_EMAILS]);

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2 mb-4"></div>
          <p className="text-neutral-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/50 border border-red-900 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-light mb-8">User Management</h1>
        
        <div className="bg-black/50 backdrop-blur-lg rounded-lg border border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Sign In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.displayName || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={user.emailVerified ? "success" : "warning"}>
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.provider}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.creationTime).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.lastSignInTime).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 