import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useAddOrder } from "@/hooks/useSupabaseData";
import { toast } from "sonner";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const addOrder = useAddOrder();
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", address: "", city: "", notes: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addOrder.mutateAsync({
        ...form,
        items: items.map((item) => ({
          productId: item.productId,
          title: item.title,
          color: item.color,
          dimension: item.dimension,
          quantity: item.quantity,
          image: item.image,
        })),
        status: "pending",
      });
      clearCart();
      setSubmitted(true);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
            <input required type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Phone Number</label>
            <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
            <input required type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">City</label>
            <input required type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Notes (optional)</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none" />
          </div>
          <button type="submit" disabled={addOrder.isPending}
            className="w-full rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
            {addOrder.isPending ? "Placing Order…" : "Place Order"}
          </button>
        </form>

        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.dimension}`} className="flex items-center gap-3 rounded border border-border p-3">
                {item.image && <img src={item.image} alt={item.title} className="h-12 w-12 rounded object-cover" />}
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
