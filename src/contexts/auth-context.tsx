
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, type SafeEventEmitterProvider } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from 'ethers';
import { auth as firebaseAuth } from '@/lib/firebase'; // Firebase Auth instance
import type { User as FirebaseUser } from 'firebase/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

// Define the user type for our context
export interface AppUser {
  id: string; // Firebase UID or Wallet Address
  email?: string | null;
  walletAddress?: string | null;
  authMethod: 'firebase_email' | 'web3auth_wallet';
  provider?: SafeEventEmitterProvider | null; // Web3Auth provider
  firebaseUser?: FirebaseUser | null; // Firebase user object
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  web3auth: Web3Auth | null;
  loginWithWeb3: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signupWithEmail: (email: string, pass: string) => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';
if (!clientId) {
  console.warn('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is not set. Web3Auth will not function.');
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [web3authInstance, setWeb3authInstance] = useState<Web3Auth | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initWeb3Auth = async () => {
      if (!clientId) {
        setLoading(false);
        return;
      }
      try {
        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: 'sapphire_mainnet', // or "sapphire_devnet" or "testnet"
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x1', // Ethereum Mainnet, adjust as needed for Solana or other chains
            rpcTarget: 'https://rpc.ankr.com/eth', // Example RPC
            displayName: 'Ethereum Mainnet',
            blockExplorer: 'https://etherscan.io',
            ticker: 'ETH',
            tickerName: 'Ethereum',
          },
          uiConfig: {
            theme: "dark",
            loginMethodsOrder: ["google", "facebook", "twitter", "discord", "email_passwordless"],
            defaultLanguage: "pt-BR",
            modalZIndex: "99999",
          }
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: 'popup', // Can be 'popup' or 'redirect'
             whiteLabel: {
              name: "FLWFF Collective",
              logoLight: "https://res.cloudinary.com/dgyocpguk/image/upload/v1747181760/2_zucoyt.png",
              logoDark: "https://res.cloudinary.com/dgyocpguk/image/upload/v1747181760/2_zucoyt.png",
              defaultLanguage: "pt-BR",
              dark: true, 
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        
        await web3auth.initModal();
        setWeb3authInstance(web3auth);

        if (web3auth.provider) {
          const ethersProvider = new ethers.BrowserProvider(web3auth.provider);
          const signer = await ethersProvider.getSigner();
          const address = await signer.getAddress();
          setUser({
            id: address,
            walletAddress: address,
            authMethod: 'web3auth_wallet',
            provider: web3auth.provider,
          });
        }
      } catch (error) {
        console.error('Web3Auth initialization error:', error);
      }
    };

    initWeb3Auth();

    // Firebase Auth state listener
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        // If Web3Auth is not primary and Firebase user exists, set Firebase user
        // This prevents overwriting Web3Auth session if both exist (e.g. page reload)
        if (!web3authInstance?.provider) {
           setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            authMethod: 'firebase_email',
            firebaseUser: firebaseUser,
          });
        }
      } else if (user?.authMethod !== 'web3auth_wallet') { 
        // Only clear user if not a web3auth session
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ensure web3authInstance is not in deps to avoid re-init loops

  const loginWithWeb3 = async () => {
    if (!web3authInstance) {
      console.error('Web3Auth not initialized');
      return;
    }
    try {
      setLoading(true);
      const web3authProvider = await web3authInstance.connect();
      if (web3authProvider) {
        const ethersProvider = new ethers.BrowserProvider(web3authProvider);
        const signer = await ethersProvider.getSigner();
        const address = await signer.getAddress();
        setUser({
          id: address,
          walletAddress: address,
          authMethod: 'web3auth_wallet',
          provider: web3authProvider,
        });
      }
    } catch (error) {
      console.error('Web3Auth login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
      // Auth state listener will update user
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      console.error("Firebase email login error:", error);
      setLoading(false);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      // Auth state listener will update user
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      console.error("Firebase email signup error:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    if (user?.authMethod === 'web3auth_wallet' && web3authInstance?.provider) {
      await web3authInstance.logout();
    }
    if (user?.authMethod === 'firebase_email' || firebaseAuth.currentUser) {
       await firebaseSignOut(firebaseAuth);
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, web3auth: web3authInstance, loginWithWeb3, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
