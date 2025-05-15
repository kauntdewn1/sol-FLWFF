'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 md:py-32 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            {/* Logo */}
            <div className="relative w-60 h-60 md:w-80 md:h-80 mx-auto mb-8">
              <Image
                src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195356/LOGO_Sfundo2_av7gff.png"
                alt="FLWFF Glow"
                fill
                className="absolute z-0 opacity-40 animate-pulse"
                priority
              />
              <Image
                src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195425/LOGO_Sfundo1_yn3irt.png"
                alt="FLWFF Logo"
                fill
                className="relative z-10 object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
        {/* Frase centralizada acima das logos */}
        <span className="text-base md:text-lg tracking-widest mb-8 uppercase font-mono text-center block" style={{ color: '#FF1C8E' }}>
          O $FLWFF é uma stablecoin utilitária, criada para movimentar o ecossistema de marketing digital baseado em Web3.
        </span>
        {/* Linha de logos inspirada na Solana */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="w-full flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full max-w-5xl mx-auto opacity-80">
            <Image
              src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747278580/assets_ce0c7323a97a4d91bd0baa7490ec9139_f5a7df85e0f44af9b95eb92290694bfc_dg6ugc.png"
              alt="Logo 1"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <Image
              src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747278580/assets_ce0c7323a97a4d91bd0baa7490ec9139_6a83a1dd16874f22b668f9d18deefb85_iaxdbi.png"
              alt="Logo 2"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <Image
              src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747278790/logo_flowoff_lrcv04.png"
              alt="Logo 3"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
