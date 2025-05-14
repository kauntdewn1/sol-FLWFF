'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, ensureFirebaseInitialized } from '@/lib/firebase'; // db might be undefined on server if not handled carefully

const formSchema = z.object({
  walletAddress: z.string().min(1),
  email: z.string().email(),
});

interface WhitelistSubmissionResult {
  success: boolean;
  ipfsHash?: string;
  error?: string;
}

export async function submitWhitelistAction(
  values: z.infer<typeof formSchema>
): Promise<WhitelistSubmissionResult> {
  try {
    const validatedData = formSchema.parse(values);
    
    // Ensure Firebase is initialized before trying to use 'db'
    // This is a workaround for simple client SDK usage in server actions.
    // For production, Firebase Admin SDK in a separate backend/API route is more robust for writes.
    ensureFirebaseInitialized(); 

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'whitelistEntries'), {
      walletAddress: validatedData.walletAddress,
      email: validatedData.email,
      submittedAt: serverTimestamp(),
    });

    // Mock IPFS export
    // In a real scenario, you'd use an IPFS client or pinning service API here.
    // For example, using Pinata, Infura IPFS, or running your own IPFS node.
    const dataToPin = JSON.stringify({ 
      walletAddress: validatedData.walletAddress,
      email: validatedData.email,
      firestoreDocId: docRef.id,
      timestamp: new Date().toISOString(),
    });
    // This is a fake hash generation
    const mockIpfsHash = 'Qm' + Array(44).fill(0).map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
    
    // Simulate a delay for IPFS upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, ipfsHash: mockIpfsHash };
  } catch (error) {
    console.error('Whitelist submission error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Dados fornecidos inválidos.' };
    }
    // Check for specific Firebase errors if needed
    // e.g., if (error.code === 'permission-denied') { ... }
    return { success: false, error: error instanceof Error ? error.message : 'Ocorreu um erro inesperado durante o envio.' };
  }
}
