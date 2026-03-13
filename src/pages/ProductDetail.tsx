import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("");

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl text-foreground">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Back to Products</Link>
      </div>
    );
  }

  const color = selectedColor || product.colors[0];
  const dimension = selectedDimension || product.dimensions[0];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      image: product.images[0],
      color,
      dimension,
    });
    toast.success("Added to cart!");
  };

  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));

  return (
    <div className="container py-12">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <img src={product.images[currentImage]} alt={product.title} className="h-full w-full object-cover" />
            <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground transition hover:bg-background">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground transition hover:bg-background">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-16 w-16 overflow-hidden rounded border transition ${
                  i === currentImage ? "border-primary" : "border-border"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">{product.title}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Color */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">Color</h3>
            <div className="mt-2 flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`rounded-md border px-4 py-2 text-sm transition ${
                    color === c
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">Dimensions</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.dimensions.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDimension(d)}
                  className={`rounded-md border px-4 py-2 text-sm transition ${
                    dimension === d
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-8 w-full rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
