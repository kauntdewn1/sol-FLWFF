import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Verifica se todas as variáveis de ambiente necessárias estão definidas
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variáveis de ambiente do Firebase faltando:', missingEnvVars);
  throw new Error('Configuração do Firebase incompleta. Verifique as variáveis de ambiente.');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Variáveis globais
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Função para verificar se o Firebase está inicializado
export const isFirebaseInitialized = () => {
  return !!app;
};

// Função para inicializar o Firebase
export const initializeFirebase = () => {
  try {
    console.log('[Firebase] Iniciando inicialização...');
    
    if (!app) {
      console.log('[Firebase] Criando nova instância...');
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      console.log('[Firebase] App inicializado com sucesso');
      
      auth = getAuth(app);
      console.log('[Firebase] Auth inicializado com sucesso');
      
      db = getFirestore(app);
      console.log('[Firebase] Firestore inicializado com sucesso');
      
      storage = getStorage(app);
      console.log('[Firebase] Storage inicializado com sucesso');
    } else {
      console.log('[Firebase] Usando instância existente');
    }

    return { app, auth, db, storage };
  } catch (error) {
    console.error('[Firebase] Erro na inicialização:', error);
    throw error;
  }
};

// Função para garantir que o Firebase está inicializado
export const ensureFirebaseInitialized = () => {
  try {
    if (!isFirebaseInitialized()) {
      console.log('[Firebase] Firebase não inicializado, iniciando...');
      return initializeFirebase();
    }
    console.log('[Firebase] Firebase já inicializado');
    return { app, auth, db, storage };
  } catch (error) {
    console.error('[Firebase] Erro ao garantir inicialização:', error);
    throw error;
  }
};

// Configurações do Firestore
export const PRICE_COLLECTION = 'prices';
export const USER_COLLECTION = 'users';
export const WHITELIST_COLLECTION = 'whitelist';
export const STAKING_COLLECTION = 'staking';

// Exportações
export { app, auth, db, storage }; 