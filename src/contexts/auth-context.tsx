'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, type SafeEventEmitterProvider } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from 'ethers';
import { 
  initializeFirebase, 
  isFirebaseInitialized, 
  ensureFirebaseInitialized 
} from '@/lib/firebase';
import type { User as FirebaseUser, Auth as FirebaseAuthInstanceType } from 'firebase/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

// Define the user type for our context
export interface AppUser {
  id: string; // Firebase UID or Wallet Address
  email?: string | null;
  walletAddress?: string | null;
  authMethod: 'firebase_email' | 'web3auth_wallet';
  provider?: SafeEventEmitterProvider | null; // Web3Auth provider
  firebaseUser?: FirebaseUser | null; // Firebase user object
  isWhitelisted: boolean;
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
  console.warn('[AuthContext] WARN: NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is not set. Web3Auth will not function properly.');
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [web3authInstance, setWeb3authInstance] = useState<Web3Auth | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAuthInstance, setFirebaseAuthInstance] = useState<FirebaseAuthInstanceType | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Helper function to set Web3 user and conditionally define window.ethereum
  const setWeb3User = async (provider: SafeEventEmitterProvider) => {
    try {
      console.log('[AuthContext] INFO: setWeb3User called with provider.');
      if (typeof window !== 'undefined' && !window.ethereum) {
        console.log('[AuthContext] INFO: window.ethereum is not defined. Attempting to set it with Web3Auth provider.');
        try {
          Object.defineProperty(window, 'ethereum', {
            value: provider,
            writable: true, // Make it writable in case other libs expect to modify it slightly, or for dev tools.
            configurable: true // Important to allow re-definition if necessary, or for cleanup.
          });
          console.log('[AuthContext] SUCCESS: Web3Auth provider successfully set as window.ethereum.');
        } catch (e) {
          console.warn('[AuthContext] WARN: Could not define window.ethereum with Web3Auth provider. It might already be defined by an extension in a non-configurable way or another error occurred.', e);
        }
      } else if (typeof window !== 'undefined' && window.ethereum !== provider) {
        console.warn('[AuthContext] WARN: window.ethereum is already defined but is not the Web3Auth provider. Using the direct Web3Auth provider for this session.');
      }


      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethers.getSigner(ethersProvider);
      const address = await signer.getAddress();
      console.log('[AuthContext] INFO: Signer address obtained:', address);
      const userInfo = await web3authInstance?.getUserInfo();
      console.log('[AuthContext] INFO: Web3Auth userInfo:', userInfo);

      setUser({
        id: address,
        walletAddress: address,
        email: userInfo?.email || null,
        authMethod: 'web3auth_wallet',
        provider: provider,
        isWhitelisted: false
      });
      console.log('[AuthContext] SUCCESS: Web3 user set in context. Address:', address);
    } catch (error) {
      console.error('[AuthContext] ERROR: Failed to set Web3 user:', error);
      // Potentially clear user or set error state if needed
    }
  };


  useEffect(() => {
    console.log('[AuthContext] INFO: AuthProvider useEffect for Firebase init triggered. FirebaseReady:', firebaseReady);
    const initFirebase = async () => {
      console.log('[AuthContext] INFO: initFirebase called.');
      try {
        const { auth: authInstance } = initializeFirebase();
        setFirebaseAuthInstance(authInstance);
        setFirebaseReady(true);
        console.log('[AuthContext] SUCCESS: Firebase initialized successfully.');
      } catch (error) {
        console.error('[AuthContext] ERROR: Failed to initialize Firebase:', error);
        setFirebaseReady(false);
      }
    };

    initFirebase();
  }, []);


  useEffect(() => {
    console.log('[AuthContext] INFO: AuthProvider useEffect for Web3Auth and Firebase listener triggered. Firebase Auth Instance available:', !!firebaseAuthInstance, 'Firebase Ready:', firebaseReady);
    const initAuth = async () => {
      console.log('[AuthContext] INFO: initAuth called.');
      if (!clientId) {
        console.warn('[AuthContext] WARN: Web3Auth Client ID is missing, skipping Web3Auth initialization.');
        // setLoading(false) will be handled by Firebase auth listener or after all inits
        // If Firebase is also not ready, we might hang in loading state.
        if (!firebaseAuthInstance) setLoading(false);
        return;
      }
      console.log('[AuthContext] INFO: Initializing Web3Auth...');
      try {
        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: "0x1",
            rpcTarget: "https://api.mainnet-beta.solana.com",
          },
          authMode: "DAPP",
          appName: "FLWFF Collective",
          privateKeyProvider: new OpenloginAdapter({
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
          }),
        });

        await web3auth.initModal();
        setWeb3authInstance(web3auth);
        console.log('[AuthContext] SUCCESS: Web3Auth modal initialized.');

        if (web3auth.provider) {
          console.log('[AuthContext] INFO: Web3Auth provider found on initModal, attempting to set user.');
          await setWeb3User(web3auth.provider);
        } else {
          console.log('[AuthContext] INFO: No active Web3Auth provider after initModal.');
        }
      } catch (error) {
        console.error('[AuthContext] CRITICAL: Web3Auth initialization error:', error);
      } finally {
        // Defer setLoading(false) to Firebase auth listener to ensure all auth states are checked
      }
    };

    initAuth();

    let unsubscribeFirebase: (() => void) | null = null;
    if (firebaseAuthInstance) {
      console.log('[AuthContext] INFO: Setting up Firebase Auth state listener.');
      unsubscribeFirebase = onAuthStateChanged(firebaseAuthInstance, (fbUser) => {
        console.log('[AuthContext] EVENT: Firebase Auth state changed. Firebase User UID:', fbUser ? fbUser.uid : 'null');
        if (fbUser) {
          // Only set Firebase user if no Web3Auth user is already set (Web3Auth takes precedence)
          if (!user || user.authMethod !== 'web3auth_wallet') {
             console.log('[AuthContext] INFO: Firebase user detected, and no active Web3Auth session. Setting user from Firebase. UID:', fbUser.uid);
             setUser({
              id: fbUser.uid,
              email: fbUser.email,
              authMethod: 'firebase_email',
              firebaseUser: fbUser,
              isWhitelisted: false
            });
          } else {
            console.log('[AuthContext] INFO: Firebase user detected, but Web3Auth user session is active. Prioritizing Web3Auth user. Wallet:', user.walletAddress);
          }
        } else if (user?.authMethod !== 'web3auth_wallet') { 
          console.log('[AuthContext] INFO: No Firebase user and not a Web3Auth wallet session. Setting user to null.');
          setUser(null);
        }
        console.log('[AuthContext] INFO: Finished processing Firebase Auth state change. Setting loading to false.');
        setLoading(false);
      }, (error) => {
        console.error('[AuthContext] ERROR: Firebase Auth state listener error:', error);
        setLoading(false);
      });
    } else {
      console.warn("[AuthContext] WARN: Firebase Auth instance not ready when trying to set up listener. Email/password auth and persisted sessions might be affected.");
      // If Web3Auth hasn't set loading to false yet (e.g. due to error or no provider), do it here.
      if (loading && !web3authInstance?.provider) {
         console.log('[AuthContext] INFO: Firebase Auth not ready, Web3Auth provider not active. Setting loading to false.');
         setLoading(false);
      }
    }

    return () => {
      if (unsubscribeFirebase) {
        console.log('[AuthContext] INFO: Unsubscribing Firebase Auth state listener.');
        unsubscribeFirebase();
      }
      // Potentially clean up Web3Auth instance if necessary, though it's usually managed by its own lifecycle
    };
  }, [firebaseAuthInstance, firebaseReady]); // Rerun when firebaseAuthInstance or firebaseReady status changes.


  const loginWithWeb3 = async () => {
    if (!web3authInstance) {
      console.error('[AuthContext] CRITICAL: Web3Auth not initialized. Cannot login with Web3.');
      return;
    }
    console.log('[AuthContext] INFO: Attempting Web3 login...');
    try {
      setLoading(true);
      const web3authProvider = await web3authInstance.connect();
      if (web3authProvider) {
        console.log('[AuthContext] SUCCESS: Web3Auth connected, provider obtained.');
        await setWeb3User(web3authProvider);
        // If Firebase was active, sign out to avoid conflicts
        if (firebaseAuthInstance?.currentUser) {
          console.log('[AuthContext] INFO: Firebase user detected during Web3 login, signing out from Firebase to prioritize Web3 session.');
          await firebaseSignOut(firebaseAuthInstance);
        }
      } else {
         console.warn('[AuthContext] WARN: Web3Auth connect did not return a provider.');
      }
    } catch (error) {
      console.error('[AuthContext] ERROR: Web3Auth login error:', error);
      setUser(null); // Clear user on error
    } finally {
      console.log('[AuthContext] INFO: Web3 login attempt finished. Setting loading to false.');
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuthInstance) {
      console.error("[AuthContext] CRITICAL: Firebase Auth not ready for email login.");
      throw new Error("Serviço de autenticação indisponível. Tente novamente mais tarde.");
    }
    console.log('[AuthContext] INFO: Attempting Firebase email login for:', email);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthInstance, email, pass);
      console.log('[AuthContext] SUCCESS: Firebase email login successful for UID:', userCredential.user.uid);
      // Auth state listener will update user. If Web3Auth was active, log it out.
      if (web3authInstance?.provider) {
        console.log('[AuthContext] INFO: Web3Auth provider active during email login, logging out from Web3Auth to prioritize Firebase session.');
        await web3authInstance.logout();
        // setUser(null) will be handled by Web3Auth logout or Firebase auth state change
      }
      // User state will be set by onAuthStateChanged
      setLoading(false);
      return userCredential.user;
    } catch (error: any) {
      console.error("[AuthContext] ERROR: Firebase email login error:", error, "Code:", error.code, "Message:", error.message);
      setLoading(false);
      throw error; // Re-throw to be caught by form handler
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
     if (!firebaseAuthInstance) {
      console.error("[AuthContext] CRITICAL: Firebase Auth not ready for email signup.");
      throw new Error("Serviço de cadastro indisponível. Tente novamente mais tarde.");
    }
    console.log('[AuthContext] INFO: Attempting Firebase email signup for:', email);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthInstance, email, pass);
      console.log('[AuthContext] SUCCESS: Firebase email signup successful for UID:', userCredential.user.uid);
      // Auth state listener will update user. If Web3Auth was active, log it out.
      if (web3authInstance?.provider) {
        console.log('[AuthContext] INFO: Web3Auth provider active during email signup, logging out from Web3Auth to prioritize Firebase session.');
        await web3authInstance.logout();
         // setUser(null) will be handled by Web3Auth logout or Firebase auth state change
      }
      // User state will be set by onAuthStateChanged
      setLoading(false);
      return userCredential.user;
    } catch (error: any) {
      console.error("[AuthContext] ERROR: Firebase email signup error:", error, "Code:", error.code, "Message:", error.message);
      setLoading(false);
      throw error; // Re-throw to be caught by form handler
    }
  };

  const logout = async () => {
    console.log('[AuthContext] INFO: Attempting logout. Current user auth method:', user?.authMethod);
    setLoading(true);
    try {
      if (user?.authMethod === 'web3auth_wallet' && web3authInstance?.status === "connected") {
        console.log('[AuthContext] INFO: Logging out from Web3Auth.');
        await web3authInstance.logout();
      }
      if ((user?.authMethod === 'firebase_email' || firebaseAuthInstance?.currentUser) && firebaseAuthInstance) {
         console.log('[AuthContext] INFO: Logging out from Firebase.');
         await firebaseSignOut(firebaseAuthInstance);
      }
      // setUser(null) will be handled by onAuthStateChanged for Firebase, or implicitly by Web3Auth logout.
      // For immediate UI update, explicitly set to null:
      setUser(null); 
      console.log('[AuthContext] SUCCESS: Logout process completed. User set to null.');
    } catch(error){
        console.error('[AuthContext] ERROR: Error during logout:', error);
    } finally {
        setLoading(false);
        console.log('[AuthContext] INFO: Logout actions finished. Loading set to false.');
    }
  };

  const handleWeb3AuthLogin = async () => {
    try {
      console.log('[AuthContext] INFO: Iniciando login Web3Auth');
      if (!web3authInstance) {
        console.error('[AuthContext] ERROR: Web3Auth não está inicializado');
        return;
      }

      const provider = await web3authInstance.connect();
      if (!provider) {
        console.error('[AuthContext] ERROR: Provedor não disponível após conexão');
        return;
      }

      const userInfo = await web3authInstance.getUserInfo();
      const accounts = await provider.request({ method: "eth_accounts" });
      const address = accounts[0];

      if (!address) {
        console.error('[AuthContext] ERROR: Endereço da carteira não encontrado');
        return;
      }

      console.log('[AuthContext] SUCCESS: Login Web3Auth bem-sucedido');
      setUser({
        id: userInfo.email || address,
        email: userInfo.email || '',
        walletAddress: address,
        authMethod: 'web3auth_wallet',
        isWhitelisted: false
      });
    } catch (error) {
      console.error('[AuthContext] ERROR: Falha no login Web3Auth:', error);
      toast.error('Falha ao conectar carteira. Tente novamente.');
    }
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
    throw new Error('useAuth must be used within an AuthProvider. This is a critical application setup error.');
  }
  return context;
};

