import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDZOy93bOkcGfnh9zbpNXV5KBXY59YjSk",
  authDomain: "daak-nepal.firebaseapp.com",
  projectId: "daak-nepal",
  storageBucket: "daak-nepal.firebasestorage.app",
  messagingSenderId: "717607878722",
  appId: "1:717607878722:web:58e25b5523c384845e2ddb",
  measurementId: "G-1E0GM6X10L",
};

let app: FirebaseApp | null = null;

export function firebaseApp() {
  app ??= getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
}

export function firebaseAuth(): Auth {
  return getAuth(firebaseApp());
}

export function firebaseDb(): Firestore {
  return getFirestore(firebaseApp());
}

export function authEmail(phone: string) {
  return `${phone.replace(/\D/g, "")}@daak-nepal.app`;
}
