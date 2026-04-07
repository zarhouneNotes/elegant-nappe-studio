import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Calendar, Download, Check } from "lucide-react";
import { useOrders, useUpdateOrder, type Order } from "@/hooks/useSupabaseData";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Selection
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  // Filters
  const [searchCustomer, setSearchCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const filteredOrders = orders.filter((o) => {
    const matchesCustomer = o.full_name.toLowerCase().includes(searchCustomer.toLowerCase());
    const matchesStatus = !filterStatus || o.status === filterStatus;
    const orderDate = new Date(o.created_at);
    const matchesDateFrom = !filterDateFrom || orderDate >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || orderDate <= new Date(filterDateTo);
    return matchesCustomer && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateOrder.mutateAsync({ id, data: { status } });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrderIds);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrderIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const exportToCSV = () => {
    if (selectedOrderIds.size === 0) {
      toast.error("Please select at least one order");
      return;
    }

    const selectedOrders = filteredOrders.filter((o) => selectedOrderIds.has(o.id));
    const headers = ["Order ID", "Customer Name", "Phone", "Address", "City", "Status", "Date", "Items", "Notes"];
    const rows = selectedOrders.map((o) => [
      o.id.slice(-8),
      o.full_name,
      o.phone,
      o.address,
      o.city,
      o.status,
      new Date(o.created_at).toLocaleDateString(),
      o.items.map((item) => `${item.title} (${item.color}, ${item.dimension} x${item.quantity})`).join("; "),
      o.notes,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => {
          const cellStr = String(cell);
          return cellStr.includes(",") ? `"${cellStr}"` : cellStr;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success(`Exported ${selectedOrderIds.size} order(s)");
  };

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">Orders submitted from the store checkout.</p>

      {/* Actions */}
      {selectedOrderIds.size > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 p-4">
          <p className="text-sm font-medium text-foreground">{selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''} selected</p>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export as CSV
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 rounded-lg border border-border p-4 space-y-3 bg-accent/20">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Search Customer</label>
            <input
              type="text"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              placeholder="Customer name..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-center text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-input cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">City</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((o) => (
                <tr key={o.id} className={`hover:bg-accent/50 transition-colors ${selectedOrderIds.has(o.id) ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.has(o.id)}
                      onChange={() => toggleOrderSelection(o.id)}
                      className="rounded border-input cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {o.items.length > 0 && o.items[0].image && (
                      <img src={o.items[0].image} alt={o.items[0].title} className="h-10 w-10 rounded object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{o.full_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{o.city}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[o.status] || ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No orders match your filters.</p>}
        </div>
      )}
    </div>
  );
}
