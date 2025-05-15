import DynamicAppHeader from '@/components/layout/dynamic-app-header'; // Changed: Restored DynamicAppHeader
import HeroSection from '@/components/flwff/hero-section';
import PageFooter from '@/components/layout/page-footer';
import PriceDisplay from '@/components/flwff/price-display';
import DynamicStakingSection from '@/components/flwff/dynamic-staking-section';
import DynamicWhitelistForm from '@/components/flwff/dynamic-whitelist-form';
import { Separator } from '@/components/ui/separator';
import { Coins, ShieldCheck, ListPlus } from 'lucide-react';

const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '';
const tokenId = process.env.NEXT_PUBLIC_NFT_TOKEN_ID || '';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <DynamicAppHeader /> {/* Changed: Using DynamicAppHeader */}

      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center space-y-12 md:space-y-20">

        <HeroSection />

        <Separator className="my-8 md:my-12 w-3/4 max-w-2xl bg-border/50" />

        <section id="price" className="w-full max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 text-center font-mono uppercase tracking-tight flex items-center justify-center">
            <Coins className="mr-3 h-8 w-8" /> Cotação $FLWFF
          </h2>
          <PriceDisplay nftData={{ contractAddress, tokenId }} />
          <p className="text-xs text-muted-foreground mt-3 italic">
            (Cotação do $FLWFF baseada na EtherScan API)
          </p>
        </section>

        <Separator className="my-8 md:my-12 w-3/4 max-w-2xl bg-border/50" />

        <section id="whitelist" className="w-full max-w-md">
          <div className="p-6 md:p-8 rounded-lg shadow-xl border border-primary/50 bg-card">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center font-mono uppercase tracking-tight flex items-center justify-center">
              <ListPlus className="mr-3 h-8 w-8" /> Entre na Whitelist
            </h2>
            <p className="text-muted-foreground mb-6 text-center text-sm md:text-base">
              Garanta seu acesso antecipado e benefícios exclusivos no ecossistema FLWFF.
            </p>
            <DynamicWhitelistForm />
          </div>
        </section>
        
        <Separator className="my-8 md:my-12 w-3/4 max-w-2xl bg-border/50" />

        <DynamicStakingSection />

      </main>

      <PageFooter />
    </div>
  );
}
