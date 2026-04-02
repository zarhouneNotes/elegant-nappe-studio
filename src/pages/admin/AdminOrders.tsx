import { useState } from "react";
import type { FirebaseOrder } from "@/services/firebaseService";

const sampleOrders: FirebaseOrder[] = [
  {
    id: "1",
    fullName: "Jane Doe",
    phone: "+1 555-0100",
    email: "jane@example.com",
    address: "123 Main St",
    city: "Paris",
    notes: "",
    items: [{ productId: "1", title: "Classic White Cotton Nappe", color: "White", dimension: "140 x 180 cm", quantity: 2, image: "" }],
    status: "pending",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<FirebaseOrder[]>(sampleOrders);
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateStatus = (id: string, status: FirebaseOrder["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    // TODO: await updateOrder(id, { status });
  };

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">Orders submitted from the store checkout.</p>

      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-lg border border-border">
            <button
              onClick={() => setExpanded(expanded === o.id ? null : o.id!)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{o.fullName}</p>
                <p className="text-xs text-muted-foreground">{o.email} · {o.city}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[o.status]}`}>
                {o.status}
              </span>
            </button>
            {expanded === o.id && (
              <div className="border-t border-border p-4 space-y-4">
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><span className="font-medium text-foreground">Phone:</span> <span className="text-muted-foreground">{o.phone}</span></p>
                  <p><span className="font-medium text-foreground">Address:</span> <span className="text-muted-foreground">{o.address}, {o.city}</span></p>
                  {o.notes && <p className="sm:col-span-2"><span className="font-medium text-foreground">Notes:</span> <span className="text-muted-foreground">{o.notes}</span></p>}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Items</h4>
                  {o.items.map((item, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      {item.title} — {item.color}, {item.dimension} × {item.quantity}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {(["pending", "confirmed", "shipped", "delivered"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(o.id!, s)}
                      className={`rounded px-3 py-1.5 text-xs font-medium capitalize ${
                        o.status === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No orders yet.</p>}
      </div>
    </div>
  );
}
