import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getCategories, addCategory, updateCategory, deleteCategory,
  getOrders, addOrder, updateOrder,
  getMessages, addMessage, markMessageRead,
  type Product, type Category, type Order, type Message, type OrderItem,
} from "@/services/supabaseService";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ─── Products ──────────────────────────────────────────

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: getProducts });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: TablesInsert<"products">) => addProduct(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TablesUpdate<"products"> }) => updateProduct(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

// ─── Categories ────────────────────────────────────────

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories });
}

export function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (c: TablesInsert<"categories">) => addCategory(c),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TablesUpdate<"categories"> }) => updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ─── Orders ────────────────────────────────────────────

export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: getOrders });
}

export function useAddOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (o: Omit<TablesInsert<"orders">, "items"> & { items: OrderItem[] }) => addOrder(o),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TablesUpdate<"orders"> }) => updateOrder(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

// ─── Messages ──────────────────────────────────────────

export function useMessages() {
  return useQuery({ queryKey: ["messages"], queryFn: getMessages });
}

export function useAddMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (m: TablesInsert<"messages">) => addMessage(m),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markMessageRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export type { Product, Category, Order, Message, OrderItem };
