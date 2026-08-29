"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export default function OrdersLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orderNumber || !email) {
      setError("Enter both your order number and email.");
      return;
    }
    router.push(`/orders/${encodeURIComponent(orderNumber.trim())}?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-ink-100 rounded-3xl p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Icon name="package" size={26} className="text-brand-600" />
          </div>
          <h1 className="text-2xl font-extrabold">Find Your Order</h1>
          <p className="text-sm text-ink-500 mt-1.5">Enter your order number and the email you used at checkout.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Order Number</label>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="BGC-20260829-A1B2C3"
              className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition">
            View Order
          </button>
        </form>
      </div>
    </div>
  );
}
