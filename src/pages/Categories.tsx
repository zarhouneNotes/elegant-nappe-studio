import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useSupabaseData";

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div className="container py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">Categories</h1>
      <p className="mt-2 text-muted-foreground">Find the perfect nappe for your needs.</p>
      {isLoading ? (
        <p className="mt-8 text-center text-muted-foreground">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="group overflow-hidden rounded-lg border border-border">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">{cat.name}</div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">{cat.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                <span className="mt-3 inline-block text-sm font-medium text-primary">Browse →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
