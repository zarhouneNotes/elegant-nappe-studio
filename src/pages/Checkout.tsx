import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0 && !submitted) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl text-foreground">No items in cart</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse Products</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container py-20 text-center">
        <div className="mx-auto max-w-md rounded-lg border border-border p-10">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Order Received!</h1>
          <p className="mt-4 text-muted-foreground">
            Your order request has been received. Our team will contact you shortly.
          </p>
          <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
  };

  return (
    <div className="container py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
            <input required type="text" className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Phone Number</label>
            <input required type="tel" className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <input required type="email" className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
            <input required type="text" className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">City</label>
            <input required type="text" className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Notes (optional)</label>
            <textarea rows={3} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none" />
          </div>
          <button type="submit" className="w-full rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Place Order
          </button>
        </form>

        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.dimension}`} className="flex items-center gap-3 rounded border border-border p-3">
                <img src={item.image} alt={item.title} className="h-12 w-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.color} · {item.dimension} · Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
