import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getCategories,
  getOrders,
  getMessages,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory,
  addOrder,
  updateOrder,
  addMessage,
  markMessageRead,
  type FirebaseProduct,
  type FirebaseCategory,
  type FirebaseOrder,
  type FirebaseMessage,
} from "@/services/firebaseService";

// ─── Products ──────────────────────────────────────────

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: getProducts });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Omit<FirebaseProduct, "id" | "createdAt">) => addProduct(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirebaseProduct> }) => updateProduct(id, data),
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
    mutationFn: (c: Omit<FirebaseCategory, "id">) => addCategory(c),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirebaseCategory> }) => updateCategory(id, data),
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
    mutationFn: (o: Omit<FirebaseOrder, "id" | "createdAt">) => addOrder(o),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirebaseOrder> }) => updateOrder(id, data),
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
    mutationFn: (m: Omit<FirebaseMessage, "id" | "createdAt">) => addMessage(m),
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
