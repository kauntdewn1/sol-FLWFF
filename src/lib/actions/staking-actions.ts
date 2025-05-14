
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, ensureFirebaseInitialized } from '@/lib/firebase';

export const StakingFormSchema = z.object({
  walletAddress: z.string().min(26, { message: 'Endereço da carteira inválido.' }),
  amount: z.number().positive({ message: 'O montante deve ser positivo.' }),
  durationMonths: z.coerce.number().min(1, { message: 'A duração deve ser de pelo menos 1 mês.' }),
});

export type StakingFormValues = z.infer<typeof StakingFormSchema>;

interface StakingSubmissionResult {
  success: boolean;
  stakeId?: string;
  error?: string;
}

export async function submitStakingAction(
  values: StakingFormValues
): Promise<StakingSubmissionResult> {
  try {
    const validatedData = StakingFormSchema.parse(values);
    
    ensureFirebaseInitialized();

    const docRef = await addDoc(collection(db, 'staking'), {
      walletAddress: validatedData.walletAddress,
      amount: validatedData.amount,
      durationMonths: validatedData.durationMonths,
      startDate: serverTimestamp(),
      status: 'active', // Initial status
    });

    return { success: true, stakeId: docRef.id };
  } catch (error) {
    console.error('Staking submission error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Dados de staking inválidos. Verifique as informações.' };
    }
    return { success: false, error: error instanceof Error ? error.message : 'Ocorreu um erro inesperado ao processar o stake.' };
  }
}
