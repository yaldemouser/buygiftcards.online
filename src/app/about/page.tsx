export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 prose">
      <h1 className="text-2xl font-extrabold mb-4">About this storefront</h1>
      <p className="text-ink-700 leading-relaxed mb-4">
        buygiftcards.online is a gift card marketplace built with a real Stripe checkout, a Postgres database, and
        transactional email — the full storefront and order pipeline works end to end.
      </p>
      <h2 className="text-lg font-bold mt-6 mb-2">Demo fulfillment</h2>
      <p className="text-ink-700 leading-relaxed mb-4">
        Gift card codes are currently issued by a placeholder provider that generates random, non-redeemable
        numbers. They are clearly labeled as demo codes wherever they appear. This exists so the checkout → payment →
        fulfillment → email flow can be tested without a live gift-card supplier.
      </p>
      <p className="text-ink-700 leading-relaxed mb-4">
        To sell real, redeemable cards, you need a contract with a licensed distributor (for example Tango Card,
        Blackhawk Network, or Fiserv Gift Solutions) and to implement <code>GiftCardProvider</code> in{" "}
        <code>src/lib/giftcard-provider.ts</code> against their API. Brand names and logos shown here are used
        descriptively to indicate the product being sold and remain the property of their respective owners.
      </p>
      <h2 className="text-lg font-bold mt-6 mb-2">Payments</h2>
      <p className="text-ink-700 leading-relaxed">
        Checkout runs on Stripe. Until you switch your API keys from test to live mode (and complete Stripe's account
        verification), no real charges occur.
      </p>
    </div>
  );
}
