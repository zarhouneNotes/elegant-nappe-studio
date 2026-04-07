import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, User, Calendar, Package } from "lucide-react";
import { useOrders, useUpdateOrder } from "@/hooks/useSupabaseData";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: orders = [] } = useOrders();
  const updateOrder = useUpdateOrder();

  const order = orders.find((o) => o.id === id);

  const handleStatus = async (status: string) => {
    if (!order) return;
    try {
      await updateOrder.mutateAsync({ id: order.id, data: { status } });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (!order) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Order Not Found</h1>
          <Link to="/admin/orders" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Order #{order.id.slice(-8)}</h1>
          <p className="text-sm text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Status */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Order Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Status</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || ""}`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(["pending", "confirmed", "shipped", "delivered"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatus(s)}
                      disabled={updateOrder.isPending}
                      className={`rounded px-3 py-2 text-xs font-medium capitalize transition-colors ${
                        order.status === s
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Customer Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{order.full_name}</p>
                  <p className="text-xs text-muted-foreground">Customer Name</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{order.phone}</p>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{order.address}, {order.city}</p>
                  <p className="text-xs text-muted-foreground">Delivery Address</p>
                </div>
              </div>
              {order.notes && (
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-medium text-foreground mb-1">Notes</h3>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6 rounded-lg border border-border p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 rounded-lg border border-border p-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Color:</span> {item.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Size:</span> {item.dimension}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Quantity:</span> {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}