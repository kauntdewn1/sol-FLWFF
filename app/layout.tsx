import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppHeader from '@/components/layout/app-header';
import AuthProviderWrapper from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '$FLWFF',
  description: '$FLWFF - Solana Foundation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProviderWrapper>
          <AppHeader />
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
} 