"use client";

import { useState } from "react";
import Link from "next/link";
import { Brand } from "@/lib/brands";
import { BrandLogo } from "./BrandLogo";
import { useCart } from "@/context/CartContext";
import { Icon } from "./Icon";

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function ProductDetail({ brand: b }: { brand: Brand }) {
  const { add } = useCart();
  const [amount, setAmount] = useState<number>(b.denominations[1] ?? b.denominations[0]);
  const [custom, setCustom] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [qty, setQty] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"egift" | "physical">(b.type === "physical" ? "physical" : "egift");
  const [added, setAdded] = useState(false);

  const amt = isCustom ? Number(custom) || 0 : amount;
  const valid = amt >= b.min && amt <= b.max;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-1.5 text-sm text-ink-400 mb-6">
        <Link href="/" className="hover:text-brand-600 transition">Home</Link>
        <Icon name="chevronRight" size={14} />
        <Link href={`/catalog?category=${encodeURIComponent(b.category)}`} className="hover:text-brand-600 transition">{b.category}</Link>
        <Icon name="chevronRight" size={14} />
        <span className="text-ink-700 font-medium">{b.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
      <div
        className="rounded-3xl p-12 flex items-center justify-center min-h-[360px] border border-ink-100"
        style={{ background: `linear-gradient(160deg, ${b.color}12, ${b.color}04)` }}
      >
        <div
          className="w-80 h-48 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl"
          style={{ background: `linear-gradient(140deg, ${b.color}ee, ${b.color}bb)` }}
        >
          <BrandLogo domain={b.domain} name={b.name} size={80} radius={16} bg="rgba(255,255,255,0.95)" />
          <div className="absolute top-4 left-5 text-[11px] font-bold text-white/60">
            {deliveryType === "egift" ? "eGIFT CARD" : "GIFT CARD"}
          </div>
          {amt > 0 && <div className="absolute bottom-4 left-5 text-2xl font-extrabold text-white">{fmt(amt)}</div>}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold mb-2">{b.name} Gift Card</h1>
        <p className="text-sm text-ink-600 mb-6 leading-relaxed">{b.description}</p>

        {b.type === "both" && (
          <div className="mb-7">
            <div className="text-sm font-bold mb-2.5">Delivery Method</div>
            <div className="flex border border-ink-100 rounded-xl overflow-hidden">
              {(["egift", "physical"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setDeliveryType(v)}
                  className={`flex-1 py-3.5 text-sm font-bold flex flex-col items-center gap-1 transition ${
                    deliveryType === v ? "bg-brand-600 text-white" : "text-ink-600 hover:bg-ink-50"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon name={v === "egift" ? "zap" : "package"} size={15} />
                    {v === "egift" ? "eGift Card" : "Physical Card"}
                  </span>
                  <span className="text-[11px] font-normal opacity-70">{v === "egift" ? "Instant via email" : "Ships in 5-7 days"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-7">
          <div className="text-sm font-bold mb-3">Select Amount</div>
          <div className="flex flex-wrap gap-2.5">
            {b.denominations.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setAmount(v);
                  setIsCustom(false);
                  setAdded(false);
                }}
                className={`px-6 py-3 rounded-xl border-2 font-extrabold ${
                  !isCustom && amount === v ? "border-brand-600 bg-brand-50 text-brand-600" : "border-ink-100"
                }`}
              >
                {fmt(v)}
              </button>
            ))}
            <button
              onClick={() => {
                setIsCustom(true);
                setAdded(false);
              }}
              className={`px-6 py-3 rounded-xl border-2 font-bold text-sm ${isCustom ? "border-brand-600 bg-brand-50 text-brand-600" : "border-ink-100 text-ink-600"}`}
            >
              Other $
            </button>
          </div>
          {isCustom && (
            <input
              type="number"
              placeholder={`${b.min} – ${b.max}`}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="mt-3 w-48 px-4 py-3 border-2 border-ink-100 rounded-xl font-bold"
            />
          )}
        </div>

        <div className="mb-8">
          <div className="text-sm font-bold mb-3">Quantity</div>
          <div className="inline-flex border border-ink-100 rounded-xl overflow-hidden">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 h-12 bg-ink-50 text-xl">−</button>
            <span className="w-14 flex items-center justify-center font-extrabold text-lg">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="w-12 h-12 bg-ink-50 text-xl">+</button>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-6 border-t border-ink-100">
          <div>
            <div className="text-xs text-ink-400">Total</div>
            <div className="text-3xl font-extrabold">{fmt(amt * qty)}</div>
          </div>
          <button
            disabled={!valid}
            onClick={() => {
              add({ brandSlug: b.slug, brandName: b.name, domain: b.domain, color: b.color, amount: amt, qty, deliveryType });
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className={`flex-1 py-4 rounded-2xl font-extrabold text-white transition ${
              added ? "bg-green-600" : "bg-brand-600 disabled:opacity-40"
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-2"><Icon name="checkCircle" size={18} />Added to Cart</span>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2.5 mt-7 pt-6 border-t border-ink-100">
          {[
            ["zap", "Instant email delivery"],
            ["lock", "Secure Stripe checkout"],
            ["shield", "No fees, no expiration"],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2 text-xs text-ink-500 font-medium">
              <Icon name={icon as "zap" | "lock" | "shield"} size={15} className="text-brand-600" />
              {label}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
