"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-brand-50 text-brand-700",
  FULFILLED: "bg-green-50 text-green-700",
  PENDING: "bg-amber-50 text-amber-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-ink-100 text-ink-600",
};

type Order = {
  orderNumber: string;
  subtotalCents: number;
  totalCents: number;
  taxCents: number | null;
  status: string;
  createdAt: string;
  billingLine1: string | null;
  billingLine2: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingPostalCode: string | null;
  billingCountry: string | null;
  items: {
    id: string;
    brandName: string;
    denomCents: number;
    quantity: number;
    deliveryType: string;
    codes: { id: string; code: string; pin: string; isDemo: boolean }[];
  }[];
};

export function OrderDetail({ orderNumber, email }: { orderNumber: string; email: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [enteredEmail, setEnteredEmail] = useState(email);
  const [loading, setLoading] = useState(false);

  const lookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, email: enteredEmail }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Order not found");
      return;
    }
    setOrder(data.order);
  };

  useEffect(() => {
    if (email) lookup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyCode = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code.replace(/\s/g, ""));
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    } catch {}
  };

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white border border-ink-100 rounded-3xl p-10 shadow-sm">
          <h1 className="text-xl font-extrabold mb-4">Confirm your email to view order {orderNumber}</h1>
          <form onSubmit={lookup} className="space-y-4">
            <input
              value={enteredEmail}
              onChange={(e) => setEnteredEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition disabled:opacity-50">
              {loading ? "Checking…" : "View Order"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Order {order.orderNumber}</h1>
          <div className="text-sm text-ink-400">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${STATUS_STYLE[order.status] || "bg-ink-100 text-ink-600"}`}>
          {order.status}
        </span>
      </div>

      {order.items.map((item) => (
        <div key={item.id} className="bg-white border border-ink-100 rounded-2xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-extrabold">{item.brandName}</span>
            <span className="text-sm text-ink-600">
              {fmt(item.denomCents)} × {item.quantity} · {item.deliveryType === "EGIFT" ? "eGift" : "Physical"}
            </span>
          </div>
          <div className="border-t border-ink-50 pt-3">
            {item.codes.map((c) => (
              <div key={c.id} className="py-3 border-b border-dashed border-ink-100 last:border-0">
                {c.isDemo && (
                  <div className="text-[11px] font-bold text-accent-600 mb-2">DEMO CODE — not redeemable</div>
                )}
                {revealed[c.id] ? (
                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      onClick={() => copyCode(c.id, c.code)}
                      className="flex items-center gap-2 font-mono font-bold bg-ink-50 hover:bg-ink-100 px-4 py-2 rounded-lg tracking-wider transition"
                    >
                      {c.code}
                      <Icon name={copiedId === c.id ? "checkCircle" : "copy"} size={14} className={copiedId === c.id ? "text-green-600" : "text-ink-400"} />
                    </button>
                    <div className="font-mono font-bold bg-ink-50 px-4 py-2 rounded-lg">PIN {c.pin}</div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-ink-400 tracking-widest">•••• •••• •••• {c.code.slice(-4)}</span>
                    <button
                      onClick={() => setRevealed((p) => ({ ...p, [c.id]: true }))}
                      className="px-5 py-2 border-2 border-brand-600 text-brand-600 rounded-lg font-bold text-sm hover:bg-brand-600 hover:text-white transition"
                    >
                      Reveal Code
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <div className="flex justify-between text-sm text-ink-500 mb-1.5">
            <span>Subtotal</span>
            <span>{fmt(order.subtotalCents)}</span>
          </div>
          {!!order.taxCents && (
            <div className="flex justify-between text-sm text-ink-500 mb-1.5">
              <span>Tax</span>
              <span>{fmt(order.taxCents)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-lg pt-2 mt-2 border-t border-ink-100">
            <span>Total Paid</span>
            <span>{fmt(order.totalCents)}</span>
          </div>
        </div>
        {(order.billingLine1 || order.billingCity) && (
          <div className="bg-white border border-ink-100 rounded-2xl p-6">
            <div className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2">Billing Address</div>
            <div className="text-sm text-ink-700 leading-relaxed">
              {order.billingLine1 && <div>{order.billingLine1}</div>}
              {order.billingLine2 && <div>{order.billingLine2}</div>}
              <div>{[order.billingCity, order.billingState, order.billingPostalCode].filter(Boolean).join(", ")}</div>
              {order.billingCountry && <div>{order.billingCountry}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
