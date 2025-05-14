'use client';

import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="w-full flex justify-center items-center mb-12 md:mb-16">
      <div className="relative flex justify-center items-center w-full h-60 md:h-80">
        {/* Brilho Rosa - Fundo animado */}
        <Image
          src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195356/LOGO_Sfundo2_av7gff.png"
          alt="FLWFF Glow"
          width={320} 
          height={320}
          className="absolute animate-pulseGlow z-0 opacity-70"
          data-ai-hint="abstract glow"
          priority
        />
        {/* Logo Principal - Em cima */}
        <Image
          src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195425/LOGO_Sfundo1_yn3irt.png"
          alt="FLWFF Logo"
          width={240}
          height={240}
          className="relative z-10"
          data-ai-hint="abstract logo"
          priority
        />
      </div>
    </section>
  );
}
