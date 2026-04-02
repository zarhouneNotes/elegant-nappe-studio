import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-tablecloth.jpg";
import { useProducts, useCategories } from "@/hooks/useFirebaseData";
import ProductCard from "@/components/ProductCard";
import { CheckCircle } from "lucide-react";

const Index = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={heroImage} alt="Elegant dining table with tablecloth" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="container relative flex h-full flex-col items-center justify-center text-center">
          <h1 className="max-w-2xl font-heading text-4xl font-bold text-primary-foreground md:text-6xl">
            Elegant Table Nappes for Every Occasion
          </h1>
          <p className="mt-4 max-w-lg text-lg text-primary-foreground/80">
            Premium quality tablecloths crafted for homes, restaurants, and events.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container py-20">
          <h2 className="text-center font-heading text-3xl font-semibold text-foreground md:text-4xl">
            Browse by Category
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">{cat.name}</div>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-end bg-foreground/30 p-6 text-center transition-colors group-hover:bg-foreground/40">
                  <h3 className="font-heading text-2xl font-semibold text-primary-foreground">{cat.name}</h3>
                  <p className="mt-1 text-sm text-primary-foreground/80">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-secondary py-20">
          <div className="container">
            <h2 className="text-center font-heading text-3xl font-semibold text-foreground md:text-4xl">
              Featured Products
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/products"
                className="inline-block rounded-md border border-primary px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quality Section */}
      <section className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            Why Choose Maison Nappe?
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { title: "Premium Fabrics", text: "Only the finest cotton and linen materials selected for durability and softness." },
              { title: "Elegant Designs", text: "Timeless patterns and colors that complement any dining setting." },
              { title: "For Every Occasion", text: "From daily meals at home to grand events and restaurant service." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-semibold text-primary-foreground md:text-4xl">
            Ready to Elevate Your Table?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
            Explore our full collection and find the perfect nappe for your home or event.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-md border border-primary-foreground bg-primary-foreground px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
