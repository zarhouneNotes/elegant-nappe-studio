import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYJH1CuUVmb54heDVpfCRE-4e199sQ8tw",
  authDomain: "softroyal-8c1a2.firebaseapp.com",
  projectId: "softroyal-8c1a2",
  storageBucket: "softroyal-8c1a2.firebasestorage.app",
  messagingSenderId: "1006775540920",
  appId: "1:1006775540920:web:3270a2928e8dd82874e84d",
  measurementId: "G-Y9CP233TTG",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
