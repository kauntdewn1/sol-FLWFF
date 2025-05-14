
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import AuthModal from '@/components/auth/auth-modal';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppHeader() {
  const { user, logout, loading } = useAuth();

  const truncateAddress = (address: string | null | undefined) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="py-4 md:py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
          <Image
            src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747181760/2_zucoyt.png"
            alt="Logo FLWFF"
            width={60}
            height={60}
            className="rounded-full group-hover:opacity-80 transition-opacity duration-300"
            priority
            data-ai-hint="abstract logo"
          />
          <span className="self-center text-2xl md:text-3xl font-mono font-semibold whitespace-nowrap text-primary group-hover:text-accent transition-colors duration-300">
            FLWFF
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          {loading ? (
            <Button variant="ghost" className="text-muted-foreground" disabled>Carregando...</Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary hover:text-accent px-3 py-2 h-auto">
                  {user.authMethod === 'web3auth_wallet' && user.walletAddress ? (
                    <>
                      <Wallet className="mr-2 h-5 w-5" />
                      {truncateAddress(user.walletAddress)}
                    </>
                  ) : (
                    <>
                      <UserCircle className="mr-2 h-5 w-5" />
                      {user.email || 'Usuário'}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-primary/30 text-foreground">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.authMethod === 'web3auth_wallet' ? 'Carteira Conectada' : 'Conta Firebase'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground break-all">
                      {user.authMethod === 'web3auth_wallet' ? user.walletAddress : user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border"/>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive hover:!bg-destructive/20 hover:!text-destructive focus:!bg-destructive/20 focus:!text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>
    </header>
  );
}
