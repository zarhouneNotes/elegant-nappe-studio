import { Link } from "react-router-dom";
import type { Product } from "@/hooks/useSupabaseData";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold text-card-foreground">{product.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          <span className="mt-3 inline-block text-sm font-medium text-primary">View Product →</span>
        </div>
      </Link>
    </div>
  );
}
