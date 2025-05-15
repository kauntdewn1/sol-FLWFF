import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from '@/components/firebase-provider';
import { AuthProvider } from '@/contexts/auth-context'; // Import AuthProvider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'FLWFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}>
        <FirebaseProvider>
          <AuthProvider> {/* Wrap with AuthProvider */}
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
