import { BusinessQuoteForm } from "@/components/BusinessQuoteForm";

export default function BusinessPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold mb-2">Corporate & Bulk Orders</h1>
      <p className="text-ink-600 mb-8 leading-relaxed">
        Buying gift cards for employee rewards, client gifts, or an event? Tell us what you need and we'll send
        an invoice — pay by bank transfer or card, on your terms.
      </p>
      <BusinessQuoteForm />
    </div>
  );
}
