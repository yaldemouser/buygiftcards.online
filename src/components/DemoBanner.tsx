export function DemoBanner() {
  return (
    <div className="bg-accent-500 text-ink-950 text-xs font-semibold text-center py-2 px-4">
      Demo mode: payments run through Stripe test mode and issued codes are randomly generated placeholders — not real, redeemable gift cards. See{" "}
      <a href="/about" className="underline">/about</a> before connecting a real fulfillment provider.
    </div>
  );
}
