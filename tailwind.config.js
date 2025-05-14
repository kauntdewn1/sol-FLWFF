
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// We will need to create these components based on the descriptions
// import PriceDisplay from '@/components/flwff/price-display'; 
// import WhitelistForm from '@/components/flwff/whitelist-form';
// import StakingSection from '@/components/flwff/staking-section'; 

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white/85 font-sans">
      {/* 1. Header */}
      <header className="w-full p-4 md:px-8 flex justify-between items-center border-b border-white/10 font-mono">
        <div className="flex items-center space-x-4">
          {/* Logo */}
 {
 /*
 Note: Adjust width and height as needed to maintain aspect ratio
 and fit within the header layout.
 */
 }
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747194303/logo_horizontal_zxbhl5.png"
              alt="FLWFF Horizontal Logo"
              width={100} // Adjust width as needed
              height={20} // Adjust height as needed to maintain aspect ratio
            />
          </Link>
          {/* Placeholder for minimal menu with anchor links */}
 {/* We will add the menu later with actual links */}
        </div>
        <div className="flex items-center space-x-4">
           <Button className="rounded-full bg-gradient-to-r from-[#FF007A] to-[#000000] text-white border-none hover:opacity-90 transition-opacity duration-300 text-xs md:text-sm px-6 py-3">
            ACESSAR SEU PAINEL
           {/*
            Note: For a true pixelated/glitchy button effect or more complex styling,
            you might need a dedicated CSS class or a separate component
            instead of relying solely on Tailwind classes for the gradient and shape.
            The current implementation uses Tailwind's gradient utility.
           */}
          </Button>
        </div>
      </header>

      {/* Add this style to your global CSS or a style block if using styled-components/CSS modules */}
      {/* For Tailwind, you might need to define a custom gradient class or use inline styles if not reusable */}
      {/* Example inline style (for demonstration, consider adding to global CSS or utility class) */}
      <style jsx global>{`
        .gradient-button {
          background: linear-gradient(to right, #FF007A, #000000);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px; /* Full rounded */
          font-weight: bold;
          transition: opacity 0.3s ease;
        }
        .gradient-button:hover {
          opacity: 0.9;
        }
      `}</style>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center space-y-16">

        {/* 1.1 Hero Section */}
        <section className="w-full flex justify-center items-center mb-12 md:mb-16">
 <section className="w-full flex justify-center items-center mb-12 md:mb-16 relative">
 {/* Brilho Rosa - Fundo animado */}
 <img
 src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195356/LOGO_Sfundo2_av7gff.png"
 alt="FLWFF Glow"
 className="absolute w-60 h-60 md:w-80 md:h-80 animate-pulseGlow z-0"
 />
 {/* Logo Principal - Em cima */}
 <img
 src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747195425/LOGO_Sfundo1_yn3irt.png"
 alt="FLWFF Logo"
 className="relative w-40 h-40 md:w-60 md:h-60 z-10"
 />
 </section>
        </section>

        {/* 2. PriceDisplay */}
        <section id="price" className="w-full max-w-2xl mb-12 md:mb-16 text-center">
          {/* This component will be built separately to have the terminal look and feel */}
          <div className="bg-black border-2 border-pink-500 text-green-400 font-mono p-6 rounded-lg shadow-lg glitch-effect">
            <div className="text-left mb-4">
              <div>FLWFF | Valor Atual: $0.4761</div>
              {/* Placeholder for typing effect */}
              <div>{`<<< Atualizado em tempo real >>>`}</div>
            </div>
            <div className="text-sm italic text-gray-400 text-center">
              “Transparência em cada bloco. O valor da sua confiança, ancorado na tecnologia.”
            </div>
          </div>
          {/* Add a comment here reminding to implement the glitch and typing effects */}
          {/* TODO: Implement terminal appearance, glitch effect, and typing animation in PriceDisplay component */}
        </section>

        {/* 3. WhitelistForm */}
        <section id="whitelist" className="w-full max-w-md mb-12 md:mb-16">
          <div className="p-6 md:p-8 rounded-lg shadow-xl border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
              PARTICIPE DO ECOSSISTEMA FLWFF
            </h2>
            <p className="text-white/70 mb-6 text-center text-sm md:text-base">
              Cadastre-se para acesso prioritário às funcionalidades.
            </p>
            {/* Placeholder for Whitelist Form component */}
            <div className="bg-[#1a1a1a] p-4 rounded-md border border-white/20">
              {/* TODO: Implement input with inverted shadow and chain icon */}
              <input type="email" placeholder="Seu melhor e-mail" className="w-full p-2 bg-transparent border-b border-white/50 focus:outline-none focus:border-white text-white/85 placeholder-white/50" />
              <Button className="w-full mt-6 bg-[#00ffe0] text-[#0e0e0e] font-bold hover:bg-[#00ccb3]">
                ENTRAR NA WHITELIST
              </Button>
            </div>
            <p className="text-white/60 mt-4 text-center text-xs">
              Você receberá notificações sobre os próximos passos diretamente em seu e-mail.
            </p>
          </div>
        </section>

        {/* 4. StakingSection */}
        <section id="staking" className="w-full max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Trave seus FLWFF e amplie seu impacto no ecossistema.
          </h2>
          <p className="text-white/70 mb-8 text-center text-sm md:text-base">
            Quanto mais tempo você contribui, maior sua participação nos retornos e decisões.
          </p>
          {/* Placeholder for Staking Section component with status cards */}
          {/* TODO: Implement StakingSection component with the four status cards and their visual styles and tooltips */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholders for status cards */}
            <div className="p-6 bg-[#1a1a1a] rounded-lg border border-white/10 text-center">Status Card 1 (Disponível)</div>
            <div className="p-6 bg-[#1a1a1a] rounded-lg border border-white/10 text-center opacity-40 grayscale">Status Card 2 (Encerrado)</div>
            <div className="p-6 bg-[#1a1a1a] rounded-lg border border-white/10 text-center opacity-50">Status Card 3 (Em Resgate)</div>
            <div className="p-6 bg-[#1a1a1a] rounded-lg border border-white/10 text-center opacity-40">Status Card 4 (Finalizado)</div>
          </div>
        </section>

      </main>

      {/* 5. Rodapé */}
      <footer className="py-8 px-4 mt-16 text-center text-white/85 text-sm border-t border-white/10 font-serif">
        <div className="max-w-3xl mx-auto">
          <p className="mb-4">
            FLWFF é mais que uma stablecoin. É uma fundação para a nova economia digital — descentralizada, transparente e controlada por código.
          </p>
          <p className="mb-4">
            Todos os dados são verificados on-chain. Sem intermediários. Apenas blockchain, confiança e propósito.
          </p>
          <p className="mb-4">
            Criado por <Link href="https://www.instagram.com/mello.flw/" className="text-[#00ffe0] font-semibold hover:underline">Netto Mello</Link>, estrategista pioneiro em marketing na blockchain, com o poder da <Link href="https://flowoff.xyz/" className="text-[#00ffe0] font-semibold hover:underline">FlowOFF</Link> — agência especializada em experiências digitais na era da descentralização.
          </p>
          <div className="flex justify-center space-x-6 mt-6 text-xs text-white/70">
            {/* TODO: Add actual links to these pages */}
            <Link href="#" className="hover:underline">Política de Privacidade</Link>
            <Link href="#" className="hover:underline">Termos de Uso</Link>
            <Link href="#" className="hover:underline">Declaração de Riscos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
