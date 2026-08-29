"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Icon } from "./Icon";

const NAV_LINKS = [
  { label: "All Brands", href: "/catalog" },
  { label: "eGift", href: "/catalog?type=egift" },
  { label: "Physical", href: "/catalog?type=physical" },
  { label: "Track Order", href: "/track-order" },
  { label: "Business", href: "/business" },
  { label: "Support", href: "/support" },
];

// Reads useSearchParams, so it's isolated behind Suspense — otherwise it
// would force every page in the app (they all render Nav via the layout)
// out of static generation.
function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");

  return (
    <>
      {NAV_LINKS.map((l) => {
        const [linkPath, linkQuery] = l.href.split("?");
        const linkType = new URLSearchParams(linkQuery || "").get("type");
        const active = pathname === linkPath && linkType === currentType;
        return (
          <Link
            key={l.label}
            href={l.href}
            className={`px-3.5 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              active
                ? "text-brand-600 border-brand-500"
                : "text-ink-600 border-transparent hover:text-brand-600 hover:border-brand-200"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
}

export function Nav() {
  const { count, setOpen } = useCart();
  const [q, setQ] = useState("");
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-ink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo-mark.svg" alt="" width={32} height={32} className="rounded-[9px]" />
            <span className="hidden sm:inline text-lg font-extrabold tracking-tight text-ink-900">
              buygiftcards<span className="text-brand-600">.online</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="flex-1 min-w-0 max-w-lg relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search gift card brands…"
              className="w-full rounded-full border border-ink-100 bg-ink-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
            />
            <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          </form>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href="/orders"
              className="hidden md:block px-3 py-2 text-sm font-semibold text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-50 transition"
            >
              My Orders
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open cart"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                count > 0 ? "bg-brand-600 text-white hover:bg-brand-700" : "text-ink-600 hover:bg-ink-50"
              }`}
            >
              <Icon name="cart" size={18} />
              <span className="hidden sm:inline">{count > 0 ? `Cart (${count})` : "Cart"}</span>
              {count > 0 && <span className="sm:hidden">{count}</span>}
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto -mt-px pb-px scrollbar-none">
          <Suspense fallback={NAV_LINKS.map((l) => (
            <span key={l.label} className="px-3.5 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-ink-600">
              {l.label}
            </span>
          ))}>
            <NavLinks />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
