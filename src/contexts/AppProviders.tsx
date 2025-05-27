"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { CourseProvider } from './CourseContext';
import { TooltipProvider } from "@/components/ui/tooltip"; // For ShadCN tooltips
import { Toaster } from "@/components/ui/toaster"; // For ShadCN toasts

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <CourseProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </CourseProvider>
    </AuthProvider>
  );
}
