import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-5">
        <Icon name="search" size={28} className="text-ink-400" />
      </div>
      <h1 className="text-2xl font-extrabold mb-2">Page not found</h1>
      <p className="text-ink-600 mb-8">The page you're looking for doesn't exist or may have moved.</p>
      <Link href="/" className="inline-block px-8 py-3.5 rounded-full bg-brand-600 text-white font-bold hover:bg-brand-700 transition">
        Back to Home
      </Link>
    </div>
  );
}
