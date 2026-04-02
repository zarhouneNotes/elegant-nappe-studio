import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useFirebaseData";
import type { FirebaseCategory } from "@/services/firebaseService";

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editing, setEditing] = useState<FirebaseCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", image: "" });

  const resetForm = () => { setForm({ name: "", description: "", image: "" }); setEditing(null); setShowForm(false); };

  const openEdit = (c: FirebaseCategory) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, image: c.image });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing?.id) {
        await updateCategory.mutateAsync({ id: editing.id, data: form });
        toast.success("Category updated");
      } else {
        await addCategory.mutateAsync(form);
        toast.success("Category added");
      }
      resetForm();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch {
      toast.error("Delete failed");
    }
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
            <label className="mb-1 block text-sm font-medium text-foreground">Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
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
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(c.id!)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No categories yet.</p>}
        </div>
      )}
    </div>
  );
}
