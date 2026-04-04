import { useProducts } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ProductCard";

export default function Products() {
  const { data: products = [], isLoading } = useProducts();

  return (
    <div className="container py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">All Products</h1>
      <p className="mt-2 text-muted-foreground">Browse our complete collection of elegant table nappes.</p>
      {isLoading ? (
        <p className="mt-8 text-center text-muted-foreground">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No products available yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
