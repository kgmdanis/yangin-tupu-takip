"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, KullaniciTipi, Paket } from "@/types";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

interface SignUpData {
  firmaAdi: string;
  yetkili: string;
  telefon: string;
  adres: string;
  il: string;
  ilce: string;
  vergiDairesi: string;
  vergiNo: string;
  kullaniciTipi: KullaniciTipi;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserData({ id: userDoc.id, ...userDoc.data() } as User);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(result.user.uid);
  };

  const signUp = async (email: string, password: string, data: SignUpData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const defaultPaket: Paket = data.kullaniciTipi === "dolumcu" ? "starter" : "fabrika_ucretsiz";

    const userRecord: Omit<User, "id"> = {
      email,
      firmaAdi: data.firmaAdi,
      yetkili: data.yetkili,
      telefon: data.telefon,
      adres: data.adres,
      il: data.il,
      ilce: data.ilce,
      vergiDairesi: data.vergiDairesi,
      vergiNo: data.vergiNo,
      kullaniciTipi: data.kullaniciTipi,
      paket: defaultPaket,
      paketBaslangic: null,
      paketBitis: null,
      hesapDurumu: data.kullaniciTipi === "fabrika" ? "aktif" : "beklemede",
      askiyaAlmaTarihi: null,
      askiyaAlmaNedeni: null,
      bagliDolumcular: [],
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };

    await setDoc(doc(db, "users", result.user.uid), userRecord);
    await fetchUserData(result.user.uid);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserData(null);
  };

  const refreshUserData = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, userData, loading, signIn, signUp, signOut, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
