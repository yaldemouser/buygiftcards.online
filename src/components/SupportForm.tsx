"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, orderNumber, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
          <Icon name="checkCircle" size={26} className="text-green-600" />
        </div>
        <h2 className="text-lg font-extrabold mb-2">Request sent</h2>
        <p className="text-sm text-ink-600">We'll get back to you at {email} soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Full Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Email Address</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Order Number (optional)</label>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition font-mono text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Describe your issue</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Submit Request"}
      </button>
    </form>
  );
}
