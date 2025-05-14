
'use client';

import StakingForm from './staking-form';
import MyStakesList from './my-stakes-list';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, ShieldCheck } from 'lucide-react';
import AuthModal from '../auth/auth-modal';
import { Button } from '../ui/button';

export default function StakingSection() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <section id="staking" className="w-full max-w-2xl mt-12 md:mt-20">
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl border border-secondary/50">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3 text-center font-mono uppercase tracking-tight flex items-center justify-center">
            <ShieldCheck className="mr-3 h-8 w-8" /> Staking $FLWFF
          </h2>
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-12 w-12 text-secondary animate-spin" />
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="staking" className="w-full max-w-2xl mt-12 md:mt-20">
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl border border-secondary/50">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3 text-center font-mono uppercase tracking-tight flex items-center justify-center">
          <ShieldCheck className="mr-3 h-8 w-8" /> Staking $FLWFF
        </h2>
        <p className="text-muted-foreground mb-6 text-center text-sm md:text-base">
          Fortaleça o Coletivo. Multiplique seus $FLWFF. O Abismo recompensa a lealdade.
        </p>
        
        {!user || !user.walletAddress ? (
          <div className="text-center p-6 bg-input rounded-md shadow-inner">
             <p className="text-muted-foreground mb-4">
              Conecte sua carteira para iniciar o staking e visualizar seus depósitos.
            </p>
            <AuthModal triggerButton={<Button className="bg-secondary hover:bg-secondary/80 text-black">Conectar Carteira</Button>} />
          </div>
        ) : (
          <StakingForm />
        )}
      </div>

      {user && user.walletAddress && <MyStakesList />}
    </section>
  );
}
