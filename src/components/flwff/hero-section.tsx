'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="w-full min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)] flex flex-col justify-center items-center text-center p-4 md:p-8 relative overflow-hidden background-grid">
      {/* Overlay com gradiente sutil para escurecer as bordas e focar no centro */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/70 opacity-50 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Principal - Em cima */}
        <div className="relative w-60 h-60 md:w-80 md:h-80 mb-6 md:mb-8">
          <Image
            src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195356/LOGO_Sfundo2_av7gff.png"
            alt="FLWFF Glow"
            fill
            className="absolute z-0 opacity-40 animate-pulseGlow"
            data-ai-hint="abstract glow"
            priority
          />
          <Image
            src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195425/LOGO_Sfundo1_yn3irt.png"
            alt="FLWFF Logo"
            fill
            className="relative z-10 object-contain"
            data-ai-hint="abstract logo"
            priority
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary font-mono uppercase tracking-tighter animate-fadeInUp">
          FLWFF Collective
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
          Entre no Abismo. Acompanhe $FLWFF. Junte-se ao Círculo Interno.
          A stablecoin para a nova economia digital — descentralizada, transparente e controlada por código.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-600">
          <Link href="/#whitelist">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105">
              Entre na Whitelist
            </Button>
          </Link>
          <Link href="/#staking">
            <Button variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-secondary/20 transition-all duration-300 hover:scale-105">
              Faça Staking $FLWFF
            </Button>
          </Link>
        </div>
      </div>

      {/* Elemento decorativo adicional - opcional */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/50 to-transparent z-0"></div>

      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0; /* Start hidden before animation */
        }
      `}</style>
    </section>
  );
}
