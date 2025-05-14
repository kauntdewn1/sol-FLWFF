
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
import { useToast } from '@/hooks/use-toast';
import { submitWhitelistAction } from '@/lib/actions/whitelist-actions';
import { useState, useTransition, useEffect } from 'react';
import { Loader2, CheckCircle, AlertTriangle, ExternalLink, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AuthModal from '../auth/auth-modal';

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
  const { toast } = useToast();
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
    } else {
      // Clear wallet address if user logs out or changes auth method
      // form.setValue('walletAddress', ''); 
    }
  }, [user, form]);

  function onSubmit(values: WhitelistFormValues) {
    if (!user?.walletAddress && values.walletAddress === '') {
        toast({
            title: "Carteira Necessária",
            description: "Por favor, conecte sua carteira ou insira um endereço manualmente.",
            variant: "destructive",
        });
        return;
    }

    const submissionValues = {
        ...values,
        walletAddress: user?.walletAddress || values.walletAddress,
    };

    setSubmissionResult(null);
    startTransition(async () => {
      try {
        const result = await submitWhitelistAction(submissionValues);
        if (result.success && result.ipfsHash) {
          toast({
            title: (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                <span className="font-bold">Pacto Selado!</span>
              </div>
            ),
            description: `Sua entrada está imortalizada. Hash IPFS: ${result.ipfsHash.substring(0,12)}...`,
            variant: 'default',
            className: 'bg-card border-secondary text-foreground',
          });
          setSubmissionResult({ 
            ipfsHash: result.ipfsHash,
            gatewayUrl: `https://ipfs.io/ipfs/${result.ipfsHash}`
          });
          form.reset({ email: '', walletAddress: user?.walletAddress || '' });
        } else {
          throw new Error(result.error || 'Ocorreu um erro desconhecido.');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Falha no envio. Por favor, tente novamente.';
        toast({
          title: (
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              <span className="font-bold">Erro</span>
            </div>
          ),
          description: errorMessage,
          variant: 'destructive',
        });
      }
    });
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-6 bg-input rounded-md shadow-inner h-48">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || (user.authMethod !== 'web3auth_wallet' && !user.walletAddress)) {
     return (
      <div className="text-center p-6 bg-input rounded-md shadow-inner">
        <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Conecte sua Carteira</h3>
        <p className="text-muted-foreground mb-4">
          Para entrar na whitelist, por favor conecte sua carteira Web3 ou faça login.
        </p>
        <AuthModal triggerButton={<Button className="bg-primary hover:bg-primary/80">Conectar / Entrar</Button>} />
        <p className="text-xs text-muted-foreground mt-4">Se preferir, pode preencher o endereço manualmente após o login por e-mail.</p>
      </div>
    );
  }


  if (submissionResult) {
    return (
      <div className="text-center p-6 bg-input rounded-md shadow-inner">
        <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Envio Registrado</h3>
        <p className="text-muted-foreground mb-1 text-sm">Seus dados foram processados.</p>
        <p className="text-muted-foreground mb-4 text-sm">
          Hash IPFS: <span className="text-secondary font-mono break-all">{submissionResult.ipfsHash}</span>
        </p>
        <Button
          variant="outline"
          className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          onClick={() => window.open(submissionResult.gatewayUrl, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Ver no Gateway IPFS
        </Button>
         <Button variant="link" className="text-primary mt-4" onClick={() => setSubmissionResult(null)}>
          Enviar Outro
        </Button>
      </div>
    );
  }

  const isWalletConnected = !!(user?.authMethod === 'web3auth_wallet' && user.walletAddress);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider">Endereço da Carteira (ETH/SOL)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Conecte sua carteira ou insira 0x... ou Sol..."
                  {...field}
                  className="bg-input border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground/50 h-12 text-base"
                  aria-describedby="wallet-address-help"
                  readOnly={isWalletConnected}
                  disabled={isWalletConnected}
                />
              </FormControl>
              <p id="wallet-address-help" className="text-xs text-muted-foreground/70 pt-1">
                {isWalletConnected ? "Carteira conectada." : "Sua chave pública para o novo mundo."}
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
                  className="bg-input border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground/50 h-12 text-base"
                  aria-describedby="email-help"
                />
              </FormControl>
              <p id="email-help" className="text-xs text-muted-foreground/70 pt-1">Apenas para transmissões vitais.</p>
              <FormMessage className="text-destructive/80" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-3 h-14 text-lg uppercase tracking-wider"
          disabled={isPending || authLoading || (!form.formState.isValid && !isWalletConnected) || (!isWalletConnected && !form.getValues("walletAddress"))}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            'Selar o Pacto'
          )}
        </Button>
      </form>
    </Form>
  );
}
