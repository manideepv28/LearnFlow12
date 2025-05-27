"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, UserData } from '@/types';
import { getUserData, setUserData as saveUserData, clearUserData as clearLocalUserData } from '@/lib/localStorageUtils';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>; // Simplified login
  signup: (name: string, email: string, pass: string) => Promise<boolean>; // Simplified signup
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const data = getUserData();
    if (data.user) {
      setCurrentUser(data.user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock login: In a real app, this would call an API.
    // For now, we'll check against a mock user or allow any for simplicity if not found.
    // This is highly insecure and for demo purposes only.
    const data = getUserData();
    // For demo, let's assume a user exists if they try to log in with a known email or any for testing.
    // A proper system would verify passwords.
    
    // Let's assume if a user tries to log in, and we don't have their specific account,
    // we just create a dummy one. This is not realistic but helps test flows.
    // Or, more simply, a fixed dummy user for testing.
    const mockUser: User = { id: 'user_123', email: email, name: 'Demo User' };

    // Let's simplify: store this user as logged in.
    const newUserData: UserData = {
      ...data, // preserve existing enrollments/progress if any under this key
      user: mockUser,
    };
    saveUserData(newUserData);
    setCurrentUser(mockUser);
    setIsLoading(false);
    return true;
  }, []);

  const signup = useCallback(async (name: string, email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock signup
    const newUser: User = { id: `user_${Date.now()}`, email, name };
    const data = getUserData(); // This is problematic if multiple users try to use same localStorage
    // For a single-user local demo, this is okay.
    const newUserData: UserData = {
      user: newUser,
      enrolledCourses: [],
      courseProgress: {},
    };
    saveUserData(newUserData);
    setCurrentUser(newUser);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearLocalUserData();
    setCurrentUser(null);
    router.push('/auth/login');
  }, [router]);

  const updateProfile = useCallback(async (name: string, email: string): Promise<boolean> => {
    if (!currentUser) return false;
    setIsLoading(true);
    const updatedUser = { ...currentUser, name, email };
    const data = getUserData();
    saveUserData({ ...data, user: updatedUser });
    setCurrentUser(updatedUser);
    setIsLoading(false);
    return true;
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
