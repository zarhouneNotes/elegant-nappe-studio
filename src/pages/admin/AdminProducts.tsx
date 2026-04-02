import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct, useCategories } from "@/hooks/useFirebaseData";
import type { FirebaseProduct } from "@/services/firebaseService";

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [editing, setEditing] = useState<FirebaseProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", images: "", colors: "", dimensions: "", category: "", featured: false,
  });

  const resetForm = () => {
    setForm({ title: "", description: "", images: "", colors: "", dimensions: "", category: "", featured: false });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (p: FirebaseProduct) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, images: p.images.join(", "),
      colors: p.colors.join(", "), dimensions: p.dimensions.join(", "), category: p.category, featured: p.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      title: form.title, description: form.description,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      dimensions: form.dimensions.split(",").map((s) => s.trim()).filter(Boolean),
      category: form.category, featured: form.featured,
    };
    try {
      if (editing?.id) {
        await updateProduct.mutateAsync({ id: editing.id, data: product });
        toast.success("Product updated");
      } else {
        await addProduct.mutateAsync(product);
        toast.success("Product added");
      }
      resetForm();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleFeatured = async (p: FirebaseProduct) => {
    try {
      await updateProduct.mutateAsync({ id: p.id!, data: { featured: !p.featured } });
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border border-border p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">{editing ? "Edit Product" : "New Product"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Category</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Image URLs (comma-separated)</label>
            <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Colors (comma-separated)</label>
              <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Dimensions (comma-separated)</label>
              <input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-input" />
            Featured on homepage
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {editing ? "Update" : "Add"} Product
            </button>
            <button type="button" onClick={resetForm} className="rounded-md border border-border px-6 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">Cancel</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 text-center text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  {p.featured && <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Featured</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.category} · {p.colors.length} colors · {p.dimensions.length} sizes</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(p)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" title="Toggle featured">
                  <Star className={`h-4 w-4 ${p.featured ? "fill-primary text-primary" : ""}`} />
                </button>
                <button onClick={() => openEdit(p)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id!)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No products yet. Add your first product above.</p>}
        </div>
      )}
    </div>
  );
}
