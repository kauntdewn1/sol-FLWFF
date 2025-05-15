'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '../ui/button';
import AuthModal from '../auth/auth-modal';
import { Loader2 } from 'lucide-react';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-secondary/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold text-secondary font-mono">$FLWFF</span>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <Loader2 className="h-5 w-5 text-secondary animate-spin" />
          ) : user?.walletAddress ? (
            <Button variant="gradient" className="font-mono">
              ACESSAR PAINEL
            </Button>
          ) : (
            <AuthModal 
              triggerButton={
                <Button variant="gradient" className="font-mono">
                  ACESSAR PAINEL
                </Button>
              } 
            />
          )}
        </div>
      </div>
    </header>
  );
} 