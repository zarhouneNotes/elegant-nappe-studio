import { Package, ShoppingCart, Tag, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Products", icon: Package, to: "/admin/products", color: "bg-primary/10 text-primary" },
  { label: "Orders", icon: ShoppingCart, to: "/admin/orders", color: "bg-primary/10 text-primary" },
  { label: "Categories", icon: Tag, to: "/admin/categories", color: "bg-primary/10 text-primary" },
  { label: "Inbox", icon: Inbox, to: "/admin/inbox", color: "bg-primary/10 text-primary" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your store from here.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.to}
              to={s.to}
              className="rounded-lg border border-border p-6 transition-colors hover:bg-accent"
            >
              <div className={`inline-flex rounded-md p-2.5 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{s.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">Manage {s.label.toLowerCase()}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
