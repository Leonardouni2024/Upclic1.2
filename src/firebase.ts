import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp({
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
});

// Since the database might not be the default database, we have to initialize firestore properly.
// Wait, Firestore client SDK doesn't natively accept 'databaseId' parameter in getFirestore yet for all versions unless specifically passed. 
// Let's check how to pass it in JS SDK: getFirestore(app, databaseId)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
