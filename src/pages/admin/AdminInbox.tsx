import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { useMessages, useMarkMessageRead } from "@/hooks/useSupabaseData";

export default function AdminInbox() {
  const { data: messages = [], isLoading } = useMessages();
  const markRead = useMarkMessageRead();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) markRead.mutate(id);
  };

  const selectedMsg = messages.find((m) => m.id === selected);

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Inbox</h1>
      <p className="mt-1 text-sm text-muted-foreground">Messages from the contact form.</p>

      {isLoading ? (
        <p className="mt-6 text-center text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={`w-full text-left rounded-lg border p-4 transition-colors ${selected === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
              >
                <div className="flex items-center gap-2">
                  {m.read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                  <span className={`text-sm font-medium ${m.read ? "text-muted-foreground" : "text-foreground"}`}>{m.name}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground truncate">{m.message}</p>
              </button>
            ))}
            {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>}
          </div>

          {selectedMsg && (
            <div className="rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-foreground">{selectedMsg.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedMsg.email}</p>
              <p className="mt-4 text-sm text-foreground whitespace-pre-wrap">{selectedMsg.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
