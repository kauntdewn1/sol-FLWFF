
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { submitStakingAction, StakingFormSchema, type StakingFormValues } from '@/lib/actions/staking-actions';
import { useAuth } from '@/contexts/auth-context';
import { useState, useTransition, useEffect } from 'react';
import { Loader2, CheckCircle, AlertTriangle, BarChartBig } from 'lucide-react';

// Define APRs for simulation - these would typically come from a config or API
const APR_RATES: Record<number, number> = {
  3: 0.05, // 5% APR for 3 months
  6: 0.08, // 8% APR for 6 months
  12: 0.12, // 12% APR for 12 months
};
const DURATION_OPTIONS = [
  { label: '3 Meses', value: 3 },
  { label: '6 Meses', value: 6 },
  { label: '12 Meses', value: 12 },
];

export default function StakingForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth(); // Assuming walletAddress comes from auth context
  const [estimatedReturn, setEstimatedReturn] = useState<number | null>(null);
  const [apr, setApr] = useState<number | null>(null);

  const form = useForm<StakingFormValues>({
    resolver: zodResolver(StakingFormSchema),
    defaultValues: {
      walletAddress: user?.walletAddress || '',
      amount: 0,
      durationMonths: DURATION_OPTIONS[0].value,
    },
  });

  useEffect(() => {
    if (user?.walletAddress) {
      form.setValue('walletAddress', user.walletAddress);
    }
  }, [user, form]);
  
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'amount' || name === 'durationMonths') {
        const amount = Number(values.amount) || 0;
        const duration = Number(values.durationMonths) || 0;
        if (amount > 0 && duration > 0 && APR_RATES[duration]) {
          const currentApr = APR_RATES[duration];
          setApr(currentApr * 100); // Display APR as percentage
          // Simple interest calculation for simulation: P * R * T
          // R is annual rate, T is time in years.
          const interest = amount * currentApr * (duration / 12);
          setEstimatedReturn(interest);
        } else {
          setEstimatedReturn(null);
          setApr(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  function onSubmit(values: StakingFormValues) {
    if (!user?.walletAddress) {
      toast({ title: "Carteira não conectada", description: "Conecte sua carteira para fazer stake.", variant: "destructive" });
      return;
    }
    
    // Ensure walletAddress from auth context is used
    const dataToSubmit = { ...values, walletAddress: user.walletAddress };

    startTransition(async () => {
      try {
        const result = await submitStakingAction(dataToSubmit);
        if (result.success && result.stakeId) {
          toast({
            title: <div className="flex items-center"><CheckCircle className="h-5 w-5 text-secondary mr-2" />Stake Realizado!</div>,
            description: `Seu stake de ${values.amount} FLWFF foi registrado com sucesso. ID: ${result.stakeId.substring(0,8)}...`,
            variant: 'default',
            className: 'bg-card border-secondary text-foreground',
          });
          form.reset({ amount: 0, durationMonths: DURATION_OPTIONS[0].value, walletAddress: user.walletAddress || ''});
          setEstimatedReturn(null);
          setApr(null);
          // TODO: Could trigger a refetch of user's stakes list if displayed elsewhere
        } else {
          throw new Error(result.error || 'Falha ao registrar o stake.');
        }
      } catch (error) {
        toast({
          title: <div className="flex items-center"><AlertTriangle className="h-5 w-5 text-destructive mr-2" />Erro no Stake</div>,
          description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
          variant: 'destructive',
        });
      }
    });
  }

  if (!user?.walletAddress) {
    return (
        <div className="text-center p-4 bg-input rounded-md shadow-inner">
            <p className="text-muted-foreground">Conecte sua carteira para participar do staking.</p>
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider">Montante $FLWFF</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  className="bg-input border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground/50 h-12 text-base"
                />
              </FormControl>
              <FormMessage className="text-destructive/80" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider">Duração do Stake</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary text-foreground h-12 text-base">
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover border-primary/50 text-popover-foreground">
                  {DURATION_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={String(opt.value)} className="hover:bg-primary/20 focus:bg-primary/30">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-destructive/80" />
            </FormItem>
          )}
        />
        
        {apr !== null && (
            <FormDescription className="text-secondary font-mono text-sm">
                Taxa Anual de Retorno (APR) Estimada: {apr.toFixed(2)}%
            </FormDescription>
        )}
        {estimatedReturn !== null && (
          <div className="p-4 bg-input rounded-md mt-2">
            <p className="text-sm text-muted-foreground">Retorno Estimado ao Final do Período:</p>
            <p className="text-lg font-mono text-secondary">
              {estimatedReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} FLWFF
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3 h-14 text-lg uppercase tracking-wider"
          disabled={isPending || !form.formState.isValid || form.getValues("amount") <= 0}
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processando Stake...</>
          ) : (
            <><BarChartBig className="mr-2 h-5 w-5" />Fazer Stake $FLWFF</>
          )}
        </Button>
      </form>
    </Form>
  );
}
