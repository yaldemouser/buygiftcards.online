"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Brand } from "@/lib/brands";
import { BrandLogo } from "./BrandLogo";
import { useCart } from "@/context/CartContext";
import { Icon } from "./Icon";

const fmt = (n: number) => `$${n.toFixed(2)}`;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProductDetail({ brand: b }: { brand: Brand }) {
  const { add } = useCart();
  const [amount, setAmount] = useState<number>(b.denominations[1] ?? b.denominations[0]);
  const [custom, setCustom] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [qty, setQty] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"egift" | "physical">(b.type === "physical" ? "physical" : "egift");
  const [added, setAdded] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const amt = isCustom ? Number(custom) || 0 : amount;
  const valid = amt >= b.min && amt <= b.max && !photoUploading;
  const chargeAmt = b.discountPercent ? Math.round(amt * (1 - b.discountPercent / 100) * 100) / 100 : amt;

  const onPhotoSelected = async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Please upload a JPEG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Image must be under 8MB.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPhotoPreview(localPreview);
    setPhotoUrl(null);
    setPhotoUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPhotoUrl(data.url);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Upload failed — try again.");
      setPhotoPreview(null);
    } finally {
      setPhotoUploading(false);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoUrl(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cardImage = photoPreview;

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
          style={{ background: cardImage ? "#000" : `linear-gradient(140deg, ${b.color}ee, ${b.color}bb)` }}
        >
          {cardImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cardImage} alt="Your uploaded photo" className="absolute inset-0 w-full h-full object-cover" />
          ) : null}
          {cardImage && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />}
          {!cardImage && <BrandLogo domain={b.domain} name={b.name} size={80} radius={16} bg="rgba(255,255,255,0.95)" />}
          {cardImage && (
            <div className="absolute top-4 right-5">
              <BrandLogo domain={b.domain} name={b.name} size={36} radius={8} bg="rgba(255,255,255,0.95)" />
            </div>
          )}
          <div className="absolute top-4 left-5 text-[11px] font-bold text-white/80">
            {deliveryType === "egift" ? "eGIFT CARD" : "GIFT CARD"}
          </div>
          {amt > 0 && <div className="absolute bottom-4 left-5 text-2xl font-extrabold text-white drop-shadow">{fmt(amt)}</div>}
          {!!b.discountPercent && (
            <span className="absolute top-4 right-5 bg-accent-500 text-ink-950 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
              {b.discountPercent}% OFF
            </span>
          )}
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

        {b.supportsCustomPhoto && (
          <div className="mb-7">
            <div className="text-sm font-bold mb-2.5">Personalize with a Photo (optional)</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => onPhotoSelected(e.target.files?.[0])}
            />
            {!photoPreview ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 border-2 border-dashed border-ink-200 rounded-xl text-sm font-semibold text-ink-500 hover:border-brand-400 hover:text-brand-600 transition flex flex-col items-center gap-2"
              >
                <Icon name="package" size={22} />
                Click to upload a photo for the card face
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-ink-50 border-2 border-ink-100 rounded-xl p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0 text-sm">
                  {photoUploading ? (
                    <span className="flex items-center gap-1.5 text-ink-500">
                      <Icon name="loader" size={14} className="animate-spin" /> Uploading…
                    </span>
                  ) : photoUrl ? (
                    <span className="flex items-center gap-1.5 text-green-700 font-semibold">
                      <Icon name="checkCircle" size={14} /> Photo ready
                    </span>
                  ) : (
                    <span className="text-red-600">Upload failed</span>
                  )}
                </div>
                <button onClick={removePhoto} className="text-ink-400 hover:text-red-500 transition flex-shrink-0">
                  <Icon name="x" size={18} />
                </button>
              </div>
            )}
            {photoError && <div className="text-red-600 text-xs mt-2">{photoError}</div>}
            <p className="text-xs text-ink-400 mt-2">JPEG, PNG, or WEBP, up to 8MB. Shown on the card design above — this doesn't change how the card is redeemed.</p>
          </div>
        )}

        <div className="mb-7">
          <div className="text-sm font-bold mb-3 flex items-center gap-2">
            Select Amount
            {!!b.discountPercent && (
              <span className="bg-accent-500 text-ink-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {b.discountPercent}% OFF
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {b.denominations.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setAmount(v);
                  setIsCustom(false);
                  setAdded(false);
                }}
                className={`px-6 py-3 rounded-xl border-2 font-extrabold flex flex-col items-center ${
                  !isCustom && amount === v ? "border-brand-600 bg-brand-50 text-brand-600" : "border-ink-100"
                }`}
              >
                {b.discountPercent ? (
                  <>
                    <span className="text-[11px] font-semibold line-through opacity-50 leading-none">{fmt(v)}</span>
                    <span className="leading-tight">{fmt(Math.round(v * (1 - b.discountPercent / 100) * 100) / 100)}</span>
                  </>
                ) : (
                  fmt(v)
                )}
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
            {b.discountPercent ? (
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-extrabold">{fmt(chargeAmt * qty)}</div>
                <div className="text-sm font-semibold text-ink-400 line-through">{fmt(amt * qty)}</div>
              </div>
            ) : (
              <div className="text-3xl font-extrabold">{fmt(amt * qty)}</div>
            )}
            <div className="text-[11px] text-ink-400 mt-0.5">
              {b.discountPercent
                ? `Gift card value: ${fmt(amt * qty)} — you pay ${b.discountPercent}% less`
                : "Gift card value: full amount, no fees"}
            </div>
          </div>
          <button
            disabled={!valid}
            onClick={() => {
              add({
                brandSlug: b.slug,
                brandName: b.name,
                domain: b.domain,
                color: b.color,
                amount: amt,
                qty,
                deliveryType,
                customPhotoUrl: photoUrl ?? undefined,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className={`flex-1 py-4 rounded-2xl font-extrabold text-white transition ${
              added ? "bg-green-600" : "bg-brand-600 disabled:opacity-40"
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-2"><Icon name="checkCircle" size={18} />Added to Cart</span>
            ) : photoUploading ? (
              "Uploading photo…"
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
