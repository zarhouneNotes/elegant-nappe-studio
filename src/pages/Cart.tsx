import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-3xl font-semibold text-foreground">Your Cart is Empty</h1>
        <p className="mt-3 text-muted-foreground">Start shopping to add items to your cart.</p>
        <Link to="/products" className="mt-6 inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground">Shopping Cart</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.color}-${item.dimension}`} className="flex items-center gap-4 rounded-lg border border-border p-4">
            <img src={item.image} alt={item.title} className="h-20 w-20 rounded object-cover" />
            <div className="flex-1">
              <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.color} · {item.dimension}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.productId, item.color, item.dimension, item.quantity - 1)} className="rounded border border-border p-1 text-muted-foreground hover:text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.color, item.dimension, item.quantity + 1)} className="rounded border border-border p-1 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => removeFromCart(item.productId, item.color, item.dimension)} className="text-muted-foreground transition-colors hover:text-destructive">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <Link to="/checkout" className="inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
