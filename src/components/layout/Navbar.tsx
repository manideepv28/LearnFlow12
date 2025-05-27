"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { BookOpen, UserCircle, LogIn, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { currentUser, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-xl">LearnFlow</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          <Link href="/courses" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
            Courses
          </Link>
          {currentUser && (
            <Link href="/dashboard" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : currentUser ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} aria-label="Profile">
                <UserCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-5 w-5 mr-2 sm:mr-0" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                <LogIn className="h-5 w-5 mr-2" /> Login
              </Button>
              <Button onClick={() => router.push('/auth/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
