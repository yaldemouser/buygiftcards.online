import Link from "next/link";
import { BRANDS } from "@/lib/brands";
import { BrandLogo } from "./BrandLogo";
import { Icon } from "./Icon";

const FEATURED = [BRANDS.find((b) => b.slug === "visa")!, BRANDS.find((b) => b.slug === "starbucks")!, BRANDS.find((b) => b.slug === "amazon")!];
const brandCount = BRANDS.length;

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-600 to-brand-400">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />
      <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-wrap items-center gap-14 justify-center">
        <div className="flex-1 min-w-[300px] text-white">
          <div className="text-xs font-bold uppercase tracking-widest opacity-75 mb-3">Digital Gift Cards</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-[1.08] tracking-tight">
            Send the perfect gift, instantly.
          </h1>
          <p className="text-base opacity-90 mb-7 max-w-md leading-relaxed">
            Browse gift cards from {brandCount}+ popular brands, checked out securely with Stripe, delivered by email
            in minutes.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-brand-700 font-bold hover:bg-brand-50 transition shadow-lg shadow-black/10"
            >
              Shop All Brands
              <Icon name="chevronRight" size={16} />
            </Link>
            <Link
              href="/business"
              className="inline-block px-8 py-3.5 rounded-full border-2 border-white/60 text-white font-bold hover:bg-white/10 transition"
            >
              Bulk Orders
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-white/85">
            <span className="flex items-center gap-1.5"><Icon name="lock" size={14} />Secure Stripe checkout</span>
            <span className="flex items-center gap-1.5"><Icon name="zap" size={14} />Instant email delivery</span>
          </div>
        </div>

        <div className="flex gap-4">
          {FEATURED.map((b, i) => (
            <div
              key={b.slug}
              className="w-32 h-40 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center gap-3 shadow-xl"
              style={{ marginTop: i === 1 ? -16 : 16 }}
            >
              <BrandLogo domain={b.domain} name={b.name} size={48} radius={12} bg="rgba(255,255,255,0.95)" />
              <span className="text-[11px] font-semibold text-white/80 text-center px-2">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
