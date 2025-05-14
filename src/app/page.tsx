import AppHeader from '@/components/layout/app-header';
import PriceDisplay from '@/components/flwff/price-display';
import WhitelistForm from '@/components/flwff/whitelist-form';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <section id="price" className="w-full max-w-2xl mb-12 md:mb-20 text-center">
          <h2 className="text-2xl md:text-3xl font-mono uppercase text-secondary mb-4 tracking-wider">
            Preço Atual da $FLWFF
          </h2>
          <PriceDisplay tokenGeckoId="flow" tokenSymbol="FLWFF" />
          <p className="text-xs text-muted-foreground mt-2">
            (Simulando preço da $FLWFF com o preço da $FLOW da CoinGecko)
          </p>
        </section>

        <Separator className="my-8 md:my-12 w-1/2 max-w-md bg-border" />

        <section id="whitelist" className="w-full max-w-md">
          <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl border border-primary/50">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3 text-center font-mono uppercase tracking-tight">
              Entre no Vazio
            </h2>
            <p className="text-muted-foreground mb-6 text-center text-sm md:text-base">
              Comprometa sua carteira. Garanta sua passagem. A correnteza $FLWFF aguarda.
            </p>
            <WhitelistForm />
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-muted-foreground text-xs border-t border-border">
        <p>&copy; {new Date().getFullYear()} Coletivo FLWFF. Todos os ritos reservados.</p>
        <p>Abrace o caos. Confie no fluxo.</p>
      </footer>
    </div>
  );
}
