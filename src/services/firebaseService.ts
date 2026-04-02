import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Products ──────────────────────────────────────────

export interface FirebaseProduct {
  id?: string;
  title: string;
  description: string;
  images: string[];
  colors: string[];
  dimensions: string[];
  category: string;
  featured: boolean;
  createdAt?: Timestamp;
}

export async function getProducts(): Promise<FirebaseProduct[]> {
  const snap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirebaseProduct));
}

export async function getProduct(id: string): Promise<FirebaseProduct | null> {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as FirebaseProduct) : null;
}

export async function addProduct(product: Omit<FirebaseProduct, "id" | "createdAt">) {
  return addDoc(collection(db, "products"), { ...product, createdAt: Timestamp.now() });
}

export async function updateProduct(id: string, data: Partial<FirebaseProduct>) {
  return updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, "products", id));
}

// ─── Categories ────────────────────────────────────────

export interface FirebaseCategory {
  id?: string;
  name: string;
  description: string;
  image: string;
}

export async function getCategories(): Promise<FirebaseCategory[]> {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirebaseCategory));
}

export async function addCategory(cat: Omit<FirebaseCategory, "id">) {
  return addDoc(collection(db, "categories"), cat);
}

export async function updateCategory(id: string, data: Partial<FirebaseCategory>) {
  return updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  return deleteDoc(doc(db, "categories", id));
}

// ─── Orders ────────────────────────────────────────────

export interface FirebaseOrder {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  items: {
    productId: string;
    title: string;
    color: string;
    dimension: string;
    quantity: number;
    image: string;
  }[];
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt?: Timestamp;
}

export async function getOrders(): Promise<FirebaseOrder[]> {
  const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirebaseOrder));
}

export async function addOrder(order: Omit<FirebaseOrder, "id" | "createdAt">) {
  return addDoc(collection(db, "orders"), { ...order, createdAt: Timestamp.now() });
}

export async function updateOrder(id: string, data: Partial<FirebaseOrder>) {
  return updateDoc(doc(db, "orders", id), data);
}

// ─── Inbox (Contact form submissions) ──────────────────

export interface FirebaseMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt?: Timestamp;
}

export async function getMessages(): Promise<FirebaseMessage[]> {
  const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirebaseMessage));
}

export async function addMessage(msg: Omit<FirebaseMessage, "id" | "createdAt">) {
  return addDoc(collection(db, "messages"), { ...msg, createdAt: Timestamp.now() });
}

export async function markMessageRead(id: string) {
  return updateDoc(doc(db, "messages", id), { read: true });
}
