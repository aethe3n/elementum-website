"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';

export default function UserProfileButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="rounded-full border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B] hover:text-white"
        onClick={() => router.push('/auth/login')}
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full hover:bg-[#B87D3B]/10"
        >
          <User className="h-5 w-5 text-[#B87D3B]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-lg border-neutral-800">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="rounded-full bg-[#B87D3B]/10 p-1">
            <User className="h-8 w-8 text-[#B87D3B]" />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">{user.email}</p>
            <p className="text-xs text-neutral-400">Account</p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem className="focus:bg-[#B87D3B]/10 focus:text-white cursor-pointer">
          <Link href="/profile" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4 text-[#B87D3B]" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-[#B87D3B]/10 focus:text-white cursor-pointer">
          <Link href="/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4 text-[#B87D3B]" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          className="focus:bg-[#B87D3B]/10 focus:text-white cursor-pointer"
          disabled={isLoading}
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4 text-[#B87D3B]" />
          <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 