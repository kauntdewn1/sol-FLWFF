'use client';

import React from 'react';
import AppHeader from '@/components/layout/app-header'; // Directly import AppHeader
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/use-mounted'; // Import the new hook

const HeaderLoadingSkeleton = () => (
  <header className="py-4 md:py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-md">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <div className="flex items-center space-x-3 rtl:space-x-reverse group">
        <Skeleton className="h-[60px] w-[60px] rounded-full" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-10 w-32" /> {/* Placeholder for AuthModal or User Dropdown */}
    </div>
  </header>
);

export default function DynamicAppHeader() {
  const isMounted = useMounted();

  if (!isMounted) {
    return <HeaderLoadingSkeleton />;
  }

  return <AppHeader />;
}
