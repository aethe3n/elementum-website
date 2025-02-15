"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { usePathname, useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// List of paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/blog',
  '/about-us',
  '/services',
  '/latest-insights'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      
      if (user) {
        try {
          // Get the ID token
          const idToken = await user.getIdToken();
          console.log('Got ID token');
          // Set the session cookie
          document.cookie = `__session=${idToken}; path=/; max-age=3600; secure; samesite=strict`;
          setUser(user);
          
          // If user is on a login page and is already authenticated, redirect to home
          if (pathname?.includes('/auth/')) {
            router.push('/');
          }
        } catch (error) {
          console.error('Error getting ID token:', error);
        }
      } else {
        // Clear the session cookie
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        
        // If user is on a protected path, redirect to login
        if (pathname && !PUBLIC_PATHS.includes(pathname)) {
          router.push(`/auth/login?from=${pathname}`);
        }
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, [pathname, router]);

  // Prevent flash of protected content
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2 mb-4"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 