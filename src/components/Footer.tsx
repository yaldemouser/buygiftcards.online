import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  { title: "Shop", links: [["All Gift Cards", "/catalog"], ["eGift Cards", "/catalog?type=egift"], ["Physical Cards", "/catalog?type=physical"]] },
  { title: "Self-Service", links: [["Track Order", "/track-order"], ["Check Balance", "/balance"], ["Support", "/support"], ["Corporate & Bulk", "/business"]] },
  { title: "Company", links: [["About", "/about"], ["Terms of Use", "/terms"], ["Privacy Policy", "/privacy"]] },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-400 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo-mark.svg" alt="" width={30} height={30} />
            <span className="text-white font-extrabold">buygiftcards.online</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            A digital gift card marketplace project. Fulfillment currently runs in demo mode — see the storefront notice for details.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="text-white text-xs font-bold uppercase tracking-wider mb-4">{col.title}</div>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href} className="block text-sm mb-2.5 hover:text-white transition">
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-xs text-center">
        © {new Date().getFullYear()} buygiftcards.online — demo storefront, not affiliated with any brand shown.
      </div>
    </footer>
  );
}
