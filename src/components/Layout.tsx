import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-heading text-2xl font-semibold tracking-wide text-foreground">
          Soft Royal
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-foreground transition-colors hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground">Maison Nappe</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Elegant table nappes crafted with premium fabrics for homes, restaurants, and events.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Navigation</h4>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Policies</h4>
          <ul className="space-y-2">
            <li><Link to="/policies#shipping" className="text-sm text-muted-foreground transition-colors hover:text-primary">Shipping</Link></li>
            <li><Link to="/policies#returns" className="text-sm text-muted-foreground transition-colors hover:text-primary">Returns</Link></li>
            <li><Link to="/policies#privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 Maison Nappe — All rights reserved.
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
