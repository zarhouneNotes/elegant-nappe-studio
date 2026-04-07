import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Star, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct, useCategories, type Product } from "@/hooks/useSupabaseData";

const MAX_IMAGES = 3;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", colors: "", dimensions: "", category: "", featured: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Filters
  const [searchTitle, setSearchTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<string>("");

  const filteredProducts = products.filter((p) => {
    const matchesTitle = p.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesFeatured = !filterFeatured || (filterFeatured === "featured" ? p.featured : !p.featured);
    return matchesTitle && matchesCategory && matchesFeatured;
  });

  const resetForm = () => {
    setForm({ title: "", description: "", colors: "", dimensions: "", category: "", featured: false });
    setImages([]);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description,
      colors: p.colors.join(", "), dimensions: p.dimensions.join(", "), category: p.category, featured: p.featured,
    });
    setImages(p.images);
    setShowForm(true);
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { toast.error(`Maximum ${MAX_IMAGES} images`); return; }
    const toAdd = files.slice(0, remaining);
    const base64s = await Promise.all(toAdd.map(fileToBase64));
    setImages((prev) => [...prev, ...base64s]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      title: form.title, description: form.description,
      images: images,
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

  const toggleFeatured = async (p: Product) => {
    try {
      await updateProduct.mutateAsync({ id: p.id, data: { featured: !p.featured } });
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
            <label className="mb-1 block text-sm font-medium text-foreground">Images (max {MAX_IMAGES})</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {images.map((src, i) => (
                <div key={i} className="relative h-24 w-24 rounded-lg border border-border overflow-hidden group">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Upload</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
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
            <button type="submit" disabled={addProduct.isPending || updateProduct.isPending} className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {(addProduct.isPending || updateProduct.isPending) && <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>}
              {editing ? "Update" : "Add"} Product
            </button>
            <button type="button" onClick={resetForm} className="rounded-md border border-border px-6 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">Cancel</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="mt-6 rounded-lg border border-border p-4 space-y-3 bg-accent/20">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Search by Title</label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Featured Status</label>
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Products</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-center text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Colors</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Sizes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    {p.images.length > 0 && (
                      <img src={p.images[0]} alt={p.title} className="h-10 w-10 rounded object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{p.category}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{p.colors.length}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{p.dimensions.length}</p>
                  </td>
                  <td className="px-4 py-3">
                    {p.featured && <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Featured</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleFeatured(p)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" title="Toggle featured">
                        <Star className={`h-4 w-4 ${p.featured ? "fill-primary text-primary" : ""}`} />
                      </button>
                      <button onClick={() => openEdit(p)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No products match your filters.</p>}
        </div>
      )}
    </div>
  );
}
