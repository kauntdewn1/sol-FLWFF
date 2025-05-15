'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useTransition, useEffect } from 'react';
import { Loader2, CheckCircle, AlertTriangle, ExternalLink, Wallet, Link2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AuthModal from '../auth/auth-modal';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const formSchema = z.object({
  walletAddress: z.string().min(26, {
    message: 'O endereço da carteira parece muito curto.',
  }).max(44, {
    message: 'O endereço da carteira parece muito longo.'
  }).regex(/^[a-zA-Z0-9]+$/, {
    message: 'O endereço da carteira contém caracteres inválidos.'
  }),
  email: z.string().email({
    message: 'Por favor, insira um endereço de email válido.',
  }),
});

type WhitelistFormValues = z.infer<typeof formSchema>;

export default function WhitelistForm() {
  const [isPending, startTransition] = useTransition();
  const [submissionResult, setSubmissionResult] = useState<{ ipfsHash: string; gatewayUrl: string } | null>(null);
  const { user, loading: authLoading } = useAuth();

  const form = useForm<WhitelistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: '',
      email: '',
    },
  });

  useEffect(() => {
    if (user?.authMethod === 'web3auth_wallet' && user.walletAddress) {
      form.setValue('walletAddress', user.walletAddress, { shouldValidate: true });
    }
  }, [user, form]);

  async function onSubmit(values: WhitelistFormValues) {
    if (!user?.walletAddress && values.walletAddress === '') {
      toast.error('Por favor, conecte sua carteira ou insira um endereço manualmente.');
      return;
    }

    const submissionValues = {
      ...values,
      walletAddress: user?.walletAddress || values.walletAddress,
    };

    setSubmissionResult(null);
    startTransition(async () => {
      try {
        if (!db) throw new Error('Firebase não está inicializado');

        const whitelistRef = collection(db, 'whitelist');
        const docRef = await addDoc(whitelistRef, {
          email: submissionValues.email,
          walletAddress: submissionValues.walletAddress,
          timestamp: serverTimestamp(),
          status: 'pending'
        });

        toast.success('💥 Você agora é parte do caos. Bem-vindo à Whitelist.');
        form.reset({ email: '', walletAddress: user?.walletAddress || '' });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Falha no envio. Por favor, tente novamente.';
        toast.error(`❌ ${errorMessage}`);
      }
    });
  }

  if (authLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center p-6 bg-input/50 backdrop-blur-sm rounded-lg shadow-xl border border-secondary/20 h-48"
      >
        <Loader2 className="h-8 w-8 text-secondary animate-spin" />
      </motion.div>
    );
  }

  if (!user || (user.authMethod !== 'web3auth_wallet' && !user.walletAddress)) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-input/50 backdrop-blur-sm rounded-lg shadow-xl border border-secondary/20"
      >
        <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 text-center font-mono uppercase tracking-wide flex items-center justify-center">
          <Sparkles className="mr-3 h-8 w-8 text-secondary" /> PARTICIPAR DO ECOSSISTEMA $FLWFF
        </h2>
        <p className="text-muted-foreground mb-6 text-center text-sm md:text-base">
        Cadastre-se para acesso prioritário às funcionalidades.
        </p>
        <div className="relative">
          <Wallet className="h-16 w-16 text-secondary mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-secondary/20 animate-ping" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Conecte sua Carteira</h3>
        <p className="text-muted-foreground mb-6">
          Para entrar na whitelist, conecte sua carteira Web3 ou entre via email.
        </p>
        <AuthModal triggerButton={
          <Button 
            variant="gradient" 
            className="font-mono text-lg px-8 py-6 h-auto hover:scale-105 transition-transform"
          >
            Conectar / Entrar
          </Button>
        } />
        <p className="text-xs text-muted-foreground mt-6">Ou insira manualmente seu melhor e-mail.</p>
      </motion.div>
    );
  }

  const isWalletConnected = !!(user?.authMethod === 'web3auth_wallet' && user.walletAddress);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 text-center font-mono uppercase tracking-wide flex items-center justify-center">
          <Sparkles className="mr-3 h-8 w-8 text-secondary" /> VOCÊ VAI FAZER PARTE DO ECOSSISTEMA FLWFF
        </h2>
        <p className="text-muted-foreground mb-6 text-center text-sm md:text-base">
          Acesse primeiro. Pegue antes. Morda a oportunidade.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-input/50 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-secondary/20">
          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider">Endereço da Carteira (ETH/SOL)</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="0x... ou Sol..."
                      {...field}
                      className="pl-10 bg-background/50 shadow-inner border-border focus:border-secondary focus:ring-secondary text-foreground placeholder:text-muted-foreground/50 h-12 text-base transition-all group-hover:border-secondary/50"
                      aria-describedby="wallet-address-help"
                      readOnly={isWalletConnected}
                      disabled={isWalletConnected}
                    />
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-secondary transition-colors h-5 w-5" />
                  </div>
                </FormControl>
                <p id="wallet-address-help" className="text-xs text-muted-foreground/70 pt-1">
                  {isWalletConnected ? "Carteira conectada." : "Insira tua chave pra entrar no fluxo."}
                </p>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider">Endereço de Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu.sinal@dominio.com"
                    {...field}
                    className="bg-background/50 shadow-inner border-border focus:border-secondary focus:ring-secondary text-foreground placeholder:text-muted-foreground/50 h-12 text-base transition-all hover:border-secondary/50"
                    aria-describedby="email-help"
                  />
                </FormControl>
                <p id="email-help" className="text-xs text-muted-foreground/70 pt-1">Usado pra selar teu pacto. Sem spam, só ritual.</p>
                <FormMessage className="text-destructive/80" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="gradient"
            className="w-full font-mono uppercase tracking-wider py-6 h-auto text-lg hover:scale-105 transition-transform"
            disabled={isPending || authLoading || (!form.formState.isValid && !isWalletConnected) || (!isWalletConnected && !form.getValues("walletAddress"))}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              'ENTRAR NA WHITELIST'
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Tu vai ser avisado dos próximos rituais direto na tua alma digital (e-mail).
          </p>
        </form>
      </Form>
    </motion.div>
  );
}
