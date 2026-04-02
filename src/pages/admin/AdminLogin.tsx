import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast.success("Welcome back!");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8">
        <h1 className="font-heading text-2xl font-semibold text-foreground text-center">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Enter your password to continue</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
