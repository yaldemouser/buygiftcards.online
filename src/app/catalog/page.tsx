import { BrandGrid } from "@/components/BrandGrid";
import { BRANDS, CATEGORIES } from "@/lib/brands";
import Link from "next/link";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; category?: string }>;
}) {
  const { q, type, category } = await searchParams;
  let items = BRANDS;

  if (q) {
    const needle = q.toLowerCase();
    items = items.filter((b) => b.name.toLowerCase().includes(needle) || b.category.toLowerCase().includes(needle));
  } else {
    if (type === "egift") items = items.filter((b) => b.type !== "physical");
    if (type === "physical") items = items.filter((b) => b.type === "both" || b.type === "physical");
    if (category) items = items.filter((b) => b.category === category);
  }

  const title = q ? `Results for "${q}"` : category || (type === "egift" ? "eGift Cards" : type === "physical" ? "Physical Cards" : "All Gift Cards");

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 pt-6 flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/catalog?category=${encodeURIComponent(c)}`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              category === c ? "bg-brand-600 text-white border-brand-600" : "border-ink-100 text-ink-600 hover:border-brand-300"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>
      <BrandGrid items={items} title={title} />
    </div>
  );
}
