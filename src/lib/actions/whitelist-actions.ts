'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, ensureFirebaseInitialized } from '@/lib/firebase';
import { storeJson } from '@/lib/web3storage';

const formSchema = z.object({
  // walletAddress is now expected to be provided by the auth context, not directly from form
  email: z.string().email({ message: 'Por favor, insira um endereço de email válido.' }),
  walletAddress: z.string().min(26, { // Keep for validation if passed, but prioritize auth context
    message: 'O endereço da carteira parece muito curto.',
  }).max(44, {
    message: 'O endereço da carteira parece muito longo.'
  }).regex(/^[a-zA-Z0-9]+$/, {
    message: 'O endereço da carteira contém caracteres inválidos.'
  }),
});

interface WhitelistSubmissionResult {
  success: boolean;
  ipfsHash?: string;
  error?: string;
}

// The walletAddress parameter will be passed from the component after retrieving from AuthContext
export async function submitWhitelistAction(
  values: z.infer<typeof formSchema>
): Promise<WhitelistSubmissionResult> {
  try {
    // The calling component should ensure walletAddress is from an authenticated source (Web3Auth)
    // and pass it in `values`.
    const validatedData = formSchema.parse(values);
    
    ensureFirebaseInitialized(); 

    const docRef = await addDoc(collection(db, 'whitelist'), { // Updated collection name
      walletAddress: validatedData.walletAddress,
      email: validatedData.email,
      timestamp: serverTimestamp(), // Updated field name
    });

    const ipfsData = { 
      walletAddress: validatedData.walletAddress,
      email: validatedData.email,
      firestoreDocId: docRef.id,
      submissionTimestamp: new Date().toISOString(),
    };
    
    const ipfsHash = await storeJson(ipfsData, `whitelist-${docRef.id}.json`);

    return { success: true, ipfsHash };
  } catch (error) {
    console.error('Whitelist submission error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Dados fornecidos inválidos. Verifique os campos e tente novamente.' };
    }
    let errorMessage = 'Ocorreu um erro inesperado durante o envio.';
    if (error instanceof Error) {
        errorMessage = error.message.includes('NEXT_PUBLIC_WEB3_STORAGE_TOKEN') 
          ? 'Erro de configuração do armazenamento IPFS. Contate o suporte.'
          : error.message;
    }
    return { success: false, error: errorMessage };
  }
}
