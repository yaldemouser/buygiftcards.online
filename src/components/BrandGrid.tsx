import Link from "next/link";
import { Brand } from "@/lib/brands";
import { BrandLogo } from "./BrandLogo";

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function BrandGrid({ items, title }: { items: Brand[]; title?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {title && <h2 className="text-2xl font-extrabold mb-5">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((b) => (
          <Link
            key={b.slug}
            href={`/product/${b.slug}`}
            className="bg-white border border-ink-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-300 hover:-translate-y-0.5 transition relative"
          >
            {b.badge && (
              <span className="absolute top-3 left-3 z-10 bg-brand-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                {b.badge}
              </span>
            )}
            <div
              className="h-32 flex items-center justify-center border-b border-ink-50"
              style={{ background: `linear-gradient(160deg, ${b.color}10, ${b.color}04)` }}
            >
              <BrandLogo domain={b.domain} name={b.name} size={64} radius={14} bg="transparent" />
            </div>
            <div className="p-4">
              <div className="font-bold text-sm mb-1 min-h-[2.4em]">{b.name}</div>
              <div className="text-brand-600 font-bold text-sm">
                {fmt(b.min)} – {fmt(b.max)}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-16 text-ink-400">No gift cards found.</div>}
    </div>
  );
}
