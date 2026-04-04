import { useParams, Link } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage() {
  const { id } = useParams();
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts();
  const category = categories.find((c) => c.id === id);
  const categoryProducts = products.filter((p) => p.category === id);

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl text-foreground">Category not found</h1>
        <Link to="/categories" className="mt-4 inline-block text-primary hover:underline">Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">{category.name}</h1>
      <p className="mt-2 text-muted-foreground">{category.description}</p>
      {categoryProducts.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No products in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
