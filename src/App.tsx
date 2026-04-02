import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminInbox from "./pages/admin/AdminInbox";

const queryClient = new QueryClient();

function AdminGuard() {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <AdminLogin />;
  return <AdminLayout />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Store routes */}
              <Route element={<Layout><Index /></Layout>} path="/" />
              <Route element={<Layout><Products /></Layout>} path="/products" />
              <Route element={<Layout><ProductDetail /></Layout>} path="/product/:id" />
              <Route element={<Layout><Categories /></Layout>} path="/categories" />
              <Route element={<Layout><CategoryPage /></Layout>} path="/category/:id" />
              <Route element={<Layout><About /></Layout>} path="/about" />
              <Route element={<Layout><Contact /></Layout>} path="/contact" />
              <Route element={<Layout><Policies /></Layout>} path="/policies" />
              <Route element={<Layout><Cart /></Layout>} path="/cart" />
              <Route element={<Layout><Checkout /></Layout>} path="/checkout" />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminGuard />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="inbox" element={<AdminInbox />} />
              </Route>

              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
