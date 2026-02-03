import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getOwnedDocs<T>(collectionName: string, ownerId: string): Promise<T[]> {
  const q = query(collection(db, collectionName), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function getDocById<T>(collectionName: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function addOwnedDoc(collectionName: string, ownerId: string, data: any): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocument(collectionName: string, id: string, data: any): Promise<void> {
  await updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}
