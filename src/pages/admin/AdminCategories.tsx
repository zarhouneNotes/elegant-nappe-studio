import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory, type Category } from "@/hooks/useSupabaseData";

const MAX_IMAGES = 3;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => { setForm({ name: "", description: "" }); setImages([]); setEditing(null); setShowForm(false); };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description });
    setImages(c.image ? [c.image] : []);
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
    try {
      const payload = { name: form.name, description: form.description, image: images[0] || "" };
      if (editing?.id) {
        await updateCategory.mutateAsync({ id: editing.id, data: payload });
        toast.success("Category updated");
      } else {
        await addCategory.mutateAsync(payload);
        toast.success("Category added");
      }
      resetForm();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try { await deleteCategory.mutateAsync(id); toast.success("Category deleted"); } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Categories</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border border-border p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
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
          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {editing ? "Update" : "Add"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-md border border-border px-6 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">Cancel</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 text-center text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-4 justify-between rounded-lg border border-border p-4">
              {c.image && <img src={c.image} alt={c.name} className="h-12 w-12 rounded object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{c.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(c.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No categories yet.</p>}
        </div>
      )}
    </div>
  );
}
