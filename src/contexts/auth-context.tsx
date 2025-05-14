
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, type SafeEventEmitterProvider } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from 'ethers';
import { ensureFirebaseInitialized, isFirebaseInitialized as getIsFirebaseInitialized } from '@/lib/firebase'; // Firebase Auth instance
import type { User as FirebaseUser, Auth as FirebaseAuthInstanceType } from 'firebase/auth';
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
  firebaseReady: boolean;
  loginWithWeb3: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signupWithEmail: (email: string, pass: string) => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';
if (!clientId) {
  console.warn('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is not set. Web3Auth will not function properly.');
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [web3authInstance, setWeb3authInstance] = useState<Web3Auth | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAuthInstance, setFirebaseAuthInstance] = useState<FirebaseAuthInstanceType | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const initFirebase = () => {
      try {
        if (getIsFirebaseInitialized) { // Use the boolean variable directly
          const { auth: authInstance } = ensureFirebaseInitialized();
          setFirebaseAuthInstance(authInstance);
          setFirebaseReady(true);
        } else {
          // This case implies module-level init failed, and ensureFirebaseInitialized would throw if called
          // For client-side, we might want to wait or retry, but for now, mark as not ready.
          console.warn("Firebase not initialized at AuthProvider mount. Email/password auth might be unavailable.");
          setFirebaseReady(false);
        }
      } catch (error) {
        console.error("AuthContext: Failed to ensure Firebase initialization:", error);
        setFirebaseReady(false);
      }
    };
    initFirebase();
  }, []);


  useEffect(() => {
    const initWeb3Auth = async () => {
      if (!clientId) {
        // setLoading(false); // Combined with Firebase auth listener
        return;
      }
      try {
        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: 'sapphire_mainnet',
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x1', 
            rpcTarget: 'https://rpc.ankr.com/eth',
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
            uxMode: 'popup',
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
      } finally {
        // Defer setLoading(false) to be handled by Firebase auth listener or after all inits
      }
    };

    initWeb3Auth();

    // Firebase Auth state listener
    let unsubscribe: (() => void) | null = null;
    if (firebaseAuthInstance) {
      unsubscribe = onAuthStateChanged(firebaseAuthInstance, (fbUser) => {
        if (fbUser) {
          if (!web3authInstance?.provider) { // Prioritize Web3 if active
             setUser({
              id: fbUser.uid,
              email: fbUser.email,
              authMethod: 'firebase_email',
              firebaseUser: fbUser,
            });
          }
        } else if (user?.authMethod !== 'web3auth_wallet') { 
          setUser(null);
        }
        setLoading(false); // Firebase auth state is now determined
      });
    } else {
      // If Firebase Auth instance is not ready, we might not be able to listen to auth changes.
      // For now, assume no Firebase user if instance isn't ready.
      if(user?.authMethod !== 'web3auth_wallet') setUser(null);
      setLoading(false); // Still need to stop loading
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseAuthInstance, firebaseReady]); // Rerun when firebaseAuthInstance becomes available.

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
        // If Firebase was active, sign out to avoid conflicts
        if (firebaseAuthInstance?.currentUser) await firebaseSignOut(firebaseAuthInstance);
      }
    } catch (error) {
      console.error('Web3Auth login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth not ready for email login.");
      throw new Error("Serviço de autenticação indisponível.");
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthInstance, email, pass);
      // Auth state listener will update user. If Web3Auth was active, log it out.
      if (web3authInstance?.provider) await web3authInstance.logout();
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      console.error("Firebase email login error:", error);
      setLoading(false);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
     if (!firebaseAuthInstance) {
      console.error("Firebase Auth not ready for email signup.");
      throw new Error("Serviço de autenticação indisponível.");
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthInstance, email, pass);
      // Auth state listener will update user. If Web3Auth was active, log it out.
      if (web3authInstance?.provider) await web3authInstance.logout();
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
    if ((user?.authMethod === 'firebase_email' || firebaseAuthInstance?.currentUser) && firebaseAuthInstance) {
       await firebaseSignOut(firebaseAuthInstance);
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, web3auth: web3authInstance, firebaseReady, loginWithWeb3, loginWithEmail, signupWithEmail, logout }}>
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
