"use client";

import { useState } from "react";
import { BRANDS } from "@/lib/brands";
import { Icon } from "./Icon";

type Line = { brandSlug: string; amount: number; quantity: number };

export function BusinessQuoteForm() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ brandSlug: BRANDS[0].slug, amount: BRANDS[0].denominations[0], quantity: 50 }]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const updateLine = (i: number, patch: Partial<Line>) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const addLine = () => setLines((prev) => [...prev, { brandSlug: BRANDS[0].slug, amount: BRANDS[0].denominations[0], quantity: 50 }]);
  const removeLine = (i: number) => setLines((prev) => prev.filter((_, idx) => idx !== i));

  const total = lines.reduce((s, l) => s + l.amount * l.quantity, 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/business/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, contactName, email, phone, notes, items: lines }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="bg-white border border-ink-100 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
          <Icon name="checkCircle" size={26} className="text-green-600" />
        </div>
        <h2 className="text-xl font-extrabold mb-2">Request received</h2>
        <p className="text-ink-600">
          We've drafted an invoice for {companyName} — our team will review it and follow up at {email} within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-ink-100 rounded-2xl p-8 space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Company Name</label>
          <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
        </div>
        <div>
          <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Contact Name</label>
          <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
        </div>
        <div>
          <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
        </div>
        <div>
          <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Phone (optional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
        </div>
      </div>

      <div>
        <div className="text-sm font-bold mb-3">Gift Cards Requested</div>
        <div className="space-y-3">
          {lines.map((line, i) => {
            const brand = BRANDS.find((b) => b.slug === line.brandSlug)!;
            return (
              <div key={i} className="flex flex-wrap gap-3 items-center bg-ink-50 rounded-xl p-3">
                <select
                  value={line.brandSlug}
                  onChange={(e) => {
                    const b = BRANDS.find((x) => x.slug === e.target.value)!;
                    updateLine(i, { brandSlug: b.slug, amount: b.denominations[0] });
                  }}
                  className="px-3 py-2 rounded-lg border border-ink-100 bg-white text-sm"
                >
                  {BRANDS.map((b) => (
                    <option key={b.slug} value={b.slug}>{b.name}</option>
                  ))}
                </select>
                <select
                  value={line.amount}
                  onChange={(e) => updateLine(i, { amount: Number(e.target.value) })}
                  className="px-3 py-2 rounded-lg border border-ink-100 bg-white text-sm"
                >
                  {brand.denominations.map((d) => (
                    <option key={d} value={d}>${d}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={line.quantity}
                  onChange={(e) => updateLine(i, { quantity: Math.max(1, Number(e.target.value)) })}
                  className="w-24 px-3 py-2 rounded-lg border border-ink-100 bg-white text-sm"
                />
                <span className="text-sm text-ink-400">qty</span>
                <span className="ml-auto font-bold text-sm">${(line.amount * line.quantity).toFixed(2)}</span>
                {lines.length > 1 && (
                  <button type="button" onClick={() => removeLine(i)} aria-label="Remove line" className="text-ink-400 hover:text-red-500 transition">
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button type="button" onClick={addLine} className="mt-3 text-brand-600 font-bold text-sm">
          + Add another card
        </button>
      </div>

      <div>
        <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Notes (optional)</label>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-ink-100">
        <div>
          <div className="text-xs text-ink-400">Estimated total</div>
          <div className="text-2xl font-extrabold">${total.toFixed(2)}</div>
        </div>
        <button disabled={status === "loading"} className="px-8 py-3.5 rounded-xl bg-brand-600 text-white font-bold disabled:opacity-50">
          {status === "loading" ? "Submitting…" : "Request Invoice"}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <p className="text-xs text-ink-400">
        This sends your request to our team for review — you'll receive an actual invoice by email after we
        confirm details, not immediately.
      </p>
    </form>
  );
}
