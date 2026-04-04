import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ─── Types ─────────────────────────────────────────────

export type Product = Tables<"products">;
export type Category = Tables<"categories">;
export type Order = Tables<"orders"> & {
  items: OrderItem[];
};
export type Message = Tables<"messages">;

export interface OrderItem {
  productId: string;
  title: string;
  color: string;
  dimension: string;
  quantity: number;
  image: string;
}

// ─── Products ──────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addProduct(product: TablesInsert<"products">) {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: TablesUpdate<"products">) {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ─── Categories ────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addCategory(cat: TablesInsert<"categories">) {
  const { data, error } = await supabase.from("categories").insert(cat).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: TablesUpdate<"categories">) {
  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ─── Orders ────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function addOrder(order: Omit<TablesInsert<"orders">, "items"> & { items: OrderItem[] }) {
  const { data, error } = await supabase.from("orders").insert({ ...order, items: order.items as any }).select().single();
  if (error) throw error;
  return data;
}

export async function updateOrder(id: string, updates: TablesUpdate<"orders">) {
  const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

// ─── Messages ──────────────────────────────────────────

export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addMessage(msg: TablesInsert<"messages">) {
  const { data, error } = await supabase.from("messages").insert(msg).select().single();
  if (error) throw error;
  return data;
}

export async function markMessageRead(id: string) {
  const { error } = await supabase.from("messages").update({ read: true }).eq("id", id);
  if (error) throw error;
}
