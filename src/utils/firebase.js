import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '../lib/dataconnect';

/* global process */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA6w9fW23z6Se4-efGESIDb8vIfjkVRU-c',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'checkbong-fb3dc.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'checkbong-fb3dc',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'checkbong-fb3dc.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '458180956921',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:458180956921:web:4ab6f294ec133111c14828'
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const dataConnect = getDataConnect(app, connectorConfig);

// Uncomment the next line if you want to test with the local emulator
// connectDataConnectEmulator(dataConnect, 'localhost', 9399);
