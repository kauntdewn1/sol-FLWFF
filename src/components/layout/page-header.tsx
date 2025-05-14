
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/auth/auth-modal';

export default function PageHeader() {
  return (
    <header className="w-full p-4 md:px-8 flex justify-between items-center border-b border-border font-mono">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747194303/logo_horizontal_zxbhl5.png"
            alt="FLWFF Horizontal Logo"
            width={100}
            height={20}
            // priority // Removido para teste
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <AuthModal
          triggerButton={
            <Button className="rounded-full bg-gradient-to-r from-primary to-background text-primary-foreground border-none hover:opacity-90 transition-opacity duration-300 text-xs md:text-sm px-6 py-3">
              ACESSAR SEU PAINEL
            </Button>
          }
        />
      </div>
    </header>
  );
}
