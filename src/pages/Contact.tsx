import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAddMessage } from "@/hooks/useFirebaseData";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const addMessage = useAddMessage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addMessage.mutateAsync({ ...form, read: false });
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="container py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">We'd love to hear from you. Get in touch with our team.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          {submitted ? (
            <div className="rounded-lg border border-border bg-accent p-8 text-center">
              <h2 className="font-heading text-xl font-semibold text-foreground">Thank you!</h2>
              <p className="mt-2 text-muted-foreground">We've received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none" />
              </div>
              <button type="submit" disabled={addMessage.isPending}
                className="rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                {addMessage.isPending ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Phone</h3>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Email</h3>
              <p className="text-sm text-muted-foreground">hello@maisonnappe.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Location</h3>
              <p className="text-sm text-muted-foreground">123 Textile Avenue, Paris, France</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
