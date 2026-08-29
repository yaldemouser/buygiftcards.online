import { Icon } from "@/components/Icon";

export default function BalancePage() {
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-ink-100 rounded-3xl p-10 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Icon name="wallet" size={26} className="text-brand-600" />
        </div>
        <h1 className="text-2xl font-extrabold mb-3">Check Your Balance</h1>
        <p className="text-sm text-ink-600 leading-relaxed">
          Balance lookups apply to real, brand-issued cards. This storefront is running in demo mode, so issued codes
          aren't tied to a live balance service yet — connect a real fulfillment provider first. See{" "}
          <a href="/about" className="text-brand-600 font-semibold hover:underline">/about</a>.
        </p>
      </div>
    </div>
  );
}
